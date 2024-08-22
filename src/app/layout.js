import Provider from './components/shared-kanji-provider'
import AuthContext from '@/lib/nextauth/auth-context'
import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Trace Kanji: Kanji recognition and learning tool',
  description: 'Handwritten kanji recognizer. Learn stroke orders, discover words and info about the kanji in a mobile-friendly environment. Sign-in to create kanji decks.',
}

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=0.8, maximum-scale=1.0" />
      </head>
      <body className={inter.className}>
        <AuthContext>
          <Provider>{children}</Provider>
        </AuthContext>
      </body>
    </html>
  )
}
