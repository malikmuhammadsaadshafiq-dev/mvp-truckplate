import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TruckPlate - Recipe Costing Platform',
  description: 'Collaborative recipe costing platform for food trucks',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  )
}