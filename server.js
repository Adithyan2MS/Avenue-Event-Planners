const express = require('express')
const expressLayout = require('express-ejs-layouts') 
const path=require('path')
const indexRouter=require('./routes/index')
const app=express()
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


const PORT = process.env.PORT || 3000

app.use(expressLayout)

app.set('layout','./layouts/layout')
app.set('view engine','ejs')




app.use('/',indexRouter)
app.use(express.static(path.join(__dirname, 'public')));

const connectDB = require('./config/db')
connectDB()

app.listen(PORT,()=>{
    console.log(`Listening on port ${PORT}`)
})