// make this a put request so that i can pass player id as a parameter
export default async function getGuessInfo(req, res) {
    const player = req.body.playerId;
    console.log(player);
    const playerName = player.name;
    const playerId = player.id;
    const playerTeam = player.teamAbbrev;
    const response = await fetch("https://api-web.nhle.com/v1/player/" + playerId + "/landing");
    const data = await response.json();

    // Get division
    let division = null;
    try {
        const standingsResponse = await fetch("https://api-web.nhle.com/v1/standings/now");
        const stadingsJson = await standingsResponse.json();
        let standings = stadingsJson.standings;
        const matchingTeam = standings.find(team => team.teamAbbrev.default === playerTeam);
        if (matchingTeam) {
            division = matchingTeam.divisionName;
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({error: 'Failed to get standings'});
    }

    let age = new Date().getFullYear() - new Date(data.birthDate).getFullYear() - (new Date().getMonth() < new Date('1990-05-15').getMonth() || (new Date().getMonth() === new Date('1990-05-15').getMonth() && new Date().getDate() < new Date('1990-05-15').getDate()) ? 1 : 0);
    const playerInfo = {
        firstName: data.firstName.default,
        lastName: data.lastName.default,
        age: age,
        nationality: data.birthCountry,
        shoots: data.shootsCatches,
        number: data.sweaterNumber,
        position: data.position,
        team: data.fullTeamName.default,
        division: division,
        teamId: data.currentTeamId,
        id: playerId,
        teamAbbrev: playerTeam,
        name: playerName
    }
    res.status(200).json(playerInfo);
}