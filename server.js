const app = require('./app');
const http = require('http')
const websocket = require("ws")
const server = http.createServer(app)
app.post("/chatbot", (req,res) => {
    console.log(req.params)
})
const wsServer = new websocket.Server({server})

server.listen(3000,() => 
{
    console.log('listening at port 3000');
});
