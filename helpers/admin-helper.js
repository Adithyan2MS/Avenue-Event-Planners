const eventDetailModel = require("../models/eventdetails")
const AdminDetailModel = require("../models/admindetails")
const AcceptedEventModel = require("../models/acceptedEvent")
const UserDetailModel = require("../models/userdetails")
const MemberDetailModel = require("../models/memberdetails")
const PortfolioDetailModel = require("../models/portfoliodetails")
const ChatDataModel = require("../models/chatdata")




const { response } = require("express")
const bcrypt = require('bcrypt')
const { vary } = require("express/lib/response")
const { reject } = require("bcrypt/promises")
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

            let data =await eventDetailModel.aggregate([
                {
                    $lookup:{
                        from:UserDetailModel.collection.collectionName,
                        let:{
                            searchId:"$user"
                        },
                        pipeline:[
                            {
                                $match:{
                                    $expr:{
                                        $eq:['$_id',"$$searchId"]
                                    }
                                }
                            },
                            {
                                $project:{
                                    name:1,
                                    email:1
                                }
                            }
                        ],
                        as:'userdetail'
                    }
                },
                {
                    $unwind:"$user"
                },
                {  
                $project: {
                    _id:1,
                    eventdetail:1,
                    userdetail:1
                }
                }
            ]).then((data)=>{
                resolve(data)
            })
        })
    },
    getEventDetails:(userId,eventId)=>{
        return new Promise(async(resolve,reject)=>{
            let user = await UserDetailModel.findOne({_id:ObjectId(userId)})
            let detail = await eventDetailModel.aggregate([
                {
                    "$match":{"user":ObjectId(userId)}
                },
                {
                    "$unwind":"$eventdetail"
                },
                {
                    "$match":{"eventdetail._id":ObjectId(eventId)}
                },
                {
                    $project:{
                        _id:1,
                        userid:userId,
                        eventid:ObjectId(eventId),
                        name:user.name,
                        email:user.email,
                        phoneNumber:"$eventdetail.phoneNumber",
                        howHearAboutUs:"$eventdetail.howHearAboutUs",
                        eventType:"$eventdetail.eventType",
                        date:"$eventdetail.date",
                        guestCount:"$eventdetail.guestCount",
                        additionalNotes:"$eventdetail.additionalNotes",
                    }
                }
            ]).then(async(detail)=>{
                let data= await AcceptedEventModel.find({date:detail[0].date})
                if(data){
                    let arr=[]
                    let j=0
                    for(let i = 0;i<data.length;i++)
                    {
                        for(let k = 0;k<data[i].members.length;k++){
                            arr[j]=data[i].members[k]
                            j++
                        }
                    }
                    let members= await MemberDetailModel.find({_id:{$nin:arr}})
                    resolve([members,detail[0]])
                }
                else{
                    let members= await MemberDetailModel.find()
                    resolve([members,detail[0]])
                }
            })
        })
    },
    getAllMembers:()=>{
        return new Promise(async(resolve,reject)=>{
            let members= await MemberDetailModel.find()
            resolve(members)
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
                    resolve(data)
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
                    resolve(data._id.toString())
                }
            })
        })
    },
    getScheduleDetail:(dataId)=>{
        return new Promise(async(resolve,reject)=>{
            let data = await AcceptedEventModel.findOne({_id:ObjectId(dataId)})
            // console.log("jbd"+data);
            let details = await AcceptedEventModel.aggregate([
                {
                    $match:{_id:ObjectId(dataId)}
                },
                {
                    $lookup:{
                        from:MemberDetailModel.collection.collectionName,
                        let:{
                            memberList:'$members'
                        },
                        pipeline:[
                            {
                                $match:{
                                    $expr:{
                                        $in:['$_id',"$$memberList"]
                                    }
                                }
                            }
                        ],
                        as:'memberDetails'
                    }
                }
            ])
            resolve(details[0])
            console.log(details[0]);
        })
    },
    addPortfolio:(data)=>{
        return new Promise(async(resolve,reject)=>{
            var PortfolioModel =  PortfolioDetailModel(data)
            await PortfolioModel.save((err,data)=>{
                if(err){
                    console.error(err);
                }
                else{
                    // console.log("data added");
                    resolve(data._id.toString())
                    console.log(data._id.toString());
                    // response=true
                    // resolve(response)
                }
            })
        })
    },
    deleteEvent:(dataId,eventId)=>{
        return new Promise(async(resolve,reject)=>{
            let data = await eventDetailModel.findOne({_id:ObjectId(dataId)})
            let userId = data.user
            const event = await eventDetailModel.findOne({_id:ObjectId(dataId)}).select({eventdetail:{$elemMatch:{_id:ObjectId(eventId)}}})
            let user= await UserDetailModel.findOne({_id:ObjectId(userId)})
            
            eventDetailModel.findOneAndUpdate(
                { _id: ObjectId(dataId) },
                { $pull: { eventdetail: { _id:ObjectId(eventId)  } } },
                { new: true }
            ).then(()=>{
                    resolve([user,event.eventdetail[0]])
            })
            .catch(err => console.log(err));
        })
    },
    deleteSchedule:(id)=>{
        return new Promise((resolve,reject)=>{
            let msg;
            AcceptedEventModel.deleteOne({_id:ObjectId(id)}).then(()=>{
                ChatDataModel.deleteOne({roomId:id}).then(()=>{
                    console.log("chat deleted..");
                })
                msg="deleted"
                resolve(msg)
            })
        })
    }
}