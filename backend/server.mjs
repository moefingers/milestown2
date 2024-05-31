import express from 'express'; // import express module
const server = express(); // create express application
const port = process.env.PORT || 3000; // get port from environment or use 3000
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

  const data = {
      message: `GET " / ", `,
      date: new Date()
  }

  res.send(JSON.stringify(data));
});



// Start the server
server.listen(port, () => {
  console.log(`|||||||||||||||\nServer listening on port ${port}`);
});
