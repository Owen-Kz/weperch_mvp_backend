const { database } = require("../db");

const cancelEvent = async (req,res) =>{
    const user_id  = req.user.buffer 
    const {event_id} = req.body

    const liveEvents = database.collection("liveEvents")
    const store  = database.collection("stores")
    
    // Check if the user has a store  
    const findStore = await store.find({store_owner:user_id}).toArray()
    if(findStore.length > 0){
    const store_id = req.user.store_id
    // if the user has a store then find the requested event 
    const findEvent = await liveEvents.find({event_id:event_id}).toArray()
    if(findEvent.length > 0){
        // if the user has a store and the event exists cancel the event by setting the event_status to cancled 
        const cancelEvent = await liveEvents.updateOne(
            {event_id:event_id},
            {$set:{event_status:"canceled"}})

        if(cancelEvent.modifiedCount > 0){
            res.json({status:"success", message:"eventCanceled"})
        }else{
            res.json({status:"error", message:"couldNotCancelEvent"})
        }
        
    }else{
        res.json({status:"error", message:"eventDoesNotExist"})
    }
    }else{
        res.json({status:"error", message:"userHasNoStore"})
    }

}

module.exports = cancelEvent