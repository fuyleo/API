const express = require("express");
const router = express.Router();

const OrderDto = require("../model/orderDto")

//Base URl: /api/ecommerce
//Get All Order
router.get('/orders', async(req, res) => {
    try {
        const orders = await OrderDto.find();
        if(!orders) throw Error('No Items');
        res.status(200).json(orders);
    }catch(err) {
        res.status(400).json({msg: err})
    }
})

//Base URl: /api/ecommerce
//Get Order
router.get('/order/:id', async(req, res) => {
    try {
        const order = await OrderDto.findById(req.params.id);
        if(!order) throw Error('Not Found Product');
        res.status(200).json(order);
    }catch(err) {
        res.status(400).json({msg: err})
    }
})

//Base URl: /api/ecommerce
//Post Order
router.post('/order', async (req, res) => {
    const newOrder = new OrderDto(req.body);
    try{
        const order = await newOrder.save();
        if(!order) throw Error('Something went wrong!');
    
        res.status(200).json(order);
    }catch(err) {
        res.status(400).json({msg: err})
    }
});

//Base URl: /api/ecommerce
//Delete Order
router.delete('/order/:id', async(req, res) => {
    try{
        const order = await OrderDto.findByIdAndDelete(req.params.id);
        if(!order) throw Error('No product found!');
        res.status(200).json({success: true})
    }catch(err) {
        res.status(400).json({msg: err})
    }
})

//Base URl: /api/ecommerce
//Update Order
router.patch('/order/:id', async(req, res) => {
    try{
        const order = await OrderDto.findByIdAndUpdate(req.params.id, req.body);
        if(!order) throw Error('Something went wrong!');
        res.status(200).json({success: true})
    }catch(err) {
        res.status(400).json({msg: err})
    }
})

module.exports = router;