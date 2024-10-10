import * as SQLite from 'expo-sqlite';
import { CategoriaRepository } from '@/repositories/CategoriaRepository';

export class Seeds {


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
            await bancos.map( async (banco) => {
                await statement.executeAsync({$nome: banco});
            });
        });

        await db.execAsync(`
            INSERT INTO SEED (NOME) VALUES ('BANCOS')
        `);
    }

    async categoriasSeed(usuario_id: number){

        const categorias = [
            { nome:'Dia a dia', tipo: 'D' },
            { nome:'Trabalho', tipo: 'D' },
            { nome:'Casa', tipo: 'D' },
            { nome:'Transporte', tipo: 'D' },
            { nome:'Mercado', tipo: 'D' },
            { nome:'Amor', tipo: 'D' },
            { nome:'Diversão', tipo: 'D' },
            { nome:'Crescimento Pessoal', tipo: 'D' },
            { nome:'Academia', tipo: 'D' },
            { nome:'Automóveis', tipo: 'D' },
            { nome:'Serviços', tipo: 'D' },
            { nome:'Viagem', tipo: 'D' },

            { nome:'Salário', tipo: 'R' },
            { nome:'Rendimentos', tipo: 'R' },
            { nome:'Presentes', tipo: 'R' },
            { nome:'Investimentos', tipo: 'R' },
            { nome:'Outros', tipo: 'R' },
        ];

        const categoriaRepository = new CategoriaRepository;
        await categorias.map( async (categoria) => {
            await categoriaRepository.create({CATEGORIA_ID: 0, NOME: categoria.nome, USUARIO_ID: usuario_id, TIPO: categoria.tipo})
        });
    }
}