import { Conta, ContaDescrita, ValidateConta } from "@/types/conta";
import * as SQLite from 'expo-sqlite';

export type SaldoContaType = {
    conta: string,
    saldoFormatado: string,
    saldo: number
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
    
        const qtdeLctos = await db.getFirstAsync<number>(`SELECT COUNT(L.LANCAMENTO_ID) AS qtdeLctos
                                                            FROM LANCAMENTO L
                                                        INNER JOIN CONTA C ON C.CONTA_ID = L.CONTA_ID
                                                        WHERE C.CONTA_ID = ? `, conta_id);
        if ((qtdeLctos ?? 0) > 0) {
            throw new Error('Não é possível apagar a conta, existem lançamentos financeiros ligados a mesma!');
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
                C.SALDO_INICIAL
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
        
        const result = db.getAllAsync<SaldoContaType>(`
            SELECT C.NOME AS conta,
                   replace(printf('R$ %.2f', SUM( CASE WHEN CAT.TIPO = 'R' THEN L.VALOR ELSE -L.VALOR END ) + C.SALDO_INICIAL), '.', ',') AS saldoFormatado,
                   SUM( CASE WHEN CAT.TIPO = 'R' THEN L.VALOR ELSE -L.VALOR END ) + C.SALDO_INICIAL AS saldo
              FROM LANCAMENTO L
             INNER JOIN CATEGORIA CAT ON L.CATEGORIA_ID = CAT.CATEGORIA_ID
             INNER JOIN CONTA C ON L.CONTA_ID = C.CONTA_ID
            WHERE CAT.USUARIO_ID = ${usuario_id}
              AND L.DATA <= '${diaVerificacao}'
            GROUP BY C.NOME, C.SALDO_INICIAL
        `);

        return result;
    }

}