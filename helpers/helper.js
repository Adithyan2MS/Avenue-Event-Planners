const userDetailModel = require("../models/userdetails")

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
    }
}