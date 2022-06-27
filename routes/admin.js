const { response } = require('express')
const express = require('express')
const router = express.Router()

var helper = require('../helpers/admin-helper') 

router.get('/',(req,res)=>{
    res.render('admin/login',{layout: 'layouts/adminLayout.ejs'})
})
router.post('/login',(req,res)=>{
    console.log(req.body.Email);
    helper.doLogin(req.body).then((response)=>{
        if(response.status){
            res.redirect('/admin/home')

            // res.render('/home',{layout: 'layouts/adminLayout.ejs'})
          }else{
              console.log("invalid username or password");
            res.redirect('/admin')
          }
    })

})
router.get('/home',async(req,res)=>{
    
    await helper.getAllDetails().then((details)=>{
        console.log(details[0].user);
        // console.log(details[0]._id);
        res.render('admin/home',{layout: 'layouts/adminLayout.ejs',details})
    })
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
            res.redirect('/admin')
            // res.render('admin/login',{layout: 'layouts/adminLayout.ejs'})
        }
        else{
            console.log("error");
        }   
    })
})
router.get('/home/view-details/:id',async(req,res)=>{
    var detail = await helper.getEventDetails(req.params.id)
        console.log(detail);
        res.render('admin/view-details',{layout: 'layouts/adminLayout.ejs',detail})

    // console.log(req.params.id);
})
router.get('/schedules',(req,res)=>{
    res.render('admin/schedules',{layout: 'layouts/scheduleLayout.ejs'})
})
router.get('/home/view-details/accept/:id',async(req,res)=>{
    helper.acceptDetail(req.params.id,req.session.user._id)
    // var detail = await helper.getUserDetails(req.params.id)
    // console.log(detail);
    // res.render('admin/schedules',{layout: 'layouts/adminLayout.ejs',detail})

})


module.exports = router