const { Pool } = require('pg');
require('dotenv').config();

const pool = new pool({
    connectionString : process.env.DATABASE_URL,
    ssl : {
        rejectUnauthorized: false, 
    },
});

module.exports = pool;