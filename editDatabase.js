const sqlite3 = require('sqlite3')

const db = new sqlite3.Database('./database/entities.db', (err) => {
  if (err) console.log(err)
  db.run('UPDATE rooms SET facilities="No facilities"', [], (err, rows) => {
    if (!err) {
      console.log(rows)
    }
  })
})
