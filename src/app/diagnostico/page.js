'use client'

import { useState, useRef, useEffect } from 'react'
import * as tf from '@tensorflow/tfjs'
import * as mobilenet from '@tensorflow-models/mobilenet'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Upload, Loader2, Camera, AlertCircle, Leaf, MapPin } from 'lucide-react'
import WeatherWidget from '@/components/WeatherWidget' // <--- Importamos o Clima aqui

export default function DiagnosticoPage() {
  const [imagem, setImagem] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [resultado, setResultado] = useState(null)
  
  // Estado para guardar o GPS
  const [location, setLocation] = useState(null) 
  
  const imageRef = useRef(null)
  const router = useRouter()

  // 1. Verifica login e Pede Localização GPS ao iniciar
  useEffect(() => {
    const initPage = async () => {
      // Checa Login
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) router.push('/login')

      // Pede GPS
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            })
          },
          (error) => {
            console.error("Erro GPS:", error)
            // Não bloqueamos o uso, apenas avisamos
          }
        )
      }
    }
    initPage()
  }, [router])

  // 2. Função para selecionar imagem
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImagem(file)
      setPreview(URL.createObjectURL(file))
      setResultado(null)
    }
  }

  // 3. Função Principal: Analisar e Salvar
  const analisarPlanta = async () => {
    if (!imagem) return alert("Por favor, selecione uma imagem.")
    
    setLoading(true)

    try {
      console.log("Carregando modelo...")
      const model = await mobilenet.load()
      
      console.log("Classificando imagem...")
      const predictions = await model.classify(imageRef.current)

      // Pega usuário atual
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        alert("Sessão expirada.")
        router.push('/login')
        return
      }

      // Upload da Imagem para o Storage
      const fileName = `${user.id}/${Date.now()}_${imagem.name}`
      const { error: uploadError } = await supabase.storage.from('plantas').upload(fileName, imagem)
      if (uploadError) throw uploadError

      const { data: publicUrlData } = supabase.storage.from('plantas').getPublicUrl(fileName)

      // Salvar no Banco (Com GPS real se tiver, ou 0,0)
      const { error: dbError } = await supabase
        .from('diagnosticos')
        .insert([
          {
            user_email: user.email,
            resultado_ia: predictions,
            imagem_url: publicUrlData.publicUrl,
            localizacao: location ? { lat: location.lat, lng: location.lng } : { lat: 0, lng: 0 }
          }
        ])

      if (dbError) throw dbError

      setResultado(predictions)
      alert("Diagnóstico salvo com sucesso!")

    } catch (error) {
      console.error(error)
      alert("Erro: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center min-h-[85vh] p-6 pb-24">
      
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-primary mb-2 flex justify-center items-center gap-2">
          <Camera /> Diagnóstico Inteligente
        </h1>
        
        {/* Indicador de GPS */}
        <div className="flex justify-center mt-2">
          {location ? (
            <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
              <MapPin size={12} /> GPS Ativo
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
              <MapPin size={12} /> A aguardar GPS...
            </span>
          )}
        </div>
      </div>

      {/* --- WIDGET DE CLIMA AQUI --- */}
      <div className="w-full max-w-lg mb-4">
        <WeatherWidget />
      </div>

      {/* Área Principal de Diagnóstico */}
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg border border-grayMedium p-6">
        
        {/* Preview da Imagem */}
        <div className="mb-6 flex flex-col items-center justify-center border-2 border-dashed border-grayMedium rounded-xl h-64 bg-gray-50 overflow-hidden relative">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img ref={imageRef} src={preview} alt="Preview" className="object-contain h-full w-full" />
          ) : (
            <div className="text-gray-400 text-center p-4">
              <Upload className="mx-auto mb-3 w-10 h-10 text-gray-300" />
              <p className="font-medium">Nenhuma imagem selecionada</p>
            </div>
          )}
        </div>

        {/* Botões */}
        <div className="space-y-4">
          <label className="block w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-center py-3 rounded-lg font-bold transition shadow-sm">
            Selecionar Foto
            <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </label>

          <button
            onClick={analisarPlanta}
            disabled={!imagem || loading}
            className={`w-full py-3 rounded-lg font-bold text-white flex justify-center items-center gap-2 transition shadow-sm
              ${!imagem || loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-green-700'}
            `}
          >
            {loading ? <><Loader2 className="animate-spin" /> Analisando...</> : <><Leaf size={20} /> Fazer Diagnóstico</>}
          </button>
        </div>

        {/* Resultados da IA */}
        {resultado && (
          <div className="mt-8 p-5 bg-green-50 border border-green-200 rounded-xl animate-fade-in">
            <h3 className="font-bold text-green-800 mb-3 flex items-center gap-2 text-lg">
              <AlertCircle size={20} /> Resultado da IA:
            </h3>
            <ul className="space-y-3">
              {resultado.slice(0, 3).map((item, index) => (
                <li key={index} className="flex justify-between items-center text-sm text-gray-700 bg-white p-3 rounded-lg border border-green-100 shadow-sm">
                  <span className="font-medium capitalize text-base">{item.className}</span>
                  <span className="font-bold text-primary bg-green-100 px-2 py-1 rounded">
                    {(item.probability * 100).toFixed(1)}%
                  </span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-gray-500 mt-4 text-center italic">
              *A IA fornece uma estimativa. Consulte um agrônomo.
            </p>
          </div>
        )}

      </div>
    </div>
  )
}