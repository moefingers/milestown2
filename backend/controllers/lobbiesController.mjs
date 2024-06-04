import { Router } from 'express'
const router = Router()

import fs from 'fs/promises';

/////////////////////////
//// GET ALL LOBBIES ////
/////////////////////////
router.get('/', async (req, res) => {
  const data =  JSON.parse(await fs.readFile('./db/lobbies.json', 'utf8'));
  res.send(JSON.stringify(data));
});


////////////////////////
//// GET ONE LOBBY  ////  EXPECTS lobbyId
////////////////////////
router.get('/:lobbyId', async (req, res) => {
  const data =  JSON.parse(await fs.readFile('./db/lobbies.json', 'utf8'));
  res.send(JSON.stringify(data.find(lobby => lobby.lobbyId === req.params.lobbyId)));
});

////////////////////////////
//// CREATE LOBBY ROUTE ////  EXPECTS lobbyId
////////////////////////////
router.post('/', async (req, res) => {
  console.log(req.body.playerId, " is creating lobby: ", req.body.lobbyId)
  
  try {
    const data =  JSON.parse(await fs.readFile('./db/lobbies.json', 'utf8'));
    if(data.find(lobby => lobby.lobbyId === req.body.lobbyId)){
      res.send({"joined": false, "message": "lobby already exists"});
      return
    }

    data.push({
        lobbyId: req.body.lobbyId,
        playerIds: [req.body.playerId]
      })
    await fs.writeFile('./db/lobbies.json', JSON.stringify(data, null, 2));
    res.send({"joined": true, "lobbyId": req.body.lobbyId, "playerIds": [req.body.playerId]});
  } catch (error) {
    console.log(error)
  }
});

//////////////////////////
//// JOIN LOBBY ROUTE ////  EXPECTS lobbyId and playerId
//////////////////////////
router.post('/join', async (req, res) => {
    const data =  JSON.parse(await fs.readFile('./db/lobbies.json', 'utf8'));
    data.forEach((lobby) => {
        if(lobby.lobbyId === req.body.lobbyId){
            lobby.players.push(req.body.playerId)
        }
    })
    await fs.writeFile('./db/lobbies.json', JSON.stringify(data, null, 2));
    res.send(JSON.stringify({"joined": true, "lobbyId": req.body.lobbyId, "playerIds": data.find(lobby => lobby.lobbyId === req.body.lobbyId).players}));
});

//////////////////////////
//// LEAVE LOBBY ROUTE ////  EXPECTS lobbyId and playerId
//////////////////////////
router.post('/leave', async (req, res) => {
    const data =  JSON.parse(await fs.readFile('./db/lobbies.json', 'utf8'));
    data.forEach((lobby) => {
        if(lobby.lobbyId === req.body.lobbyId){
            lobby.playerIds = lobby.playerIds.filter((playerId) => playerId !== req.body.playerId)
        }
    })
    await fs.writeFile('./db/lobbies.json', JSON.stringify(data, null, 2));
    res.send(JSON.stringify(data));
});

////////////////////////////
//// DELETE LOBBY ROUTE ////  EXPECTS lobbyId
////////////////////////////
router.delete('/:lobbyId', async (req, res) => {
  const data =  JSON.parse(await fs.readFile('./db/lobbies.json', 'utf8'));
  data = data.filter(lobby => lobby.lobbyId !== req.params.lobbyId);
  await fs.writeFile('./db/lobbies.json', JSON.stringify(data, null, 2));
  res.send(JSON.stringify(data));
});
  
////////////////////////////
//// DELETE ALL LOBBIES ////
////////////////////////////
router.delete('/', async (req, res) => {
  const data =  JSON.parse(await fs.readFile('./db/lobbies.json', 'utf8'));
  data = [];
  await fs.writeFile('./db/lobbies.json', JSON.stringify(data, null, 2));
  res.send(JSON.stringify(data));
});


export default router