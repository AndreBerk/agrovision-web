'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Leaf, Loader2, Mail, Lock } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Login com Supabase (substitui o Firebase signInWithEmailAndPassword)
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      alert('Erro ao entrar: ' + error.message)
      setLoading(false)
    } else {
      // Sucesso! Vai para a página inicial
      router.push('/')
      router.refresh() // Atualiza a navbar para mostrar o menu
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-grayLight px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-grayMedium">
        
        {/* Cabeçalho */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <Leaf className="text-primary w-8 h-8" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-primary">Bem-vindo ao AgroVision</h1>
          <p className="text-grayDark mt-2">Entre para gerir a sua plantação</p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-grayDark mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-grayMedium rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
                placeholder="seu@email.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-grayDark mb-1">Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-grayMedium rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary hover:bg-green-700 text-white font-bold py-3 rounded-lg transition flex justify-center items-center gap-2 shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Entrar na Conta'}
          </button>
        </form>

        {/* Rodapé */}
        <div className="mt-8 text-center text-sm text-grayDark">
          <p>
            Ainda não tem conta?{' '}
            <Link href="/cadastro" className="text-primary font-bold hover:underline">
              Criar conta grátis
            </Link>
          </p>
        </div>

      </div>
    </div>
  )
}