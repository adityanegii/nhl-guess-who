import React, { useEffect, useState } from 'react'
import styles from '../styles/GuessWhoPopUp.module.css'
import Link from 'next/link';
import Image from 'next/image';

export default function EndGamePopUp({props, playerInfo, page}) {
    
    if (!props) {
        return (
            <div className={styles.popup}>
                <Image 
                src={`https://assets.nhle.com/mugs/nhl/20232024/${playerInfo.resp.teamAbbrev}/${playerInfo.resp.id}.png`} 
                alt="player image"
                height={175}
                width={175} />
            <h3>{playerInfo.resp.name} was the answer!</h3>
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
                src={`https://assets.nhle.com/mugs/nhl/20232024/${playerInfo.resp.teamAbbrev}/${playerInfo.resp.id}.png`} 
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
