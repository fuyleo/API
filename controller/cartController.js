const express = require("express");
const router = express.Router();

const CartDto = require("../model/cartDto")

//Base URl: /api/ecommerce
//Get All Cart
router.get('/carts', async(req, res) => {
    try {
        const carts = await CartDto.find();
        if(!carts) throw Error('No Items');
        res.status(200).json(carts);
    }catch(err) {
        res.status(400).json({msg: err})
    }
})

//Base URl: /api/ecommerce
//Get Cart
router.get('/cart/:id', async(req, res) => {
    try {
        const cart = await CartDto.findById(req.params.id);
        if(!cart) throw Error('Not Found Product');
        res.status(200).json(cart);
    }catch(err) {
        res.status(400).json({msg: err})
    }
})

//Base URl: /api/ecommerce
//Post Cart
router.post('/cart', async (req, res) => {
    const newCart = new CartDto(req.body);
    try{
        const cart = await newCart.save();
        if(!cart) throw Error('Something went wrong!');
    
        res.status(200).json(cart);
    }catch(err) {
        res.status(400).json({msg: err})
    }
});

//Base URl: /api/ecommerce
//Delete Cart
router.delete('/cart/:id', async(req, res) => {
    try{
        const cart = await CartDto.findByIdAndDelete(req.params.id);
        if(!cart) throw Error('No product found!');
        res.status(200).json({success: true})
    }catch(err) {
        res.status(400).json({msg: err})
    }
})

//Base URl: /api/ecommerce
//Update Cart
router.patch('/cart/:id', async(req, res) => {
    try{
        const cart = await CartDto.findByIdAndUpdate(req.params.id, req.body);
        if(!cart) throw Error('Something went wrong!');
        res.status(200).json({success: true})
    }catch(err) {
        res.status(400).json({msg: err})
    }
})

module.exports = router;