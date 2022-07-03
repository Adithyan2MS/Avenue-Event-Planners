const eventDetailModel = require("../models/eventdetails")
const AdminDetailModel = require("../models/admindetails")
const AcceptedEventModel = require("../models/acceptedEvent")
const UserDetailModel = require("../models/userdetails")
const MemberDetailModel = require("../models/memberdetails")


const { response } = require("express")
const bcrypt = require('bcrypt')
const { vary } = require("express/lib/response")
var ObjectId=require('mongodb').ObjectID


module.exports={
    doLogin:(data)=>{
        return new Promise(async(resolve,reject)=>{
            let response={}
            let user = await AdminDetailModel.findOne({email:data.Email})
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
                            console.log("login failed 3");
                            resolve({status:false})
                        }
                    })
                }else{
                    console.log("login failed 4");
                    resolve({status:false})
    
                }
            })
    },
    doSignup:(data)=>{
        return new Promise(async(resolve,reject)=>{
            data.password=await bcrypt.hash(data.password,10)
            var AdminModel =  AdminDetailModel(data)
            await AdminModel.save((err,data)=>{
                if(err){
                    console.error(err);
                }
                else{
                    // console.log("data added");
                    resolve(data)
                    console.log("gdcutffyh");
                    console.log(data);
                    // response=true
                    // resolve(response)
                }
            })
        })
    },
    getAllDetails:()=>{
        return new Promise(async(resolve,reject)=>{
            let details= await eventDetailModel.find()
            resolve(details)
        })
    },
    getEventDetails:(userId,eventId)=>{
        return new Promise(async(resolve,reject)=>{
            let user = await UserDetailModel.findOne({_id:ObjectId(userId)})
            let detail = await eventDetailModel.aggregate([
                {
                    "$match":{"user":userId}
                },
                {
                    "$unwind":"$eventdetail"
                },
                {
                    "$match":{"eventdetail._id":ObjectId(eventId)}
                },
                {
                    $project:{
                        _id:0,
                        userid:userId,
                        eventid:ObjectId(eventId),
                        name:user.name,
                        email:user.email,
                        phoneNumber:"$eventdetail.phoneNumber",
                        howHearAboutUs:"$eventdetail.howHearAboutUs",
                        eventType:"$eventdetail.eventType",
                        date:"$eventdetail.date",
                        guestCount:"$eventdetail.guestCount",
                        additionalNotes:"$eventdetail.additionalNotes"
                    }
                }
            ]).then((detail)=>{
                resolve(detail[0])
            })
        })
    },
    acceptDetail:(data)=>{
        return new Promise(async(resolve,reject)=>{
            var AcceptModel =  AcceptedEventModel(data)
            await AcceptModel.save((err,data)=>{
                if(err){
                    console.error(err);
                }
                else{
                    // console.log("data added");
                    resolve(data)
                    // eventDetailModel.update(
                    //     { '_id': ObjectId("5150a1199fac0e6910000002") }, 
                    //     { $pull: { items: { id: 23 } } },
                    //     false, // Upsert
                    //     true, // Multi
                    // );
                    // response=true
                    // resolve(response)
                }
            })     

            
        })
    },
    getAcceptedDetail:()=>{
        return new Promise(async(resolve,reject)=>{
            let data= await AcceptedEventModel.find()
            resolve(data)
        })
    },
    addMemberDetails:(data)=>{
        return new Promise(async(resolve,reject)=>{
            data.password=await bcrypt.hash(data.password,10)
            var MemberDetail = new MemberDetailModel(data)
            await MemberDetail.save((err,data)=>{
                if(err){
                    console.error(err);
                }else{
                    resolve(data)
                }
            })
        })
    }
}