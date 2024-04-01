const { database } = require("../db");

const searchByKeywords = async (req,res) => {
    const matchingProducts = [];
    
    const collection = database.collection("products")
    const productsArray = await collection.find({}).toArray()
    if(req.query.cat){
        
    }else{
    const searchParam = req.query.q;
    const keywords = searchParam.toLowerCase().split(" "); // Split searchParam into keywords

    
    // Assuming productsArray contains the products data
    productsArray.forEach(product => {
        // Convert product keywords to lowercase and split them into an array
        const productKeywords = product.keywords.toLowerCase().split(", ");
        let matchesAllKeywords = true;
    
        // Check if each keyword in the searchParam is present in the product keywords
        keywords.forEach(keyword => {
            if (!productKeywords.includes(keyword)) {
                matchesAllKeywords = false;
            }
        });
    
        // If all keywords are present in the product keywords, add the product to matchingProducts array
        if (matchesAllKeywords) {
            matchingProducts.push(product);
        }
    });
    
    res.json({status:"success", items: matchingProducts});
}
    
}



module.exports = searchByKeywords