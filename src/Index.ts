import { config } from "dotenv";
config();

import Client from '@/Structures/Client';

const client = new Client();

client.start();

import express from 'express';
const app = express();

app.get('/', (req, res) => {
    res.send(`<h1 style="padding: 70px 0; border: 3px solid green; text-align: center;">Hello ${req.ip}</h1>`);
});

app.listen(3000 || process.env.PORT, () => console.log(`App listening to port ${3000 || process.env.PORT}`));