const express = require("express");
const register_user = require("../controllers/account/signup");
const bodyParser = require("body-parser");
const login_user = require("../controllers/account/login");
const session = require('express-session');
const addToCart = require("../controllers/cart/addToCart");
const cartItems = require("../controllers/cart/cartItems");
const deleteItemFromCart = require("../controllers/cart/deleteItem");
const reduceQuantity = require("../controllers/cart/reduceQuantity");
const BecomeSeller = require("../controllers/account/becomeSeller");
const LoggedIn = require("../controllers/account/loggedIn");
const verifyUser = require("../controllers/account/validateCode");
const createProduct = require("../controllers/products/createProduct");
const searchByKeywords = require("../controllers/products/searchByKeywords");
const addComment = require("../controllers/livestream/addComment");
const deleteComment = require("../controllers/livestream/deleteComment");
const getComments = require("../controllers/livestream/getComments");
const deleteProduct = require("../controllers/products/deleteProduct");
const createLiveEvent = require("../controllers/livestream/createLiveEvent");
const cancelEvent = require("../controllers/livestream/cancelEvent");
const AllEvents = require("../controllers/livestream/getAllEvents");
const router = express.Router()

router.use(express.json())
router.use(bodyParser.json())



// Configure express-session middleware
router.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: true
}));

// Enable CORS for this router
router.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
  });


router.post("/regiser/create/user", register_user)
router.post("/login/user", login_user)
router.post("/item/addToCart", addToCart)
router.get("/cart/items/user", cartItems)
router.post("/cart/item/delete", deleteItemFromCart)
router.post("/item/reduceFromCart", reduceQuantity)
router.post('/user/verification/token', verifyUser)
router.get('/products/search', searchByKeywords)


router.post("/user/account/create/seller",LoggedIn, BecomeSeller)
router.post("/user/stores/products/create",LoggedIn, createProduct)
router.post("/live/videos/comment/add", LoggedIn, addComment)
router.post("/live/videos/comment/delete", LoggedIn, deleteComment)
router.get("/live/video/comments", LoggedIn, getComments)
router.post('/store/products/delete', LoggedIn, deleteProduct)
router.post("/live/events/create", LoggedIn, createLiveEvent)
router.post("/live/events/cancel", LoggedIn, cancelEvent)
router.get("/live/events", AllEvents)


router.get("/signupForm", (req,res) =>{
    res.render('testpage')
})

router.get("*", (req,res) =>{
    res.json({message:"Unathorized access"})
})
module.exports =   router;