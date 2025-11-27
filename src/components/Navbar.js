'use client' // Importante: Permite interatividade (cliques, verificar rota)

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Camera, List, Map, MessageCircle, User, LogOut, Leaf } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function Navbar() {
  const pathname = usePathname() // Descobre qual a página atual
  const router = useRouter()

  // Função para saber se o link está ativo (para pintar de verde)
  const isActive = (path) => pathname === path ? "text-primary bg-green-50" : "text-grayDark hover:text-primary hover:bg-gray-50"

  // Função de Sair (Logout)
  const handleLogout = async () => {
    const confirmar = confirm("Tem a certeza que deseja sair?")
    if (confirmar) {
      await supabase.auth.signOut()
      router.push('/login') // Manda para o login
    }
  }

  // Lista de Menus (Traduzindo do teu TabNavigator antigo)
  const menus = [
    { name: 'Diagnóstico', path: '/diagnostico', icon: Camera },
    { name: 'Histórico', path: '/historico', icon: List },
    { name: 'Mapa', path: '/mapa', icon: Map },
    { name: 'Suporte', path: '/suporte', icon: MessageCircle },
    { name: 'Perfil', path: '/perfil', icon: User },
  ]

  // Se estiver na tela de Login ou Cadastro, NÃO mostra o menu
  if (pathname === '/login' || pathname === '/cadastro') return null

  return (
    <nav className="bg-white border-b border-grayMedium sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          
          {/* LADO ESQUERDO: Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary p-2 rounded-full text-white group-hover:bg-green-700 transition">
              <Leaf size={20} />
            </div>
            <span className="text-xl font-bold text-primary tracking-tight">AgroVision</span>
          </Link>

          {/* CENTRO: Menu Desktop (escondido em telemóveis) */}
          <div className="hidden md:flex space-x-2">
            {menus.map((item) => {
              const Icon = item.icon
              return (
                <Link 
                  key={item.path} 
                  href={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium text-sm ${isActive(item.path)}`}
                >
                  <Icon size={18} />
                  {item.name}
                </Link>
              )
            })}
          </div>

          {/* LADO DIREITO: Botão Sair */}
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-2 text-danger hover:bg-red-50 px-3 py-2 rounded-lg transition-colors text-sm font-medium"
            title="Sair da conta"
          >
            <LogOut size={18} />
            <span className="hidden md:inline">Sair</span>
          </button>

        </div>
      </div>

      {/* MENU MOBILE (Só aparece em telas pequenas, fica em baixo fixo igual app) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-grayMedium px-6 py-3 flex justify-between items-center z-50 shadow-lg pb-safe">
        {menus.slice(0, 4).map((item) => { // Mostra só os 4 principais no mobile
           const Icon = item.icon
           return (
             <Link key={item.path} href={item.path} className={`flex flex-col items-center gap-1 ${pathname === item.path ? 'text-primary' : 'text-gray-400'}`}>
               <Icon size={24} />
               <span className="text-[10px] font-medium">{item.name}</span>
             </Link>
           )
        })}
      </div>
    </nav>
  )
}