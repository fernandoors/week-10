const express = require('express')
const http = require('http')
const cors = require('cors')
const mongoose = require('mongoose')
const routes = require('./routes')
const { setupWebSocket } = require('./websocket')

const app = express()
const server = http.Server(app)

setupWebSocket(server)

mongoose.connect('mongodb+srv://semana:semana@cluster0-obts4.mongodb.net/week10?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  createIndexes: true
})

app.use(cors())
app.use(express.json())

app.use(routes)

server.listen(3333)