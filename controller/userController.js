const express = require("express");
const router = express.Router();
const UserDto = require("../model/UserDto");
const { registerValidation, loginValidation, updateValidation } = require('../validation/userValidation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verifyToken = require('../config/verifyToken'); 
const pagination = require('../pagination/pagination');
const MESSAGE = require('../utils/message');


//Base URl: /api
//Get All User
router.get('/users',verifyToken , pagination(UserDto), async(req, res) => {
    try {
        const users = res.pagination;
        res.status(200).json({data: users});
    }catch(err) {
        MESSAGE.NOT_FOUND.alert = 'User';
        const message = MESSAGE.NOT_FOUND.getMessage;
        res.status(400).json({message: message})
    }
})

//Base URl: /api
//Get User
router.get('/user/:id', async(req, res) => {
    try {
        const user = await UserDto.findById(req.params.id);
        res.status(200).json(user);
    }catch(err) {
        MESSAGE.INVALID.alert = 'User';
        const message = MESSAGE.INVALID.getMessage;
        res.status(400).json({message: message});
    }
})

//Base URl: /api
//User Login
router.post('/user/login', async (req, res) => {
    //Validation
    const { error } = loginValidation(req.body);
    if(error) return res.status(400).json({message: error.details[0].message.replace(/["']/g, "")});
    
    //Checking if user exist
    const user = await UserDto.findOne({username: req.body.username});
    if(!user) {
        MESSAGE.NOT_FOUND.alert = 'Username';
        const message = MESSAGE.NOT_FOUND.getMessage;
        return res.status(400).json({message: message});
    } 

    //Checking Password
    const validPassword =  await bcrypt.compare(req.body.password, user.password)
    if(!validPassword) {
        MESSAGE.NOT_FOUND.alert = 'Password';
        const message = MESSAGE.NOT_FOUND.getMessage;
        return res.status(400).json({message: message});
    }

    //Create JWT
    const payload = { _id: req.body._id, username: req.body.username };
    const token = jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: '6h'});
    // const refresh_token = jwt.sign(payload, process.env.TOKEN_SECRET);

    try{
        res.status(201).json(
            {
                user: user,
                token: token
            }
        );
    }catch(err) {
        res.status(400).json({message: err});
    }
});

//Base URl: /api
//User Register
router.post('/user/register', async (req, res) => {
    createDate = new Date();
    //Validation
    const { error } = registerValidation(req.body);
    if(error) return res.status(400).json({message: error.details[0].message.replace(/["']/g, "")});
    
    //Checking if user is dubplicate
    const emailExist = await UserDto.findOne({email: req.body.email});
    if(emailExist) {
        MESSAGE.EXISIT.alert = 'Email';
        const message = MESSAGE.EXISIT.getMessage;
        return res.status(400).json({message: message});
    }

    //Hash The Password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new UserDto({
        username: req.body.username,
        email: req.body.email,
        password: hashPassword,
        isAdmin: false,
        createAt: createDate,
        updateAt: ''
    });
    try {
        MESSAGE.SUCCESS.alert = 'User';
        MESSAGE.SUCCESS.request = 'added';
        const message = MESSAGE.SUCCESS.getMessage;
        const user = await newUser.save();
        res.status(201).json(
            {
                message: message,
                data: user
            }
        );
    }catch(err) {
        res.status(400).json({message: err});
    }
});

//Base URl: /api
//Delete User
router.delete('/user/:id', verifyToken, async(req, res) => {
    try{
        const user = await UserDto.findByIdAndDelete(req.params.id);
        MESSAGE.SUCCESS.alert = 'User';
        MESSAGE.SUCCESS.request = 'deleted';
        const message = MESSAGE.SUCCESS.getMessage;
        res.status(200).json({
            message: message,
            data: user
        })
    }catch(err) {
        MESSAGE.NOT_FOUND.alert = 'User';
        const message = MESSAGE.NOT_FOUND.getMessage;
        res.status(400).json({message: message})
    }
})

//Base URl: /api
//Update User
router.patch('/user/:id', verifyToken, async(req, res) => {
    //Validation
    const { error } = updateValidation(req.body);
    if(error) return res.status(400).json({message: error.details[0].message.replace(/["']/g, "")});

    let updateDate = new Date();
    const newUser = new UserDto({
        _id: req.params.id,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        updateAt: updateDate
    });
    const result = await UserDto.findByIdAndUpdate(req.params.id, newUser, { new: true }).then(result => {
        MESSAGE.SUCCESS.alert = 'User';
        MESSAGE.SUCCESS.request = 'been update'
        const message = MESSAGE.SUCCESS.getMessage;
        res.status(201).json({
            message: message,
            data: result
        })
    }).catch(err => {
        MESSAGE.NOT_FOUND.alert = 'User';
        const message = MESSAGE.NOT_FOUND.getMessage;
        res.status(400).json({message: message});
    })
})

module.exports = router;