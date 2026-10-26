require("dotenv").config();

const { authService } = require("./src/services");
const { db } = require("./src/config");

async function test() {
  try {
    const user = await authService.findUserByEmail("test@test.com");
    console.log(user);
  } catch (err) {
    console.error(err);
  } finally {
    await db.end();
  }
}

test();