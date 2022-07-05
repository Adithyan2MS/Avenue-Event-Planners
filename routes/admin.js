const { response } = require('express')
const express = require('express')
const { redirect } = require('express/lib/response')
const { load } = require('nodemon/lib/config')
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

        // console.log(details);
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
router.get('/home/view-details/:userid/:eventid',async(req,res)=>{
    // console.log(req.params.userid);
    // console.log(req.params.eventid)
    let members =await helper.getAllMembers()
        await helper.getEventDetails(req.params.userid,req.params.eventid).then((detail)=>{

        console.log(detail);
        res.render('admin/view-details',{layout: 'layouts/adminLayout.ejs',detail,members})
    })
})
router.get('/schedules',async(req,res)=>{
    await helper.getAcceptedDetail().then((datas)=>{
        // console.log("hhguguu");
        // console.log(datas);
        res.render('admin/schedules',{layout: 'layouts/adminLayout.ejs',datas})
    })
    
})
// router.get('/home/view-details/accept/:userid/:eventid',async(req,res)=>{
//     helper.acceptDetail(req.params.userid,req.params.eventid).then(()=>{
//         res.redirect('/admin/home')
//     })
   

// })
router.post('/acceptdetail',(req,res)=>{
    console.log("jbjb");
    console.log(req.body);
    helper.acceptDetail(req.body).then(()=>{
        res.redirect('/admin/home')
    })
})
router.get('/home/addMember',(req,res)=>{
    res.render('admin/add-member',{layout: 'layouts/adminLayout.ejs'})
})
router.post('/addMember',(req,res)=>{
    // console.log(req.files.image)
    helper.addMemberDetails(req.body).then((id)=>{
        let image=req.files.image
        image.mv('./public/images/members/'+id+'.jpg',(err,done)=>{
            if(!err){
                res.redirect('/admin/home/addMember')
            }else{
                console.log(err);
            }
        })
    })
    console.log(req.body);
})
router.get('/home/scheduled-details/:id',(req,res)=>{
    console.log(req.params.id);
    helper.getScheduleDetail(req.params.id).then((data)=>{
        // console.log("jni as"+data);
    })
    res.render('admin/scheduled-details',{layout:'layouts/adminLayout.ejs'})
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
                console.log(err);
            }
        })
        
    })
})

module.exports = router