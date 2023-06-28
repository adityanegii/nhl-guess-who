// Function to get players from NHL API, return array of JSON objects [name, id, teamId]
export const fetchPlayerIds = async () => {
    const response = await fetch("https://statsapi.web.nhl.com/api/v1/teams/");
    const data = await response.json();
    let teamIDs = data.teams.map((team) => team.id);
  
    let playerList = [];
  
    for (let i = 0; i < teamIDs.length; i++) {
      const response = await fetch(
        "https://statsapi.web.nhl.com/api/v1/teams/" + teamIDs[i] + "/roster"
      );
      const data = await response.json();
      const roster = data.roster;
  
      roster.forEach((player) => {
        const playerData = {
          name: player.person.fullName,
          id: player.person.id,
          teamId: teamIDs[i]
        };
        playerList.push(playerData);
      });
    }
    
    return playerList;
  };

// Function to choose random player, return JSON object with player info
export async function getRandomPlayerTeams(playerIDs) {
    if (playerIDs.length != 0) {
        const pIds = Array.from(playerIDs)
        const randomIndex = Math.floor(Math.random() * pIds.length);
        const randomPlayer = await pIds[randomIndex];
        // const randomPlayer = 8470604;        // Jeff Carter
        const response = await fetch("https://statsapi.web.nhl.com/api/v1/people/" + randomPlayer + "/stats?stats=yearByYear");
        const data = await response.json();
        let info = data.stats[0].splits;

        // Extract only relevant information from JSON object
        const seasons = info.map(season => ({
        season: season.season,
        team: season.team.name,
        league: season.league.name,
        gamesTotal: season.stat.games
        }));

        // Turn object into array of JSON objects
        const seasonsArray = Object.keys(seasons).map(key => ({
            key: key,
            value: seasons[key]
        }));

        const desiredLeagues = ['National Hockey League', 'AHL', 'QMJHL', 'OHL', 'WHL', 'NL', 'NCAA', 'Liiga', 'KHL', 'Finland', 'Sweden', 'DEL']
        const filteredSeasons = seasonsArray.filter(obj => desiredLeagues.includes(obj.value.league));

        // Sort array by season, then league, then team
        filteredSeasons.sort((a, b) => {
            if (a.value.season !== b.value.season) {
                return a.value.season.localeCompare(b.value.season);
            }
            if (a.value.league !== b.value.league) {
                return a.value.league.localeCompare(b.value.league);
            }
            return a.value.team.localeCompare(b.value.team);
        });
        
        // Seperate the start and end season
        const transformedData = filteredSeasons.map(entry => {
            const { season, ...rest } = entry.value;
            const startYear = season.slice(0, 4);
            const endYear = season.slice(4);
            return {
                key: entry.key,
                value: {
                    startYear,
                    endYear,
                    ...rest
                }
            };
        });
        
        // Aggregate the seasons for same teams
        const aggregatedData = aggregateTeamTotals(transformedData);

        // Get the player info
        const playerInfoResponse = await fetch("https://statsapi.web.nhl.com/api/v1/people/" + randomPlayer);
        const playerInfo = await playerInfoResponse.json();

        // Get division
        const divisionResponse = await fetch("https://statsapi.web.nhl.com/api/v1/teams/");
        const divisionData = await divisionResponse.json();
        const division = divisionData.teams.filter(team => team.name === playerInfo.people[0].currentTeam.name)[0].division.name;

        const playerData = {
            name: playerInfo.people[0].fullName,
            age: playerInfo.people[0].currentAge,
            nationality: playerInfo.people[0].nationality,
            shoots: playerInfo.people[0].shootsCatches,
            number: playerInfo.people[0].primaryNumber,
            position: playerInfo.people[0].primaryPosition.code,
            team: playerInfo.people[0].currentTeam.name,
            playerId: randomPlayer,
            teamId: playerInfo.people[0].currentTeam.id,
            division: division,
            seasons: aggregatedData
        };

        return playerData;
    }
    else {
        return null;
    }
}

// Function to aggregate totals for each team
const aggregateTeamTotals = playerData => {
    const aggregatedData = [];
    let team = null;
    
    for (const entry of playerData) {
        // If first entry
        if (team === null) {
            team = JSON.parse(JSON.stringify(entry));
        } 
        else {
            // If the team is the same, add the totals
            if (team.value.team === entry.value.team && team.value.league === entry.value.league) {
                team.value.endYear = entry.value.endYear;
                team.value.gamesTotal += entry.value.gamesTotal;
            }
            // If different team, push the aggregated data and reset the team 
            else {
                aggregatedData.push(team.value);
                team = JSON.parse(JSON.stringify(entry));
            }
        }
    }

    aggregatedData.push(team.value);

    return aggregatedData;
}


export async function getGuessInfo(playerId) {
    const response = await fetch("https://statsapi.web.nhl.com/api/v1/people/" + playerId);
    const data = await response.json();

    // Get division
    const divisionResponse = await fetch("https://statsapi.web.nhl.com/api/v1/teams/");
    const divisionData = await divisionResponse.json();
    const division = divisionData.teams.filter(team => team.name === data.people[0].currentTeam.name)[0].division.name;
    const playerInfo = {
        name: data.people[0].fullName,
        age: data.people[0].currentAge,
        nationality: data.people[0].nationality,
        shoots: data.people[0].shootsCatches,
        number: data.people[0].primaryNumber,
        position: data.people[0].primaryPosition.code,
        team: data.people[0].currentTeam.name,
        division: division,
        teamId: data.people[0].currentTeam.id,
        playerId: playerId
    }

    return playerInfo;
}