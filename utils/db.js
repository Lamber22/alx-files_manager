import { MongoClient } from 'mongodb';

const host = process.env.DB_HOST ? process.env.DB_HOST : 'localhost';
const port = process.env.DB_PORT ? process.env.DB_PORT : '27017';
const database = process.env.DB_DATABASE ? process.env.DB_DATABASE : 'files_manager';

const url = `mongodb://${host}:${port}`;

class DBClient {
  constructor() {
    this.client = new MongoClient(url, { useUnifiedTopology: true });
    this.connectDB();
  }

  async connectDB() {
    await this.client.connect(() => {
      console.log('DB connected successfully!');
    });
    this.db = this.client.db(database);
  }

  isAlive() {
    return this.client.topology.isConnected();
  }

  async nbUsers() {
    const allUsers = await this.db.collection('users').countDocuments();
    return allUsers;
  }

  async nbFiles() {
    const allFiles = await this.db.collection('files').countDocuments();
    return allFiles;
  }
}

const dbClient = new DBClient();

export default dbClient;
