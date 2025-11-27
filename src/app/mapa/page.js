'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import dynamic from 'next/dynamic' // Importante para carregar o mapa
import { Map as MapIcon, Loader2 } from 'lucide-react'

// Carrega o componente Map de forma dinâmica (apenas no cliente/navegador)
// Isso evita o erro "window is not defined"
const MapWithNoSSR = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-gray-100 rounded-xl">
      <Loader2 className="animate-spin text-primary" />
      <span className="ml-2 text-gray-500">Carregando mapa...</span>
    </div>
  ),
})

export default function MapaPage() {
  const [diagnosticos, setDiagnosticos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLocations = async () => {
      // Busca todos os diagnósticos (não apenas os meus, para ver o mapa cheio!)
      // Se quiseres só os teus, adiciona .eq('user_email', ...)
      const { data, error } = await supabase
        .from('diagnosticos')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) console.error(error)
      else setDiagnosticos(data || [])
      
      setLoading(false)
    }

    fetchLocations()
  }, [])

  return (
    <div className="container mx-auto px-4 py-6 h-[85vh] flex flex-col">
      <h1 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
        <MapIcon /> Mapa de Ocorrências
      </h1>

      <div className="flex-1 bg-white p-2 rounded-xl border border-grayMedium shadow-sm relative z-0">
        <MapWithNoSSR diagnosticos={diagnosticos} />
      </div>

      <p className="text-center text-sm text-grayDark mt-4">
        Exibindo {diagnosticos.length} ocorrências registadas na plataforma.
      </p>
    </div>
  )
}