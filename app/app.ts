import express from 'express';
import dotenv from 'dotenv';

import root from './src/apis/root';

const app: express.Application = express();

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api', root);

export default app;
