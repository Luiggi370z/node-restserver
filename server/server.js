require('./config/config')

const express = require('express')
const bodyParser = require('body-parser')
const app = express()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}))

// parse application json
app.use(bodyParser.json())

app.get('/user', (req, res) => {
    res.send('Hello World')
})

app.post('/user', (req, res) => {
    let body = req.body

    if (!body.name)
        res.status(400).json({
            ok: false,
            message: 'Name is required'
        })
    else
        res.send(body)
})

app.put('/user/:id', (req, res) => {
    let id = req.params.id

    res.send(id)
})

app.delete('/', (req, res) => {
    res.send('Hello World')
})

app.listen(process.env.PORT, () => {
    console.log('listening port', process.env.PORT)
})