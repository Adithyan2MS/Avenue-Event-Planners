const { render } = require('ejs')
const express=require('express')
const userHelper = require('../helpers/user-helper')
const router = express.Router()
const sendMail = require('../services/emailService')

var userhelper = require('../helpers/user-helper')


const verifyuserLogin=(req,res,next)=>{
    if(req.session.userloggedIn){
        next()
    }else{
        res.redirect('/login')
    }
}
const verifyMemberLogin=(req,res,next)=>{
    if(req.session.membeLoggedIn){
        next()
    }else{
        res.redirect('/team')
    }
}
router.get('/',(req,res)=>{
    var user=req.session.user
    res.render('index',{user})
})
router.get('/signup',(req,res)=>{
    let signupErr=req.session.userSignupErr
    res.render('user/signup',{signupErr})
})

router.get('/logout',(req,res)=>{
    req.session.user=null
    req.session.userloggedIn=false
    req.session.userLoginErr=false
    res.redirect('/')
})
router.post('/signup',(req,res)=>{
    userhelper.doSignup(req.body).then((response)=>{
        if(response.status)
        {
            console.log("new user added");
            res.redirect('/login')
        }
        else{
            console.log("error");
            req.session.userSignupErr=true
            res.redirect('/signup')
        }   
    })
})
router.get('/login',(req,res)=>{
    if(req.session.user){
        res.redirect('/')
    }else{
        let loginErr=req.session.userLoginErr
        res.render('user/login',{loginErr})
    }
    
})
router.post('/login',(req,res)=>{
    userhelper.doLogin(req.body).then((response)=>{
        if(response.status){
            req.session.userloggedIn=true
            req.session.user=response.user
            req.session.userLoginErr=false
            res.redirect('/')
        }else{
            req.session.userLoginErr=true
            res.redirect('/login')
        }
      })
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
router.post('/contact/addDetails',(req,res)=>{
    console.log(req.body);
    userhelper.addDetails(req.body,req.session.user._id).then((user)=>{
        res.redirect('/contact');
        sendMail({
            from:user.email,
            to:"adithyan2ms@gmail.com",
            subject:"Avenue Hospitality - New Request!",
            text:"",
            html:require('../services/emailTemplates/sendAdmin')({
                name:user.name,
                emailFrom:user.email,
                eventType:req.body.eventType,
                date:req.body.date,
                Adminlogin:`${process.env.APP_BASE_URL}`
            })
        })
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

router.get('/team',(req,res)=>{
    let memberLoginErr=req.session.memberLoginErr
    res.render('members/team',{memberLoginErr})
})
router.get('/team/member/memberLogout',(req,res)=>{
    req.session.member=null
    req.session.membeLoggedIn=false
    res.redirect('/team')
})
router.get('/chatwindow',(req,res)=>{
    res.render('members/chat')
})
router.post('/member/login',(req,res)=>{
    userhelper.doMemberLogin(req.body).then((response)=>{
        if(response.status){
            req.session.member=response.member
            req.session.membeLoggedIn=true
            req.session.memberLoginErr=false
            req.session.member_emailStatus=true
            req.session.member_passStatus=true
            res.redirect('/team/member')
            
        }else{
            req.session.memberLoginErr=true
            res.redirect('/team')
        }
    })
})
router.get('/team/member',verifyMemberLogin,(req,res)=>{
    let member=req.session.member
    let emailstatus = req.session.member_emailStatus
    let passstatus = req.session.member_passStatus
    userhelper.getMembersEvent(member).then((event)=>{
        res.render('members/member',{member,event,emailstatus,passstatus}) 
    })
})
router.post('/team/member/change-email/:id',(req,res)=>{
    userhelper.changeEmail(req.params.id,req.body.email).then((emailstatus)=>{
        if(emailstatus==true)
            console.log("email changed");
        else
            console.log("email unchanged");
        req.session.member_emailStatus=emailstatus
        res.redirect('/team/member')
    })
})
router.post('/team/member/change-password/:id',(req,res)=>{
    console.log(req.body);
    userhelper.changePassword(req.params.id,req.body).then((passstatus)=>{
        if(passstatus==true)
            console.log("password changed");
        else
            console.log("password unchanged");
        req.session.member_passStatus=passstatus
        res.redirect('/team/member')
    })
})
router.post('/team/member/change-image/:id',(req,res)=>{
    let image=req.files.image
    image.mv('./public/images/members/'+req.params.id+'.jpg',(err,done)=>{
        if(!err){
            console.log("image changed");
            res.redirect('/team/member')
        }else{
            console.log(err)
        }
    })
})


module.exports=router