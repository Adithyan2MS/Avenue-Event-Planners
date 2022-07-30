const express = require('express')
const expressLayout = require('express-ejs-layouts') 
const path=require('path')
const indexRouter=require('./routes/index')
const adminRouter=require('./routes/admin')

const app=express()
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);






const bodyParser = require('body-parser')
var session=require('express-session')
var fileUpload=require('express-fileupload')

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(session({secret:"key",cookie:{maxAge:60000}}))

const PORT = process.env.PORT || 3000

app.use(expressLayout)

app.set('layout','./layouts/layout')
app.set('view engine','ejs')



app.use(fileUpload())
app.use('/',indexRouter)
app.use('/admin',adminRouter)
app.use(express.static(path.join(__dirname, 'public')));



const connectDB = require('./config/db')
connectDB()
const ChatDataModel = require("./models/chatdata")


io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
    io.emit('chat message', msg);

  });
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});



server.listen(PORT,()=>{
    console.log(`Listening on port ${PORT}`)
})