'use client'
import { useState, useEffect } from 'react'
import { Cloud, Droplets, Wind, MapPin, Loader2, AlertCircle } from 'lucide-react'

export default function WeatherWidget() {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // A tua chave está correta aqui
  const API_KEY = '47d620211dcd3ca0ee5606229262c805'

  useEffect(() => {
    
    if (!API_KEY) {
      setError('API Key não configurada')
      setLoading(false)
      return
    }

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords
            
            // Chama a API do OpenWeatherMap
            const response = await fetch(
              `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=pt_br&appid=${API_KEY}`
            )
            
            const data = await response.json()
            
            if (response.ok) {
              setWeather(data)
            } else {
              setError('Erro ao carregar clima')
            }
          } catch (err) {
            setError('Erro de conexão')
          } finally {
            setLoading(false)
          }
        },
        (err) => {
          setError('Permissão de localização negada')
          setLoading(false)
        }
      )
    } else {
      setError('GPS não suportado')
      setLoading(false)
    }
  }, [])

  if (loading) return (
    <div className="flex items-center gap-2 text-gray-500 text-sm bg-gray-50 p-3 rounded-xl border border-gray-200 w-full animate-pulse">
      <Loader2 className="animate-spin" size={16} /> Carregando clima...
    </div>
  )

  if (error) return (
    <div className="flex items-center gap-2 text-orange-600 text-sm bg-orange-50 p-3 rounded-xl border border-orange-100 w-full">
      <AlertCircle size={16} /> {error}
    </div>
  )

  if (!weather) return null

  return (
    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl shadow-md w-full mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
      
      {/* Lado Esquerdo: Local e Ícone */}
      <div className="flex items-center gap-4">
        {/* Ícone do Clima (Vem da API) */}
        <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
           {/* eslint-disable-next-line @next/next/no-img-element */}
           <img 
             src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} 
             alt={weather.weather[0].description} 
             className="w-10 h-10"
           />
        </div>
        
        <div>
          <h3 className="font-bold text-lg flex items-center gap-1">
            <MapPin size={16} /> {weather.name}
          </h3>
          <p className="text-blue-100 text-sm capitalize">
            {weather.weather[0].description}
          </p>
        </div>
      </div>

      {/* Lado Direito: Dados Numéricos */}
      <div className="flex items-center gap-6 text-sm font-medium">
        <div className="text-center">
          <p className="text-2xl font-bold">{Math.round(weather.main.temp)}°C</p>
          <p className="text-blue-100 text-xs">Sensação {Math.round(weather.main.feels_like)}°</p>
        </div>
        
        <div className="h-8 w-px bg-white/30 hidden md:block"></div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <Droplets size={14} className="text-blue-200" />
            <span>{weather.main.humidity}% Humidade</span>
          </div>
          <div className="flex items-center gap-1">
            <Wind size={14} className="text-blue-200" />
            <span>{weather.wind.speed} m/s Vento</span>
          </div>
        </div>
      </div>

    </div>
  )
}