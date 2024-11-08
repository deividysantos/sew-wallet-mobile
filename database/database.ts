import * as SQLite from 'expo-sqlite';
import { Seeds } from './seeds';

export const db = SQLite.openDatabaseAsync('sew-wallet.db');

export async function initDataBase (){
    const db = await SQLite.openDatabaseAsync('sew-wallet.db');

    const seed = new Seeds;

    try {
        let result = await db.getFirstAsync<{NUMERO: number}>('SELECT NUMERO FROM VERSAO WHERE NUMERO = 1');
        
        if (result?.NUMERO) {
            db.closeAsync();
            return 
        }
    } catch (error) {
        //pode nao ter a tabela versao
    }

    await db.withTransactionAsync( async() => {

        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS VERSAO (
                VERSAO_ID INTEGER PRIMARY KEY AUTOINCREMENT,
                NOME TEXT,
                NUMERO INTEGER
            );
        `);        

        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS SEED (
                SEED_ID INTEGER PRIMARY KEY AUTOINCREMENT,
                NOME TEXT
            );
        `);

        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS USUARIO (
                USUARIO_ID INTEGER PRIMARY KEY AUTOINCREMENT,
                NOME TEXT NOT NULL,
                EMAIL TEXT NOT NULL UNIQUE,
                SENHA TEXT NOT NULL
            );
        `);

        await db.execAsync(`
            INSERT INTO USUARIO (NOME, EMAIL, SENHA) VALUES ('Deividy Santos', 'admin@admin.com', 'senha123');
        `);

        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS BANCO (
                BANCO_ID INTEGER PRIMARY KEY AUTOINCREMENT,
                NOME TEXT NOT NULL
            );
        `);

        seed.bancosSeed();

        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS CONTA (
                CONTA_ID INTEGER PRIMARY KEY AUTOINCREMENT,
                BANCO_ID INTEGER,
                USUARIO_ID INTEGER,
                NOME TEXT NOT NULL,
                SALDO_INICIAL NUMBER,
                FOREIGN KEY (BANCO_ID) REFERENCES BANCO(BANCO_ID),
                FOREIGN KEY (USUARIO_ID) REFERENCES USUARIO(USUARIO_ID),
                UNIQUE (NOME, USUARIO_ID)
            );
        `);

        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS CATEGORIA (
                CATEGORIA_ID INTEGER PRIMARY KEY AUTOINCREMENT,
                USUARIO_ID INTEGER,
                NOME TEXT NOT NULL,
                TIPO TEXT,
                FOREIGN KEY (USUARIO_ID) REFERENCES USUARIO(USUARIO_ID),
                UNIQUE (NOME, USUARIO_ID, TIPO)
            );
        `);

        seed.categoriasSeed(1);        

        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS LANCAMENTO (
                LANCAMENTO_ID INTEGER PRIMARY KEY AUTOINCREMENT,
                CONTA_ID INTEGER,
                CATEGORIA_ID INTEGER,
                TITULO TEXT NOT NULL,
                DESCRICAO TEXT,
                VALOR NUMERIC(15,2),
                DATA DATE,
                EFETIVADA TEXT,
                FOREIGN KEY (CONTA_ID) REFERENCES CONTA(CONTA_ID),
                FOREIGN KEY (CATEGORIA_ID) REFERENCES CATEGORIA(CATEGORIA_ID)
            );
        `);

        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS PARAMETRO (
                PARAMETRO_ID INTEGER PRIMARY KEY AUTOINCREMENT,
                USUARIO_ID INTEGER,
                NOME TEXT,
                VALOR TEXT,
                FOREIGN KEY (USUARIO_ID) REFERENCES USUARIO(USUARIO_ID)
            );
        `);

        await db.execAsync(`
            INSERT INTO VERSAO (NOME, NUMERO) VALUES ('TESTE', 1);
        `);
    });

}