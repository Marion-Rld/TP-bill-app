import cors from 'cors'
import express from 'express'

// voir l'écosystème de node avec des middlewares comme passeport, multer, helmet, etc

// ici on importe les routes déclarées dans le fichiers routes/bill.mjs
import { router as billRoutes } from './routes/bill.mjs'
import { router as clientRoutes } from './routes/client.mjs'

// configuration du server
// ------------------------
const app = express()
const port = 3000
app.use(express.json()) // ici on définit que les body des requêtes seront automatiquement convertiens en format json dans nos contrôleurs de routes

app.use(
  cors({
    origin: 'http://localhost:5173'
  })
)

// déclaration des routes
// ------------------------
// pour déclarer des routes, il faut utiliser l'une des fonctions suivantes : get, post, put, patch, delete... qui correspondent aux verbes HTTP, le premier paramètre est la routes utilisée, le deuxième paramètre est une fonction controller qui est une fonction anonyme qui prend deux paramètres : req et res, req est la requête reçue, res, la réponse que l'on renvoie par cette fonction. Il est aussi possible d'intercaller des middlewares avant de renvoier la réponse, par exemple un middleware qui contrôle les droits d'accès ou un muddleware qui résoud les erreurs...
app.get('/', (req, res) => {
  res.send('Bills API v1.0.0')
})

// dans le cas d'un middleware, on utilise le mot next pour passe au middleware suivant
const uploadFile = (req, res, next) => {
  console.log('Enregistrement des fichiers envoyés dans la requête')
  res.urlFichier = 'test.jpg'
  next()
}
// une route qui utilise le middleware myLogger
app.get('/uploadfile', uploadFile, (req, res) => {
  // on peut passer des variables entre middleware en attachant ces variables à la requête ou à la réponse
  res.send('Votre fichier a bien été enregistré: ' + res.urlFichier) // ici on envoie une réponse avec res.send()
})

// ici on externalise toutes les routes qui commencent par /bills dans un fichier que l'on importe comme billRouter
// ici, les routes GET /bills, GET /bills/:id, PATCH /bills/:id, POST /bills, DELETE /bills/:id ... seront gérées par le fichier routes/bill.mjs
app.use('/bills', billRoutes)

app.use('/clients', clientRoutes)

// lancement du serveur
// ------------------------
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
