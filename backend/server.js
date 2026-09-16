const express = require('express')
const cors = require('cors')
const sqlite3 = require('sqlite3').verbose()

const app = express()
const PORT = 3000

// Povezivanje s SQLite bazom
const db = new sqlite3.Database('./bloghub.db', (err) => {
  if (err) {
    console.log('Greška pri povezivanju s bazom:', err.message)
  } else {
    console.log('Povezano s SQLite bazom.')
  }
})

// Kreiranje tablice posts
db.run(`
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    userId INTEGER NOT NULL
  )
`)

// Omogućuje komunikaciju s frontendom
app.use(cors())

// Omogućuje primanje JSON podataka
app.use(express.json())

// Testna ruta
app.get('/', (req, res) => {
  res.send('BlogHub backend radi!')
})

// Dohvaćanje svih članaka iz baze
app.get('/api/posts', (req, res) => {
  db.all('SELECT * FROM posts', [], (err, rows) => {
    if (err) {
      return res.status(500).json({
        error: err.message
      })
    }

    res.json(rows)
  })
})

// Dohvaćanje jednog članka prema ID-u
app.get('/api/posts/:id', (req, res) => {
  const id = req.params.id

  db.get(
    'SELECT * FROM posts WHERE id = ?',
    [id],
    (err, row) => {
      if (err) {
        return res.status(500).json({
          error: err.message
        })
      }

      if (!row) {
        return res.status(404).json({
          poruka: 'Članak nije pronađen.'
        })
      }

      res.json(row)
    }
  )
})

// Dodavanje novog članka u bazu
app.post('/api/posts', (req, res) => {
  const { title, body, userId } = req.body

  const sql = `
    INSERT INTO posts (title, body, userId)
    VALUES (?, ?, ?)
  `

  db.run(sql, [title, body, userId], function (err) {
    if (err) {
      return res.status(500).json({
        error: err.message
      })
    }

    res.status(201).json({
      id: this.lastID,
      title,
      body,
      userId
    })
  })
})

// Brisanje članka iz baze
app.delete('/api/posts/:id', (req, res) => {
  const id = req.params.id

  db.run(
    'DELETE FROM posts WHERE id = ?',
    [id],
    function (err) {
      if (err) {
        return res.status(500).json({
          error: err.message
        })
      }

      if (this.changes === 0) {
        return res.status(404).json({
          poruka: 'Članak nije pronađen.'
        })
      }

      res.json({
        poruka: 'Članak je uspješno obrisan.'
      })
    }
  )
})

// Uređivanje članka u bazi
app.put('/api/posts/:id', (req, res) => {
  const id = req.params.id
  const { title, body, userId } = req.body

  const sql = `
    UPDATE posts
    SET title = ?, body = ?, userId = ?
    WHERE id = ?
  `

  db.run(sql, [title, body, userId, id], function (err) {
    if (err) {
      return res.status(500).json({
        error: err.message
      })
    }

    if (this.changes === 0) {
      return res.status(404).json({
        poruka: 'Članak nije pronađen.'
      })
    }

    res.json({
      id: Number(id),
      title,
      body,
      userId
    })
  })
})

// Pokretanje servera
app.listen(PORT, () => {
  console.log(`Backend radi na http://localhost:${PORT}`)
})