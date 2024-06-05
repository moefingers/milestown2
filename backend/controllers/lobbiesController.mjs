import { Router } from 'express'
const router = Router()

import fs from 'fs/promises';


import cullLobbies from '../js/cullLobbies.mjs';


///////////////////////////////////////////////////////////////////////////////////////////////
//// It should be noted that on connect / disconnect of any peer, the server will cull all  ///
//// lobbies for playerids that are not in the peer list.                                   ///
///////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////
//// GET ALL LOBBIES ////
/////////////////////////
router.get('/', async (req, res) => {

  const data =  JSON.parse(await fs.readFile('./db/lobbies.json', 'utf8'));
  const newData = data.map(lobby => {
    return {
      lobbyId: lobby.lobbyId,
      playerList: lobby.playerList.map(player => {
        return {
          playerId: player.playerId,
          owner: player.owner
        }
      })
    }
  })
  res.send(newData);
});

////////////////////////
//// GET ONE LOBBY  ////  EXPECTS lobbyId
////////////////////////  // in url params
router.get('/:lobbyId', async (req, res) => {
  const data =  JSON.parse(await fs.readFile('./db/lobbies.json', 'utf8'));
  const lobby = data.find(lobby => lobby.lobbyId === req.params.lobbyId);
  const newData = {
    lobbyId: lobby.lobbyId,
    playerList: lobby.playerList.map(player => {
      return {
        playerId: player.playerId,
        owner: player.owner
      }
    })
  }
  res.send(newData);
});

////////////////////////////
//// CREATE LOBBY ROUTE ////  EXPECTS lobbyId, playerId, playerToken
////////////////////////////  // in req.body
router.post('/', async (req, res) => {
  console.log(req.body.playerId, " is trying to create lobby: ", req.body.lobbyId)
  try {
    const data =  JSON.parse(await fs.readFile('./db/lobbies.json', 'utf8'));
    // check if lobby already exists
    if(data.find(lobby => lobby.lobbyId === req.body.lobbyId)){res.send({"joined": false, "message": "lobby already exists"});return}
    // check for playerId
    if(!req.body.playerId){res.send({"joined": false, "message": "playerId is missing in request", "playerId": req.body.playerId}); return}
    // check for playerToken
    if(!req.body.playerToken){res.send({"joined": false, "message": "playerToken is missing in request", "playerToken": req.body.playerToken}); return}

    data.push({
        lobbyId: req.body.lobbyId,
        playerList: [
          {
            playerId: req.body.playerId, 
            playerToken: req.body.playerToken,
            owner: true
          }
        ]
      })
    await fs.writeFile('./db/lobbies.json', JSON.stringify(data, null, 2));
    res.send({
      "joined": true, 
      "message": "lobby created successfully and joined as owner", 
      "lobbyId": req.body.lobbyId, 
      "playerList": [{
        playerId: req.body.playerId, 
        playerToken: req.body.playerToken,
        owner: true
      }]
    });
  } catch (error) {
    console.log(error)
  }
});

//////////////////////////
//// JOIN LOBBY ROUTE ////  EXPECTS lobbyId, playerId, playerToken
//////////////////////////  // in req.body
router.post('/join', async (req, res) => {
    if (!req.body.playerId) {res.send({"joined": false, "message": "playerId is missing in request", "playerId": req.body.playerId});return;}
    if (!req.body.lobbyId) {res.send({"joined": false, "message": "lobbyId is missing in request", "playerId": req.body.lobbyId});return;}
    if (!req.body.playerToken) {res.send({"joined": false, "message": "playerToken is missing in request", "playerId": req.body.playerToken});return;}
    
    const lobbies =  JSON.parse(await fs.readFile('./db/lobbies.json', 'utf8'));
    // check if playerid of any player in any playerlist of any lobby match req.body.playerId
    const playerMatch = lobbies.find(lobby => lobby.playerList.find(player => player.playerId === req.body.playerId));
    if(playerMatch){
        // res.send({"joined": false, "message": "player already exists in lobby", "playerId": req.body.playerId})
        console.log("player already exists in a lobby: ", req.body.playerId)
        // check if playertoken of any player in any playerlist of any lobby match req.body.playerToken
        const playerTokenMatch = lobbies.find(lobby => lobby.playerList.find(player => player.playerToken === req.body.playerToken));
        if(playerTokenMatch){
          console.log('however, playertoken matches: ', req.body.playerToken, 'going to leave old lobby to join new')
          leaveLobby(req.body.playerId);
          {res.send({"joined": false, "message": "auto-kicked from old lobby, now try again."});return}
        } else {
          console.log("playertoken does not match: ", req.body.playerToken, 'notifying client to refresh page or change identity')
          {res.send({"joined": false, "message": "Token conflict. Refresh page or change identity."});return}
        }
    } else {
      console.log("player", req.body.playerId, 'joining lobby: ', req.body.lobbyId)
        const lobby = lobbies.find(lobby => lobby.lobbyId === req.body.lobbyId);
        if(lobby && lobby.playerList.length < 4){
          lobby.playerList.push({
            playerId: req.body.playerId, 
            playerToken: req.body.playerToken,
            owner: false
          })
          await fs.writeFile('./db/lobbies.json', JSON.stringify(lobbies, null, 2));
          res.send({"joined": true, "message": "joined lobby successfully", "lobbyId": req.body.lobbyId, "playerList": lobby.playerList, 'lobby': lobby});
        } else {
          res.send({"joined": false, "message": "lobby not found or already has 4 players"})
        }
    }
    
});

