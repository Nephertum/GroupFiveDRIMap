const sqlite3 = require('sqlite3')

const db = new sqlite3.Database('./database/entities.db', (err) => {
    if (err) console.log(err)
    db.all("SELECT * FROM rooms",[],(err,rows) => {
        if (!err) {
            console.log(rows);
            
        }
    })
})