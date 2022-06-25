const eventDetailModel = require("../models/eventdetails")
const UserDetailModel = require("../models/userdetails")
const bcrypt=require('bcrypt')



module.exports={
    addDetails:(detail)=>{
        return new Promise(async(resolve,reject)=>{
            var EventModel = new eventDetailModel(detail)
            await EventModel.save((err,data)=>{
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
    }

}