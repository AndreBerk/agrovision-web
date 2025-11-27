import { Calendar, TrendingUp, ExternalLink } from 'lucide-react'

export default function NewsFeed() {
  const news = [
    {
      id: 1,
      category: 'Tecnologia',
      title: 'Drones na agricultura: Como a monitorização aérea reduz custos em 30%',
      date: '26 Out 2025',
      // AQUI: Usamos a imagem que você colocou na pasta public
      image: '/noticia-drone.jpg', 
      link: '#'
    },
    {
      id: 2,
      category: 'Mercado',
      title: 'Preço da soja sobe 5% com novas políticas de exportação',
      date: '25 Out 2025',
      // AQUI: Usamos a imagem da soja
      image: '/noticia-soja.png',
      link: '#'
    },
    {
      id: 3,
      category: 'Clima',
      title: 'Alerta: Previsão de chuvas intensas para a região Sul na próxima semana',
      date: '24 Out 2025',
      // Esta mantemos uma genérica de chuva (ou se tiveres outra, coloca na pasta public também)
      image: 'https://images.unsplash.com/photo-1516912481808-3406841bd33c?auto=format&fit=crop&q=80&w=800',
      link: '#'
    }
  ]

  return (
    <div className="w-full mb-12 animate-fade-in">
      <div className="flex items-center justify-between mb-6 px-2">
        <h2 className="text-xl font-bold text-primary flex items-center gap-2">
          <TrendingUp /> Notícias do Agro
        </h2>
        <button className="text-xs text-primary font-semibold cursor-pointer hover:underline flex items-center gap-1">
          Ver todas <ExternalLink size={12} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {news.map((item) => (
          <a key={item.id} href={item.link} className="bg-white rounded-xl border border-grayMedium overflow-hidden hover:shadow-lg transition group flex flex-col">
            <div className="h-40 overflow-hidden relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute top-3 left-3">
                <span className="text-[10px] font-bold uppercase text-blue-800 bg-white/90 backdrop-blur px-2 py-1 rounded shadow-sm">
                  {item.category}
                </span>
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-xs text-gray-400 flex items-center gap-1 mb-2">
                  <Calendar size={12} /> {item.date}
                </span>
                <h3 className="text-sm font-bold text-gray-800 leading-snug group-hover:text-primary transition">
                  {item.title}
                </h3>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-primary font-medium">
                Ler notícia completa →
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}