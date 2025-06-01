const mysql = require('mysql2/promise');
require('dotenv').config();

let connection;

async function initConnection() {
    if (!connection) {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });
        console.log('Shared database connection established');
    }
    return connection;
}

async function closeConnection() {
    if (connection) {
        await connection.end();
        console.log('Shared database connection closed');
    }
}

module.exports = { initConnection, closeConnection };
