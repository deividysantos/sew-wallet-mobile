import { z } from "zod";

export type Conta = {
    BANCO_ID: number,
    USUARIO_ID: number,
    NOME: string,
    SALDO_INICIAL: number,
};

export type ContaDescrita = {
    CONTA_ID: number,
    NOME_BANCO: string,
    NOME_USUARIO: string,
    NOME_CONTA: string,
    SALDO_INICIAL: number,
    SALDO_INICIAL_FORMATADO: string
};

export const ValidateConta = z.object({
    BANCO_ID: z.number().min(1, {message: 'É necessário selecionar um banco!'}),
    USUARIO_ID: z.number().min(1, {message: 'Usuário não selecionado!'}),
    NOME: z.string().min(3, {message: 'O nome da conta precisa ter ao menos 3 dígitos!'}).max(20, {message: 'O nome da conta precisa ter no máximo 20 dígitos'}),
    SALDO_INICIAL: z.number(),
});