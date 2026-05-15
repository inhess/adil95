import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ADIL 95 — Inauguration 26 juin 2026',
  description: "Inscription à la journée d'inauguration des nouveaux locaux de l'ADIL 95 à Cergy",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Rethink+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
