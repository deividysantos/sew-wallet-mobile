import { Conta, ContaDescrita } from "@/types/conta";
import * as SQLite from 'expo-sqlite';

export class ContaRepository {

    async createConta (conta : Conta): Promise<number|null>  {
        const db = await SQLite.openDatabaseAsync('sew-wallet.db');
        
        if ((conta.NOME.length < 3) && (conta.NOME.length > 20)){
            throw Error('Nome de conta de tamanho inválido!');
        }

        let result = await db.getFirstAsync<{CONTA_ID: number}>('SELECT CONTA_ID FROM CONTA WHERE USUARIO_ID = ? AND NOME = ?', conta.USUARIO_ID, conta.NOME);

        if (result?.CONTA_ID) {
            throw Error('Você já possui uma conta com este nome!');
        }
        console.log('dentro');
        result = null;
        
        const statement = await db.prepareAsync('INSERT INTO CONTA (BANCO_ID, USUARIO_ID, NOME) VALUES ($banco_id, $usuario_id, $nome)');

        try {
            await statement.executeAsync({$banco_id: conta.BANCO_ID, $usuario_id: conta.USUARIO_ID, $nome: conta.NOME});            
        } finally {
            await statement.finalizeAsync();
        }


        result = await db.getFirstAsync<{CONTA_ID: number}>('SELECT CONTA_ID FROM CONTA WHERE USUARIO_ID = ? AND NOME = ?', conta.USUARIO_ID, conta.NOME);
        console.log(conta);
        return result?.CONTA_ID ?? null;
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

}