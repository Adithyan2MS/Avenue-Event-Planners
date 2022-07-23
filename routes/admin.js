const { response } = require('express')
const express = require('express')
const { redirect } = require('express/lib/response')
const { load } = require('nodemon/lib/config')
const router = express.Router()
require('dotenv').config();
const sendMail = require('../services/emailService')


var helper = require('../helpers/admin-helper') 

router.get('/',(req,res)=>{
    res.render('admin/login',{layout: 'layouts/adminLayout.ejs'})
})
router.post('/login',(req,res)=>{
    console.log(req.body.Email);
    helper.doLogin(req.body).then((response)=>{
        if(response.status){
            res.redirect('/admin/home')
        }else{
            console.log("invalid username or password");
            res.redirect('/admin')
        }
    })

})
router.get('/home',async(req,res)=>{
    
    await helper.getAllDetails().then((details)=>{
        res.render('admin/home',{layout: 'layouts/adminLayout.ejs',details})
    })
})
router.get('/signup',(req,res)=>{
    res.render('admin/signup',{layout: 'layouts/adminLayout.ejs'})
})
router.post('/signup',(req,res)=>{
    helper.doSignup(req.body).then((response)=>{
        if(response)
        {
            console.log("added");
            res.redirect('/admin')
        }
        else{
            console.log("error");
        }   
    })
})
router.get('/home/view-details/:userid/:eventid',async(req,res)=>{
        await helper.getEventDetails(req.params.userid,req.params.eventid).then(([members,detail])=>{

        res.render('admin/view-details',{layout: 'layouts/adminLayout.ejs',members,detail})
    })
})
router.get('/schedules',async(req,res)=>{
    await helper.getAcceptedDetail().then((datas)=>{
        res.render('admin/schedules',{layout: 'layouts/adminLayout.ejs',datas})
    })
    
})
router.post('/acceptdetail',(req,res)=>{
    console.log(req.body);
    helper.acceptDetail(req.body).then(()=>{
        helper.deleteEvent(req.body.id,req.body.eventid).then(()=>{
            res.redirect('/admin/home')
        })
        const emailFrom="adithyan2ms@gmail.com"
        sendMail({
            from:emailFrom,
            to:req.body.email,
            subject:"Avenue Hospitality - Event request Accepted",
            text:"",
            html:require('../services/emailTemplates/eventAccept')({
                name:req.body.name,
                emailFrom:emailFrom,
                eventType:req.body.eventType,
                date:req.body.date
            })
        })
    })
})
router.get('/home/addMember',(req,res)=>{
    res.render('admin/add-member',{layout: 'layouts/adminLayout.ejs'})
})
router.post('/addMember',(req,res)=>{
    const memberPassword=req.body.password
    helper.addMemberDetails(req.body).then((id)=>{
        let image=req.files.image
        image.mv('./public/images/members/'+id+'.jpg',(err,done)=>{
            if(!err){
                res.redirect('/admin/home/addMember')
                const emailTo=req.body.email
                const emailFrom="adithyan2ms@gmail.com"
                if(!emailTo){
                    return res.status(422).send({error:"All fields are required"})
                }
                    sendMail({
                        from:emailFrom,
                        to:emailTo,
                        subject:"Greetings from Avenue Hospitality",
                        text:"",
                        html:require('../services/emailTemplates/membercredentials')({
                            name:req.body.name,
                            emailFrom:emailFrom,
                            loginID:req.body.email,
                            loginPassword:memberPassword,
                            loginLINK:`${process.env.APP_BASE_URL}/team/member/login`
                        })
                    })
            }else{
                console.log(err);
            }
        })
    })
    console.log(req.body);
})
router.get('/home/scheduled-details/:id',(req,res)=>{
    console.log(req.params.id);
    helper.getScheduleDetail(req.params.id).then((details)=>{
        console.log("jni as"+details);
        res.render('admin/scheduled-details',{layout:'layouts/adminLayout.ejs',details})
    })
    
})
router.get('/home/add-portfolio',(req,res)=>{
    res.render('admin/add-portfolio')
})
router.post('/home/add-portfolio',(req,res)=>{
    console.log(req.body);
    console.log(req.files.Image);
    helper.addPortfolio(req.body).then((id)=>{
        let image=req.files.Image
        image.mv('./public/images/portfolio/'+id+'.jpg',(err,done)=>{
            if(!err){
                res.redirect('/admin/home/add-portfolio')
            }else{
                console.log(err)
            }
        })
        
    })
})
router.get('/home/view-details-reject/:dataId/:eventId',(req,res)=>{
    const emailFrom="adithyan2ms@gmail.com"
    helper.deleteEvent(req.params.dataId,req.params.eventId).then(([user,event])=>{
        res.redirect('/admin/home')
        sendMail({
            from:emailFrom,
            to:user.email,
            subject:"Avenue Hospitality - Event request rejected",
            text:"",
            html:require('../services/emailTemplates/eventReject')({
                name:user.name,
                emailFrom:emailFrom,
                eventType:event.eventType,
                date:event.date
            })
        })
    })

})
router.get('/home/schedule-details-delete/:id',(req,res)=>{
    helper.deleteSchedule(req.params.id).then((msg)=>{
        console.log(msg);
        res.redirect('/admin/schedules')
    })

})

module.exports = router