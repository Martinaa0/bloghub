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

// Početni članci
const pocetniClanci = [
  {
    title: 'Kako bolje organizirati svoje vrijeme',
    body: 'Dobra organizacija vremena može nam pomoći da lakše izvršimo svakodnevne obaveze i pronađemo više vremena za odmor.',
    userId: 1
  },
  {
    title: 'Moji savjeti za učenje',
    body: 'Učenje je puno lakše kada napravimo dobar raspored, redovito ponavljamo gradivo i napravimo kratke pauze.',
    userId: 2
  },
  {
    title: 'Ideje za produktivan dan',
    body: 'Dan možemo započeti jednostavnim planom obaveza i prvo riješiti najvažnije zadatke.',
    userId: 3
  },
  {
    title: 'Zašto je važno imati hobi',
    body: 'Hobiji nam omogućuju da se opustimo, naučimo nešto novo i kvalitetno provedemo slobodno vrijeme.',
    userId: 4
  },
  {
    title: 'Kako se odmoriti nakon napornog dana',
    body: 'Šetnja, glazba, druženje ili dobra knjiga mogu biti odličan način za odmor nakon obaveza.',
    userId: 5
  },
  {
    title: 'Male navike koje čine razliku',
    body: 'Male svakodnevne navike s vremenom mogu donijeti velike promjene i pomoći nam da budemo organiziraniji.',
    userId: 6
  },
  {
    title: 'Kako ostati motiviran',
    body: 'Postavljanje malih i ostvarivih ciljeva može nam pomoći da zadržimo motivaciju i lakše pratimo svoj napredak.',
    userId: 7
  },
  {
    title: 'Prednosti jutarnje rutine',
    body: 'Dobra jutarnja rutina može nam pomoći da mirnije započnemo dan i bolje se pripremimo za obaveze.',
    userId: 8
  },
  {
    title: 'Kako kvalitetno provesti slobodno vrijeme',
    body: 'Slobodno vrijeme možemo iskoristiti za druženje, sport, čitanje, putovanja ili aktivnosti koje nas vesele.',
    userId: 9
  },
  {
    title: 'Važnost odmora i sna',
    body: 'Kvalitetan san i dovoljno odmora važni su za koncentraciju, raspoloženje i uspješno izvršavanje svakodnevnih obaveza.',
    userId: 10
  }
]

// Dodavanje početnih članaka ako već ne postoje
pocetniClanci.forEach((clanak) => {
  db.get(
    'SELECT id FROM posts WHERE title = ?',
    [clanak.title],
    (err, row) => {
      if (err) {
        console.log('Greška:', err.message)
        return
      }

      if (!row) {
        db.run(
          'INSERT INTO posts (title, body, userId) VALUES (?, ?, ?)',
          [clanak.title, clanak.body, clanak.userId]
        )
      }
    }
  )
})

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