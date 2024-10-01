import { Usuario, ValidateUsuario, UsuarioLogin } from "@/types/usuario";
import * as SQLite from 'expo-sqlite';
import { Banco } from "@/types/banco";

export class BancoRepository {

    async getAll (): Promise<Banco[]|null> {
        const db = await SQLite.openDatabaseAsync('sew-wallet.db');
        const result = await db.getAllAsync<Banco>('SELECT BANCO_ID, NOME FROM BANCO');

        return result;
    }

}