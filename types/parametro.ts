export type Parametro = {
    nome: string,
    valor: string,
}

export const parametrosPadroes: {nome: parametros, valor: string}[] = [
    {nome: 'tema_escuro', valor: 'N'},
    {nome: 'saldo_oculto', valor: 'N'},
    {nome: 'aviso_gasto_categoria', valor: 'N'}
]

export type parametros = 'tema_escuro' | 'saldo_oculto' | 'aviso_gasto_categoria';