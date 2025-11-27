/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2E7D32',    // Verde Agro (Botões principais, Header)
        secondary: '#4CAF50',  // Verde mais claro
        accent: '#FF9800',     // Laranja (Avisos, Pendente)
        danger: '#D32F2F',     // Vermelho (Erro, Logout, Químico)
        white: '#FFFFFF',
        grayLight: '#F5F5F5',  // Fundo das telas
        grayMedium: '#E0E0E0', // Bordas
        grayDark: '#757575',   // Texto secundário
        textPrimary: '#212121',// Texto principal
      },
    },
  },
  plugins: [],
};