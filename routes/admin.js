const { response } = require('express')
const express = require('express')
const router = express.Router()

var helper = require('../helpers/helper') 

router.get('/',(req,res)=>{
    res.render('admin/login',{layout: 'layouts/adminLayout.ejs'})
})
router.post('/login',(req,res)=>{
    console.log(req.body.Email);
    helper.doLogin(req.body).then((response)=>{
        if(response)
        {
            console.log("ogggggg");
        }
        else{
            console.log("lknklnk");
        }
    })

})
router.get('/home',(req,res)=>{
    res.render('admin/home',{layout: 'layouts/adminLayout.ejs'})
})
router.get('/signup',(req,res)=>{
    res.render('admin/signup',{layout: 'layouts/adminLayout.ejs'})
})
router.post('/signup',(req,res)=>{
    // console.log(req.body)
    helper.doSignup(req.body).then((response)=>{
        if(response)
        {
            console.log("added");
        }
        else{
            console.log("error");
        }   
    })
})


module.exports = router