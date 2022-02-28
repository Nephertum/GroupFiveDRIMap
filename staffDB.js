const sqlite3 = require('sqlite3')
const bcrypt = require('bcrypt')

const db = new sqlite3.Database('./database/staff.db', (err) => {
  if (err) console.log(err)
  db.run(`CREATE TABLE IF NOT EXISTS staff (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT,
        password TEXT
        )
        `, async (err) => {
    if (err) console.log(err)
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash('test', salt)
    db.run('INSERT INTO staff(username, password) VALUES(?,?)', ['admin', hashedPassword], (err) => {
      if (err) console.log(err)
    })
  })
})

module.exports = db
