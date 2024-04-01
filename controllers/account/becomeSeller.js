const { database } = require("../db");
const generateRandomString = require("../utils/generateStrings.");

const BecomeSeller = async (req,res) =>{
    const user_id = req.user.buffer
    const collection = database.collection("user_data")
    const stores = database.collection("stores")
    
    const {store_name, local_currency} = req.body

    const findStoreName = await stores.find({store_name:store_name}).toArray()

    if(findStoreName.length > 0){
        res.json({status:"error", message:"storeAlreadyExists"})
    }else{
        const StoreID = await generateRandomString(7);
        const document = {store_name: store_name, store_owner:user_id, store_id:StoreID, local_currency:local_currency}
        const newStore = await stores.insertOne(document)

        if(newStore.insertedId){
        const updateToSeller = await collection.updateOne(
        {buffer: user_id},
        {$set: 
            {
             accountType: "seller_account",
             store_id:StoreID,
            }
        }
    )

    // Check if the user data has been updated 
    const updateCount = (updateToSeller).modifiedCount

    if(updateCount > 0){
        res.json({status:'success', message:"accountUpdatedToSeller"})
    }else{
        res.json({status:"error", message: "updateFailed"})
    }
    }else{
        res.json({status:"error", message: "couldNotCreateSellerAccount"})
    }
}
}

module.exports = BecomeSeller