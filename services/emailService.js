const nodemailer = require('nodemailer')
async function sendMail({from,to,subject,text,html}){
    let transporter=nodemailer.createTransport({
        
        service:'SendinBlue',
        auth:{
            user:process.env.MAIL_USER,
            pass:process.env.MAIL_PASSWORD
        }
    });
    let info=await transporter.sendMail({
        from: `Avenue Event Management <${from}>`,
        to:to,
        subject:subject,
        text:text,
        html:html
    })
}
module.exports = sendMail;