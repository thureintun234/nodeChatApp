const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const mongoose = require('mongoose')

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const dbUrl = 'mongodb+srv://user:user@cluster0.b082v.mongodb.net/user?retryWrites=true&w=majority'
let Message = mongoose.model('Message', {
    name: String,
    message: String
})

let messages = [
    { name: 'Tim', message: 'hi' },
    { name: 'John', message: 'hello' }
]

app.get('/message', (req, res) => {
    Message.find({}, (err, messages) => {
        if (err) sendStatus(404)
        res.send(messages)
    })
})

app.post('/message', (req, res) => {
    let message = new Message(req.body)
    message.save((err) => {
        if (err) sendStatus(500)

        io.emit('message', req.body)
        res.sendStatus(200)
    })
})

mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    console.log('mongodb error ', err);
})

io.on('connection', (socket) => {
    console.log('a user connected');
})

http.listen(3001, () => {
    console.log('Server running on port 3001');
})