const express = require("express");
const app = express();

const cors = require('cors')
app.use(cors());

const mongoose = require('mongoose');
const dotenv = require('dotenv');

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
dotenv.config();
mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}).then(() => {
})
mongoose.connection.on('connected', (req, res)=> {
    console.log("Server is up and running");
})
mongoose.connection.on('error', (req, res)=> {
    console.log("Server is down!!!");
})
//End of database connection

app.use(bodyParser.urlencoded({
    extended: false
  }));
app.use(cors());

//Routes
app.use('/api', product);
app.use('/api', user);
app.use('/api', cart);
app.use('/api', order);

app.use('/images', express.static(path.join('images')));
//End of routes

app.get('/', (req, res)=> {
    res.send("Hello Thesis");
});

app.listen(4000);