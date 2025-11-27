'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect } from 'react'

// --- CORREÇÃO DE ÍCONES DO LEAFLET NO NEXT.JS ---
// Por padrão, os ícones do Leaflet quebram no Next.js.
// Este código abaixo conserta isso automaticamente.
const iconFix = () => {
  delete L.Icon.Default.prototype._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  })
}

export default function Map({ diagnosticos }) {
  useEffect(() => {
    iconFix()
  }, [])

  // Centro inicial do mapa (Ex: Brasil ou Portugal)
  // Se quiseres focar na tua cidade, muda estes números!
  const defaultCenter = [-15.7942, -47.8822] // Brasília

  return (
    <MapContainer 
      center={defaultCenter} 
      zoom={4} 
      style={{ height: '100%', width: '100%', borderRadius: '12px' }}
    >
      {/* Camada do Mapa (Estilo OpenStreetMap) */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Marcadores */}
      {diagnosticos.map((item) => {
        // Verifica se tem coordenadas válidas (diferentes de 0)
        const lat = item.localizacao?.lat || item.localizacao?.latitude
        const lng = item.localizacao?.lng || item.localizacao?.longitude

        if (!lat || !lng || (lat === 0 && lng === 0)) return null

        // Pega o nome da doença
        const nome = item.resultado_ia?.[0]?.className || 'Diagnóstico'

        return (
          <Marker key={item.id} position={[lat, lng]}>
            <Popup>
              <div className="text-center">
                <strong className="text-primary text-sm">{nome}</strong>
                <br />
                {item.imagem_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img 
                    src={item.imagem_url} 
                    alt="Foto" 
                    className="w-20 h-20 object-cover rounded mt-2 mx-auto" 
                  />
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(item.created_at).toLocaleDateString()}
                </p>
              </div>
            </Popup>
          </Marker>
        )
      })}
    </MapContainer>
  )
}