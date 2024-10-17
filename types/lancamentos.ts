import { z } from "zod";

export type Lancamento = {
    LANCAMENTO_ID: number,
    CONTA_ID: number,
    CATEGORIA_ID: number,
    TITULO: string,
    DESCRICAO: string,
    VALOR: number,
    DATA: Date
};

export type LancamentoDescrito = {
    TITULO: string,
    DESCRICAO: string,
    VALOR: number,
    DATA: Date,
    CATEGORIA: string,
    CONTA: string,
    TIPO: string
};

export const ValidateLancamento = z.object({

});