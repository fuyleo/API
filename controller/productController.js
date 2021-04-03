const express = require("express");
const router = express.Router();

const multer = require('multer');

const ProductDto = require("../model/ProductDto")

const mongoose = require('mongoose');

// Multer File upload settings
const DIR = './images/';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(' ').join('-');
    cb(null, fileName)
  }
});

// Multer Mime Type Validation
var upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  }
});

//Base URl: /api/ecommerce
//Get All Product
router.get('/products', async(req, res) => {
    try {
        const products = await ProductDto.find();
        if(!products) throw Error('No Items');
        res.status(200).json(products);
    }catch(err) {
        res.status(400).json({msg: err})
    }
})

//Base URl: /api/ecommerce
//Get Product
router.get('/product/:id', async(req, res) => {
    try {
        const product = await ProductDto.findById(req.params.id);
        if(!product) throw Error('Not Found Product');
        res.status(200).json(product);
    }catch(err) {
        res.status(400).json({msg: err})
    }
})

//Base URl: /api/ecommerce
//Post Product
router.post('/product', upload.single('imageUrl'), async (req, res) => {

    const url = req.protocol + '://' + req.get('host')
    const product = new ProductDto({
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    imageUrl: url + '/images/' + req.file.filename,
    status: req.body.status
    });
    product.save().then(result => {
      console.log(result);
      res.status(201).json({
        message: "Product has added successfully!",
        product_details: {
          _id: result._id,
          title: result.title,
          description: result.description,
          price: result.price,
          imageUrl: result.imageUrl,
          status: result.status
        }
      })
    }).catch(err => {
      console.log(err),
        res.status(500).json({
          error: err
      });
    })
});

//Base URl: /api/ecommerce
//Delete Product
router.delete('/product/:id', async(req, res) => {
    try{
        const product = await ProductDto.findByIdAndDelete(req.params.id);
        if(!product) throw Error('No product found!');
        res.status(200).json({success: true})
    }catch(err) {
        res.status(400).json({msg: err})
    }
})

//Base URl: /api/ecommerce
//Update Product
router.patch('/product/:id', async(req, res) => {
    try{
        const product = await ProductDto.findByIdAndUpdate(req.params.id, req.body);
        if(!product) throw Error('Something went wrong!');
        res.status(200).json({success: true})
    }catch(err) {
        res.status(400).json({msg: err})
    }
})

module.exports = router;