'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { UserPlus, Loader2, Mail, Lock } from 'lucide-react'

export default function Cadastro() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleCadastro = async (e) => {
    e.preventDefault()
    
    if (password !== confirmPass) {
      alert("As senhas não coincidem!")
      return
    }

    if (password.length < 6) {
      alert("A senha deve ter pelo menos 6 caracteres.")
      return
    }

    setLoading(true)

    // Criar conta no Supabase
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      alert('Erro ao cadastrar: ' + error.message)
      setLoading(false)
    } else {
      alert('Conta criada com sucesso! Você já pode entrar.')
      router.push('/login')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-grayLight px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-grayMedium">
        
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <UserPlus className="text-blue-600 w-8 h-8" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Criar Nova Conta</h1>
          <p className="text-grayDark mt-2">Junte-se ao AgroVision hoje</p>
        </div>

        <form onSubmit={handleCadastro} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-grayDark mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full pl-10 pr-4 py-3 border border-grayMedium rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="seu@email.com" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-grayDark mb-1">Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                className="w-full pl-10 pr-4 py-3 border border-grayMedium rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="Mínimo 6 caracteres" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-grayDark mb-1">Confirmar Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input type="password" value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} required
                className="w-full pl-10 pr-4 py-3 border border-grayMedium rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="Repita a senha" />
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition flex justify-center items-center gap-2 shadow-md mt-4">
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Cadastrar'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-grayDark">
          <p>
            Já tem uma conta?{' '}
            <Link href="/login" className="text-blue-600 font-bold hover:underline">
              Fazer Login
            </Link>
          </p>
        </div>

      </div>
    </div>
  )
}