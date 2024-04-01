const { database } = require("../db");

const deleteComment = async (req,res) =>{
    const {comment_id} = req.body
    const username = req.user.username
    const comments = database.collection("comments")
    const findComment = await comments.find({comment_username:username, comment_id:comment_id}).toArray()
    // The comment exists and belongs to the user 
    if(findComment.length > 0){
        const deleteComment = await comments.deleteOne({comment_id:comment_id, comment_username: username})
        if(deleteComment.deletedCount > 0){
            res.json({status:"success", message:"commentDeleted"})
        }else{
            res.json({status:"error", message:"couldNotDeleteComment"})
        }
    }else{
        res.json({status:"error", message:"commentNotFound"})
    }
}

module.exports = deleteComment