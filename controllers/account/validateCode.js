const { database } = require("../db");

const verifyUser = async (req,res) =>{
    const {email, verification_code} = req.body

    const userCollection = database.collection('user_data')
    const user = await userCollection.find({
        $or: [
            { email: email },
            { phonenumber: email }
        ]
    }).toArray();


    if(user[0].verification_token && user[0].verification_token > 0){
        if(user[0].verification_token == verification_code){
            const updateAccountStatus = await userCollection.updateOne(
                {$or: [
                        { email: email },
                        { phonenumber: email }
                ]},
                {$set:{verification_status: 'verified'}}
            )
    
            if(updateAccountStatus.modifiedCount > 0){
                res.json({status:"success", message: "accountVerified"})
            }else{
            res.json({status:"error", message: "invalidVerificationCode"})
            }
        }else{
            res.json({status:"error", message: "invalidVerificationCode"})
        }
    }else{
        res.json({status:"error", message: "invalidVerificationCode"})
    }
    
}

module.exports = verifyUser