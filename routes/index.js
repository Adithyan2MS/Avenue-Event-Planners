const express=require('express')
const router = express.Router()

var helper = require('../helpers/helper') 

router.get('/',(req,res)=>{
    res.render('index')
})
router.get('/contact',(req,res)=>{
    res.render('contact')
})
router.get('/services',(req,res)=>{
    res.render('services')
})
router.post('/contact/addDetails',(req,res)=>{
    console.log(req.body);
    helper.addDetails(req.body).then((data)=>{
       if(data){
        // req.flash("msg","Error Occured");
        // res.locals.messages = req.flash();
        res.redirect('/contact');
       }
    })
})
router.get('/about',(req,res)=>{
    res.render('about')
})

module.exports=router