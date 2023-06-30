import React from 'react'
import styles from '../styles/GuessWhoPopUp.module.css'
import Link from 'next/link';
import Image from 'next/image';
import Router from 'next/router';

export default function EndGamePopUp({props, playerInfo, page}) {
    if (!props) {
        return (
            <div className={styles.popup}>
                <Image 
                src={`https://cms.nhl.bamgrid.com/images/headshots/current/168x168/${playerInfo.playerId}@2x.png`} 
                alt="player image"
                height={175}
                width={175} />
            <h3>{playerInfo.name} was the answer!</h3>
            <div>
                <Link href="/"><Image src="return.svg" alt="return button" height={40} width={40} /></Link>
                <a href={page}><Image src='reload.svg' alt='reload button' height={40} width={40} /></a>
            </div>
            </div>
        );
      } else {
    
        return (
            <div className={styles.popup}>
                <Image 
                src={`https://cms.nhl.bamgrid.com/images/headshots/current/168x168/${playerInfo.playerId}@2x.png`} 
                alt="player image"
                height={175}
                width={175} />
            <h3>You guessed it right!</h3>
            <div>
                <Link href="/"><Image src="return.svg" alt="return button" height={40} width={40} /></Link>
                <a href={page}><Image src='reload.svg' alt='reload button' height={40} width={40} /></a>
            </div>
            </div>
        );
      }
}
