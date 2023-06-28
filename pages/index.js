import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import { useEffect } from 'react'

export default function Home() {
  useEffect(() => {
    fetch('/api/fetchPlayers')
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Error: ' + response.status);
        }
      })
      .then(data => {
        console.log(data); // Process the response data
      })
      .catch(error => {
        console.error(error); // Handle any errors
      });
  }, []);
  
  return (
    <div>
      <Head>
        <title>NHL games</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section>
        <a style={{margin: "10px"}} href='/'><img src='home.svg' alt='home button' height='50px'/></a>
      </section>

      <section className= {styles.container}>
        <Link href="/guessWho"><button className={styles.button}><h2>NHL Guess Who?</h2></button></Link>
        <Link href="/whereWereYou"><button className={styles.button}><h2>NHL Where Were You?</h2></button></Link>
      </section>
    </div>
  )
}

