const { render } = require('ejs')
const express=require('express')
const userHelper = require('../helpers/user-helper')
const router = express.Router()

var userhelper = require('../helpers/user-helper') 

const verifyLogin=(req,res,next)=>{
    if(req.session.user.loggedIn)
    {
        next()
    }else{
        res.redirect('/login')
    }
}
router.get('/',(req,res)=>{
    let user=req.session.user
    if(user)
        console.log(user);
    res.render('index',{user})
})
router.get('/logout',(req,res)=>{
    req.session.user=null
    res.redirect('/')
})
router.get('/contact',(req,res)=>{
    let user = req.session.user
    res.render('contact',{user})
})
router.get('/services',(req,res)=>{
    res.render('services')
})
router.get('/portfolio',(req,res)=>{
    userHelper.getPortfolio().then((portfolios)=>{
        res.render('portfolio',{portfolios})
    })
    
})
router.get('/team',(req,res)=>{
    let member=req.session.member
    if(member)
        console.log(member);
    res.render('members/team',{member})
})
router.post('/contact/addDetails',(req,res)=>{
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
router.get('/wedding',(req,res)=>{
    res.render('wedding')
})
router.get('/corporateEvent',(req,res)=>{
    res.render('corporate-event')
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
            
            req.session.user=response.user
            req.session.user.loggedIn=true
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
router.get('/team/member/login',(req,res)=>{
    res.render('members/login')
})
router.post('/member/login',(req,res)=>{
    userhelper.doMemberLogin(req.body).then((response)=>{
        if(response.status){
            req.session.member=response.member
            req.session.member.loggedIn=true
            res.redirect('/team')
        }else{
            console.log('invalid username or password');
            res.redirect('/team/member/login')
        }
      })
})
router.get('/team/member/logout',(req,res)=>{
    req.session.member=null
    res.redirect('/team')
})


module.exports=router