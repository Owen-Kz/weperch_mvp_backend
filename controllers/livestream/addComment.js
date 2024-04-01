const { database } = require("../db");
const generateRandomCode = require("../utils/generateCode");
const generateRandomString = require("../utils/generateStrings.");

const addComment = async (req,res) =>{
    const user = req.user
    const user_fullname = `${req.user.first_name} ${req.user.last_name}`
    const username = `${req.user.username}`
    const buffer = `${req.user.buffer}`
    const profilePicture = `${req.user.profile_picture}`

    const {videoId, comment_text} = req.body 
    const commentID = `cmt_${await generateRandomString(5)}${videoId}${await generateRandomCode()}`

    const product  = database.collection("products")
    const productList = await product.find({product_id: videoId}).toArray()

    if(productList.length > 0){
        const collection = database.collection("comments")
        const document  = {comment_text:comment_text, comment_fullname:user_fullname, comment_username:username, comment_id:commentID, product_id:videoId}
    
        const newData = await collection.insertOne(document)
    
        if(newData.insertedId){
            res.json({status:"success", message:"commentAdded"})
        }else{
            res.json({status:"error", message:"couldNotAddComment"})
        }
    }else{
        res.json({status:"error", message:"productNotFound"})
    }

  
}


module.exports = addComment