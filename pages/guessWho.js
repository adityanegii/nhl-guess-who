import Head from 'next/head'
import styles from '../styles/GuessWho.module.css'
import { fetchPlayerIds, getRandomPlayerTeams, getGuessInfo } from '../helpers/helperFunctions'
import { useEffect, useState } from 'react'
import EndGamePopUp from '../components/EndGamePopUp'

import Script from 'next/script'

export default function GuessWho({players}) {
  
  const [playerData, setPlayerData] = useState([]); // [id, name, teamId]
  const [playerIds, setPlayerIds] = useState([]);
  const [playerNames, setPlayerNames] = useState([]);

  const [playerInfo, setPlayerInfo] = useState([]); // Player to guess 

  const [interimGuess, setInterimGuess] = useState(''); // What is in text box
  const [numGuesses, setNumGuesses] = useState(0);
  const [guesses, setGuesses] = useState([]); // [id, name, teamId], List of guessed players

  const [filteredPlayers, setFilteredPlayers] = useState([]); // Players to show in dropdown

  const [won, setWon] = useState(false);


  useEffect(() => {
    fetch('/api/staticData')
    .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Error: ' + response.status);
        }
      })
      .then(data => {
        setPlayerData(data);
        setPlayerIds(data.map((player) => player.id));
        setPlayerNames(data.map((player) => player.name));
      })
      .catch(error => {
        console.error(error); // Handle any errors
      });
  }, []);

  useEffect(() => {
      getRandomPlayerTeams(playerIds).then((playerInfo) => {
          setPlayerInfo(playerInfo);
          console.log(playerInfo);
      });
  }, [playerData]);

  const handleChange = (event) => {
    setInterimGuess(event.target.value);
  };

  useEffect(() => {
    if (interimGuess.length > 2) {
      const filteredPlayers = playerData.filter((player) =>
        player.name.toLowerCase().includes(interimGuess.toLowerCase())
      );
      setFilteredPlayers(filteredPlayers);
    } else {
      setFilteredPlayers([]);
    }
  }, [interimGuess]);

  const handleClick = (player) => {
    setInterimGuess('');
    getGuessInfo(player.id).then((guessInfo) => {
      setGuesses((prevGuesses) => [...prevGuesses, guessInfo]);
    })
    if (player.id === playerInfo.playerId ) {
      setWon(true);

      var duration = 15 * 500;
      var animationEnd = Date.now() + duration;
      var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
      }

      var interval = setInterval(function() {
        var timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        var particleCount = 50 * (timeLeft / duration);
        // since particles fall down, start a bit higher than random
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
      }, 250);

    } else {
      setNumGuesses(numGuesses + 1);
    }
  };

  const highlightMatchingText = (text, query) => {
    const regex = new RegExp(`(${query}|\\s+)`, 'gi');
    const parts = text.split(regex);
  
    return parts.map((part, index) => {
      if (part.toLowerCase() === query.toLowerCase()) {
        return <strong key={index}>{part}</strong>;
      } else if (/\s+/.test(part)) {
        return <span key={index}>&nbsp;</span>;
      } else {
        return part;
      }
    });
  };

  
  return (
    <div>
      <Head>
        <title>NHL guess who</title>
        <meta name="description" content="Guess a player" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Script type="text/javascript" 
        id="hs-script-loader" 
        async 
        defer 
        src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js" 
      />

      <section>
        <a style={{margin: "10px"}} href='/'><img src='home.svg' alt='home button' height='50px'/></a>
      </section>

      <section className= {styles.container}>
        <div className={styles.guess}>
        {(numGuesses < 7 && won==false) && 
          <div>
            <input type="text" id="guess" name="guess" onChange={handleChange} value={interimGuess} placeholder="Write a Player's Name"/>
            <div className={styles.dropdownContainer}>
              <div>
                {filteredPlayers.map((player, index) => (
                  <div key={index} className={styles.dropdownRow} onClick={() => handleClick(player)}>
                    <img
                      src={`https://www-league.nhlstatic.com/images/logos/teams-current-primary-light/${player.teamId}.svg`}
                      alt="Player Team logo"
                      height="25px"
                      />
                    {highlightMatchingText(player.name, interimGuess)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        }
        {(numGuesses == 7 || won==true) && <EndGamePopUp props={won} playerInfo={playerInfo} page="/guessWho" />}
        </div>      
        
        {guesses.length > 0 && (
        <div className={styles.guesses}>
          <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Team</th>
                  <th>Division</th>
                  <th>Nationality</th>
                  <th>Number</th>
                  <th>Age</th>
                  <th>Position</th>
                </tr>
              </thead>
              <tbody>
                {guesses.map((player, index) => (
                  <tr key={index}>
                    <td className={player.name === playerInfo.name ? styles.correctCell : styles.incorrectCell}>{player.name}</td>
                    <td className={player.team === playerInfo.team ? styles.correctCell : styles.incorrectCell}>
                      <div className={styles.entryImg}>
                        <img
                        src={`https://www-league.nhlstatic.com/images/logos/teams-current-primary-light/${player.teamId}.svg`}
                        alt="Player Team logo"
                        height="30px"/>
                        {player.team}
                      </div>
                    </td>
                    <td className={player.division === playerInfo.division ? styles.correctCell : styles.incorrectCell}>
                      <div className={styles.entryImg}>
                        <img src={`/${player.division}.png`}   
                        alt = "Player Division"
                        height="30px"/>
                        {player.division}
                      </div>
                    </td>
                    <td className={player.nationality === playerInfo.nationality ? styles.correctCell : styles.incorrectCell}>{player.nationality}</td>
                    <td className={Math.abs(player.number - playerInfo.number) > 7 ? styles.incorrectCell : (player.number == playerInfo.number ? styles.correctCell : styles.closeCell)}>
                      <div className={styles.numberCell}>
                        {player.number < playerInfo.number && <img src="arrowUp.svg" height="25px"/>}
                        {player.number > playerInfo.number && <img src="arrowDown.svg"  height="25px"/>}
                        {player.number}
                      </div>
                    </td>
                    <td className={Math.abs(player.age - playerInfo.age) > 3 ? styles.incorrectCell : (player.age === playerInfo.age ? styles.correctCell : styles.closeCell)}>
                      <div className={styles.numberCell}>
                        {player.age < playerInfo.age && <img src="arrowUp.svg"  height="25px"/>}
                        {player.age > playerInfo.age && <img src="arrowDown.svg"  height="25px"/>}
                        {player.age}
                      </div>
                    </td>
                    <td className={player.position === playerInfo.position ? styles.correctCell : styles.incorrectCell}>{player.position}</td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>)}
      </section>
    </div>
  )
}