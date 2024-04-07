const postgres = require('postgres');
require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const { Resend } = require('resend');


const neonDB = postgres({
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    port: 5432,
    ssl: 'require',
    connection: {
        options: `project=${process.env.ENDPOINT_ID}`,
    },
});

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.API_SECRET
});

const resend = new Resend(process.env.API_KEY);

module.exports = { cloudinary, neonDB, resend };