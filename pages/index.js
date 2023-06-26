import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Link from 'next/link'

export default function Home() {
  
  return (
    <div>
      <Head>
        <title>NHL games</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section>
        <h1>NHL games</h1>
      </section>

      <section className= {styles.container}>
        <Link href="/guessWho"><button className={styles.button}><h2>NHL Guess Who?</h2></button></Link>
        <Link href="/whereWereYou"><button className={styles.button}><h2>NHL Where Were You?</h2></button></Link>
      </section>
    </div>
  )
}
