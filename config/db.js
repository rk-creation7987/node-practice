var mysql = require('mysql');

// Create connection
var Conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "test"
});

// Connect to the database
Conn.connect((err) => {
  if (err) {
      console.error('Database connection failed:', err);
      return;
  }
  console.log('Connected to MySQL database');
});

// Export the connection object
module.exports = Conn;
