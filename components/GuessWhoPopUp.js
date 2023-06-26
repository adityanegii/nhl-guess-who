import React from 'react'
import styles from '../styles/GuessWhoPopUp.module.css'

export default function GuessWhoPopUp({props, playerInfo}) {
    if (!props) {
        return (
            <div className={styles.popup}>
                <img 
                src={`https://cms.nhl.bamgrid.com/images/headshots/current/168x168/${playerInfo.playerId}@2x.png`} 
                alt="player image"
                height="175px" />
            <h3>{playerInfo.name} was the answer!</h3>
            <div>
                <a href="/"><img src="return.svg" alt="return button" height="40px" /></a>
                <a href="/guessWho"><img src='reload.svg' alt='reload button' height="40px" /></a>
            </div>
            </div>
        );
      } else {
    
        return (
            <div className={styles.popup}>
                <img 
                src={`https://cms.nhl.bamgrid.com/images/headshots/current/168x168/${playerInfo.playerId}@2x.png`} 
                alt="player image"
                height="175px" />
            <h3>You guessed it right!</h3>
            <div>
                <a href="/"><img src="return.svg" alt="return button" height="40px" /></a>
                <a href="/guessWho"><img src='reload.svg' alt='reload button' height="40px" /></a>
            </div>
            </div>
        );
      }
}
