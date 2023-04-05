const express = require('express');
const dbClient = require('../utils/db');
const redisClient = require('../utils/redis');

const router = express.Router();
router.get('/status', (req, res) => {
  if (redisClient.redisClient.isAlive() && dbClient.isAlive()) {
    res.status(200).json({ redis: true, db: true }, 200);
  } else {
    res.status(404).json({ redis: false, db: false }, 404);
  }
});

router.get('/stats', async (req, res) => {
  const users = await dbClient.nbUsers();
  const files = await dbClient.nbFiles();
  const obj = {
    users,
    files,
  };
  res.status(200).json(obj);
});

module.exports = router;
