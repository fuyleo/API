const express = require("express");
const app = express();

const cors = require('cors')
app.use(cors());

let Url = require("./config/configDB").dbUrl;
const mongoose = require('mongoose');

const path = require("path");

const product = require('./controller/productController');
const user = require('./controller/userController');
const cart = require('./controller/cartController');
const order = require('./controller/orderController');
const bodyParser = require("body-parser");

//Body Parser Middleware
app.use(express.json())
//End of Body Parser Middleware

//Database Connetion
mongoose.connect(Url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}).then(() => {
})
mongoose.connection.on('connected', (req, res)=> {
    console.log("Mongoose is connected!!");
})
mongoose.connection.on('error', (req, res)=> {
    console.log("Mongoose went wrong");
})
//End of database connection

app.use(bodyParser.urlencoded({
    extended: false
  }));
app.use(cors());

//Routes
app.use('/api/ecommerce', product);
app.use('/api/ecommerce', user);
app.use('/api/ecommerce', cart);
app.use('/api/ecommerce', order);

app.use('/images', express.static(path.join('images')));
//End of routes

app.get('/', (req, res)=> {
    res.send("Hello Thesis");
});

app.listen(4000);