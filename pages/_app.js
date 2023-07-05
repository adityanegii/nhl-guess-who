import '../styles/globals.css'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ['latin'] })

function MyApp({ Component, pageProps }) {
  return(
  <main className={inter.className}>
    <Component {...pageProps} />
    <Analytics />
  </main>
  )
}

export default MyApp
