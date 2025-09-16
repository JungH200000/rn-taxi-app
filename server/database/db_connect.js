require('dotenv').config();
const db = require('mysql');

const conn = db.createConnection({
  host: 'localhost',
  port: 3307,
  user: 'taxi',
  password: process.env.DB_PASSWORD,
  database: 'taxi',
});

module.exports = conn;
