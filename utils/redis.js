import { promisify } from 'util';
import { createClient } from 'redis';

// Redis client.
class RedisClient {
// new RedisClient instance.
  constructor() {
    this.client = createClient();
    this.isClientConnected = true;
    this.client.on('error', (err) => {
      console.error('Redis client failed to connect:', err.message || err.toString());
      this.isClientConnected = false;
    });
    this.client.on('connect', () => {
      this.isClientConnected = true;
    });
  }

  // Checks if connection to the Redis server is active.
  isAlive() {
    return this.isClientConnected;
  }

  // Get the value of a given key
  async get(key) {
    return promisify(this.client.GET).bind(this.client)(key);
  }

  // Stores a key and with an expiration time.
  async set(key, value, duration) {
    await promisify(this.client.SETEX)
      .bind(this.client)(key, duration, value);
  }

  // Delete the value of a given key
  async del(key) {
    await promisify(this.client.DEL).bind(this.client)(key);
  }
}

export const redisClient = new RedisClient();
export default redisClient;
