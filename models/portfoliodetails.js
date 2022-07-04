const mongoose = require('mongoose')

const portfolioDetailSchema  = new mongoose.Schema({
    Category:{
        type:String,
        required:true
    },
    Description:{
        type:String,
        required:true
    }
})

const PortfolioDetailModel=mongoose.model("portfolio",portfolioDetailSchema)

module.exports = PortfolioDetailModel