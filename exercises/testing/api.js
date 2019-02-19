const express = require('express')
const morgan = require('morgan')
const {
  urlencoded,
  json
} = require('body-parser')
const users = require('./users')
const app = express()

app.use(morgan('dev'))
app.use(urlencoded({
  extended: true
}))
app.use(json())

app.get('/user/:id', async (req, res) => {
  if (req.params.id) {
    const id = req.params.id
    await users.findUser(id)
      .then(user => res.status(200).send(user))
      .catch(error => console.error(error))
  }
})

app.delete('/user/:id', async (req, res) => {
  if (req.params.id) {
    const id = req.params.id
    await users.deleteUser(id)
      .then(user => res.status(201).send({ id }))
      .catch(error => console.error(error))
  }
})

module.exports = app