import { ScrollView } from "react-native"
import { useEffect, useState } from "react";

import { ThemedText } from "../ThemedText"
import { ThemedView } from "../ThemedView"
import { useThemeColor } from '@/hooks/useThemeColor';

import { LancamentoRepository, DespesasPendentesType } from "@/repositories/LancamentoRepository";
import { formatCurrency } from "@/utils/currency";

export type DespesasPendentesProps = {
    usuario_id: number,
    mes: number,
    ano: number,
};

export default function DespesasPendentes ( { usuario_id, mes, ano }: DespesasPendentesProps ){
    const text = useThemeColor({}, 'text');
    const backgroundSoft = useThemeColor({}, 'backgroundSoft');

    const [despesasPendentes, setDepespesasPendentes] = useState<DespesasPendentesType[]|null>(null);
    const [loading, setLoading] = useState(true);

    async function AtualizaDados(){
        setLoading(true)

        try {
            if (ano == 0) {
                return
            }

            const lancamentoRepository = new LancamentoRepository();

            const despesas = await lancamentoRepository.getDespesasPendentes(usuario_id, mes, ano);
            setDepespesasPendentes(despesas);
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        AtualizaDados()
    }, [mes])

    return (
        <ThemedView style={{padding: 15, gap: 10, minHeight: 155}}>

            <ThemedView>
                <ThemedText type='subtitle'>Despesas Pendentes</ThemedText>
            </ThemedView>            

            {!loading &&
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator= {false}
            >
                <ThemedView style={{gap: 15, flexDirection: 'row'}}>
                {(despesasPendentes != undefined) && (despesasPendentes.length > 0) ?
                    despesasPendentes.map( (despesa, i) => {
                    return (
                        <ThemedView key={i} style={{flexDirection: 'column', backgroundColor: backgroundSoft, padding: 7, borderRadius: 8, width: 150, shadowColor: "#ccc", shadowOffset: { width: 5, height: 3, }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 4 }}>
                            <ThemedText>{despesa.nome}</ThemedText>
                            <ThemedText style={{color: 'red'}}>{ formatCurrency(despesa.valor, 'BRL') }</ThemedText>
                            <ThemedText>{ new Date(despesa.data).toLocaleDateString('pt-br') }</ThemedText>
                        </ThemedView>
                    )
                    } ) :
                    <><ThemedText>Não existem despesas pendentes</ThemedText></>
                }           
                </ThemedView> 
            </ScrollView>
            }

        </ThemedView>

    )
}