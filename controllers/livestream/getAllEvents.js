const { database } = require("../db");

const AllEvents = async (req,res) =>{
    const collection = database.collection("liveEvents")
    const findEvent = await collection.find({ event_status: { $ne: "canceled" } }).toArray();

    if(findEvent.length > 0){
        // if events exist then find their related store and products 
        const storesCollection = database.collection("stores")
        const productsCollection = database.collection("products")

        findEvent.forEach( async (event) =>{
            const findStore = await storesCollection.find({store_id:event.store_id}).toArray()
            if(findStore.length > 0){
                var storeName = findStore[0].store_name 
                var storeCurrency = findStore[0].store_currency
                console.log("storeActive")

                const findRelatedProducts = await productsCollection.find({product_id:event.product_id}).toArray()

                if(findRelatedProducts.length > 0){
                    const productName = findRelatedProducts[0].product_name 
                    const productPrice = findRelatedProducts[0].price 
                    const category = findRelatedProducts[0].category
                     const qty = findRelatedProducts[0].qty_in_stock 
                     const keywords = findRelatedProducts[0].keywords
                     const thumbnail = findRelatedProducts[0].thumbnail

                    const EventData = {
                        store_name: storeName,
                        store_currency: storeCurrency,
                        event_title: event.event_title,
                        prodcut_price: productPrice,
                        product_name: productName,
                        category: category,
                        quantity: qty,
                        keywords:keywords,
                        thumbnail: thumbnail,
                        type: event.type,
                        date: event.schedule_date,
                        status:event.event_status
                    }
                    res.json({status:"success", eventData:EventData})
                }else{
                    res.json({status:"error", message:"noRelatedProducts"})
                }
            }else{
                res.json({status:'error', message:"noEventRelatedToStore"})
            }
        })
    }else{
        res.json({status:"error", message:"noEventsAvailable"})
    }
}


module.exports = AllEvents