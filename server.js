const express = require("express");
const app = express();

const path = require("path");
const session = require("express-session");
const sqlite3 = require("sqlite3").verbose();
const { hashPassword, comparePassword } = require("./lib/hash-password");

const db = new sqlite3.Database("./sqlite/username.db");

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname)));
app.use(
  session({
    secret: "key-secret",
    resave: false,
    saveUninitialized: false,
  })
);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS username (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      password TEXT NOT NULL
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS trails (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      difficulty TEXT NOT NULL,
      location TEXT NOT NULL,
      startingPoint TEXT NOT NULL,
      image TEXT NOT NULL,
      user TEXT NOT NULL
    )
  `);
  
  
});

app.post("/login", (req, res) => {
  const { username, password, isNewUser } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "enter username and password CORRECTLY." });
  }

  db.get("SELECT * FROM username WHERE name = ?", [username], (err, user) => {
    if (err) {
      console.error("DB hatası:", err);
      return res.status(500).json({ message: "Server error" });
    }

    if (isNewUser) {
      if (user) {
        return res.status(409).json({ message: "user already exists." });
      }

      hashPassword(password).then((hashed) => {
        db.run(
          "INSERT INTO username (name, password) VALUES (?, ?)",
          [username, hashed],
          (err) => {
            if (err) {
              console.error("Kayıt hatası:", err);
              return res.status(500).json({ message: "error" });
            }
            req.session.username = username;
            return res.status(200).json({ message: "succes" });
          }
        );
      });
      return;
    }

    if (!user) {
      return res.status(401).json({ message: "user not found." });
    }

    comparePassword(password, user.password).then((isValid) => {
      if (!isValid) {
        return res.status(401).json({ message: "password error" });
      }
      req.session.username = username;
      res.status(200).json({ message: "succes" });
    });
  });
});

app.get("/me", (req, res) => {
  if (req.session && req.session.username) {
    res.json({ username: req.session.username });
  } else {
    res.status(401).json({ message: "Not logged in" });
  }
});
app.post("/submit-trail", (req, res) => {
  const { title, description, difficulty, startingPoint, location, image } = req.body;

  if (!req.session.username) {
    return res.status(401).json({ message: "Oturum açılmamış." });
  }

  if (!title || !description || !difficulty || !startingPoint || !image) {
    return res.status(400).json({ message: "Eksik bilgi." });
  }

  const user = req.session.username;

  db.run(
    "INSERT INTO trails (title, description, difficulty, startingPoint, location, image, user) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [title, description, difficulty, startingPoint, location, image, user],
    (err) => {
      if (err) {
        console.error("Veri kaydetme hatası:", err);
        return res.status(500).json({ message: "Sunucu hatası." });
      }

      res.status(200).json({ message: "Rota başarıyla kaydedildi." });
    }
  );
});




const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`server: http://localhost:${PORT}`);
});
