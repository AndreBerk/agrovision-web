'use client'
import { useState, useRef, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Send, Bot, User, Loader2, MessageCircle } from 'lucide-react'

export default function Suporte() {
  // Estado inicial com a mensagem de boas-vindas
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: 'Olá! Sou o assistente AgroVision. Pergunte sobre pragas ou doenças (ex: ferrugem, manchas) para ver causas e tratamentos.', 
      sender: 'bot' 
    }
  ])
  const [inputText, setInputText] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  // Rola para baixo sempre que chega mensagem nova
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!inputText.trim()) return

    // 1. Adiciona mensagem do usuário
    const userMsg = { id: Date.now(), text: inputText, sender: 'user' }
    setMessages(prev => [...prev, userMsg])
    const termoBusca = inputText.toLowerCase()
    setInputText('')
    setLoading(true)

    try {
      // 2. Busca no Supabase (procura se a palavra está no array palavras_chave)
      const { data, error } = await supabase
        .from('doencas')
        .select('*')
        .contains('palavras_chave', [termoBusca]) // Busca exata no array
        .limit(1)
      
      // Se não achar exato, tenta buscar se o texto contém a palavra (mais flexível)
      let resultado = data
      if (!data || data.length === 0) {
         // Fallback: Tenta buscar pelo nome
         const { data: dataNome } = await supabase
         .from('doencas')
         .select('*')
         .ilike('nome', `%${termoBusca}%`)
         
         resultado = dataNome
      }

      let botResponse = ''

      if (resultado && resultado.length > 0) {
        const doenca = resultado[0]
        botResponse = `🌱 **${doenca.nome}**\n\n` +
                      `🔍 **Causa:** ${doenca.causa}\n\n` +
                      `✅ **Tratamento Sustentável:** ${doenca.tratamento_sustentavel}\n\n` +
                      `🧪 **Químico:** ${doenca.tratamento_quimico || 'Consulte um agrônomo.'}`
      } else {
        botResponse = `Desculpe, não encontrei informações sobre "${termoBusca}" na minha base de dados. Tente palavras como "ferrugem", "míldio" ou "mancha".`
      }

      // 3. Adiciona resposta do Bot
      setTimeout(() => {
        setMessages(prev => [...prev, { id: Date.now() + 1, text: botResponse, sender: 'bot' }])
        setLoading(false)
      }, 500) // Pequeno delay para parecer natural

    } catch (error) {
      console.error(error)
      setMessages(prev => [...prev, { id: Date.now(), text: "Erro ao conectar com o servidor.", sender: 'bot' }])
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-6 h-[85vh] flex flex-col">
      <h1 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
        <MessageCircle /> Suporte Inteligente
      </h1>

      {/* Área de Chat */}
      <div className="flex-1 bg-white border border-grayMedium rounded-2xl shadow-sm p-4 overflow-y-auto mb-4 custom-scrollbar">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex mb-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-[80%] gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              
              {/* Ícone */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 
                ${msg.sender === 'user' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>

              {/* Balão */}
              <div className={`p-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap
                ${msg.sender === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-gray-100 text-gray-800 rounded-tl-none border border-gray-200'
                }`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex justify-start mb-4">
            <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-2xl rounded-tl-none border border-gray-100">
              <Loader2 className="animate-spin text-primary" size={16} />
              <span className="text-xs text-gray-500">Consultando base de dados...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="relative">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Digite sua dúvida (ex: ferrugem)..."
          className="w-full pl-4 pr-12 py-4 border border-grayMedium rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
        />
        <button 
          type="submit" 
          disabled={!inputText.trim() || loading}
          className="absolute right-2 top-2 p-2 bg-primary text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  )
}