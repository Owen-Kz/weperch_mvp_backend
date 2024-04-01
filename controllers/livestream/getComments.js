const { database } = require("../db");

const getComments = async (req,res) =>{
    const productCollection = database.collection("products")
    const {product_id} = req.query
    const getProduct = await productCollection.find({product_id:product_id}).toArray()
    if(getProduct.length > 0){
        const comments  = database.collection("comments")
        const commentsList = await comments.find({product_id: product_id}).toArray()
        if(commentsList.length > 0){
            res.json({status:"success", message:"commentsFound", comments:commentsList})
        }else{
            res.json({status:"error", message:"noCommentsAvailable"})
        }
    }else{
        res.json({status:"error", message:"productNotFound"})
    }
}

module.exports = getComments