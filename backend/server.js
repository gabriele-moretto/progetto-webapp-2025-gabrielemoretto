const express = require('express')
const app = express()

app.use(express.static('../frontend'))

//Importo le funzioni
const { load_disc } = require('../db/disc_load.js')
const { getAllDiscs, getDiscFromId, getTopNDiscs, getRandNDiscs } = require('../db/disc_data.js')
const { putDisc, deleteDisc, getAllItems } = require('../db/cart.js')


//Inizializza il database
//Scrivere /init/data?N=X&page=Y
app.get('/init/:data', (req, res) => {
    N = req.query.N
    init_page = req.query.page
    load_disc(N, init_page)
})

// GET disk/:data
app.get('/disc/:id', (req, res) => {
    id = req.params.id
    disc = getDiscFromId(id)
    if(disc)
        res.json(disc)
    else
        res.status(204)
})

// GET disc - Restituisce il disco N
app.get('/disc', (req, res) => {
    res.json(getAllDiscs())
})

// GET disc/top/:N - Restituisce i top N dischi
app.get('/disc/top/:N', (req, res) => {
    N = req.params.N
    discs = getTopNDiscs(N)
    if(discs)
        res.json(discs)
    else
        res.status(204)
})

// GET disc/rand/:N - Restituisce N dischi random
app.get('/disc/rand/:data', (req, res) => {
    N = req.query.N
    NTop = req.query.NTop

    discs = getRandNDiscs(N, NTop)
    if(discs)
        res.json(discs)
    else
        res.status(204)
})

// GET cart/items - Resistuisce gli elementi nel carrello
app.get('/cart/items', (req, res) => {
    discs = getAllItems()
    if(discs)
        res.json(discs)
    else
        res.status(204)
})

// POST cart/:data
app.post('/cart/item/:id', (req, res) => {
    id = req.params.id

    ret = putDisc(id, 1)
    if(ret)
        res.json(ret)
    else
        res.status(204)
})

//PUT cart/:id, quantity
app.put('/cart/:data', (req, res) => {
    id = req.query.id
    quantity = req.query.quantity

    ret = putDisc(id, quantity)
    if(ret)
        res.json(ret)
    else
        res.status(204)
})

//DELETE cart:id
app.delete('/cart/:id', (req, res) => {
    id = req.params.id

    ret = deleteDisc(id)
    if(ret)
        res.json(ret)
    else
        res.status(204)
})


app.listen(3000, () => {
    console.log('http://localhost:3000')
})
