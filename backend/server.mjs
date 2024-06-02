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

/////////////////////////////////////////
/////   MIDDLEWARE FOR CONTROLLERS /////
////////////////////////////////////////
import offerController from './controllers/offerController.mjs'
server.use('/offer', offerController)

////////////////////////////////////
//// MIDDLEWEAR TO LOG REQUESTS ////
////////////////////////////////////
server.use((req, res, next) => {
  console.log(`-request received-\n    ${req.method} ${req.originalUrl}`)
  next()
})

//////////////////////////
/// HEALTH CHECK ROUTE ///
//////////////////////////
server.get('/healthz', (req, res) => {
  res.sendStatus(200);
})

//////////////////////////
//// POST OFFER ROUTE ////
//////////////////////////
// server.post('/offer', async (req, res) => {
//   const data =  JSON.parse(await fs.readFile('./db/data.json', 'utf8'));
//   data.currentOffers.push(req.body);
//   await fs.writeFile('./db/data.json', JSON.stringify(data, null, 2));
//   res.send(JSON.stringify(data.currentOffers));
// });

///////////////////////////
//// DELETE ALL OFFERS ////
///////////////////////////
// server.delete('/offer', async (req, res) => {
//   const data =  JSON.parse(await fs.readFile('./db/data.json', 'utf8'));
//   data.currentOffers = [];
//   await fs.writeFile('./db/data.json', JSON.stringify(data, null, 2));
//   res.send(JSON.stringify(data.currentOffers));
// });

////////////////////////
//// GET ALL OFFERS ////
////////////////////////
// server.get('/offer', async (req, res) => {
//   const data =  JSON.parse(await fs.readFile('./db/data.json', 'utf8'));
//   res.send(JSON.stringify(data.currentOffers));
// });

//////////////////////
//// GET ALL MAPS ////
//////////////////////
server.get('/maps', async (req, res) => {
  const maps =  JSON.parse(await fs.readFile('./db/maps.json', 'utf8'));
  res.send(JSON.stringify(maps));
});

/////////////////////////
//// GET DEFAULT MAP ////
/////////////////////////
server.get('/defaultmap', async (req, res) => {
  const maps =  JSON.parse(await fs.readFile('./db/maps.json', 'utf8'));
  res.send(JSON.stringify(maps[0]));
});

//////////////////////
/// GET AESTHETICS ///
//////////////////////
server.get('/aesthetics', async (req, res) => {
  const aesthetics =  JSON.parse(await fs.readFile('./db/aesthetics.json', 'utf8'));
  res.send(JSON.stringify(aesthetics));
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


/////////////////////////////
///// START PEER SERVER /////
/////////////////////////////

const peerServer = ExpressPeerServer(listener, {
  path: '/listener',
  debug: true
});

server.use('/peerjs', peerServer);


////////////////////////
/// 404 ERROR ROUTE  ///
////////////////////////
server.use((req, res) => {
  res.status(404)
  res.send(`
  <div>
    <h1>404 - Page Not Found</h1>
    <div>Due to the single-page nature of this application, routes are simulated off of a single page.</div>
    <div>You may not access a page directly for now and the ultimate application may not use pages.</div>
    <div>Try navigating to the  <a href="/">index</a>.</div>
  </div>
  `)
})