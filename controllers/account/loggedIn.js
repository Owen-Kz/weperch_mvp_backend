const jwt = require("jsonwebtoken");
const { database } = require("../db");

const LoggedIn = async (req, res, next) => {
  // RestartConnection()
  if (!req.cookies.userRegistered) {
    // Redirect to home if user is not logged in
  
      return res.json({message: "notLoggedIn"})
  }else{
 
  try {
    // Decrypt the cookie and retrieve user data with the id
    const decoded = jwt.verify(req.cookies.userRegistered, process.env.JWT_SECRET);
    
    const userCollection = database.collection("user_data")
    const finduserData = await userCollection.find({buffer: `${decoded.id}`}).toArray()

    if(finduserData.length > 0){
        req.user = finduserData[0];
      next();

    }else{
        res.json({status:"Error", messsage:"userNotFound"})
    }



    // });

   

    // clearInterval(disconnectTimer);
  } catch (error) {
    console.log(error);
    res.json({error:error}); // Redirect to home on error
  }
  }
};

module.exports = LoggedIn;
