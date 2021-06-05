const express = require("express");
const router = express.Router();
const multer = require('multer');
const ProductDto = require("../model/ProductDto")
const mongoose = require('mongoose');
const pagination = require('../pagination/pagination');
const verifyToken = require('../config/verifyToken'); 
const MESSAGE = require('../utils/message');
// Multer File upload settings
const DIR = './images/';
const { postValidation } = require('../validation/productValidation');

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

//Base URl: /api
//Get All Product
router.get('/products' , pagination(ProductDto), async(req, res) => {
    try {
        const products = res.pagination;
        res.status(200).json({data: products});
    } catch (err) {
        MESSAGE.NOT_FOUND.alert = 'Product';
        const message = MESSAGE.NOT_FOUND.getMessage;
        res.status(400).json({message: message});
    }
})

//Base URl: /api
//Get Product
router.get('/product/:id', async(req, res) => {
    try {
        const product = await ProductDto.findById(req.params.id);
        res.status(200).json(product);
    } catch (err) {
        MESSAGE.NOT_FOUND.alert = 'Product';
        const message = MESSAGE.NOT_FOUND.getMessage;
        res.status(400).json({message: message});
    }
})

//Base URl: /api
//Post Product
router.post('/product', verifyToken, upload.single('imageUrl'), async(req, res) => {

    //Validation
    const { error } = postValidation(req.body);
    if(error) return res.status(400).json({message: error.details[0].message.replace(/["']/g, "")});

    const url = req.protocol + '://' + req.get('host');
    createDate = new Date();
    // updateDate = new Date();
    const product = new ProductDto({
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        imageUrl: url + '/images/' + req.file.filename,
        status: req.body.status,
        createAt: createDate,
        updateAt: ''
    });
    product.save().then(result => {
        MESSAGE.SUCCESS.alert = 'Product';
        MESSAGE.SUCCESS.request = 'added';
        const message = MESSAGE.SUCCESS.getMessage;
        res.status(201).json({
            message: message,
            data: {
                _id: result._id,
                title: result.title,
                description: result.description,
                price: result.price,
                imageUrl: result.imageUrl,
                status: result.status,
                createAt: result.createAt,
                updateAt: result.updateAt
            }
        })
    }).catch(err => {
        res.status(500).json({message: err});
    })
});

//Base URl: /api
//Delete Product
router.delete('/product/:id', verifyToken, async(req, res) => {
    try {
        const product = await ProductDto.findByIdAndDelete(req.params.id);
        MESSAGE.SUCCESS.alert='Product';
        MESSAGE.SUCCESS.request='deleted';
        const message = MESSAGE.SUCCESS.getMessage;
        res.status(200).json({ 
            message: message
         })
    } catch (err) {
        MESSAGE.NOT_FOUND.alert='Product';
        const message = MESSAGE.NOT_FOUND.getMessage;
        res.status(400).json({ message: message })
    }
})

//Base URl: /api
//Update Product
router.patch('/product/:id', verifyToken, upload.single('imageUrl'), async(req, res) => {

    let product;
    let newDate = new Date();
    const url = req.protocol + '://' + req.get('host');

    if(req.file != undefined) {
        product = new ProductDto({
            _id: req.params.id,
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            imageUrl: url + '/images/' + req.file.filename,
            status: req.body.status,
            updateAt: newDate
        });
    }else {
        product = new ProductDto({
            _id: req.params.id,
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            status: req.body.status,
            updateAt: newDate
        });
    }

    const result = await ProductDto.findByIdAndUpdate(req.params.id, product, { new: true }).then(result => {
        MESSAGE.SUCCESS.alert='Product';
        MESSAGE.SUCCESS.request='been update';
        const message = MESSAGE.SUCCESS.getMessage;
        res.status(201).json({
            message: message,
            data: result
        })
    }).catch(err => {
        MESSAGE.NOT_FOUND.alert='Product';
        const message = MESSAGE.NOT_FOUND.getMessage;
        res.status(400).json({
            message: message
        });
    })
});

module.exports = router;