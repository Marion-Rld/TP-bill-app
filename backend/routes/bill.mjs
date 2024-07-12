import express from 'express'
const router = express.Router()
import ctrl from '../controllers/bill.mjs'

// ici le / correspond à la route /bills/ (voir le index.mjs qui déclare l'import de ces routes avec app.use('/bills, billRoutes)
router.get('/', ctrl.getItems)

// ici la route /bills/:id
router.get('/:id', ctrl.getItem)

router.patch('/:id', ctrl.patchItem)

router.post('/', ctrl.postItem)

router.delete('/:id', ctrl.deleteItem)

export { router }
