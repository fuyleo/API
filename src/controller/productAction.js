const express = require("express");
const router = express.Router();

const ProductDto = require("../model/ProductDto")

//Base URl: api/product
//Get All Product
router.get('/', async(req, res) => {
    try {
        const products = await ProductDto.find();
        if(!products) throw Error('No Items');
        res.status(200).json(products);
    }catch(err) {
        res.status(400).json({msg: err})
    }
})

//Base URl: api/posts
//Get User
router.get('/:id', async(req, res) => {
    try {
        const product = await ProductDto.findById(req.params.id);
        if(!product) throw Error('Not Found Item');
        res.status(200).json(product);
    }catch(err) {
        res.status(400).json({msg: err})
    }
})

//Base URl: api/posts
//Post User
router.post('/user', async (req, res) => {
    const newPost = new ProductDto(req.body);
    try{
        const product = await newPost.save();
        if(!product) throw Error('Something went wrong while saving the post');
    
        res.status(200).json(product);
    }catch(err) {
        res.status(400).json({msg: err})
    }
});

//Base URl: api/posts
//Delete User
router.delete('/:id', async(req, res) => {
    try{
        const product = await ProductDto.findByIdAndDelete(req.params.id);
        if(!product) throw Error('No post found!');
        res.status(200).json({success: true})
    }catch(err) {
        res.status(400).json({msg: err})
    }
})

//Base URl: api/posts
//Update User
router.patch('/:id', async(req, res) => {
    try{
        const product = await ProductDto.findByIdAndUpdate(req.params.id, req.body);
        if(!product) throw Error('Something went wrong while updating the post');
        res.status(200).json({success: true})
    }catch(err) {
        res.status(400).json({msg: err})
    }
})

module.exports = router;