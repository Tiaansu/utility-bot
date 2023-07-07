import { config } from "dotenv";
config();

import Client from '@/Structures/Client';

const client = new Client();

client.start();