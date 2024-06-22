
const User = require('../Modal/user.schema')
const bcrypt = require('bcryptjs')
const jwt=require('jsonwebtoken')
const Tosend = require('../mail/Sendmail')

const signUp = async (req, res) => {
   try {
      const { username, Email, password, mobile} = req.body
      const checkEmail=await User.findOne({Email:Email})
      if(checkEmail){
         return res.json({status:0,message:"email already taken"})
      }
      let hashpassword = await bcrypt.hash(password, 10)
      let data = {
         username,
         Email,
         password: hashpassword,
         mobile,
      
      }
      const saveUser = await User.create(data)
      if (!saveUser) {
         return res.json({ status: 0, message: "user not created" })
      }
      res.json({ status: 1, message: "user created successfully" })
   } catch (error) {
      console.log("user.controller.js/signUp-->error", error)
   }
}
const login = async (req, res) => {
   try {
      const { Email, password } = req.body
      if (!Email ) {
         return res.json({ status: 0, message: "Email requried" })
      }
      const checkUser = await User.findOne({ Email: Email })
      if (!checkUser) {
         return res.json({ status: 0, message: "user not found" })
      }
      const ComparePassword = await bcrypt.compare(password, checkUser.password)
      if (!ComparePassword) {
         return res.json({ status: 0, message: "Invalid Password" })
      }
      let token=jwt.sign({userId:checkUser._id,username:checkUser.username,Email:checkUser.Email},"ABCD123",{expiresIn:'1hr'})
      res.json({ status: 1, message: "login successfully",token:token ,user:checkUser})
   } catch (error) {
      console.log("user.controller.js/login-->error", error)
   }
}

const forgotpassword = async (req, res) => {
   try {
      const { Email } = req.body
      if (!Email) {
         return res.json({ status: 0, message: "Email requried" })
      }
      const checkuser = await User.findOne({ Email: Email })
      if (!checkuser) {
         return res.json({ status: 0, message: "no user found" })
      }
      let otp = Math.floor(1000 + Math.random() * 9000)
      let otpTimeStamp = Date.now() + 300000
      const updateuser = await User.updateOne({ _id: checkuser._id }, { otp: otp, otpTimeStamp: otpTimeStamp })
      if (!updateuser) {
         return res.json({ status: 0, message: " OTP could not be send your email" })
      }
      let subject=`your one time password is ${otp}`
      let content=`Dear ${checkuser.username} ,your one time password is ${otp} It is valid for 5mins`
      Tosend(checkuser.Email,subject,content)
      res.json({ status: 1, message: `OTP send your email ${otp} ` })
   } catch (error) {
      console.log("user.controller.js/forgotpassword-->error", error)
   }
}

const verifyOtp = async (req, res) => {
   try {
      const { Email, otp } = req.body
      if (!Email) {
         return res.json({ status: 0, message: "Email requried" })
      }
      const checkuser = await User.findOne({ Email: Email })
      if (!checkuser) {
         return res.json({ status: 0, message: "no user found" })
      }
      if (Date.now() < checkuser.otpTimeStamp) {
         if (Number(otp) === checkuser.otp) {
            const updateuser = await User.updateOne({ _id: checkuser._id }, { isOtpverified: true })
            if (!updateuser) {
               return res.json({ status: 0, message: "OTP is not verified" })
            }
            return res.json({ status: 1, message: "OTP is verified" })
         }
         else {
            return res.json({ status: 0, message: "OTP is not matched" })
         }
      }
      else {
         return res.json({ status: 2, message: "OTP Expired" })
      }
   } catch (error) {
      console.log("user.controller.js/verifyOtp-->error", error)
   }
}

const resetPassword = async(req, res) => {
   try {
      const { Email, NewPassword, ConfirmPassword } = req.body
      if (!Email) {
         return res.json({ status: 0, message: "Email requried" })
      }
      const checkuser = await User.findOne({ Email: Email })
      if (!checkuser) {
         return res.json({ status: 0, message: "no user found" })
      }
      if (checkuser.isOtpverified) {
         if(NewPassword===ConfirmPassword){
            let hashPassword = await bcrypt.hash(NewPassword ,10)
            const updateuser = await User.updateOne({_id:checkuser._id},{password:hashPassword,isOtpverified:false})
            if (!updateuser) {
               return res.json({ status: 0, message: "new password not updated" })
            }
            return res.json({ status: 1, message: "password update sucuessfully" })
         }
         else {
            return res.json({ status: 0, message: "password doesn't match" })
         }
      }
      else {
         return res.json({ status: 0, message: "OTP verification requried" })
      }

   } catch (error) {
      console.log("user.controller.js/resetPassword-->error", error)
   }
}

const allUser = async (req, res) => {
   try {
      const user = await User.find()
      if (!user) {
         return res.json({ status: 0, message: "user not found" })
      }
      res.json({ status: 1, response: user })
   } catch (error) {
      console.log("user.controller.js/allUser-->error", error)
   }
}

const getsingleUser = async (req, res) => {
   try {
      const { id } = req.params
      if (!id) {
         return res.json({ status: 0, message: "user id requried" })
      }
      const user = await User.findById(id)
      if (!user) {
         return res.json({ status: 0, message: "user not found" })
      }
      res.json({ status: 1, response: user })
   } catch (error) {
      console.log("user.controller.js/getsingleUser-->error", error)
   }
}

const getoneUser = async (req, res) => {
   try {
      const { id } = req.body
      if (!id) {
         return res.json({ status: 0, message: "user id requried" })
      }
      const user = await User.findById(id)
      if (!user) {
         return res.json({ status: 0, message: "user not found" })
      }
      res.json({ status: 1, response: user })
   } catch (error) {
      console.log("user.controller.js/getoneUser-->error", error)
   }
}

const DeleteUser = async (req, res) => {
   try {
      const { id } = req.params
      if (!id) {
         return res.json({ status: 0, message: "user id requried" })
      }
      const user = await User.findByIdAndDelete(id)
      console.log("user", user)
      if (!user) {
         return res.json({ status: 0, message: "user not deleted" })
      }
      res.json({ status: 1, message: "deleted successfully" })
   } catch (error) {
      console.log("user.controller.js/DeleteUser-->error", error)
   }
}

const editUser = async (req, res) => {
   try {
      const { id } = req.params
      if (!id) {
         return res.json({ status: 0, message: "user id requried" })
      }
      const user = await User.findByIdAndUpdate(id, req.body)

      if (!user) {
         return res.json({ status: 0, message: "user not updated" })
      }
      res.json({ status: 1, message: "updated successfully" })
   } catch (error) {
      console.log("user.controller.js/editUser-->error", error)
   }
}
const UpdateallUser = async (req, res) => {
   try {
      const { role } = req.body
      if (!role) {
         return res.json({ status: 0, message: "no roles" })
      }
      const updateMany = await User.updateMany({}, { role: role })
      console.log(updateMany)
      if (!updateMany.acknowleged || !updateMany) {
         return res.json({ status: 0, message: "user not updated" })
      }
      return res.json({ status: 1, message: "updated successfully" })
   } catch (error) {
      console.log("user.controller.js/UpdateallUser-->error", error)
   }
}


module.exports = { signUp, allUser, getsingleUser, getoneUser, DeleteUser, editUser, UpdateallUser, login, forgotpassword, verifyOtp, resetPassword }