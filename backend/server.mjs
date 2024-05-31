import express from 'express';
const server = express();
const port = process.env.PORT || 3000;

// Simple route to test the server
server.get('/', (req, res) => {
  console.log("server.get('/')")

  const data = {
      message: 'all good on server.get("/")',
      date: new Date()
  }

  res.send(JSON.stringify(data));
});

server.get('/healthz', (req, res) => {
  console.log("server.get('/healthz')")

  const data = {
      message: 'all good on server.get("/healthz")',
      date: new Date()
  }

  res.send(JSON.stringify(data));
})



// Start the server
server.listen(port, () => {
  console.log(`|||||||||||||||\nServer listening on port ${port}`);
});