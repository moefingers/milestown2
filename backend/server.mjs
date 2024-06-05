///////////////////////////////
///// MODULES, DEPS, SETUP/////
///////////////////////////////
import express from 'express'; // import express module
const server = express(); // create express application

import cors from 'cors'; // import cors module

import dotenv from 'dotenv'; // import dot env
dotenv.config(); // load .env

import fs from 'fs/promises';

import { ExpressPeerServer } from 'peer';

import cullLobbies from './js/cullLobbies.mjs';

/////////////////////////////////////////
///// CORS MIDDLEWEAR AND WHITELIST /////
/////////////////////////////////////////
const devOrigins = '*'; // for development CORS
const prodOrigins = ['https://milestown2.onrender.com', "https://moefingers.github.io"]; // for production CORS
const whitelist = process.env.NODE_ENV === 'production' // determine production or development environment and set whitelist to be...
  ? prodOrigins // production origins
  : devOrigins; // development origins

server.use(cors({ 
  origin: whitelist,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
 }));
console.log(`|||||||||||||||\ncors whitelist: ${whitelist}`)

//////////////////////////////////////////
///// MIDDLEWEAR TO PARSE REQUEST BODY ///
//////////////////////////////////////////
server.use(express.json());

////////////////////////////////////////////////////////
///// MIDDLEWEAR SERVE FRONTEND AND ASSETS on '/'  /////
////////////////////////////////////////////////////////
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
server.use(express.static(path.join(__dirname, 'dist')));

////////////////////////////////////
//// MIDDLEWEAR TO LOG REQUESTS ////
//// AND CULL LOBBIES           ////
////////////////////////////////////
server.use(async (req, res, next) => {
  console.log(`-request received-\n    ${req.method} ${req.originalUrl}`)
  if(req.method !== 'GET' && req.originalUrl !== '/peerjs/peers'){await cullLobbies()}
  next()
})

/////////////////////////////////////////
/////   MIDDLEWARE FOR CONTROLLERS /////
////////////////////////////////////////
import lobbiesController from './controllers/lobbiesController.mjs'
server.use('/lobby', lobbiesController)

//////////////////////////
/// HEALTH CHECK ROUTE ///
//////////////////////////
server.get('/healthz', (req, res) => {
  res.sendStatus(200);
})


//////////////////////
//// GET ALL MAPS ////
//////////////////////
server.get('/maps', async (req, res) => {
  const maps =  JSON.parse(await fs.readFile('./db/maps.json', 'utf8'));
  res.send((maps));
});
//////////////////////
//// GET ONE MAP  ////
//////////////////////
server.get('/maps/:nameOrIndex', async (req, res) => {
  const maps =  JSON.parse(await fs.readFile('./db/maps.json', 'utf8'));
  if(!isNaN(Number(req.params.nameOrIndex))){
    console.log('Searching one map by index...')
    res.send((maps[Number(req.params.nameOrIndex)]));
  }else {
    console.log('Searching one map by name...')
    res.send((maps.find(map => map.name === req.params.nameOrIndex)));
  }
});
////////////////////////////////
//// POST ONE OR MORE MAPS  ////
////////////////////////////////
server.post('/maps', async (req, res) => {
  try {
    const maps =  JSON.parse(await fs.readFile('./db/maps.json', 'utf8'));
    let mapStatuses = []
    if(Array.isArray(req.body)){
      req.body.forEach((eachMap) => {
        if(!eachMap.name){mapStatuses.push({map: eachMap.name, message: 'ERROR: map name is required'}); return}
        if(!eachMap.map){mapStatuses.push({map: eachMap.name, message: 'map is required'}); return}
        if(!eachMap.spawns || !Array.isArray(eachMap.spawns)){mapStatuses.push({map: eachMap.name, message: 'spawns are missing or badly formatted'}); return}
        if(!eachMap.spawns.every((spawn) => Array.isArray(spawn) && spawn.length === 2)){mapStatuses.push({map: eachMap.name, message: 'spawns are  badly formatted'}); return}
        if(maps.find(map => map.name === eachMap.name)){mapStatuses.push({map: eachMap.name, message: 'map with that name already exist'}); return}
        maps.push(eachMap)
        mapStatuses.push({map: eachMap.name, message: 'created successfully', 
          link: (process.env.NODE_ENV === 'production' ? 'https://milestown2.onrender.com' : 'http://localhost:3000') + '/maps/' + eachMap.name
        })
      })
    } else{
      maps.push(req.body)
      mapStatuses.push({map: req.body.name, message: 'created successfully', 
        link: (process.env.NODE_ENV === 'production' ? 'https://milestown2.onrender.com' : 'http://localhost:3000') + '/maps/' + req.body.name
      })
    }
    await fs.writeFile('./db/maps.json', JSON.stringify(maps, null, 2));
    res.status(200)
    res.send(({
      message: 'here are the results of your post request',
      mapStatuses: mapStatuses
    }));
    
  } catch (error) {
    console.log(error)
    console.log("The server is still running.")
    res.status(400).send({message: error.toString()});
  }
});

//////////////////////
/// GET AESTHETICS ///
//////////////////////
server.get('/aesthetics', async (req, res) => {
  const aesthetics =  JSON.parse(await fs.readFile('./db/aesthetics.json', 'utf8'));
  res.send((aesthetics));
});


/////////////////////////////////
//// START SERVER AND LISTEN ////
/////////////////////////////////
const listener = server.listen(process.env.PORT, () => {
  console.log(`
    ///////.env////////
    NODE_ENV=${process.env.NODE_ENV}
    PORT=${process.env.PORT}
  `);
});


//////////////////////////////////////////
///   START PEER SERVER ON /peerjs     ///
/// https://www.npmjs.com/package/peer ///
//////////////////////////////////////////

const peerServer = ExpressPeerServer(listener, {
  path: '/',
  debug: true,
  allow_discovery: true,
});

server.use('/', peerServer);

//////////////remove player from lobby on disconnect ////////////////
peerServer.on('disconnect', async (client) => {
  console.log(client.getId(), 'disconnected')
  const data =  JSON.parse(await fs.readFile('./db/lobbies.json', 'utf8'));
  const lobbyIndex = data.findIndex(lobby => lobby.playerList.findIndex(player => player.playerId === client.getId()) !== -1)
  if(lobbyIndex !== -1){
    const playerIndex = data[lobbyIndex].playerList.findIndex(player => player.playerId === client.getId())
    if(data[lobbyIndex].playerList[playerIndex].owner){
      data.splice(lobbyIndex, 1)
    } else {
      data[lobbyIndex].playerList.splice(playerIndex, 1)
    }
    await fs.writeFile('./db/lobbies.json', JSON.stringify(data, null, 2));
  }
  
  cullLobbies()
})
////////////////notate player connect to server//////////////
peerServer.on('connection', async (client) => {
  console.log(client.getId(), 'connected')
  cullLobbies()
})



////////////////////////
/// 404 ERROR ROUTE  ///
////////////////////////
server.use((req, res) => {
  res.status(404)
  res.send(`
  <div>
    <h1>Server 404 - Page Not Found</h1>
    <div>Due to the single-page nature of this application, routes are simulated off of a single page.</div>
    <div>You may not access a page directly for now and the ultimate application may not use pages.</div>
    <div>Try navigating to the  <a href="/">index</a>.</div>
  </div>
  `)
})