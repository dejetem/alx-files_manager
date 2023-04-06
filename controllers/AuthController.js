/* eslint-disable import/no-named-as-default */
import { v4 as uuidv4 } from 'uuid';
import { Buffer } from 'buffer';
import redisClient from '../utils/redis';
import dbClient from '../utils/db';

class AuthController {
  static async getConnect(req, res) {
    const auth = Buffer.from(req.headers.authorization.split(' ')[1], 'base64').toString();
    const user = await dbClient.searchUser('users', auth.split(':')[0]);
    const token = uuidv4();

    await redisClient.set(`auth_${token}`, user._id.toString(), 24 * 60 * 60);
    res.status(200).json({ token });
  }

  static async getDisconnect(req, res) {
    const token = req.headers['x-token'];

    await redisClient.del(`auth_${token}`);
    res.status(204).send();
  }
}

export default AuthController;
