const app = require('./app')

app.post('/chatbot', (req, res) => {
  console.log(req.params)
})

app.listen(3000, () => {
  console.log('listening at port 3000')
})
