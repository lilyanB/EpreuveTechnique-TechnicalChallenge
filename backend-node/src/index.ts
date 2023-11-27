import express from 'express';
import http from 'http';

import router from './router';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
require('dotenv').config()

const app = express();

app.use(bodyParser.json());

const server = http.createServer(app);

server.listen(9090, () => {
    console.log('Server running on http://localhost:9090/');
});

const MONGO_URL = process.env.DB_URL;


mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on('error', (error: Error) => console.log(error));

app.use('/', router());