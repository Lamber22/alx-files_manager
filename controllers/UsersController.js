import sha1 from 'sha1';
import { ObjectID } from 'mongodb';
import Queue from 'bull';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

const userQueue = new Queue('userQueue', 'redis://127.0.0.1:6379');

class UsersController {
  static postNew(request, response) {
    const { email } = request.body;
    const { password } = request.body;

    if (!email) {
      return response.status(400).json({ error: 'Missing email' });
    }
    if (!password) {
      return response.status(400).json({ error: 'Missing password' });
    }

    const users = dbClient.db.collection('users');
    return users.findOne({ email }, (err, user) => {
      if (user) {
        return response.status(400).json({ error: 'Already exist' });
      }
      const hashedPassword = sha1(password);
      return users
        .insertOne({
          email,
          password: hashedPassword,
        })
        .then((result) => {
          response.status(201).json({ id: result.insertedId, email });
          userQueue.add({ userId: result.insertedId });
        })
        .catch(() => {
          response.status(500).json({ error: 'Internal Server Error' });
        });
    });
  }

  static async getMe(request, response) {
    const token = request.header('X-Token');
    const key = `auth_${token}`;
    const userId = await redisClient.get(key);
    if (userId) {
      const users = dbClient.db.collection('users');
      const idObject = new ObjectID(userId);
      users.findOne({ _id: idObject }, (err, user) => {
        if (user) {
          response.status(200).json({ id: userId, email: user.email });
        } else {
          response.status(401).json({ error: 'Unauthorized' });
        }
      });
    } else {
      console.log('Hupatikani!');
      response.status(401).json({ error: 'Unauthorized' });
    }
  }
}

export default UsersController;
