const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { authService } = require("../services");

async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required",
      });
    }

    const existingUser = await authService.findUserByEmail(email);

    if (existingUser) {
      return res.status(409).json({
        message: "An account with that email already exists",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await authService.createUser(
      name,
      email,
      passwordHash
    );

    return res.status(201).json({
      message: "Account created successfully",
      user,
    });
  } catch (err) {
    console.error("Register error:", err);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await authService.findUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

module.exports = {
  register,
  login,
};