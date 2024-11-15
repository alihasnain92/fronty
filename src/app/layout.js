// src/app/layout.js
import './globals.css'

export const metadata = {
  title: 'University Admission Assistant',
  description: 'AI-powered admission assistant for university inquiries',
  icons: {
    icon: [
      {
        url: '/favicon.ico',
        sizes: 'any',
      },
    ],
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}