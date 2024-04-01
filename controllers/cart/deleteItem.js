const { database } = require("../db");

const deleteItemFromCart = async (req,res) =>{
    const cartCollection = database.collection("cart")
    let userId 
    if(req.cookies.userRegistered){
        userId = await decodeSession(req.cookies.userRegistered)
        }else{
            userId = req.ip
    }
    const {itemId} = req.body

    const findItem = await cartCollection.find({product_id: itemId, user_id: userId}).toArray()

    if(findItem.length > 0){
        const DelteCartItem = await cartCollection.deleteMany({product_id: itemId, user_id: userId})
        res.json({status: "success", message:"ItemDeletedFromCart"})
    }else{
        res.json({status:"error", message:"itemNotFound"})
    }
}

module.exports = deleteItemFromCart