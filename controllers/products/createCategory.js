const { database } = require("../db");

const CreateCAtegory = async (category) =>{
const product_categories = database.collection("categories")
const find_category = await product_categories.find({category_name:category}).toArray()

if(find_category.length > 0){
    console.log('Category Exists')
}else{
    const NewCategory = await product_categories.insertOne({category_name: category})
    if(NewCategory.insertedId) {
        console.log("New Category Created")
    }else{
       console.log({status:"error", message:'couldNotCreateCategory'})
    }
}
}

module.exports = CreateCAtegory