const dbClient = require('../utils/db');
const redisClient = require('../utils/redis');

const getStatus = ((req, res) => {
  if (redisClient.redisClient.isAlive()) {
    console.log('okay');
    res.status(200).json({ redis: true, db: true }, 200);
  } else {
    res.status(404).json({ redis: false, db: false }, 404);
  }
});

const getStats = async (req, res) => {
  const users = await dbClient.nbUsers();
  const files = await dbClient.nbFiles();
  const obj = {
    users,
    files,
  };
  res.status(200).json(obj);
};

module.exports = { getStats, getStatus };
