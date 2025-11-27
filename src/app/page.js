'use client'
import Link from "next/link";
import { Camera, History, Leaf } from "lucide-react";
import NewsFeed from '@/components/NewsFeed';
import { useEffect, useState } from 'react';

export default function Home() {
  const [saudacao, setSaudacao] = useState('Olá');

  useEffect(() => {
    // Usamos um setTimeout para evitar o erro de "atualização síncrona"
    const timer = setTimeout(() => {
      const hora = new Date().getHours();
      
      if (hora >= 5 && hora < 12) {
        setSaudacao('Bom dia');
      } else if (hora >= 12 && hora < 18) {
        setSaudacao('Boa tarde');
      } else {
        setSaudacao('Boa noite');
      }
    }, 0);

    // Limpa o timer se a pessoa sair da página (boa prática)
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center py-8 px-4 max-w-6xl mx-auto">
      
      {/* Cabeçalho de Boas Vindas */}
      <div className="w-full mb-10 text-center animate-fade-in">
        <div className="inline-flex items-center justify-center p-3 bg-green-100 rounded-full mb-4 shadow-sm">
          <Leaf size={32} className="text-green-600" />
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-2">
          {saudacao}, Agricultor!
        </h2>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
          Bem-vindo ao <span className="text-primary font-bold">AgroVision</span>. Utilize a Inteligência Artificial para proteger a sua plantação.
        </p>
      </div>
      
      {/* Botões de Ação Rápida */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mb-16">
        {/* Botão Diagnóstico */}
        <Link href="/diagnostico" className="group">
          <div className="bg-green-600 p-8 rounded-2xl shadow-lg hover:bg-green-700 hover:shadow-xl transition duration-300 flex flex-row items-center justify-between relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-white mb-1">Nova Análise</h3>
              <p className="text-green-100 text-sm">Identificar pragas e doenças</p>
            </div>
            <div className="bg-white/20 p-4 rounded-full relative z-10">
              <Camera size={32} className="text-white" />
            </div>
            {/* Efeito de fundo */}
            <div className="absolute -right-10 -bottom-10 bg-white/10 w-32 h-32 rounded-full group-hover:scale-150 transition duration-500"></div>
          </div>
        </Link>
        
        {/* Botão Histórico */}
        <Link href="/historico" className="group">
          <div className="bg-white border border-grayMedium p-8 rounded-2xl shadow-sm hover:border-blue-500 hover:shadow-md transition duration-300 flex flex-row items-center justify-between group-hover:bg-blue-50">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 group-hover:text-blue-700 transition">Histórico</h3>
              <p className="text-gray-500 text-sm group-hover:text-blue-600">Ver diagnósticos anteriores</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-full group-hover:bg-blue-200 transition">
              <History size={32} className="text-gray-600 group-hover:text-blue-700" />
            </div>
          </div>
        </Link>
      </div>

      {/* Noticiário Agrícola */}
      <NewsFeed />

      {/* Rodapé Simples */}
      <div className="mt-8 pt-8 border-t border-gray-200 w-full text-center">
        <p className="text-gray-400 text-sm">Versão Web 2.0 • AgroVision</p>
      </div>
    </div>
  );
}