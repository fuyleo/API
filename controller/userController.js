const express = require("express");
const router = express.Router();

const UserDto = require("../model/userDto");

//Base URl: /api/ecommerce
//Get All User
router.get('/users', async(req, res) => {
    try {
        const users = await UserDto.find();
        if(!users) throw Error('No Items');
        res.status(200).json(users);
    }catch(err) {
        res.status(400).json({msg: err})
    }
})

//Base URl: /api/ecommerce
//Get User
router.get('/user/:id', async(req, res) => {
    try {
        const user = await UserDto.findById(req.params.id);
        if(!user) throw Error('Not Found Product');
        res.status(200).json(user);
    }catch(err) {
        res.status(400).json({msg: err})
    }
})

//Base URl: /api/ecommerce
//Post User
router.post('/user', async (req, res) => {
    const newUser = new UserDto(req.body);
    try{
        const user = await newUser.save();
        if(!user) throw Error('Something went wrong!');
    
        res.status(200).json(user);
    }catch(err) {
        res.status(400).json({msg: err})
    }
});

//Base URl: /api/ecommerce
//Delete User
router.delete('/user/:id', async(req, res) => {
    try{
        const user = await UserDto.findByIdAndDelete(req.params.id);
        if(!user) throw Error('No product found!');
        res.status(200).json({success: true})
    }catch(err) {
        res.status(400).json({msg: err})
    }
})

//Base URl: /api/ecommerce
//Update User
router.patch('/user/:id', async(req, res) => {
    try{
        const user = await UserDto.findByIdAndUpdate(req.params.id, req.body);
        if(!user) throw Error('Something went wrong!');
        res.status(200).json({success: true})
    }catch(err) {
        res.status(400).json({msg: err})
    }
})

module.exports = router;