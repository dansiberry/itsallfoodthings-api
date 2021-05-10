const Pool = require('pg').Pool;

const pool = new Pool ({
    user: 'dan',
    password: '',
    host: 'localhost',
    port: 5432,
    database: 'itsallfoodthings'
});

module.exports = pool;