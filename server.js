import express from 'express';
import router from './routes/index';

const app = express();
const port = process.env.PORT ? process.env.PORT : '5000';

app.use(router);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
