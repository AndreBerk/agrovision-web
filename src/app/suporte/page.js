'use client'
import { useState, useRef, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Send, Bot, User, Loader2, MessageCircle, Sprout, BookOpen, Smile, AlertCircle } from 'lucide-react'

export default function Suporte() {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: 'Olá! Sou o assistente AgroVision Nível 2. 🎓🚜\n\nSou capaz de:\n🔍 **Distinguir problemas** (ex: "Mancha")\n🌾 **Listar por cultura** (ex: "Pragas da Soja")\n🧪 **Indicar Defensivos**\n\nComo posso ajudar?', 
      sender: 'bot' 
    }
  ])
  const [inputText, setInputText] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!inputText.trim()) return

    const termoOriginal = inputText.trim()
    const termoBusca = termoOriginal.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, "")
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"")

    const userMsg = { id: Date.now(), text: termoOriginal, sender: 'user' }
    setMessages(prev => [...prev, userMsg])
    setInputText('')
    setLoading(true)

    // --- 1. CÉREBRO DE CONVERSA (Social) ---
    const conversaBasica = {
      'oi': 'Olá! Pronto para o trabalho no campo?',
      'ola': 'Olá! Em que posso ser útil hoje?',
      'obrigado': 'Disponha! Estou aqui para ajudar a sua colheita.',
      'quem e voce': 'Sou o AgroVision 2.0, seu assistente virtual com base de dados agronômica.',
      'ajuda': 'Tente digitar o nome de uma cultura (ex: "Soja") ou um sintoma (ex: "folha comida").'
    }

    let respostaConversa = null
    for (const chave in conversaBasica) {
      if (termoBusca === chave || (termoBusca.includes(chave) && termoBusca.length < 20)) {
        respostaConversa = conversaBasica[chave]
        break
      }
    }

    if (respostaConversa) {
      setTimeout(() => {
        setMessages(prev => [...prev, { id: Date.now() + 1, text: respostaConversa, sender: 'bot' }])
        setLoading(false)
      }, 500)
      return
    }

    try {
      let botResponse = ''
      let encontrou = false

      // --- 2. CÉREBRO AGRÍCOLA AVANÇADO ---

      // A. Busca por CULTURA (Novo!)
      // Verifica se o termo digitado está no array 'culturas'
      const { data: dataCultura } = await supabase
        .from('doencas')
        .select('nome')
        .contains('culturas', [termoBusca])

      if (dataCultura && dataCultura.length > 0) {
        const listaPragas = dataCultura.map(p => `• ${p.nome}`).join('\n')
        botResponse = `🌾 **Cultura Identificada: ${termoOriginal}**\n\nAqui estão as pragas/doenças comuns cadastradas para esta cultura:\n\n${listaPragas}\n\n*Digite o nome de uma delas para ver o tratamento.*`
        encontrou = true
      }

      // B. Busca DOENÇA/PRAGA (Se não for cultura)
      if (!encontrou) {
        let { data: dataDoencas } = await supabase
          .from('doencas')
          .select('*')
          .contains('palavras_chave', [termoBusca])
        
        if (!dataDoencas || dataDoencas.length === 0) {
           const { data: dataAmpla } = await supabase
           .from('doencas')
           .select('*')
           .or(`nome.ilike.%${termoBusca}%,causa.ilike.%${termoBusca}%,tratamento_sustentavel.ilike.%${termoBusca}%`)
           dataDoencas = dataAmpla
        }

        if (dataDoencas && dataDoencas.length > 0) {
          // --- INTELIGÊNCIA DE DESAMBIGUAÇÃO ---
          if (dataDoencas.length === 1) {
            // Só achou um, mostra direto
            const item = dataDoencas[0]
            botResponse = `🔎 **${item.nome}**\n\n` +
                          `🍂 **Causa:** ${item.causa}\n\n` +
                          `✅ **Tratamento:**\n${item.tratamento_sustentavel}\n\n` +
                          `🧪 **Químico:** ${item.tratamento_quimico || 'Consulte um técnico.'}`
          } else {
            // Achou vários (ex: "mancha"), lista as opções
            const opcoes = dataDoencas.map(d => `• ${d.nome}`).join('\n')
            botResponse = `🤔 Encontrei ${dataDoencas.length} resultados para "${termoOriginal}". Qual deles você procura?\n\n${opcoes}\n\n*Digite o nome completo para ver os detalhes.*`
          }
          encontrou = true
        }
      }

      // C. Busca GLOSSÁRIO
      if (!encontrou) {
        let { data: dataGlossario } = await supabase
          .from('glossario')
          .select('*')
          .or(`termo.ilike.%${termoBusca}%,definicao.ilike.%${termoBusca}%`)
          .limit(1)
        
        if (dataGlossario && dataGlossario.length > 0) {
          const item = dataGlossario[0]
          botResponse = `📚 **Conceito: ${item.termo}**\n\n${item.definicao}\n\n💡 Ex: ${item.exemplo}`
          encontrou = true
        }
      }

      if (!encontrou) {
        botResponse = `Não encontrei "${termoOriginal}".\n\nTente:\n1. Digitar uma cultura (ex: "Soja", "Milho")\n2. Digitar um sintoma simples.`
      }

      setTimeout(() => {
        setMessages(prev => [...prev, { id: Date.now() + 1, text: botResponse, sender: 'bot' }])
        setLoading(false)
      }, 600)

    } catch (error) {
      console.error(error)
      setMessages(prev => [...prev, { id: Date.now(), text: "Erro técnico.", sender: 'bot' }])
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-6 h-[85vh] flex flex-col">
      <h1 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
        <MessageCircle /> Suporte Inteligente
      </h1>

      <div className="flex-1 bg-white border border-grayMedium rounded-2xl shadow-sm p-4 overflow-y-auto mb-4 custom-scrollbar">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex mb-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-[85%] gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm
                ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'}`}>
                {msg.sender === 'user' ? <User size={16} /> : (msg.text.includes('Qual deles') ? <AlertCircle size={18} /> : <Sprout size={18} />)}
              </div>

              <div className={`p-3.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap shadow-sm
                ${msg.sender === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-gray-50 text-gray-800 rounded-tl-none border border-gray-200'
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
              <span className="text-xs text-gray-500 font-medium">Pesquisando...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="relative">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Digite cultura, praga ou dúvida..."
          className="w-full pl-5 pr-14 py-4 border border-grayMedium rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm text-gray-700 placeholder-gray-400"
        />
        <button 
          type="submit" 
          disabled={!inputText.trim() || loading}
          className="absolute right-2 top-2 p-2.5 bg-primary text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  )
}