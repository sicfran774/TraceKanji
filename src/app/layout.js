import Provider from './components/svg-provider'
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
        <Provider>{children}</Provider>
      </body>
    </html>
  )
}
