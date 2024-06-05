import fs from 'fs/promises';

import {customFetch, getPeers} from './backendCustomFetch.mjs'

////////////////////
/// cull lobbies ///
export default async function cullLobbies(){
    try {
        const peers =  await getPeers()
        console.log('culling lobbies to remove all peers not in this list')
        console.log(peers)
        let lobbies =  JSON.parse(await fs.readFile('./db/lobbies.json', 'utf8'));
        if(peers.length > 0){
            console.log("lobbies before culling: ", lobbies)
            lobbies.forEach((lobby) => {
                lobby.playerList = lobby.playerList.filter((player) => peers.includes(player.playerId))
                if(lobby.playerList.length == 0){
                    lobbies = lobbies.filter(lobby => lobby.lobbyId !== lobby.lobbyId)
                }
            })
            await fs.writeFile('./db/lobbies.json', JSON.stringify(lobbies, null, 2));
        } else {
        await fs.writeFile('./db/lobbies.json', JSON.stringify([], null, 2));
        }
        console.log("lobbies after culling: ", lobbies)
        return lobbies
    } catch (error) {
        console.log(error)
        console.log("The server is still running.")
    }
  }
