export default async function getRandomPlayerTeams(req, res) {
    // read the body from the request into a json array
    const resp = await fetch('http://localhost:3000/api/staticData');
    const playerIDs = await resp.json();
    
    if (playerIDs.length != 0) {
        const pIds = Array.from(playerIDs)
        const randomIndex = Math.floor(Math.random() * pIds.length);
        const randomPlayer = await pIds[randomIndex];
        // const randomPlayer = {
        //     name: "Auston Matthews", 
        //     id: 8479318,
        //     teamAbbrev: "TOR"
        // }
        // const randomPlayer = 8479318;        // matthews
        // const randomPlayer = 8473541;        // Jonathan Bernier
        // const randomPlayer = 8476453;
        let info = null;
        let playerInfo = null;
        try {
            const response = await fetch("https://api-web.nhle.com/v1/player/" + randomPlayer.id + "/landing");
            const data = await response.json();
            playerInfo = data;
            info = data.seasonTotals;
        } catch (err) {
            res.status(500).json({error: 'Failed to get player info'});
        }

        // Extract only relevant information from JSON object
        const seasons = info.map(season => ({
        season: season.season,
        team: season.teamName.default,
        league: season.leagueAbbrev,
        gamesTotal: season.gamesPlayed,
        points: season.points,
        sA: season.shotsAgainst,
        gA: season.goalsAgainst,
        }));

        // Turn object into array of JSON objects
        const seasonsArray = Object.keys(seasons).map(key => ({
            key: key,
            value: seasons[key]
        }));

        const desiredLeagues = ['NHL', 'AHL', 'QMJHL', 'OHL', 'WHL', 'USHL', 'NL', 'NCAA', 'Liiga', 'KHL', 'Finland', 'Sweden', 'DEL', 'Liiga', 'MHL']
        const filteredSeasons = seasonsArray.filter(obj => desiredLeagues.includes(obj.value.league));
    
        // Sort array by season, then league, then team
        filteredSeasons.sort((a, b) => {
            if (a.value.season !== b.value.season) {
                return a.value.season - b.value.season;
            }
            if (a.value.league !== b.value.league) {
                return a.value.league.localeCompare(b.value.league);
            }
            return a.value.team.localeCompare(b.value.team);
        });
        
        // Seperate the start and end season
        const transformedData = filteredSeasons.map(entry => {
            const { season, ...rest } = entry.value;
            const seasonString = season.toString();
            const startYear = seasonString.slice(0, 4);
            const endYear = seasonString.slice(4);
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
        // let playerInfo = null;
        // try {
        //     const playerInfoResponse = await fetch("https://api-web.nhle.com/v1/player/" + randomPlayer + "/landing");
        //     playerInfo = await playerInfoResponse.json();
        // } catch (err) {
        //     res.status(500).json({error: 'Failed to get player info'});
        // }

        // Get division
        let division = null;
        try {
            const standingsResponse = await fetch("https://api-web.nhle.com/v1/standings/now");
            const stadingsJson = await standingsResponse.json();
            let standings = stadingsJson.standings;
            const matchingTeam = standings.find(team => team.teamAbbrev.default === playerInfo.currentTeamAbbrev);
            if (matchingTeam) {
                division = matchingTeam.divisionName;
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({error: 'Failed to get standings'});
        }

        let age = new Date().getFullYear() - new Date(playerInfo.birthDate).getFullYear() - (new Date().getMonth() < new Date('1990-05-15').getMonth() || (new Date().getMonth() === new Date('1990-05-15').getMonth() && new Date().getDate() < new Date('1990-05-15').getDate()) ? 1 : 0);
        const playerData = {
            fistname: playerInfo.firstName.default,
            lastname: playerInfo.lastName.default,
            age: age,
            nationality: playerInfo.birthCountry,
            shoots: playerInfo.shootsCatches,
            number: playerInfo.sweaterNumber,
            position: playerInfo.position,
            team: playerInfo.fullTeamName.default,
            playerId: randomPlayer,
            teamId: playerInfo.currentTeamId,
            division: division,
            seasons: aggregatedData,
            name: playerInfo.firstName.default + " "  + playerInfo.lastName.default,
            id: playerInfo.playerId,
            teamAbbrev: playerInfo.currentTeamAbbrev
        };

        res.status(200).json({resp: playerData});
    }
    else {
        res.status(500).json({error: "Failed to get information of random player"});
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
                team.value.points += entry.value.points;
                team.value.sA += entry.value.sA;
                team.value.gA += entry.value.gA;
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