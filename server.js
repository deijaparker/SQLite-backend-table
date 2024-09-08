const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const app = express();

// Create an SQLite database connection
const db = new sqlite3.Database(":memory:");

// Middleware to parse JSON data
app.use(express.json());

// Create the 'friends' table
db.serialize(() => {
  db.run(`CREATE TABLE friends (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    age INTEGER NOT NULL,
    email TEXT
  )`);
});

// Insert a new friend
app.post("/add-friend", (req, res) => {
  const { name, age, email } = req.body;
  db.run(
    `INSERT INTO friends (name, age, email) VALUES (?, ?, ?)`,
    [name, age, email],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "Friend added successfully!", id: this.lastID });
    }
  );
});

// Delete a friend
app.delete("/delete-friend/:id", (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM friends WHERE id = ?`, [id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Friend deleted successfully!" });
  });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
