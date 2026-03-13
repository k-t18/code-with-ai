import type { Metadata } from 'next'
import { Ubuntu, Poppins } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/common/Navbar'

const ubuntu = Ubuntu({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-heading',
  display: 'swap',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'TruCare',
  description: 'TruCare Healthcare Platform',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${ubuntu.variable} ${poppins.variable}`}>
      <body className="">
        <Navbar />
        {children}
      </body>
    </html>
  )
}
