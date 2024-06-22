const jwt = require('jsonwebtoken')
const User = require('../Modal/user.schema')


const auth =  (req, res, next) => {
    try {
        if (req.headers.authorization) {
            jwt.verify(req.headers.authorization, "ABCD123", async function (err, decode) {
                if(err){
                    return res.json({status:0,message:"invalid token"})
                }
                const checkUser = await User.findOne({ Email: decode.Email })
                if (!checkUser) {
                    return res.json("invalid user/Token")
                }
                req.User = decode
                next()
            })
            

        }
        else {
            res.json({ status: "00", message: "unAuthorized" })
        }
    } catch (error) {
        console.log('auth.js', error)
    }
}

module.exports = auth