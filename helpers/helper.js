const userDetailModel = require("../models/userdetails")
const AdminDetailModel = require("../models/admindetails")
const { response } = require("express")

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
        return new Promise((resolve,reject)=>{
            let response = false
            AdminDetailModel.findOne({email:data.Email}).then((response)=>{
                response = true
                resolve(response)
            })
            
            // if(user)
            // {
            //     user.findOne({password:data.Password}).then((status)=>{
            //         if(status){
            //             console.log("login success");
            //             response=true
            //             resolve(response)
            //         }
            //         else
            //         {
            //             console.log("can't login");
            //             response=false
            //         }
            //     })
            // }
            // else{
            //     console.log("can't login");
            //     response=false
            // }
        })
    },
    doSignup:(data)=>{
        return new Promise(async(resolve,reject)=>{
            var AdminModel =  AdminDetailModel(data)
            await AdminModel.save((err,data)=>{
                if(err){
                    console.error(err);
                }
                else{
                    console.log("data added");
                    response=true
                    resolve(response)
                }
            })
        })
    }
}