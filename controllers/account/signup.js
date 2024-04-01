const { client, connectToDatabase } = require("../../routes/dbConfig");
const bcrypt = require("bcryptjs")
const validator = require("validator");
const { database } = require("../db");
const verifyIdentity = require("./verify");

const register_user = async (req, res)=>{
    const {username, firstname, lastname, email, country, state, city, password, phonenumber } = req.body
    const userDataCollection = database.collection("user_data")

    // Check if the user already exists 
    const validateforUsername =  await userDataCollection.find({username: username}).toArray()
    const validateForEmail = await userDataCollection.find({email:email}).toArray()
    if(validateforUsername.length > 0 || validateForEmail.length > 0){
        res.json({status:"error", message: "userExists", error: "A User with this email / username already exists"})

        // Validate user Email 
    }else if(!validator.isEmail(email)) {
         res.json({ status: "error", error: "Please provide a valid email" });
        }else{
        // Create Variable to hold data / document
        const Npassword = await bcrypt.hash(password, 8)
        const date = new Date()

        const document = {username: username, first_name: firstname, last_name: lastname, email: email, country: country, state:state, city: city, password: Npassword, createdAt: date, updatedAt: date, phonenumber: phonenumber}

        const result = await userDataCollection.insertOne(document)
        let userIdentifier
        let type

        if(email || email != "null"){
         userIdentifier = email
         type = 'email_verify'
        }else{
            userIdentifier = phonenumber
            type = 'number_verify'
        }

        if(result.insertedId){
            const fullname = `${firstname} ${lastname}`
            await verifyIdentity(userIdentifier, fullname, type)
            res.json({status:"success", message: 'inserted', user_id: result.insertedId})
        }else{
            res.json({status:"error", message: "Internal Server Error"})
        }
        }
       
    
  
}


module.exports =  register_user