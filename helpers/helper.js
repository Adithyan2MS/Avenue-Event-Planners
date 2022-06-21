const userDetailModel = require("../models/userdetails")
const AdminDetailModel = require("../models/admindetails")
const { response } = require("express")
const bcrypt = require('bcrypt')
var ObjectId=require('mongodb').ObjectID


module.exports={
    addDetails:(detail)=>{
        return new Promise(async(resolve,reject)=>{
            var DetailModel = new userDetailModel(detail)
            await DetailModel.save((err,data)=>{
                if(err){
                    console.error(err);
                }
                else{
                    console.log("data added");
                    resolve(data)
                }
            })
        })
    },
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
                            console.log("login failed");
                            resolve({status:false})
                        }
                    })
                }else{
                    console.log("login failed");
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
                    // response=true
                    // resolve(response)
                }
            })
        })
    },
    getAllDetails:()=>{
        return new Promise(async(resolve,reject)=>{
            let details= await userDetailModel.find()
            resolve(details)
        })
    },
    getUserDetails:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            await userDetailModel.findOne({_id:ObjectId(userId)}).then((detail)=>{
                resolve(detail)
            })
        })
    }
}