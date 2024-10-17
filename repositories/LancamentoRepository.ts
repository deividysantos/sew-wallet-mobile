import { Lancamento, ValidateLancamento } from "@/types/lancamentos";
import * as SQLite from 'expo-sqlite';

export class LancamentoRepository {

    async createLancamento (lancamento: Lancamento): Promise<void>  {
        const result = ValidateLancamento.safeParse(lancamento);
        
        if (!result.success) {
            throw new Error(result.error.errors[0].message);
        }

        const db = await SQLite.openDatabaseAsync('sew-wallet.db');

        const statement = await db.prepareAsync(`INSERT INTO LANCAMENTO (CONTA_ID, CATEGORIA_ID, TITULO, DESCRICAO, VALOR, DATA) VALUES ($conta_id, $categoria_id, $titulo, $descricao, $valor, $data)`);
        let usuario_id;
        try {
            await statement.executeAsync({$conta_id: lancamento.CONTA_ID, $categoria_id: lancamento.CATEGORIA_ID, $titulo: lancamento.TITULO, $descricao: lancamento.DESCRICAO, $valor: lancamento.VALOR, $data: lancamento.DATA.toLocaleString()});
        } finally {
            await statement.finalizeAsync();
        }
    }

    async updateLancamento (lancamento: Lancamento): Promise<void>  {
        const result = ValidateLancamento.safeParse(lancamento);
        
        if (!result.success) {
            throw new Error(result.error.errors[0].message);
        }

        const db = await SQLite.openDatabaseAsync('sew-wallet.db');

        const statement = await db.prepareAsync(`UPDATE LANCAMENTO SET CONTA_ID = $conta_id, CATEGORIA_ID = $categoria_id, TITULO = $titulo, DESCRICAO = $descricao, VALOR = $valor, DATA = $data WHERE LANCAMENTO_ID = $lancamento_id`);
        let usuario_id;
        try {
            await statement.executeAsync({ $lancamento_id: lancamento.LANCAMENTO_ID, $conta_id: lancamento.CONTA_ID, $categoria_id: lancamento.CATEGORIA_ID, $titulo: lancamento.TITULO, $descricao: lancamento.DESCRICAO, $valor: lancamento.VALOR, $data: lancamento.DATA.toLocaleString()});
        } finally {
            await statement.finalizeAsync();
        }
    }

    async deleteLancamento(lancamento_id: string): Promise<boolean>{
        const db = await SQLite.openDatabaseAsync('sew-wallet.db');
        
        try {
            db.execAsync(`DELETE FROM LANCAMENTO WHERE LANCAMENTO_ID = ${lancamento_id}`);
            return true;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}