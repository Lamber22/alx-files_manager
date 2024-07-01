import { createClient } from 'redis';

class RedisClient {
  constructor() {
    this.client = createClient();
    this.isConnected = false;
    this.client.on('error', (err) => console.log(err));

    this.connectedClient();
  }

  async connectedClient() {
    this.isConnected = true;
    await new Promise((resolve, reject) => {
      this.client.once('ready', resolve);
      this.client.once('error', reject);
    });
  }

  isAlive() {
    return this.isConnected;
  }

  async get(key) {
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, value) => {
        if (err) return reject(err);
        return resolve(value);
      });
    });
  }

  async set(key, value, duration) {
    return new Promise((resolve, reject) => {
      this.client.set(key, value, 'EX', duration, (err) => {
        if (err) return reject(err);
        return resolve();
      });
    });
  }

  async del(key) {
    return new Promise((resolve, reject) => {
      this.client.del(key, (err) => {
        if (err) return reject(err);
        return resolve();
      });
    });
  }
}

const redisClient = new RedisClient();

export default redisClient;
