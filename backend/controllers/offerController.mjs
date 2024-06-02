import { Router } from 'express'
const router = Router()

import fs from 'fs/promises';

////////////////////////
//// GET ALL OFFERS ////
////////////////////////
router.get('/', async (req, res) => {
  const data =  JSON.parse(await fs.readFile('./db/data.json', 'utf8'));
  res.send(JSON.stringify(data.currentOffers));
});

//////////////////////////
//// POST OFFER ROUTE ////
//////////////////////////
router.post('/', async (req, res) => {
    const data =  JSON.parse(await fs.readFile('./db/data.json', 'utf8'));
    data.currentOffers.push(req.body);
    await fs.writeFile('./db/data.json', JSON.stringify(data, null, 2));
    res.send(JSON.stringify(data.currentOffers));
});
  
///////////////////////////
//// DELETE ALL OFFERS ////
///////////////////////////
router.delete('/', async (req, res) => {
  const data =  JSON.parse(await fs.readFile('./db/data.json', 'utf8'));
  data.currentOffers = [];
  await fs.writeFile('./db/data.json', JSON.stringify(data, null, 2));
  res.send(JSON.stringify(data.currentOffers));
});


export default router