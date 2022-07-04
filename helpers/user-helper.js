const eventDetailModel = require("../models/eventdetails")
const UserDetailModel = require("../models/userdetails")
const bcrypt=require('bcrypt')
const EventDetailModel = require("../models/eventdetails")
const MemberDetailModel = require("../models/memberdetails")
const PortfolioDetailModel = require("../models/portfoliodetails")
var ObjectId=require('mongodb').ObjectID



module.exports={
    addDetails:(detail,userId)=>{
        return new Promise(async(resolve,reject)=>{
            let details = await eventDetailModel.findOne({user:ObjectId(userId)})
            if(details){
                await EventDetailModel
                .updateOne({user:ObjectId(userId)},
                {
                    $push:{eventdetail:detail}
                }
                ).then((response)=>{
                    resolve()
                })
            }else
            {
                let user = await UserDetailModel.findOne({_id:ObjectId(userId)})
                let eventObj={
                    id:ObjectId(user.id),
                    name:user.name,
                    email:user.email,
                    eventdetail:[detail]
                }
                var EventModel = new eventDetailModel(eventObj)
                await EventModel.save((err,data)=>{
                    if(err){
                        console.error(err);
                    }
                    else{
                        console.log("data added");
                        resolve()
                    }
                })   
            }
        })
    },
    doSignup:(data)=>{
        return new Promise(async(resolve,reject)=>{
            data.password=await bcrypt.hash(data.password,10)
            var UserModel =  UserDetailModel(data)
            await UserModel.save((err,data)=>{
                if(err){
                    console.error(err);
                }
                else{
                    // console.log("data added");
                    resolve(data)
                    // response=true
                    // resolve(response)
                }
            })
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
    }
}