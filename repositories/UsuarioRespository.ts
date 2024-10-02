import { Usuario, ValidateUsuario, UsuarioLogin } from "@/types/usuario";
import * as SQLite from 'expo-sqlite';

export class UsuarioRepository {

    async createUsuario (usuario : Usuario): Promise<string|null>  {
        const result = ValidateUsuario.safeParse(usuario);
        
        if (!result.success) {
            throw new Error(result.error.errors[0].message);
        }

        if (await this.emailExistente(usuario.email)) {
            throw new Error('Email já está sendo utilizado!');
        }

        const db = await SQLite.openDatabaseAsync('sew-wallet.db');
        
        const statement = await db.prepareAsync('INSERT INTO USUARIO (NOME, EMAIL, SENHA) VALUES ($nome, $email, $senha)');
        let usuario_id;
        try {
            await statement.executeAsync({$nome: usuario.nome, $email: usuario.email, $senha: usuario.senha});
        } finally {
            await statement.finalizeAsync();
        }

        usuario_id = await this.verificaCredenciais({email: usuario.email, senha: usuario.senha});

        return usuario_id;
    }

    async verificaCredenciais (usuario: UsuarioLogin): Promise<string|null> {
        const db = await SQLite.openDatabaseAsync('sew-wallet.db');
        const result = await db.getFirstAsync<{USUARIO_ID: string}>('SELECT USUARIO_ID FROM USUARIO U WHERE U.EMAIL = ? AND U.SENHA = ?', [usuario.email, usuario.senha]);
        
        return result?.USUARIO_ID ?? null;
    }

    async buscaDadosUsuario (usuario_id : string): Promise<{NOME: string, EMAIL: string, USUARIO_ID: number}|null> {
        const db = await SQLite.openDatabaseAsync('sew-wallet.db');
        const result = await db.getFirstAsync<{NOME: string, EMAIL: string, USUARIO_ID: number}>('SELECT NOME, EMAIL, USUARIO_ID FROM USUARIO U WHERE U.USUARIO_ID = ?', usuario_id);

        return result;
    }

    async emailExistente(email: string): Promise<boolean>{
        const db = await SQLite.openDatabaseAsync('sew-wallet.db');
        const result = await db.getFirstAsync<{USUARIO_ID: string}>('SELECT USUARIO_ID FROM USUARIO U WHERE U.EMAIL = ?', email);

        return result ? true : false;
    }
}