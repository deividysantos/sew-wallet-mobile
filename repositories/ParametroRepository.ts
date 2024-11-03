import * as SQLite from 'expo-sqlite';
import { parametros } from '@/types/parametro';

export class ParametroRepository {

    async createParametro (usuario_id: number, nomeParametro: parametros, valorParametro: string): Promise<boolean> {
        
        if (await this.existeParametro(usuario_id, nomeParametro)){
            return true;
        }

        const db = await SQLite.openDatabaseAsync('sew-wallet.db');
        
        const statement = await db.prepareAsync('INSERT INTO PARAMETRO (USUARIO_ID, NOME, VALOR) VALUES ($usuario_id, $nome, $valor)');
        
        try {
            await statement.executeAsync({$usuario_id: usuario_id, $nome: nomeParametro, $valor: valorParametro});
            return true;
        } catch(e: any){
            return false;
        }finally {
            await statement.finalizeAsync();
        }
    }

    async existeParametro(usuario_id: number, nomeParametro: parametros): Promise<boolean>{
        const db = await SQLite.openDatabaseAsync('sew-wallet.db');

        const existe = await db.getFirstAsync<{ qtde: number }>(`
            SELECT COUNT(P.PARAMETRO_ID) as qtde
              FROM PARAMETRO P
             WHERE P.USUARIO_ID = ${usuario_id}
               AND P.NOME = '${nomeParametro}'
        `);

        if (existe?.qtde){
            return true
        }

        return false
    }

    async getParametro(usuario_id: number, nomeParametro: parametros, valorParatrao?: string): Promise<string>{

        if (!(await this.existeParametro(usuario_id, nomeParametro))){
            if (valorParatrao){
                await this.createParametro(usuario_id, nomeParametro, valorParatrao)
            } else {
                throw new Error('Parâmetro '+ nomeParametro +' não encontrado!')
            }
        }

        const db = await SQLite.openDatabaseAsync('sew-wallet.db');
        const parametro = await db.getFirstAsync<{ nome: string, valor: string }>(`
            SELECT P.NOME AS nome,
                   P.VALOR AS valor
              FROM PARAMETRO P
             WHERE P.USUARIO_ID = ${usuario_id}
               AND P.NOME = '${nomeParametro}'
        `);

        if (parametro) {
            return parametro?.valor
        }

        throw new Error('Parâmetro '+ nomeParametro +' não encontrado!')
    }

    async atualizarParametro(usuario_id: number, nomeParametro: parametros, valorParametro: string): Promise<boolean>{

        if (!this.existeParametro(usuario_id, nomeParametro)){
            return this.createParametro(usuario_id, nomeParametro, valorParametro)
        }

        const db = await SQLite.openDatabaseAsync('sew-wallet.db');
        
        const statement = await db.prepareAsync('UPDATE PARAMETRO SET VALOR = $valor WHERE USUARIO_ID = $usuario_id AND NOME = $nome');
        
        try {
            await statement.executeAsync({$usuario_id: usuario_id, $nome: nomeParametro, $valor: valorParametro});
            return true;
        } catch(e: any){
            return false;
        }finally {
            await statement.finalizeAsync();
        }
        
        return true;
    }
}