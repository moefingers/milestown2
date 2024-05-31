import express from 'express';
const server = express();
const port = process.env.PORT || 3000;

// Simple route to test the server
server.get('/', (req, res) => {
  res.send(
        {
            message: 'all good on server.get("/")',
            date: new Date()
        }
    );
});



// Start the server
server.listen(port, () => {
  console.log(`|||||||||||||||\nServer listening on port ${port}`);
});