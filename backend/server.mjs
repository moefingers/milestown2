///////////////////////////////
///// MODULES, DEPS, SETUP/////
///////////////////////////////
import express from 'express'; // import express module
const server = express(); // create express application

import cors from 'cors'; // import cors module

import dotenv from 'dotenv'; // import dot env
dotenv.config(); // load .env

import fs from 'fs/promises';

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
////////////////////////////////////
server.use((req, res, next) => {
  console.log(`-request received-\n    ${req.method} ${req.originalUrl}`)
  next()
})

//////////////////////////
/// HEALTH CHECK ROUTE ///
server.get('/healthz', (req, res) => {
  res.sendStatus(200);
})


// Simple route to test the server
server.get('/date', (req, res) => {
  res.send(JSON.stringify(
    {date : new Date()}
  ));
});

//////////////////////////
//// POST OFFER ROUTE ////
//////////////////////////

server.post('/offer', async (req, res) => {
  const data =  JSON.parse(await fs.readFile('./db/data.json', 'utf8'));
  data.currentOffers.push(req.body);
  await fs.writeFile('./db/data.json', JSON.stringify(data, null, 2));
  res.send(JSON.stringify(data.currentOffers));
});



/////////////////////////////////
//// START SERVER AND LISTEN ////
server.listen(process.env.PORT, () => {
  console.log(`
    ///////.env////////
    NODE_ENV=${process.env.NODE_ENV}
    PORT=${process.env.PORT}
  `);
});
