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
    CONTA_ID: z.number().min(1, {message: 'É necessário selecionar uma conta!'}),
    CATEGORIA_ID: z.number().min(1, {message: 'É necessário selecionar uma categoria!'}),
    TITULO: z.string().min(3, {message: 'O título do lançamento precisa ter ao menos 3 dígitos!'}).max(50, {message: 'O título do lançamento precisa ter no máximo 50 dígitos!'}),
    DESCRICAO: z.string().max(4000, {message: 'O título do lançamento precisa ter no máximo 4000 dígitos!'}),
    VALOR: z.number(),
    DATA: z.date(),
});