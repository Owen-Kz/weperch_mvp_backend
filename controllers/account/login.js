const { database } = require("../db");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");

const login_user = async(req,res)=>{
    const {user, password} = req.body

    const collection = database.collection("user_data")
    // Find the user in the data collection 
    const userInfo = await collection.find({
        $or: [
            { email: user },
            { username: user }
        ]
    }).toArray();

    // if the user is found validate the password 
    if(userInfo.length > 0){
        if(!await bcrypt.compare(password, userInfo[0].password )){
        res.json({status:"errror", message:"InvalidUsername/Password", user_id: "null"})
        }else{
            const verification_status = userInfo[0].verification_status;

            if(verification_status === "email_verified" || verification_status === "sms_verified" || verification_status === "verified"){
                // Create a New Session 
                const token = jwt.sign({id: userInfo[0]._id}, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES
                    // httpOnly: true
                })
                // create cookie expiry date  
                const cookieOptions = {
                    expiresIn: new Date(Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                    httpOnly: true
                }
                // save cookies
                await res.cookie("userRegistered", token, cookieOptions)

          

                if(token){
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                // const decoded = jwt.verify(req.cookies.userRegistered, process.env.JWT_SECRET);

                await collection.updateOne(
                    {_id:userInfo[0]._id},
                    {$set:{buffer: decoded.id}}
                )

                // send Response 
                res.json({status:"success", message:"userLoggedIn", user_id: userInfo[0]._id})
                }else{
                    res.json({message:"cookieNotSet"})
                }
                }else{
                 res.json({status:"errror", message:"accountNotVerified", user_id: "null"})

                }
            }
           
    }else{
        res.json({status:"error", message:"User not Found"})
    }
}


module.exports = login_user