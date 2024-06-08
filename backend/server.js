import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();
const app = express();
const PORT = 4003;
const saltRounds = 10;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// Generate one-time password (OTP)
function generateOTP() {
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp.toString();
}

// Routes
app.post("/users", async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const [result] = await pool.query(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, hashedPassword]
    );
    const userId = result.insertId;
    await pool.query("INSERT INTO accounts (userId, amount) VALUES (?, 0)", [
      userId,
    ]);
    res.status(201).json({ userId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/sessions", async (req, res) => {
  const { username, password } = req.body;
  try {
    const [users] = await pool.query("SELECT * FROM users WHERE username = ?", [
      username,
    ]);
    if (users.length > 0) {
      const user = users[0];
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        const token = generateOTP();
        await pool.query("INSERT INTO sessions (userId, token) VALUES (?, ?)", [
          user.id,
          token,
        ]);
        res.json({ token });
      } else {
        res.status(401).send("Username or password is incorrect");
      }
    } else {
      res.status(401).send("Username or password is incorrect");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/me/accounts", async (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  try {
    const [sessions] = await pool.query(
      "SELECT * FROM sessions WHERE token = ?",
      [token]
    );
    if (sessions.length > 0) {
      const session = sessions[0];
      const [accounts] = await pool.query(
        "SELECT * FROM accounts WHERE userId = ?",
        [session.userId]
      );
      if (accounts.length > 0) {
        res.json({ amount: accounts[0].amount });
      } else {
        res.status(404).send("Account not found");
      }
    } else {
      res.status(401).json({ error: "Invalid or expired token" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/me/accounts/transactions", async (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  const { amount } = req.body;
  console.log(`Received transaction request: token=${token}, amount=${amount}`);
  try {
    const [sessions] = await pool.query(
      "SELECT * FROM sessions WHERE token = ?",
      [token]
    );
    if (sessions.length > 0) {
      const session = sessions[0];
      const [accounts] = await pool.query(
        "SELECT * FROM accounts WHERE userId = ?",
        [session.userId]
      );
      if (accounts.length > 0) {
        const account = accounts[0];
        if (amount < 0) {
          res.status(400).send("Negative amount not allowed");
        } else {
          const newAmount = account.amount + parseFloat(amount);
          const [updateResult] = await pool.query(
            "UPDATE accounts SET amount = ? WHERE id = ?",
            [newAmount, account.id]
          );
          console.log(
            `Updated account: userId=${session.userId}, newAmount=${newAmount}, updateResult=${updateResult}`
          );
          res.json({ amount: newAmount });
        }
      } else {
        res.status(404).send("Account not found");
      }
    } else {
      res.status(401).json({ error: "Invalid or expired token" });
    }
  } catch (error) {
    console.error("Error processing transaction:", error);
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Bankens backend körs på http://localhost:${PORT}`);
});
