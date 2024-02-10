import fs from 'fs';
import path from 'path';

export default async function getPlayerIds(req, res) {
  try {
    const response = await fetch("https://api.nhle.com/stats/rest/en/skater/summary?limit=-1&sort=points&cayenneExp=seasonId=20232024");
    const data = await response.json();
    const playerIds = data.data.map(player => ({
      name: player.skaterFullName,
      id: player.playerId,
      teamAbbrev: player.teamAbbrevs
    }));

    if (playerIds.length > 0) {
      const filePath = path.join(process.cwd(), '/data/players.json');
      fs.writeFileSync(filePath, JSON.stringify(playerIds, null, 4));
    }

    res.status(200).json({ message: 'Player data fetched successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({error: 'Internal Server Error'})
  }
}