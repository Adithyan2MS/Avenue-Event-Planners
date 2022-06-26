const { render } = require('ejs')
const express=require('express')
const router = express.Router()

var userhelper = require('../helpers/user-helper') 

const verifyLogin=(req,res,next)=>{
    if(req.session.loggedIn)
    {
        next()
    }else{
        res.redirect('/login')
    }
}
router.get('/',(req,res)=>{
    let user=req.session.user
    if(user)
        console.log("user eru");
    console.log(user);
    res.render('index',{user})
})
router.get('/logout',(req,res)=>{
    req.session.destroy()
    res.redirect('/')
})
router.get('/contact',(req,res)=>{
    let user = req.session.user
    res.render('contact',{user})
})
router.get('/services',(req,res)=>{
    res.render('services')
})
router.post('/contact/addDetails',verifyLogin,(req,res)=>{
    console.log(req.body);
    userhelper.addDetails(req.body,req.session.user._id).then(()=>{
        res.redirect('/contact');
    })
})
router.get('/about',(req,res)=>{
    res.render('about')
})
router.get('/socialGathering',(req,res)=>{
    res.render('social-gathering')
})
router.get('/signup',(req,res)=>{
    res.render('user/signup')
})
router.post('/signup',(req,res)=>{
    userhelper.doSignup(req.body).then((response)=>{
        if(response)
        {
            console.log("new user added");
            res.redirect('/login')
        }
        else{
            console.log("error");
        }   
    })
})
router.post('/login',(req,res)=>{
    userhelper.doLogin(req.body).then((response)=>{
        if(response.status){
            req.session.loggedIn=true
            req.session.user=response.user
            res.redirect('/')
        }else{
            console.log('invalid username or password');
            res.redirect('login')
        }
      })
})

router.get('/login',(req,res)=>{
    res.render('user/login')
})

module.exports=router