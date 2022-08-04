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
app.use(session({secret:"key",cookie:{maxAge:600000}}))

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


app.get('/chatwindow/:eventid/:user',(req,res)=>{
    console.log(req.params.user)
    res.render('members/chat',{ roomName: req.params.eventid,user:req.params.user })
})

io.on('connection',(socket)=>{
  console.log("connected...");
  socket.on('message',(room,msg)=>{
    socket.join(room)
      socket.to(room).emit('message',msg)
  })
})


server.listen(PORT,()=>{
    console.log(`Listening on port ${PORT}`)
})