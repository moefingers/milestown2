///////////////////////////////
///// IMPORT, LOAD DOTENV /////
///////////////////////////////
import dotenv from 'dotenv';
dotenv.config();

///////////////////////////////
///// MODULES, DEPS, SETUP/////
///////////////////////////////
import express from 'express'; // import express module
const server = express(); // create express application


///////////////////////////
///// SERVE FRONTEND  /////
///////////////////////////
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
server.use(express.static(path.join(__dirname, '../frontend/dist')));


//////////////////////////////
///// CORS AND WHITELIST /////
//////////////////////////////
const devOrigins = ['http://localhost:5173','http://localhost:4173']; // for development CORS
const prodOrigins = ['https://milestown2.onrender.com', "https://moefingers.github.io/milestown2/"]; // for production CORS
const whitelist = process.env.NODE_ENV === 'production' // determine production or development environment and set whitelist to be...
? prodOrigins // production origins
: devOrigins; // development origins

server.use(function (req, res, next) { // set up CORS
  const origin = req.headers.origin; // get origin from request
  if (whitelist.includes(origin)) { // if origin is in whitelist
    // set CORS headers
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); 
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); 
    res.setHeader('Access-Control-Allow-Credentials', true);
  }
  next();
});


// health check for render.. not literal render. Render is the service we're hosting on at the time this comment is written.
server.get('/healthz', (req, res) => {
  console.log(`GET " /healthz ", ATTEMPTING sendStatus(200)`);
  res.sendStatus(200);
})


// Simple route to test the server
server.get('/', (req, res) => {
  console.log(`GET " / "`)

  res.sendFile(path.join(__dirname,  '../frontend/dist/index.html'));
});



// Start the server
server.listen(process.env.PORT, () => {
  console.log(`
    ///////.env////////
    NODE_ENV=${process.env.NODE_ENV}
    PORT=${process.env.PORT}
  `);
});
