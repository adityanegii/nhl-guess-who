import Head from 'next/head'
import { useEffect, useState } from 'react'
import { fetchPlayerIds, getRandomPlayerTeams, getGuessInfo } from '../helpers/helperFunctions'
import styles from '../styles/WhereWereYou.module.css'
import EndGamePopUp from '../components/EndGamePopUp'
import Script from 'next/script'
import Link from 'next/link'
import Image from 'next/image'

export default function WhereWereYou() {

  const [numGuesses, setNumGuesses] = useState(0);

  const [playerData, setPlayerData] = useState([]); // [id, name, teamId]
  const [playerIds, setPlayerIds] = useState([]);
  const [playerNames, setPlayerNames] = useState([]);
  const [playerInfo, setPlayerInfo] = useState([]); // Player to guess 

  const [guesses, setGuesses] = useState([]); // [id, name, teamId], List of guessed players
  const [maxGuesses, setMaxGuesses] = useState(1); // Max number of guesses (different teams played for)

  const [filteredPlayers, setFilteredPlayers] = useState([]); // Players to show in dropdown
  const [interimGuess, setInterimGuess] = useState(''); // What is in text box

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
        if (playerInfo!=null) {
          console.log(playerInfo);
          setPlayerInfo(playerInfo);
          setMaxGuesses(playerInfo.seasons.length);
          setSeasonsToShow(playerInfo.seasons.slice(0, numGuesses + 1));
        }
        });
  }, [playerIds]);

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

  const handleChange = (event) => {
    setInterimGuess(event.target.value);
  };

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

  const [seasonsToShow, setSeasonsToShow] = useState([]); // [seasons to show]
  useEffect(() => {
    if (playerInfo != null) {
      if (playerInfo.seasons != null){
        setSeasonsToShow(playerInfo.seasons.slice(0, numGuesses + 1));
      }
    }
  }, [numGuesses]);

  return (
    <div>
      <Head>
        <title>NHL where were you</title>
        <meta name="description" content="Guess a player based on their career" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Script type="text/javascript" 
        id="hs-script-loader" 
        async 
        defer 
        src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js" 
      />

      <section>
        <Link style={{margin: "10px"}} href='/'><Image src='home.svg' alt='home button' height={50} width={50} /></Link>
      </section>

      <section className={styles.container}>
        <div className={styles.guess}>
          {(numGuesses < maxGuesses && won==false) && 
            <div>
              <input type="text" id="guess" name="guess" onChange={handleChange} value={interimGuess} placeholder="Write a Player's Name"/>
              <div className={styles.dropdownContainer}>
                <div>
                  {filteredPlayers.map((player, index) => (
                    <div key={index} className={styles.dropdownRow} onClick={() => handleClick(player)}>
                      <Image
                        src={`https://www-league.nhlstatic.com/images/logos/teams-current-primary-light/${player.teamId}.svg`}
                        alt="Player Team logo"
                        height={40}
                        width={40}
                        />
                      {highlightMatchingText(player.name, interimGuess)}
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.guesses}>
                <table>
                  <tbody>
                    {
                      guesses.map((player, index) => (
                        <tr key={index}>
                          <td className={player.id === playerInfo.playerId ? styles.correctCell : styles.incorrectCell}>
                            <Image
                            src={`https://cms.nhl.bamgrid.com/images/headshots/current/168x168/${player.playerId}@2x.png`}
                            alt="Player Headshot"
                            height={50}
                            width={50}
                            />
                          </td>
                          <td className={player.division === playerInfo.division ? styles.correctCell : styles.incorrectCell}>
                            <Image src={`/${player.division}.png`} 
                            alt = "Player Division"
                            height={50}
                            width={50}
                            />
                          </td>
                          <td className={player.team === playerInfo.team ? styles.correctCell : styles.incorrectCell}>
                            <Image
                            src={`https://www-league.nhlstatic.com/images/logos/teams-current-primary-light/${player.teamId}.svg`}
                            alt="Player Team logo"
                            height={50}
                            width={50}
                            />
                          </td>
                        </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          }
          {(numGuesses == maxGuesses || won==true) && <EndGamePopUp props={won} playerInfo={playerInfo} page="whereWereYou"/>}
          </div>  
          
          <div className={styles.playerInfo}>
          <table>
            <thead>
              <tr>
                  <th>Season</th>
                  <th>Team</th>
                  <th>League</th>
                  <th>Games</th>
                  {
                      playerInfo.position === "G" ? 
                      <th>SV%</th> :
                      <th>Points</th>
                    }
                </tr>
            </thead>
            
            <tbody>
              { 
                seasonsToShow.map((season, index) => (
                  <tr key={index}>
                    <td>{season.startYear}-{season.endYear}</td>
                    <td>{season.team}</td>
                    <td>{season.league}</td>
                    <td>{season.gamesTotal}</td>
                    {
                      playerInfo.position === "G" ? 
                      <td>{1-(season.gA/season.sA).toFixed(3)}</td> :
                      <td>{season.points}</td>
                    }
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}