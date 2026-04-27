// Database connection configuration
const mysql = require('mysql2/promise');

// Create a connection pool to handle multiple connections
const pool = mysql.createPool({
  host: 'localhost',      // MySQL server host
  user: 'root',           // MySQL username (change if needed)
  password: 'Today@786',  // MySQL password (change if needed)
  database: 'hostel_db',  // Database name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
