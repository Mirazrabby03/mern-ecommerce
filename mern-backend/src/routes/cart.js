const express = require('express');
const {requireSignin, userMiddleware} =require('../common-middleware');
const  {addItemToCart, getCartItems }= require('../controller/cart')
 //const {getCartItems} = require('../controller/cart');

// const cart = require('../controller/cart')

// const {addItemtoCart, gtCartItems} = 
const router = express.Router();


router.post('/user/cart/addtocart', requireSignin, userMiddleware, addItemToCart );
 router.post('/user/getCartItems', requireSignin, userMiddleware, getCartItems );   
//return router;
module.exports = router;         