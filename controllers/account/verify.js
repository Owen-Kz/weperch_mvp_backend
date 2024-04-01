const { database } = require("../db");
const SendEmail = require("../utils/SendEmail");
const generateRandomCode = require("../utils/generateCode");

const verifyIdentity = async (recipient, fullname, verify_type) =>{
    const VerificationCode = await generateRandomCode()
    const message = `<p>Your Authentication Code is:</p><h2>${VerificationCode}</h2>`
    const subject  = `Weperch Authentication Code ${VerificationCode}`

    const userCollection = database.collection("user_data")
    const updateCount = await userCollection.updateOne({
        $or: [
            { email: recipient },
            { phonenumber: recipient }
        ]},
        {$set:{verification_token: VerificationCode}}
        )
    if(updateCount.modifiedCount > 0){
        if(verify_type === "email_verify"){
            SendEmail(recipient, fullname, subject, message)
            console.log("verificationCodeSent")
        }
    }

}

module.exports = verifyIdentity