const express = require('express')
const expressLayout = require('express-ejs-layouts') 
const path=require('path')
const indexRouter=require('./routes/index')
const adminRouter=require('./routes/admin')
const app=express()
const bodyParser = require('body-parser')
var session=require('express-session')

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(session({secret:"key",cookie:{maxAge:600000}}))

const PORT = process.env.PORT || 3000

app.use(expressLayout)

app.set('layout','./layouts/layout')
app.set('view engine','ejs')




app.use('/',indexRouter)
app.use('/admin',adminRouter)
app.use(express.static(path.join(__dirname, 'public')));

const connectDB = require('./config/db')
connectDB()

app.listen(PORT,()=>{
    console.log(`Listening on port ${PORT}`)
})