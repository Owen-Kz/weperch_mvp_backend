
const { decodeSession } = require("../account/decodeSession");
const { database } = require("../db");

const addToCart = async (req,res) =>{
    const cart = database.collection('cart')
    const userIp =  req.ip;

    const {itemId} = req.body
    const date = new Date()
    let userId 

    if(req.cookies.userRegistered){
    userId = await decodeSession(req.cookies.userRegistered)
    }else{
        userId = req.ip
    }

    // check if the Item already exist in the user's cart and increast the number  
       const findCartItems = await cart.find({product_id:itemId, user_id: userId}).toArray();
    
       if(findCartItems.length > 0){
        const increaseItemCount = await cart.updateOne(
            {product_id:itemId, user_id: userId},
            { $set: { quantity: new Number(findCartItems[0].quantity) + 1 } }
            )
            // Send Cart upate response  
            res.json({status:"success", message:"cartUpdated", cart_item_id: increaseItemCount.product_id, quantity:increaseItemCount.quantity, createdAt:  increaseItemCount.date})
       }else{

        const result = await cart.insertOne({product_id: itemId, user_id: userId, quantity: 1})
        if(result.insertedId){
            res.json({status:"success", message:"ItemAdded", cart_item_id: result.insertedId, quantity:result.quantity, createdAt:  date})

        }else{
            res.json({status:"error", message: "Internal Server Error"})
        }
       }
       
        

}

module.exports = addToCart