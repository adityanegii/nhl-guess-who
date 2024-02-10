import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import { useEffect } from 'react'
import Image from 'next/image'

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
        <div>
          <Link style={{margin: "10px"}} href='/'><Image src='home.svg' alt='home button' height={50} width={50}/></Link>
        </div>
      </section>

      <section className= {styles.container}>
        <Link href="/guessWho"><button className={styles.button}><h2>NHL Guess Who?</h2></button></Link>
        <Link href="/teamHopper"><button className={styles.button}><h2>NHL Team Hopper</h2></button></Link>
      </section>
    </div>
  )
}

// export default function Home() {
//   return (
//     <section className= {styles.container}>
//       <h1>Sorry, this project is currently down, the NHL API update has left the old API deprecated. I will try to get this up and running as fast as possible!</h1>
//     </section>
//   )
// }

