import express from 'express'
const router = express.Router()
import ctrl from '../controllers/client.mjs'

router.get('/', ctrl.getItems)

router.get('/:id', ctrl.getItem)

router.patch('/:id', ctrl.patchItem)

router.post('/', ctrl.postItem)

router.delete('/:id', ctrl.deleteItem)

export { router }
