const sqlite3 = require('sqlite3')

const db = new sqlite3.Database('./database/staff.db', (err) => {
  if (err) console.log(err)
  db.all("SELECT * FROM staff",[],(err,rows) => {
      console.log(rows)
  })
})
