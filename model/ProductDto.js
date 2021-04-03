const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const mongooseDateFormat = require('mongoose-date-format');
const product_status = {
    inStock: "In Stock",
    outOfStock: "Out of Stock"
}
const productSchema = new Schema({
    title: {
        type: String,
        require: true,
    },
    description: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    imageUrl: {
        type: String,
        require: true
    },
    status: {
        type: product_status
    },
    createAt: {
        type: Date,
        default: Date.now
    },
    updateAt: {
        type: Date,
        default: Date.now
    }
})
productSchema.plugin(mongooseDateFormat)
module.exports = mongoose.model('product', productSchema);