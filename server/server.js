require('./config/config')

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const app = express()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}))

// parse application json
app.use(bodyParser.json())

app.use(require('./routes/index'))

mongoose.connect(process.env.URL_DB, {
    useNewUrlParser: true
}, (err, res) => {
    if (err) throw err

    console.log('BD online')
})
mongoose.set('useCreateIndex', true)

app.listen(process.env.PORT, () => {
    console.log('listening port', process.env.PORT)
})