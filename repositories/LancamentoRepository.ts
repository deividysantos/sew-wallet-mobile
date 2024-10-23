import { Lancamento, LancamentoDescrito, ValidateLancamento } from "@/types/lancamentos";
import * as SQLite from 'expo-sqlite';

export class LancamentoRepository {

    async createLancamento (lancamento: Lancamento): Promise<void>  {
        const result = ValidateLancamento.safeParse(lancamento);
        
        if (!result.success) {
            throw new Error(result.error.errors[0].message);
        }

        const db = await SQLite.openDatabaseAsync('sew-wallet.db');
        const statement = await db.prepareAsync(`INSERT INTO LANCAMENTO (CONTA_ID, CATEGORIA_ID, TITULO, DESCRICAO, VALOR, DATA, EFETIVADA) VALUES ($conta_id, $categoria_id, $titulo, $descricao, $valor, $data, $efetivada)`);
        
        try {
            await statement.executeAsync({$conta_id: lancamento.CONTA_ID, $categoria_id: lancamento.CATEGORIA_ID, $titulo: lancamento.TITULO, $descricao: lancamento.DESCRICAO, $valor: lancamento.VALOR, $data: lancamento.DATA.toLocaleDateString(), $efetivada: lancamento.EFETIVADA});
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
        const statement = await db.prepareAsync(`UPDATE LANCAMENTO SET CONTA_ID = $conta_id, CATEGORIA_ID = $categoria_id, TITULO = $titulo, DESCRICAO = $descricao, VALOR = $valor, DATA = $data, EFETIVADA = $efetivada WHERE LANCAMENTO_ID = $lancamento_id`);

        try {
            await statement.executeAsync({ $lancamento_id: lancamento.LANCAMENTO_ID, $conta_id: lancamento.CONTA_ID, $categoria_id: lancamento.CATEGORIA_ID, $titulo: lancamento.TITULO, $descricao: lancamento.DESCRICAO, $valor: lancamento.VALOR, $data: lancamento.DATA.toLocaleString(), $efetivada: lancamento.EFETIVADA});
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

    async getAllByUser(usuario_id : number, data_inicio?: string, data_fim?: string): Promise<LancamentoDescrito[]|null>{
        const db = await SQLite.openDatabaseAsync('sew-wallet.db');

        let condicoes = '';

        if (data_inicio) {
            condicoes += '   AND L.DATA >= ' + data_inicio + ' ';
        }

        if (data_fim) {
            condicoes += '   AND L.DATA <= ' + data_fim + ' ';
        }

        const result = db.getAllAsync<LancamentoDescrito>(`
            SELECT L.TITULO,
                   L.DESCRICAO,
                   L.DATA,
                   C.NOME AS CATEGORIA,
                   CO.NOME AS CONTA,
                   CASE 
                     WHEN C.TIPO = 'C' THEN 'Crédito'
                     WHEN C.TIPO = 'D' THEN 'Débito'
                   END TIPO,
                   L.VALOR,
                   CASE
                     WHEN L.EFETIVADA = 'S' THEN 'Sim'
                     ELSE 'Não'
                   end EFETIVADA
              FROM LANCAMENTO L
             INNER JOIN CATEGORIA C ON C.CATEGORIA_ID = L.CATEGORIA_ID
             INNER JOIN USUARIO U ON U.USUARIO_ID = C.USUARIO_ID
             INNER JOIN CONTA CO ON CO.CONTA_ID = L.CONTA_ID
            WHERE C.USUARIO_ID = ?
            ${condicoes}
            ORDER BY L.DATA
        `, usuario_id);

        return result;
    }
}