//////////////////////////
//// LEAVE LOBBY ROUTE ////  EXPECTS lobbyId and playerId and playerToken
//////////////////////////
router.post('/leave', async (req, res) => {
    if (!req.body.playerId) {res.send({"joined": false, "message": "playerId is missing in request", "playerId": req.body.playerId});return;}
    if (!req.body.lobbyId) {res.send({"joined": false, "message": "lobbyId is missing in request", "playerId": req.body.lobbyId});return;}
    if (!req.body.playerToken) {res.send({"joined": false, "message": "playerToken is missing in request", "playerId": req.body.playerToken});return;}
    const lobbies =  JSON.parse(await fs.readFile('./db/lobbies.json', 'utf8'));
    const lobby = lobbies.find(lobby => lobby.lobbyId === req.body.lobbyId);
    if(lobby){
      const player = lobby.playerList.find(player => player.playerId === req.body.playerId)
      if(player){
        if(player.playerToken === req.body.playerToken){
          await leaveLobby(req.body.playerId);
          res.send({message: 'left lobby'});
        } else {
          res.send({message: 'Token conflict. Refresh page or change identity.'});
        }
      } else {
        res.send({message: 'player not found'});
      }
    } else {
      res.send({message: 'lobby not found'});
    }
});          ////////////////
///////////////////Leave Lobby Function
async function leaveLobby(playerId) {
  console.log("leaving all lobbies: ", playerId)
  const data = JSON.parse(await fs.readFile('./db/lobbies.json', 'utf8'));
  const newData = data.map(lobby => {
    const newPlayerList = lobby.playerList.filter(player => player.playerId !== playerId);
    return {
      lobbyId: lobby.lobbyId,
      playerList: newPlayerList
    }
  });
  await fs.writeFile('./db/lobbies.json', JSON.stringify(newData, null, 2));
  cullLobbies();
}


////////////////////////////
//// DELETE LOBBY ROUTE ////  EXPECTS lobbyId, playerId, playerToken
////////////////////////////
router.delete('/', async (req, res) => {
  console.log("deleting lobby: ", req.body)
  if (!req.body.lobbyId) {res.send({message: 'lobbyId is missing in request'});return;}
  if (!req.body.playerId) {res.send({message: 'playerId is missing in request'});return;}
  if (!req.body.playerToken) {res.send({message: 'playerToken is missing in request'});return;}
  const lobbies =  JSON.parse(await fs.readFile('./db/lobbies.json', 'utf8'));
  const lobby = lobbies.find(lobby => lobby.lobbyId === req.body.lobbyId);
  if(lobby){
    const player = lobby.playerList.find(player => player.playerId === req.body.playerId)
    if(player){
      if(player.playerToken === req.body.playerToken){
        const newLobbies = lobbies.filter(lobby => lobby.lobbyId !== req.body.lobbyId);
        await fs.writeFile('./db/lobbies.json', JSON.stringify(newLobbies, null, 2));
        cullLobbies();
        res.send({inLobby: false, message: 'lobby deleted'});
      } else {
        res.send({inLobby: false, message: 'Token conflict. Refresh page or change identity.'});
      }
    } else {
      res.send({inLobby: false, message: 'player not found'});
    }
  } else {
    res.send({inLobby: false, message: 'lobby not found'});
  }
});
  
////////////////////////////
//// DELETE ALL LOBBIES //// EXPECTS req.body.confirm == 'true'
////////////////////////////
router.delete('/all', async (req, res) => {
  if(req.body.confirm !== 'true'){
    res.send({message: 'sowwy unauthorized'});
    return
  }else {
    await fs.writeFile('./db/lobbies.json', JSON.stringify([], null, 2));
    res.send({message: 'all lobbies deleted'});
  }
});


export default router