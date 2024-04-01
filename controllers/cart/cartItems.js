const { decodeSession } = require("../account/decodeSession");
const { database } = require("../db");

const cartItems  = async(req,res)=>{
    const cart = database.collection('cart')
    let userId

    if(req.cookies.userRegistered){
        userId = await decodeSession(req.cookies.userRegistered)
    }else{
        userId = req.ip
    }

    const result = await cart.find({user_id: userId}).toArray()

    // Stingify and csent the list of cart Items to the front end 
    if(result.length > 0){            
        res.json({status:"success", message:"cartNotEmpty", cart_items: JSON.stringify(result)})

    }else{
        res.json({status:"error", message: "cartEmpty", cart_items: "[]"})
    }
        
 
}

module.exports = cartItems