const { database } = require("../db");

const deleteProduct = async (req,res) =>{
    const {product_id} = req.body 
    const store_owner = req.user.buffer

    // Check if the user Has a store 
    const store = database.collection("stores")
    const findStoreForUser = await store.find({store_owner:store_owner}).toArray()

    // if the user has a store check if the product they want to delete belongs to their store 
    if(findStoreForUser.length > 0){
        const products = database.collection("products")

        const storeId = findStoreForUser[0].store_id
        const findProductInstore = await products.find({product_id:product_id, store_id:storeId}).toArray()
        if(findProductInstore.length > 0){                
          const deleteProd = await  products.deleteOne({product_id:product_id})
          if(deleteProd.deletedCount > 0) {
            res.json({status:"success", message:"productDeleted"})
          }
       
 
        }else{
            res.json({status:"error", message:"productNotFound"})
        }
    }else{
        res.json({status:"error", message:"storeNotFound"})
    }

   
}


module.exports = deleteProduct