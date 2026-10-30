const mysql = require('mysql2'); 

const pool = mysql.createPool({
    host: 'localhost',
    port: 3307,        // Porta do seu MySQL
    user: 'root',
    password: 'admin', // Senha do seu MySQL
    database: 'rivals_counter'
});

module.exports = pool.promise();