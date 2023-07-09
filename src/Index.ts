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

import axios from "axios";
import cron from 'node-cron';
import Logger from "@/Utils/Logger";

cron.schedule('*/5 * * * *', async () => {
    await axios.get(process.env.ENVIRONMENT === 'dev' ? 'http://localhost:3000' : 'https://lirp-utility-bot.onrender.com').then((res) => {
        Logger.info(res.status);
    })
});