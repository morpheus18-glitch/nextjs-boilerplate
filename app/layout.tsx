// app/layout.tsx
import './globals.css'
import { ReactNode } from 'react'
import Navbar from './components/Navbar'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main style={{ paddingTop: '60px' }}>{children}</main>
      </body>
    </html>
  )
}