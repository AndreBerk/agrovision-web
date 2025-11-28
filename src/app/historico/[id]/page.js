'use client'
import { useEffect, useState, use } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Leaf, AlertTriangle, FlaskConical, MapPin, Trash2, Printer, Share2 } from 'lucide-react'

export default function DetalhesDiagnostico({ params }) {
  const resolvedParams = use(params)
  const id = resolvedParams.id

  const [diagnostico, setDiagnostico] = useState(null)
  const [detalhesDoenca, setDetalhesDoenca] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // --- MAPA SUPER TURBINADO DE TRADUÇÃO (O SEGREDO DOS 50%) ---
    // Aqui mapeamos tudo o que a IA costuma "chutar" para a doença real
    const aiResultToDiseaseMap = {
      // 1. COCHONILHA (Parece bichos pequenos, carrapatos, coisas brancas)
      'isopod': 'Cochonilha',
      'tick': 'Cochonilha',
      'leaf beetle': 'Cochonilha',
      'weevil': 'Cochonilha',
      'flatworm': 'Cochonilha',
      'sea slug': 'Cochonilha',
      'conch': 'Cochonilha',
      
      // 2. PULGÃO (Insetos aglomerados, formigas, grilos)
      'aphid': 'Pulgão',
      'cricket': 'Pulgão',
      'grasshopper': 'Pulgão',
      'ant': 'Pulgão',
      'mantis': 'Pulgão', 
      'fly': 'Pulgão',
      'bee': 'Pulgão',
      'dragonfly': 'Pulgão',
      'ladybug': 'Pulgão', // Às vezes confunde com a predadora

      // 3. OÍDIO (Coisas brancas, pó, texturas suaves)
      'velvet': 'Oídio', // Veludo
      'wool': 'Oídio',   // Lã
      'dough': 'Oídio',  // Massa
      'cauliflower': 'Oídio', // Couve-flor
      'toilet tissue': 'Oídio',
      'handkerchief': 'Oídio', // Lenço
      'mushroom': 'Oídio',
      'powder': 'Oídio',
      'flour': 'Oídio', // Farinha

      // 4. FERRUGEM (Coisas laranjas/marrons/textura áspera)
      'ear': 'Ferrugem', // Espiga (confunde muito)
      'corn': 'Ferrugem',
      'honeycomb': 'Ferrugem', // Favo de mel (textura)
      'sponge': 'Ferrugem', // Esponja
      'orange': 'Ferrugem',

      // 5. MANCHA FOLIAR (Manchas escuras, frutas podres)
      'banana': 'Mancha Foliar', // Manchas pretas na banana
      'slug': 'Mancha Foliar',
      'cucumber': 'Mancha Foliar',
      'zucchini': 'Mancha Foliar',
      'plate': 'Mancha Foliar', // Às vezes vê o formato da folha como prato

      // 6. LAGARTAS (Bichos compridos)
      'caterpillar': 'Lagarta',
      'ringlet': 'Lagarta',
      'worm': 'Lagarta',
      'snake': 'Lagarta',
      'nematode': 'Lagarta',
    }

    const carregarDados = async () => {
      const { data: diagData, error: diagError } = await supabase
        .from('diagnosticos')
        .select('*')
        .eq('id', id)
        .single()

      if (diagError || !diagData) {
        alert('Diagnóstico não encontrado.')
        router.push('/historico')
        return
      }

      setDiagnostico(diagData)

      // LÓGICA DE TRADUÇÃO INTELIGENTE
      // 1. Pega o resultado da IA e limpa (ex: "Velvet, fabric" vira "velvet")
      const resultadoBruto = diagData.resultado_ia?.[0]?.className?.toLowerCase() || ''
      
      // Divide por vírgula e testa cada palavra até achar uma correspondência
      const palavrasIA = resultadoBruto.split(',').map(p => p.trim())
      
      let nomeReal = null
      
      // Tenta encontrar alguma das palavras da IA no nosso mapa
      for (const palavra of palavrasIA) {
        if (aiResultToDiseaseMap[palavra]) {
          nomeReal = aiResultToDiseaseMap[palavra]
          break // Achou! Para de procurar.
        }
      }

      // Se não achou no mapa, usa o nome original da IA
      if (!nomeReal) nomeReal = diagData.resultado_ia?.[0]?.className

      if (nomeReal) {
        const { data: doencaData } = await supabase
          .from('doencas')
          .select('*')
          .ilike('nome', `%${nomeReal}%`) 
          .maybeSingle()

        setDetalhesDoenca(doencaData)
      }

      setLoading(false)
    }

    carregarDados()
  }, [id, router])

  const handleDelete = async () => {
    const confirmacao = window.confirm("Tem a certeza que deseja apagar este diagnóstico permanentemente?")
    if (confirmacao) {
      const { error } = await supabase.from('diagnosticos').delete().eq('id', id)
      if (error) alert("Erro ao deletar: " + error.message)
      else {
        router.push('/historico')
        router.refresh()
      }
    }
  }

  const handlePrint = () => {
    window.print()
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!diagnostico) return null

  const tituloExibicao = detalhesDoenca?.nome || diagnostico.resultado_ia?.[0]?.className || 'Análise Concluída'
  const confianca = diagnostico.resultado_ia?.[0]?.probability 
    ? (diagnostico.resultado_ia[0].probability * 100).toFixed(0) + '%' 
    : 'N/A'

  const textoZap = `Olá! Fiz uma análise no AgroVision.%0A%0A🌱 *Diagnóstico:* ${tituloExibicao}%0A📊 *Confiança:* ${confianca}%0A%0AVeja se precisa de tratamento!`

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl print:max-w-none">
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 print:hidden">
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 text-grayDark hover:text-primary font-medium transition self-start md:self-center"
        >
          <ArrowLeft size={20} /> Voltar
        </button>

        <div className="flex gap-2 w-full md:w-auto">
          <button onClick={handlePrint} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-lg transition font-medium">
            <Printer size={18} /> Imprimir
          </button>
          <a href={`https://wa.me/?text=${textoZap}`} target="_blank" className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-green-500 text-white hover:bg-green-600 px-4 py-2 rounded-lg transition font-medium shadow-sm">
            <Share2 size={18} /> WhatsApp
          </a>
          <button onClick={handleDelete} className="flex-none bg-white border border-red-200 text-red-500 hover:bg-red-50 p-2 rounded-lg transition" title="Apagar">
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:block">
        <div className="print:mb-6">
          <div className="rounded-2xl overflow-hidden shadow-lg border border-grayMedium bg-gray-100 mb-6 group print:shadow-none print:border-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={diagnostico.imagem_url} alt="Planta analisada" className="w-full h-auto object-cover group-hover:scale-105 transition duration-500 print:h-64 print:object-contain print:group-hover:scale-100"/>
          </div>

          <div className="bg-white p-6 rounded-xl border border-grayMedium shadow-sm print:border print:shadow-none">
            <h3 className="text-grayDark text-xs font-bold uppercase tracking-wider mb-4 border-b pb-2">Dados Técnicos</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Detecção Original</span>
                <span className="font-medium text-gray-800 capitalize">{diagnostico.resultado_ia?.[0]?.className}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Probabilidade</span>
                <span className="font-bold text-primary bg-green-50 px-2 py-1 rounded print:bg-transparent print:p-0 print:text-black">{confianca}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Data</span>
                <span>{new Date(diagnostico.created_at).toLocaleDateString('pt-BR')}</span>
              </div>
              {diagnostico.localizacao && (diagnostico.localizacao.lat !== 0) && (
                <div className="flex justify-between items-center pt-2 border-t mt-2">
                  <span className="text-gray-600 flex items-center gap-1"><MapPin size={14} /> Localização</span>
                  <span className="text-xs text-blue-600 truncate">{diagnostico.localizacao.lat.toFixed(4)}, {diagnostico.localizacao.lng.toFixed(4)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6 print:mt-6">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2 capitalize">{tituloExibicao}</h1>
            {!detalhesDoenca && (
              <div className="text-orange-600 text-sm bg-orange-50 p-3 rounded-lg border border-orange-100 flex items-center gap-2 print:bg-transparent print:border-0 print:text-black">
                <AlertTriangle size={16} />
                <span>A IA detetou &quot;{diagnostico.resultado_ia?.[0]?.className}&quot;, mas não temos &quot;receita&quot; específica.</span>
              </div>
            )}
          </div>

          {detalhesDoenca ? (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-white p-6 rounded-xl border-l-4 border-l-orange-400 shadow-sm border border-orange-100 print:border print:shadow-none print:mb-4">
                <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2 mb-3"><AlertTriangle className="text-orange-500" size={20} /> O que é isso?</h3>
                <p className="text-gray-600 leading-relaxed text-sm md:text-base">{detalhesDoenca.causa}</p>
              </div>
              <div className="bg-white p-6 rounded-xl border-l-4 border-l-green-500 shadow-sm border border-green-100 print:border print:shadow-none print:mb-4">
                <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2 mb-3"><Leaf className="text-green-600" size={20} /> Tratamento Sustentável</h3>
                <p className="text-gray-600 leading-relaxed text-sm md:text-base">{detalhesDoenca.tratamento_sustentavel}</p>
              </div>
              {detalhesDoenca.tratamento_quimico && (
                <div className="bg-white p-6 rounded-xl border-l-4 border-l-red-500 shadow-sm border border-red-100 opacity-90 print:border print:shadow-none">
                  <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2 mb-3"><FlaskConical className="text-red-500" size={20} /> Tratamento Químico</h3>
                  <p className="text-gray-600 leading-relaxed text-sm">{detalhesDoenca.tratamento_quimico}</p>
                  <p className="text-xs text-red-500 mt-3 font-semibold italic border-t pt-2">* Consulte um agrônomo.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-50 p-8 rounded-xl text-center border border-grayMedium print:hidden">
              <Leaf className="mx-auto text-gray-300 w-12 h-12 mb-3" />
              <p className="text-gray-500">Informações detalhadas indisponíveis.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}