import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

export const SERVER_PORT = process.env.SERVER_PORT;
export const MONGODB_URL = process.env.MONGODB_URL;
export const MONGODB_NAME = process.env.MONGODB_NAME;
