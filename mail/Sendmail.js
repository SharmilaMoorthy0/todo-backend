const nodemailer=require('nodemailer')


const Tosend= async(Email,subject,content)=>{
    try {
         let transport=nodemailer.createTransport({
            host: "smtp.gmail.com",
            service:"gmail.com",
            port:587,
            secure:true,
            auth:{
                user:"testmailnoreply989@gmail.com",
                pass:"xglmptwkgrolrpzm"
            },

         })

         transport.sendMail({
            from:"testmailnoreply989@gmail.com",
            to:Email,
            subject:subject,
            text:content
         }).then((result)=>{
            console.log("mail send successfully",result)
         })
    } catch (error) {
        console.log("sendmail.js----->",error)
    }
}
module.exports=Tosend