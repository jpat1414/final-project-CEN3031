
require("dotenv").config();

const app = require("./app");
const { db } = require("./config");

const PORT = process.env.PORT;

async function startServer() {
  try {
    await db.query("SELECT 1");

    console.log("Database connection established");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

startServer();