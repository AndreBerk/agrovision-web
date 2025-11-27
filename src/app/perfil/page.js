'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { User, LogOut, Rocket, Shield, CloudLightning, Sprout, WifiOff } from 'lucide-react'

export default function Perfil() {
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setUser(user)
      else router.push('/login')
    }
    getUser()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  // Lista de tecnologias futuras (Copiado do teu app original)
  const futureFeatures = [
    { icon: Sprout, title: 'IA Específica para Culturas', description: 'Modelos treinados para identificar pragas em culturas locais.' },
    { icon: BotIcon, title: 'Assistente Virtual Pro', description: 'Chatbot avançado que entende perguntas complexas sobre manejo.' },
    { icon: Shield, title: 'Notificações de Risco', description: 'Avisos sobre riscos climáticos baseados na sua localização.' },
    { icon: WifiOff, title: 'Modo Offline Completo', description: 'Realize diagnósticos básicos mesmo sem internet no campo.' },
  ]

  if (!user) return null

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      
      {/* Cartão do Utilizador */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-grayMedium mb-8 flex flex-col md:flex-row items-center gap-6">
        <div className="bg-green-100 p-6 rounded-full">
          <User size={48} className="text-primary" />
        </div>
        <div className="text-center md:text-left flex-1">
          <h2 className="text-2xl font-bold text-gray-800">Minha Conta</h2>
          <p className="text-gray-500 mt-1">{user.email}</p>
          <div className="mt-2 text-xs text-gray-400 bg-gray-100 inline-block px-2 py-1 rounded">
            ID: {user.id.slice(0, 8)}...
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 text-danger hover:bg-red-50 px-6 py-3 rounded-xl transition font-bold border border-transparent hover:border-red-100"
        >
          <LogOut size={20} />
          Sair da Conta
        </button>
      </div>

      {/* Secção Tecnologias Futuras */}
      <h3 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
        <Rocket /> O Futuro do AgroVision
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {futureFeatures.map((feature, index) => {
          const Icon = feature.icon
          return (
            <div key={index} className="bg-white p-6 rounded-xl border border-grayMedium hover:shadow-md transition group">
              <div className="bg-blue-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-100 transition">
                <Icon className="text-blue-600" size={24} />
              </div>
              <h4 className="font-bold text-gray-800 mb-2">{feature.title}</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          )
        })}
      </div>

      <p className="text-center text-gray-400 text-sm mt-12">
        AgroVision Web v2.0 • Desenvolvido por André
      </p>
    </div>
  )
}

// Componente ícone auxiliar
function BotIcon({size, className}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
  )
}