import { z } from "zod";

export type Usuario = {
    nome: string,
    email: string,
    senha: string,
}

export type UsuarioLogin = {
    email: string,
    senha: string
}

export const ValidateUsuario = z.object({
    nome: z.string().min(5, {message:'O nome do usuário precisa ter entre 5 e 20 caractéres!'}).max(20, {message:'O nome do usuário precisa ter entre 5 e 20 caractéres!'}),
    email: z.string().email({message: 'É necessário informar um email válido!'}),
    senha: z.string().min(6, {message:'A senha precisa ter entre 6 e 12 caractéres!'}).max(12, {message:'A senha precisa ter entre 6 e 12 caractéres!'}),
});

export const ValidateUsuarioLogin = z.object({
    email: z.string().email({message: 'É necessário informar um email válido!'}),
    senha: z.string().min(6, {message:'A senha precisa ter entre 6 e 12 caractéres!'}).max(12, {message:'A senha precisa ter entre 6 e 12 caractéres!'}),
});