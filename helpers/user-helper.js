const eventDetailModel = require("../models/eventdetails")
const UserDetailModel = require("../models/userdetails")
const bcrypt=require('bcrypt')
const EventDetailModel = require("../models/eventdetails")
const MemberDetailModel = require("../models/memberdetails")
const PortfolioDetailModel = require("../models/portfoliodetails")
const { reject } = require("bcrypt/promises")
const AcceptedEventModel = require("../models/acceptedEvent")
var ObjectId=require('mongodb').ObjectID



module.exports={
    addDetails:(detail,userId)=>{
        return new Promise(async(resolve,reject)=>{
            let user = await UserDetailModel.findOne({_id:ObjectId(userId)})
            let details = await eventDetailModel.findOne({user:ObjectId(userId)})
            if(details){
                await EventDetailModel
                .updateOne({user:ObjectId(userId)},
                {
                    $push:{eventdetail:detail}
                }
                ).then((response)=>{
                    resolve(user)
                })
            }else
            {
                let user = await UserDetailModel.findOne({_id:ObjectId(userId)})
                let eventObj={
                    user:user.id,
                    eventdetail:[detail]
                }
                var EventModel = new eventDetailModel(eventObj)
                await EventModel.save((err,data)=>{
                    if(err){
                        console.error(err);
                    }
                    else{
                        console.log("data added");
                        resolve(user)
                    }
                })   
            }
        })
    },
    doSignup:(data)=>{
        return new Promise(async(resolve,reject)=>{
            let emailexist = await UserDetailModel.findOne({email:data.email})
            console.log(emailexist);
            let response={}
            if(!emailexist){
                data.password=await bcrypt.hash(data.password,10)
                var UserModel =  UserDetailModel(data)
                await UserModel.save((err,data)=>{
                    if(err){
                        response.status=false
                        resolve(response)
                        console.error(err);
                    }
                    else{
                        response.status=true
                        resolve(response)
                        
                    }
                })
            }else{
                response.status=false
                resolve(response)
            }
        })
    },
    doLogin:(data)=>{
        return new Promise(async(resolve,reject)=>{
            let response={}
            let user = await UserDetailModel.findOne({email:data.Email})
            console.log(user);
                if(user){
                    bcrypt.compare(data.Password,user.password).then((status)=>{
                        if(status){
                            console.log("login sucess");
                            response.user=user
                            response.status=true
                            resolve(response)
                        }
                        else{
                            console.log("login failed 1");
                            resolve({status:false})
                        }
                    })
                }else{
                    console.log("login failed 2");
                    resolve({status:false})
    
                }
            })
    },
    doMemberLogin:(data)=>{
        return new Promise(async(resolve,reject)=>{
            let response={}
            let member = await MemberDetailModel.findOne({email:data.email})
            // console.log(member);
                if(member){
                    bcrypt.compare(data.password,member.password).then((status)=>{
                        if(status){
                            console.log("member login sucess");
                            response.member=member
                            response.status=true
                            resolve(response)
                        }
                        else{
                            console.log("login failed 1");
                            resolve({status:false})
                        }
                    })
                }else{
                    console.log("login failed 2");
                    resolve({status:false})
    
                }
        })
    },
    getPortfolio:()=>{
        return new Promise(async(resolve,reject)=>{
            let portfolios= await PortfolioDetailModel.find()
            resolve(portfolios)
        })
    },
    getMembersEvent:(member)=>{
        return new Promise(async(resolve,reject)=>{
            let event = await AcceptedEventModel.find({members:ObjectId(member._id)})
            resolve(event)
        })
    },
    getUsersAcceptedEvent:(user)=>{
        return new Promise(async(resolve,reject)=>{
            let event = await AcceptedEventModel.find({userid:ObjectId(user._id)})
            resolve(event)
        })
    },
    getMember:(memId)=>{
        return new Promise(async(resolve,reject)=>{
            await MemberDetailModel.findOne({_id:memId}).then((member)=>{
                resolve(member)
                // console.log(member)
            })
        })
    },
    changeEmail:(memId,newEmail)=>{
        return new Promise(async(resolve,reject)=>{
            let emailexist=false;
            let status;
            let data =await MemberDetailModel.findOne({email:newEmail})
            if(data)
                emailexist=true
            if(emailexist==false)
            {
                await MemberDetailModel.updateOne(
                    {_id:memId},
                    {
                        $set:
                        {
                            email:newEmail
                        }
                    }
                ).then(()=>{
                    status=true
                    resolve(status)
                })
            }else
            {
                status=false
                resolve(status)
            }
        })
    },
    changePassword:(memId,passData)=>{
        return new Promise(async(resolve,reject)=>{
            let status=false
            if(passData.password1==passData.password2&&passData.password1!="")
            {
                passData.password1=await bcrypt.hash(passData.password1,10)
                await MemberDetailModel.updateOne(
                    {_id:memId},
                    {
                        $set:
                        {
                            password:passData.password1
                        }
                    }
                ).then(()=>{
                    status=true
                    resolve(status)
                })
            }else{
                status=false
                resolve(status)
            }
        })
    }
}