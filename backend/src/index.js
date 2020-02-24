const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const routes = require('./routes')

const app = express()

mongoose.connect('mongodb+srv://semana:semana@cluster0-obts4.mongodb.net/week10?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  createIndexes: true
})

app.use(cors())
app.use(express.json())

app.use(routes)

app.listen(3333)