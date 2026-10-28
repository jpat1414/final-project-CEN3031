require("dotenv").config();

const { db } = require("../src/config");

async function createUsrTbl() {
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("Table ready");

  } catch (err) {

    console.error("Failed to create users table:", err);
    process.exitCode = 1;
  } finally {
    
    await db.end();
  }
}

createUsrTbl();