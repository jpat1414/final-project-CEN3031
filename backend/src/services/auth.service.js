const { db } = require("../config");

async function findUserByEmail(email) {
  const [rows] = await db.execute(
    `
      SELECT id, name, email, password_hash, created_at
      FROM users
      WHERE email = ?
      LIMIT 1
    `,
    [email]
  );

  return rows[0] || null;
}

async function findUserById(id) {
  const [rows] = await db.execute(
    `
      SELECT id, name, email, created_at
      FROM users
      WHERE id = ?
      LIMIT 1
    `,
    [id]
  );

  return rows[0] || null;
}

async function createUser(name, email, passwordHash) {
  const [result] = await db.execute(
    `
      INSERT INTO users (name, email, password_hash)
      VALUES (?, ?, ?)
    `,
    [name, email, passwordHash]
  );

  return {
    id: result.insertId,
    name,
    email,
  };
}

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
};