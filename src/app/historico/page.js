'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link' // Importante para a navegação
import { Calendar, CheckCircle, Search } from 'lucide-react'

export default function Historico() {
  const [diagnosticos, setDiagnosticos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Definimos a função DENTRO do useEffect para evitar erros do React
    const buscarHistorico = async () => {
      // 1. Pega o utilizador logado
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setLoading(false)
        return
      }

      // 2. Busca os diagnósticos desse email
      const { data, error } = await supabase
        .from('diagnosticos')
        .select('*')
        .eq('user_email', user.email) // Filtro pelo email
        .order('created_at', { ascending: false }) // Mais recentes primeiro

      if (error) {
        console.error('Erro ao buscar:', error)
        alert('Erro ao carregar histórico.')
      } else {
        setDiagnosticos(data || [])
      }
      setLoading(false)
    }

    // Chama a função
    buscarHistorico()
  }, []) 

  // Função para formatar a data bonita
  const formatarData = (dataISO) => {
    return new Date(dataISO).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
        <Search /> Histórico de Análises
      </h1>

      {diagnosticos.length === 0 ? (
        // Estado Vazio (Sem diagnósticos)
        <div className="flex flex-col items-center justify-center bg-white p-12 rounded-xl border border-dashed border-grayMedium text-center h-64">
          <div className="bg-gray-100 p-4 rounded-full mb-4">
            <Search className="text-gray-400 w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold text-grayDark">Sem Diagnósticos</h3>
          <p className="text-sm text-gray-500 mt-1">
            As suas análises aparecerão aqui.
          </p>
        </div>
      ) : (
        // Lista em Grade (Grid)
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {diagnosticos.map((item) => {
            // Tratamento de dados (caso venha vazio ou diferente)
            const resultados = item.resultado_ia || []
            const nomeDoenca = resultados.length > 0 ? resultados[0].className : 'Desconhecido'
            
            let confianca = 'N/A'
            if (resultados.length > 0 && resultados[0].probability) {
                confianca = (resultados[0].probability * 100).toFixed(0) + '%'
            }

            return (
              // Agora usamos o Link para tornar o card clicável
              <Link 
                href={`/historico/${item.id}`} 
                key={item.id} 
                className="bg-white rounded-xl shadow-sm border border-grayMedium overflow-hidden hover:shadow-md transition cursor-pointer group"
              >
                
                {/* Imagem (Topo do Card) */}
                <div className="h-48 w-full bg-gray-100 relative overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={item.imagem_url} 
                    alt="Planta" 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-xs font-bold text-primary shadow-sm">
                    {confianca}
                  </div>
                </div>

                {/* Conteúdo */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-gray-800 capitalize truncate group-hover:text-primary transition">
                      {nomeDoenca}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                    <Calendar size={14} />
                    {formatarData(item.created_at)}
                  </div>

                  <div className="flex items-center gap-2 text-sm font-medium text-green-600 bg-green-50 px-3 py-1.5 rounded-lg w-fit">
                    <CheckCircle size={16} />
                    Ver Detalhes
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}