import { Categoria, ValidateCategoria, CategoriaDescrita } from "@/types/categoria";
import * as SQLite from 'expo-sqlite';

export class CategoriaRepository {

    async getAll(usuario_id : number): Promise<CategoriaDescrita[]|null> {
        const db = await SQLite.openDatabaseAsync('sew-wallet.db');

        const result = await db.getAllAsync<CategoriaDescrita>(`
            SELECT U.NOME AS USUARIO_NOME,
                   C.NOME AS CATEGORIA_NOME,
                   C.TIPO
              FROM CATEGORIA C
             INNER JOIN USUARIO U ON U.USUARIO_ID = C.USUARIO_ID
             WHERE U.USUARIO_ID = ?
             ORDER BY C.TIPO, C.NOME
        `, usuario_id);
        
        return result;
    }

    async getCategoriaPorCaracteristicas(usuario_id: number, categoria_nome: string, categoria_tipo: string): Promise<string|null> {
        const db = await SQLite.openDatabaseAsync('sew-wallet.db');
      
        const categoriaExistente = await db.getFirstAsync<{CATEGORIA_ID: string}>(`
            SELECT C.CATEGORIA_ID 
              FROM CATEGORIA C 
             WHERE C.NOME = ? 
               AND C.USUARIO_ID = ?
               AND C.TIPO = ?`, categoria_nome, usuario_id, categoria_tipo
        );

        if (!categoriaExistente?.CATEGORIA_ID){
            return null;
        }

        return categoriaExistente?.CATEGORIA_ID;        
    }

    async create(categoria: Categoria): Promise<string|null>{
        
        const result = ValidateCategoria.safeParse(categoria);
        
        if (!result.success) {
            throw new Error(result.error.errors[0].message);
        }        

        const categoriaExistente = await this.getCategoriaPorCaracteristicas(categoria.USUARIO_ID, categoria.NOME, categoria.TIPO);

        if (categoriaExistente) {
            throw new Error('Nome de categoria já cadastrada!');
        }

        const db = await SQLite.openDatabaseAsync('sew-wallet.db');
        
        const statement = await db.prepareAsync('INSERT INTO CATEGORIA (USUARIO_ID, NOME, TIPO) VALUES ($usuario_id, $nome, $tipo)');
        let categoria_id;
        try {
            await statement.executeAsync({$usuario_id: categoria.USUARIO_ID, $nome: categoria.NOME, $tipo: categoria.TIPO});
        } finally {
            await statement.finalizeAsync();
        }

        categoria_id = await this.getCategoriaPorCaracteristicas(categoria.USUARIO_ID, categoria.NOME, categoria.TIPO);
        
        return categoria_id;
    }

}