import './globals.css'
import Navbar from '@/components/Navbar' // <--- 1. Importa aqui

export const metadata = {
  title: 'AgroVision Web',
  description: 'Diagnóstico de plantas com IA',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt">
      <body className="bg-grayLight min-h-screen text-textPrimary font-sans">
        
        <Navbar /> {/* <--- 2. Adiciona aqui no topo */}
        
        <main className="container mx-auto p-4 pb-24 md:pb-4">
          {children}
        </main>
      
      </body>
    </html>
  )
}