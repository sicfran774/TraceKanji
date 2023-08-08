import Provider from './components/shared-kanji-provider'
import AuthContext from '@/lib/nextauth/auth-context'
import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Trace Kanji',
  description: 'Online japanese kanji trainer',
}

export default function RootLayout({ children }) {
  return (
    <html>
      <body className={inter.className}>
        <AuthContext>
          <Provider>{children}</Provider>
        </AuthContext>
      </body>
    </html>
  )
}
