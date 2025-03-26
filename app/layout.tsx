import './globals.css'
import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import { Providers } from '@/components/providers'

const inter = Roboto({ weight: '400', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Tally',
  description: 'Keeping track of your taxes, one number at a time.',
  generator: 'v0.dev'
}

// Enable Partial Prerendering for the root layout
export const experimental_ppr = true

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}