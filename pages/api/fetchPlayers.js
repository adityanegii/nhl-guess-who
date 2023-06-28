import fs from 'fs';
import path from 'path';

export default async function fetchPlayerIds(req, res) {
  try {
    const response = await fetch("https://statsapi.web.nhl.com/api/v1/teams/");
    const data = await response.json();
    const teamIDs = data.teams.map((team) => team.id);
  
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

    if (playerList.length > 0) {
      const filePath = path.join(process.cwd(), '/data/players.json');
      fs.writeFileSync(filePath, JSON.stringify(playerList, null, 4));
    }

    res.status(200).json({ message: 'Player data fetched successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
