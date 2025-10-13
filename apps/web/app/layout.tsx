import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

export const metadata: Metadata = {
  title: 'Horcrux - Persistent Context for Agents',
  description: 'A living memory interface for AI systems',
  openGraph: {
    title: 'Horcrux',
    description: 'Persistent personal context for agents',
    url: 'https://horcrux.inc',
    siteName: 'Horcrux',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${jetbrains.variable} font-sans antialiased bg-black text-green-400`}>
        {children}
      </body>
    </html>
  )
}
