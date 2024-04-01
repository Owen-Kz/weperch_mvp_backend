const { database } = require("../db");
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const generateRandomString = require("../utils/generateStrings.");
const generateRandomCode = require("../utils/generateCode");
const CreateCAtegory = require("../products/createCategory");

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

const createLiveEvent = async (req,res) =>{
    try {
        // Use Multer middleware to handle file uploads
        upload.fields([{ name: 'thumbnail', maxCount: 1 }])(req, res, async function (err) {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to upload file' });
          }
    
          // Access uploaded files from req.files
          const thumbnailFile = req.files['thumbnail'][0];
    
          if (!thumbnailFile) {
            return res.status(400).json({ error: 'Both thumbnail and video file are required' });
          }
    
          // Upload the thumbnail and video files to Cloudinary
          const thumbnailUrl = await uploadToCloudinary(thumbnailFile);
          console.log("thumbnailUploaded")
    
  
          const products = database.collection("products")
          const store = database.collection("stores")
          const live_events = database.collection("liveEvents")
  
          const userId = req.user.buffer 
          const storeID = req.user.store_id
          const productId = `${await generateRandomString(16)}_${await generateRandomCode()}`
          const findStore = await store.find({store_id: storeID}).toArray()
    
          console.log("Event creation started")
          if(findStore.length > 0){
  
          const date  = new Date()
          const userID = req.user.buffer
          const storeId = req.user.store_id 
          const eventID = `${storeId}${await generateRandomString(8)}`
          const {eventTitle, eventType, scheduleDate, productName, productCategory, productPrice, productQuantity, productKeywords,  } = req.body
          
          const document = {product_name:productName, store_id:storeId, product_id:productId, category:productCategory, price:productPrice, qty_in_stock:productQuantity, keywords: JSON.parse(JSON.stringify(productKeywords)), thumbnailURL: thumbnailUrl, videoUrl:"liveEvent", event_id:eventID, createdAt:date}

          const liveEventDocument = {event_title:eventTitle, event_type:eventType, store_owner:userID, event_id:eventID, store_id:storeId,product_id:productId, schedule_date:scheduleDate, event_status:"scheduled"}
  
          const newProduct = await products.insertOne(document)
          const newEvent = await live_events.insertOne(liveEventDocument)

          if((newProduct).insertedId){
              await CreateCAtegory(productCategory)
              res.json({status:"success", message:"newEventCreated"})
          }else{
              res.json({status:"error", message:'CouldNotCreateEvent'})
          }
      }
  
        });
        
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
}


module.exports = createLiveEvent