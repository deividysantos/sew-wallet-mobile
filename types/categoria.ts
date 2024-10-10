import { z } from "zod";

export type Categoria = {
    CATEGORIA_ID: number,
    USUARIO_ID: number,
    NOME: string,
    TIPO: string
}

export type CategoriaDescrita = {
    USUARIO_NOME: string,
    CATEGORIA_NOME: string,
    TIPO: string
}

export const ValidateCategoria = z.object({
    NOME: z.string().min(3, {message:'O nome da categoria precisa ter entre 3 e 20 caractéres!'}).max(20, {message:'O nome da categoria precisa ter entre 5 e 20 caractéres!'}),
    TIPO: z.enum(['D', 'R']),
});