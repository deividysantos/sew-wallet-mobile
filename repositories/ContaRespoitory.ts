import { Conta, ContaDescrita, ValidateConta } from "@/types/conta";
import * as SQLite from 'expo-sqlite';

export type SaldoContaType = {
    conta_id: number,
    conta: string,
    saldoFormatado: string,
    saldo: number
}

export type SaldoFuturoType = {
    conta_id: number, 
    saldo: number, 
    saldoFormatado: string
}

export class ContaRepository {

    async createConta (conta : Conta): Promise<number|null>  {

        const resultaValidate = ValidateConta.safeParse(conta);

        if (!resultaValidate.success) {
            throw Error(resultaValidate.error.errors[0].message)
        }

        const db = await SQLite.openDatabaseAsync('sew-wallet.db');
        
        let result = await db.getFirstAsync<{CONTA_ID: number}>('SELECT CONTA_ID FROM CONTA WHERE USUARIO_ID = ? AND NOME = ?', conta.USUARIO_ID, conta.NOME);

        if (result?.CONTA_ID) {
            throw Error('Você já possui uma conta com este nome!');
        }
        
        result = null;
        
        const statement = await db.prepareAsync('INSERT INTO CONTA (BANCO_ID, USUARIO_ID, NOME, SALDO_INICIAL) VALUES ($banco_id, $usuario_id, $nome, $saldo_inicial)');

        try {
            await statement.executeAsync({$banco_id: conta.BANCO_ID, $usuario_id: conta.USUARIO_ID, $nome: conta.NOME, $saldo_inicial: conta.SALDO_INICIAL});            
        } finally {
            await statement.finalizeAsync();
        }


        result = await db.getFirstAsync<{CONTA_ID: number}>('SELECT CONTA_ID FROM CONTA WHERE USUARIO_ID = ? AND NOME = ?', conta.USUARIO_ID, conta.NOME);
                
        return result?.CONTA_ID ?? null;
    }

    async deleteConta(conta_id : number): Promise<boolean>{
        const db = await SQLite.openDatabaseAsync('sew-wallet.db');
    
        const result = await db.getFirstAsync<{qtdeLctos: number}>(`SELECT COUNT(L.LANCAMENTO_ID) AS qtdeLctos
                                                            FROM LANCAMENTO L
                                                        INNER JOIN CONTA C ON C.CONTA_ID = L.CONTA_ID
                                                        WHERE C.CONTA_ID = ${conta_id} `, );
        
        if (result) {
            if (result.qtdeLctos > 0) {
                throw new Error('Não é possível apagar a conta, existem lançamentos financeiros ligados a mesma!');
            }
        }

        try {
            db.execAsync(`DELETE FROM CONTA WHERE CONTA_ID = ${conta_id}`);
            return true;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async getAllByUser (usuario_id: number|null): Promise<ContaDescrita[]|null> {
        if (!usuario_id) {
            return null;
        }

        const db = await SQLite.openDatabaseAsync('sew-wallet.db');

        const result = await db.getAllAsync<ContaDescrita>(`
            SELECT C.CONTA_ID,
                   B.NOME AS NOME_BANCO,
                   U.NOME AS NOME_USUARIO,
                   C.NOME AS NOME_CONTA,
                   C.SALDO_INICIAL,
                   replace(printf('R$ %.2f', C.SALDO_INICIAL), '.', ',') AS SALDO_INICIAL_FORMATADO
              FROM CONTA C
             INNER JOIN BANCO B ON B.BANCO_ID = C.BANCO_ID
             INNER JOIN USUARIO U ON U.USUARIO_ID = C.USUARIO_ID
             WHERE U.USUARIO_ID = ?
            `, usuario_id
        );

        return result;
    }

    async getSaldoContas(usuario_id: number, data: Date): Promise<SaldoContaType[]|null>{
        const db = await SQLite.openDatabaseAsync('sew-wallet.db');

        const diaVerificacao = new Date(data).toISOString().slice(0, 10);
        
        //Refazer sql
        const result = db.getAllAsync<SaldoContaType>(`
            SELECT C.CONTA_ID AS conta_id,
                   C.NOME AS conta,
                   replace(printf('R$ %.2f', IFNULL(SUM(CASE WHEN CAT.TIPO = 'R' THEN L.VALOR ELSE -L.VALOR END ),0) + C.SALDO_INICIAL), '.', ',') AS saldoFormatado,
                   IFNULL(SUM( CASE WHEN CAT.TIPO = 'R' THEN L.VALOR ELSE -L.VALOR END ),0) + C.SALDO_INICIAL AS saldo
             FROM CONTA C
             LEFT JOIN LANCAMENTO L ON C.CONTA_ID = L.CONTA_ID
             LEFT JOIN CATEGORIA CAT ON L.CATEGORIA_ID = CAT.CATEGORIA_ID
            WHERE C.USUARIO_ID = ${usuario_id}
              AND L.DATA <= '${diaVerificacao}'
              AND L.EFETIVADA = 'S'
            GROUP BY C.NOME, C.SALDO_INICIAL
            
            UNION all
            
            SELECT C.CONTA_ID AS conta_id,
                   C.NOME AS conta,
                   replace(printf('R$ %.2f', C.SALDO_INICIAL), '.', ',') AS saldoFormatado,
                   C.SALDO_INICIAL AS saldo
             FROM CONTA C
            WHERE C.USUARIO_ID = ${usuario_id}
              AND NOT EXISTS (SELECT LT.LANCAMENTO_ID 
                                FROM LANCAMENTO LT 
                               WHERE LT.CONTA_ID = C.CONTA_ID 
                                 AND LT.EFETIVADA = 'S' 
                                 AND LT.DATA <= '${diaVerificacao}')
        `);

        return result;
    }

    async getSaldoFuturo(usuario_id: number, conta_id?: number, data?: Date): Promise<SaldoFuturoType[]>{
        const db = await SQLite.openDatabaseAsync('sew-wallet.db');

        var filtros = '';
        if (data){
            const diaVerificacao = new Date(data).toISOString().slice(0, 10);
            filtros += `   AND L.DATA <=  '${diaVerificacao}'`
        }

        if (conta_id){
            filtros += `   AND C.CONTA_ID = ${conta_id}`
        }

        const result = db.getAllAsync<SaldoFuturoType>(`
            SELECT C.CONTA_ID AS conta_id,
                   IFNULL(SUM( CASE WHEN CAT.TIPO = 'R' THEN L.VALOR ELSE -L.VALOR END ),0) + C.SALDO_INICIAL AS saldo,
                   replace(printf('R$ %.2f', IFNULL(SUM(CASE WHEN CAT.TIPO = 'R' THEN L.VALOR ELSE -L.VALOR END ),0) + C.SALDO_INICIAL), '.', ',') AS saldoFormatado
              FROM CONTA C
             INNER JOIN LANCAMENTO L ON L.CONTA_ID = C.CONTA_ID
             INNER JOIN CATEGORIA CAT ON CAT.CATEGORIA_ID = L.CATEGORIA_ID
             WHERE C.USUARIO_ID = ${usuario_id}
             ${filtros}
        `)

        return result
    }

}