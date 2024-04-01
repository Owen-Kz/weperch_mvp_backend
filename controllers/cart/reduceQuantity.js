const { database } = require("../db");

const reduceQuantity = async (req,res) =>{
    const cartCollection = database.collection('cart')
  
    const {itemId} = req.body 
    let userId 
    if(req.cookies.userRegistered){
        userId = await decodeSession(req.cookies.userRegistered)
        }else{
            userId = req.ip
    }

    const findItem = await cartCollection.find({product_id:itemId, user_id:userId}).toArray()
    if(findItem.length > 0) {
        const newQuantity = new Number(findItem[0].quantity) + 1;

        if(newQuantity > 0){
            const updateCart = await cartCollection.updateOne(
                {product_id: itemId, user_id: userId},
                {$set: {quantity: new Number(findItem[0].quantity) - 1}}
            )
        }else{
            const DelteCartItem = await cartCollection.deleteMany({product_id: itemId, user_id: userId})
        }
       
        res.json({status:"success", message:"cartUpdated"})
    }else{
        res.json({status:"error", message:"CouldNotUpdateCart"})

    }
}

module.exports = reduceQuantity