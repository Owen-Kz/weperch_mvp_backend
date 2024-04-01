const { database } = require("../db");
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const generateRandomString = require("../utils/generateStrings.");
const generateRandomCode = require("../utils/generateCode");
const CreateCAtegory = require("./createCategory");

// Configure Cloudinary with your Cloudinary credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Set up Multer storage engine and file upload configurations
const storage = multer.memoryStorage(); // Store files in memory for uploading to Cloudinary
const upload = multer({ storage: storage });

const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
      if (error) {
        reject(error);
        console.log(error)
      } else {
        resolve(result.secure_url);
      }
    }).end(file.buffer);
  });
};

const createProduct = async (req, res) => {
    try {
      // Use Multer middleware to handle file uploads
      upload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'video_file', maxCount: 1 }])(req, res, async function (err) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Failed to upload file' });
        }
  
        // Access uploaded files from req.files
        const thumbnailFile = req.files['thumbnail'][0];
        const videoFile = req.files['video_file'][0];
  
        if (!thumbnailFile || !videoFile) {
          return res.status(400).json({ error: 'Both thumbnail and video file are required' });
        }
  
        // Upload the thumbnail and video files to Cloudinary
        const thumbnailUrl = await uploadToCloudinary(thumbnailFile);
        console.log("thumbnailUploaded")
        const videoUrl = await uploadToCloudinary(videoFile);
        console.log("fileUploaded")
  

        const products = database.collection("products")
        const store = database.collection("stores")

        const userId = req.user.buffer 
        const storeID = req.user.store_id
        const productId = `${await generateRandomString(16)}_${await generateRandomCode()}`
        const findStore = await store.find({store_id: storeID}).toArray()
  
        console.log("product creating started")
        if(findStore.length > 0){

        const date  = new Date()
        const { product_name, category, price, qty_in_stock, keywords} = req.body
        const document = {product_name:product_name, store_id:storeID, product_id:productId, category:category, price:price, qty_in_stock:qty_in_stock, keywords: JSON.parse(JSON.stringify(keywords)),
        thumbnailURL: thumbnailUrl, videoURL: videoUrl, createdAt:date}

        const newProduct = await products.insertOne(document)
        if((newProduct).insertedId){
            await CreateCAtegory(category)
            res.json({status:"success", message:"newProductCreated"})
        }else{
            res.json({status:"error", message:'CouldNotCreateProduct'})
        }
        // res.json({ thumbnailUrl, videoUrl });
    }

      });
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  module.exports = createProduct;
  