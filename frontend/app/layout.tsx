import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SpoilGuard AI',
  description: 'ML-Driven Food Spoilage Predictor',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
