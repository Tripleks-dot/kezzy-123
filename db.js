const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'gateway01.eu-central-1.prod.aws.tidbcloud.com',
    port: 4000,
    user: '2DVPjdpkT71tpQs.root',
    password: 'ut25Cbs4BrXUYihz',
    database: 'kodi',
    ssl: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test the connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ TiDB Connection failed:', err.message);
    } else {
        console.log('✅ Connected to TiDB Cloud! Database: kodi');
        connection.release();
    }
});

module.exports = pool.promise();