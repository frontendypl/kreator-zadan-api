require('dotenv').config();
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const playerRouter = require('./src/routers/player')
const userRouter = require('./src/routers/user')
const listRouter = require('./src/routers/list')
const imageRouter = require('./src/routers/image')
const exerciseRouter = require('./src/routers/exercise')
const answerRouter = require('./src/routers/answer')
const resetPassword = require('./src/routers/resetPassword')
const youtubeVideo = require('./src/routers/youtubeVideo')

const uri = `mongodb+srv://${process.env.DATABASE_CONNECTION}/${process.env.DATABASE_NAME}?retryWrites=true&w=majority`;

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

app.use(playerRouter)
app.use(userRouter)
app.use(listRouter)
app.use(imageRouter)
app.use(exerciseRouter)
app.use(answerRouter)
app.use(resetPassword)
app.use(youtubeVideo)

app.listen(process.env.PORT, ()=>{
    console.log('App is running on port', process.env.PORT)
})





