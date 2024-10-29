import { Lancamento, LancamentoDescrito, ValidateLancamento } from "@/types/lancamentos";
import * as SQLite from 'expo-sqlite';

export type InfoMesType = {
    entradas: number, 
    saidas: number,
    balanco: number,
    saldoAnterior: number
};

export type DespesasPendentesType = {
    nome: string,
    valor: number,
    valorFormatado: string,
    data: Date
}

export type DespesasPorCategoriaType = {
    categoria: string,
    tipo: string,
    valor: number,
    valorFormatado: string
}

export class LancamentoRepository {

    async createLancamento (lancamento: Lancamento): Promise<void>  {
        const result = ValidateLancamento.safeParse(lancamento);
        
        if (!result.success) {
            throw new Error(result.error.errors[0].message);
        }
        
        const db = await SQLite.openDatabaseAsync('sew-wallet.db');
        const statement = await db.prepareAsync(`INSERT INTO LANCAMENTO (CONTA_ID, CATEGORIA_ID, TITULO, DESCRICAO, VALOR, DATA, EFETIVADA) VALUES ($conta_id, $categoria_id, $titulo, $descricao, $valor, $data, $efetivada)`);
        
        
        try {
            await statement.executeAsync({$conta_id: lancamento.CONTA_ID, $categoria_id: lancamento.CATEGORIA_ID, $titulo: lancamento.TITULO, $descricao: lancamento.DESCRICAO, $valor: lancamento.VALOR, $data: lancamento.DATA.toISOString().slice(0, 10), $efetivada: lancamento.EFETIVADA});
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
            await statement.executeAsync({ $lancamento_id: lancamento.LANCAMENTO_ID, $conta_id: lancamento.CONTA_ID, $categoria_id: lancamento.CATEGORIA_ID, $titulo: lancamento.TITULO, $descricao: lancamento.DESCRICAO, $valor: lancamento.VALOR, $data: lancamento.DATA.toISOString().slice(0, 10), $efetivada: lancamento.EFETIVADA});
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
                     WHEN C.TIPO = 'R' THEN 'Crédito'
                     WHEN C.TIPO = 'D' THEN 'Débito'
                   END TIPO,
                   replace(printf('R$ %.2f', L.VALOR), '.', ',') AS VALOR,
                   CASE
                     WHEN L.EFETIVADA = 'S' THEN 'Efetivado'
                     ELSE 'Pendente'
                   end EFETIVADA,
                   L.LANCAMENTO_ID
              FROM LANCAMENTO L
             INNER JOIN CATEGORIA C ON C.CATEGORIA_ID = L.CATEGORIA_ID
             INNER JOIN USUARIO U ON U.USUARIO_ID = C.USUARIO_ID
             INNER JOIN CONTA CO ON CO.CONTA_ID = L.CONTA_ID
            WHERE C.USUARIO_ID = ?
            ${condicoes}
            ORDER BY L.DATA DESC
        `, usuario_id);
        
        return result;
    }
    
    async getInfoMes(usuario_id: number, mes: number, ano:number): Promise<InfoMesType|null>{
        const db = await SQLite.openDatabaseAsync('sew-wallet.db');
        
        const ultimoDiaMes = new Date(ano, mes, 0).toISOString().slice(0, 10);
        const primeiroDiaMes = new Date(ano, mes-1, 1).toISOString().slice(0, 10);

        const result = db.getFirstAsync<InfoMesType>(`
            SELECT replace(printf('R$ %.2f', SUM( CASE WHEN C.TIPO = 'R' THEN 1 ELSE 0 END * L.VALOR )), '.', ',') AS entradas,
                   replace(printf('R$ %.2f', SUM( CASE WHEN C.TIPO = 'D' THEN 1 ELSE 0 END * L.VALOR )), '.', ',') AS saidas,
                   replace(printf('R$ %.2f', SUM( CASE WHEN C.TIPO = 'R' THEN L.VALOR ELSE -L.VALOR END )), '.', ',') AS balanco
             FROM LANCAMENTO L
            INNER JOIN CATEGORIA C ON C.CATEGORIA_ID = L.CATEGORIA_ID
            WHERE C.USUARIO_ID = ${usuario_id}
              AND L.DATA BETWEEN '${primeiroDiaMes}' AND '${ultimoDiaMes}'
        `);

        return result;
    }

    async getDespesasPendentes(usario_id: number, mes?: number, ano?: number): Promise<DespesasPendentesType[]|null> {
        const db = await SQLite.openDatabaseAsync('sew-wallet.db');

        let condicoes = '';
        
        if (ano && mes) {
            const ultimoDiaMes = new Date(ano, mes, 0).toISOString().slice(0, 10);
            const primeiroDiaMes = new Date(ano, mes-1, 1).toISOString().slice(0, 10);

            condicoes = `   AND L.DATA BETWEEN '${primeiroDiaMes}' AND '${ultimoDiaMes}' `
        }

        const result = db.getAllAsync<DespesasPendentesType>(`
            SELECT L.TITULO AS nome,
                   L.VALOR AS valor,
                   replace(printf('R$ %.2f', L.VALOR), '.', ',') AS valorFormatado,
                   L.DATA AS data
              FROM LANCAMENTO L
             INNER JOIN CATEGORIA C ON C.CATEGORIA_ID = L.CATEGORIA_ID
             WHERE C.USUARIO_ID = ${usario_id}
             ${condicoes}
               AND L.EFETIVADA = 'N'
               AND C.TIPO = 'D'
             ORDER BY L.DATA
        `);

        return result
    }

    async efetivaLancamento(lancamento_id: number){
        const db = await SQLite.openDatabaseAsync('sew-wallet.db');
        
        const statement = await db.prepareAsync(`UPDATE LANCAMENTO SET EFETIVADA = CASE WHEN EFETIVADA = 'S' THEN 'N' ELSE 'S' END WHERE LANCAMENTO_ID = ${lancamento_id}`);
        
        try {
            await statement.executeAsync();
        } finally {
            await statement.finalizeAsync();
        }
    }

    async getLancamentosPorCategoria(usuario_id: number, mes: number, ano: number){
        const db = await SQLite.openDatabaseAsync('sew-wallet.db');

        let condicoes = '';
        
        if (ano && mes) {
            const ultimoDiaMes = new Date(ano, mes, 0).toISOString().slice(0, 10);
            const primeiroDiaMes = new Date(ano, mes-1, 1).toISOString().slice(0, 10);

            condicoes = `   AND L.DATA BETWEEN '${primeiroDiaMes}' AND '${ultimoDiaMes}' `
        }

        const result = db.getAllAsync<DespesasPorCategoriaType>(`
            SELECT C.NOME AS categoria,
                   C.TIPO AS tipo,
                   SUM(L.VALOR) AS valor,
                   replace(printf('R$ %.2f', SUM(L.VALOR)), '.', ',') AS valorFormatado
              FROM LANCAMENTO L
             INNER JOIN CATEGORIA C ON L.CATEGORIA_ID = C.CATEGORIA_ID
             WHERE C.USUARIO_ID = ${usuario_id}
               AND C.TIPO = 'D'
             ${condicoes}
             GROUP BY C.NOME, C.TIPO
        `);

        return result;
    }

}