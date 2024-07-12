import fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const getItems = (req, res) => {
  try {
    const data = fs.readFileSync(path.resolve(__dirname, '../db/clients.json'))
    res.send(data)
  } catch (err) {
    res.sendStatus(500)
    throw err
  }
}

const getItem = (req, res) => {
  try {
    const data = fs.readFileSync(path.resolve(__dirname, '../db/clients.json'))
    const clients = JSON.parse(data)
    const client = clients.find((client) => client.idclient == req.params.id)
    if (client) {
      res.json(client)
    } else {
      res.sendStatus(404)
    }
  } catch (err) {
    res.sendStatus(500)
    throw err
  }
}

const patchItem = (req, res) => {
  try {
    console.log('Received ID:', req.params.id)
    console.log('Request body:', req.body)
    const data = fs.readFileSync(path.resolve(__dirname, '../db/clients.json'))
    const clients = JSON.parse(data)
    let index = clients.findIndex((client) => client.idclient == req.params.id)

    if (index !== -1) {
      clients[index] = {
        ...clients[index],
        ...req.body
      }

      fs.writeFileSync(path.resolve(__dirname, '../db/clients.json'), JSON.stringify(clients))
      res.json(clients[index])
    } else {
      res.sendStatus(404)
    }
  } catch (err) {
    res.sendStatus(500)
    throw err
  }
}

const postItem = (req, res) => {
  try {
    const data = fs.readFileSync(path.resolve(__dirname, '../db/clients.json'))
    const clients = JSON.parse(data)
    const newClient = { ...req.body, idclient: clients.length + 1 }

    clients.push(newClient)

    fs.writeFileSync(path.resolve(__dirname, '../db/clients.json'), JSON.stringify(clients))

    res.json(newClient)
  } catch (err) {
    res.sendStatus(500)
    throw err
  }
}

const deleteItem = (req, res) => {
  try {
    const data = fs.readFileSync(path.resolve(__dirname, '../db/clients.json'))
    let clients = JSON.parse(data)
    clients = clients.filter((client) => client.idclient != req.params.id)

    fs.writeFileSync(path.resolve(__dirname, '../db/clients.json'), JSON.stringify(clients))
    res.sendStatus(200)
  } catch (err) {
    res.sendStatus(500)
    throw err
  }
}

export default {
  getItems,
  getItem,
  patchItem,
  postItem,
  deleteItem
}
