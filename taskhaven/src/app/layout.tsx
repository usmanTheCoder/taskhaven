import { Inter } from 'next/font/google'
import '../styles/globals.css'
import { ReactNode } from 'react'
import { Provider } from 'react-redux'
import { store } from '../redux/store'
import { Toaster } from '../components/ui/toast'
import { NavBar } from '../components/ui/navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'TaskHaven',
  description: 'A comprehensive todo list application',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider store={store}>
          <div className="flex flex-col min-h-screen">
            <NavBar />
            <main className="flex-grow">{children}</main>
            <Toaster />
          </div>
        </Provider>
      </body>
    </html>
  )
}