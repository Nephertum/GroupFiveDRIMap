const app = require('./app');
const http = require('http')
const websocket = require("ws");
const sqlite3 = require('sqlite3');
const server = http.createServer(app)
let db = new sqlite3.Database('./database/entities.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    }
})


app.post("/chatbot", (req,res) => {
    console.log(req.params)
})
const wsServer = new websocket.Server({server})

server.listen(3000,() => 
{
    console.log('listening at port 3000');
});
