import fs from 'fs/promises';

import {customFetch, getPeers} from './backendCustomFetch.mjs'

////////////////////
/// cull lobbies ///
export default async function cullLobbies(){
    try {
        const peers =  await getPeers()
        console.log('|||CULLING lobbies to remove all|||\n', peers.length, 'peers not in\n', peers)
        
        let {lobbies} =  JSON.parse(await fs.readFile('./db/lobbies.json', 'utf8'));
        let newLobbyList
        if(peers.length > 0){
            console.log(lobbies.length, " lobbies before culling:\n", lobbies)
            newLobbyList = lobbies.map((lobby) => {
                let newPlayerList = lobby.playerList.filter((player) => peers.includes(player.playerId))
                return {
                    lobbyId: lobby.lobbyId,
                    playerList: newPlayerList
                }
            }).filter((lobby) => lobby.playerList.length > 0)
        } else {
            newLobbyList = []
        }
        if(lobbies.toString() === newLobbyList.toString()){
            console.log('no change, no cull')
        } else {
            console.log(newLobbyList.length, " lobbies after culling:\n", newLobbyList)
            await fs.writeFile('./db/lobbies.json', JSON.stringify({lobbies: newLobbyList}, null, 2));
        }
        return lobbies
    } catch (error) {
        console.log(error)
        console.log("The server is still running.")
    }
  }
