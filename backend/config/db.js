const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.MYSQLHOST || process.env.DB_HOST || "localhost",
  user: process.env.MYSQLUSER || process.env.DB_USER || "root",
  password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || "260603",
  database: process.env.MYSQLDATABASE || process.env.DB_NAME || "MilitaryHistoryVN",
  port: process.env.MYSQLPORT || process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

pool
  .getConnection()
  .then(() => console.log("Connected to MySQL successfully!"))
  .catch((err) => console.error("MySQL Connection Failed:", err));

module.exports = pool;
