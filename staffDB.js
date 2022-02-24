const sqlite3 = require('sqlite3')

const db = new sqlite3.Database('./database/staff.db', (err) => {
    if (err) console.log(err)
    db.run(`CREATE TABLE IF NOT EXISTS staff (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT,
        password TEXT
        )
        `,(err) => {
            if (err) console.log(err)
            db.run("INSERT INTO staff(username, password) VALUES(?,?)",["admin","test"],(err) => {
                if(err) console.log(err)
            })
        })
})

module.exports = db