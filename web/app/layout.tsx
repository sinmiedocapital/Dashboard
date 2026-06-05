import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Sin Miedo Capital · SMC Venice v9',
  description: 'Institutional SMC confluence signals for MES & MCL futures. Trading Without Fear.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body style={{ backgroundColor: '#0d1117', margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  )
}
