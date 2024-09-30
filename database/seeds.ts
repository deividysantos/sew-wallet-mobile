import * as SQLite from 'expo-sqlite';
import { initDataBase } from "./database";

export class Seeds {

    constructor(){
        initDataBase();
    }

    async bancosSeed() {
        const db = await SQLite.openDatabaseAsync('sew-wallet.db');
        
        const result = await db.getFirstAsync<{SEED_ID: string}>('SELECT SEED_ID FROM SEED WHERE NOME = $nome', 'BANCOS');
        
        if (result?.SEED_ID) {
            return
        }

        const statement = await db.prepareAsync('INSERT INTO BANCO (NOME) VALUES ($nome)');

        const bancos = [
            "Banco do Brasil",
            "Caixa Econômica Federal",
            "Bradesco",
            "Itaú Unibanco",
            "Santander Brasil",
            "BTG Pactual",
            "Banco Safra",
            "Banco Original",
            "Banrisul",
            "Banco Inter",
            "Nubank",
            "Banco Votorantim (BV)",
            "Banco PAN",
            "XP Investimentos",
            "Banco Modal",
            "Banco Mercantil do Brasil",
            "Banco Rendimento",
            "Banco C6",
            "Banco Neon",
            "PicPay",
            "Banco Daycoval"
        ];


        await db.withTransactionAsync( async () => {
            await bancos.forEach( async (banco) => {
                await statement.executeAsync({$nome: banco});
            });

            await db.execAsync(`
                INSERT INTO SEED (NOME) VALUES ('BANCOS')
            `);
        });
    }
}