const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const mongooseDateFormat = require('mongoose-date-format');
const cartSchema = new Schema({
    userID: {
        type: String,
        require: true,
    },
    cartItem: {
        type: String,
        require: true
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
cartSchema.plugin(mongooseDateFormat)
module.exports = mongoose.model('cart', cartSchema);