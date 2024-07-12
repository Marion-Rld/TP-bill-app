import fs from 'fs'
import { v4 as uuid } from 'uuid'
import * as path from 'path'
import { fileURLToPath } from 'url'
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const getItems = (req, res) => {
  try {
    const data = fs.readFileSync(path.resolve(__dirname, '../db/bills.json'))
    res.send(data)
  } catch (err) {
    res.sendStatus(500)
    throw err
  }
}

const getItem = (req, res) => {
  try {
    const data = fs.readFileSync(path.resolve(__dirname, '../db/bills.json'))
    const items = JSON.parse(data)
    const item = items.find((item) => item.id == req.params.id)
    if (item) {
      res.json(item)
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
    const data = fs.readFileSync(path.resolve(__dirname, '../db/bills.json'))
    const items = JSON.parse(data)
    let index = items.findIndex((item) => item.id == req.params.id)

    items[index] = {
      ...items[index],
      ...req.body
    }

    fs.writeFileSync(path.resolve(__dirname, '../db/bills.json'), JSON.stringify(items))
    res.json(items[index])
  } catch (err) {
    res.sendStatus(500)
    throw err
  }
}

const postItem = (req, res) => {
  try {
    const data = fs.readFileSync(path.resolve(__dirname, '../db/bills.json'))
    const items = JSON.parse(data)
    const newBill = { ...req.body, id: uuid() }

    items.push(newBill)

    fs.writeFileSync(path.resolve(__dirname, '../db/bills.json'), JSON.stringify(items))

    res.json(newBill)
  } catch (err) {
    res.sendStatus(500)
    throw err
  }
}

const deleteItem = (req, res) => {
  try {
    const data = fs.readFileSync(path.resolve(__dirname, '../db/bills.json'))
    let items = JSON.parse(data)
    items = items.filter((item) => item.id != req.params.id)

    fs.writeFileSync(path.resolve(__dirname, '../db/bills.json'), JSON.stringify(items))
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
