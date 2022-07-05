require('dotenv').config();
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const gameRouter = require('./src/routers/game')
const userRouter = require('./src/routers/user')
const listRouter = require('./src/routers/list')

const port = process.env.PORT || 2000 //TODO nie wiem jak z tym portem na serwerze 'atthost'

const DATABASE_NAME = 'KreatorZadan'
const uri = `mongodb+srv://${process.env.DATABASE_CONNECTION}/${DATABASE_NAME}?retryWrites=true&w=majority`;

mongoose
    .connect(uri)
    .then(res=>{
        console.log(`Connected to Mongo! Database name: "${res.connections[0].name}"`)
    })
    .catch(error=>{
        console.error('Error connecting to mongo',error.reason)
    })

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(cors())

app.use(gameRouter)
app.use(userRouter)
app.use(listRouter)

app.listen(port, ()=>{
    console.log('App is running on port', port)
})





