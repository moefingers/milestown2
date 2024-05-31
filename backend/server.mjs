///////////////////////////////
///// MODULES, DEPS, SETUP/////
///////////////////////////////
import express from 'express'; // import express module
const server = express(); // create express application

import cors from 'cors'; // import cors module

import dotenv from 'dotenv'; // import dot env
dotenv.config(); // load .env

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

////////////////////////////////////////////////////////
///// MIDDLEWEAR SERVE FRONTEND AND ASSETS on '/'  /////
////////////////////////////////////////////////////////
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
server.use(express.static(path.join(__dirname, '../frontend/dist')));

//////////////////////
//// Log requests ////
//////////////////////
server.use((req, res, next) => {
  console.log(`-request received-\n    ${req.method} ${req.originalUrl}`)
  next()
})

// health check for Render.com hosting..
server.get('/healthz', (req, res) => {
  res.sendStatus(200);
})

server.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'))
})

// Simple route to test the server
server.get('/date', (req, res) => {
  res.send(JSON.stringify(
    {date : new Date()}
  ));
});



// Start the server
server.listen(process.env.PORT, () => {
  console.log(`
    ///////.env////////
    NODE_ENV=${process.env.NODE_ENV}
    PORT=${process.env.PORT}
  `);
});
