const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const mongooseDateFormat = require('mongoose-date-format');
const orderSchema = new Schema({
    userID: {
        type: String,
        require: true,
    },
    items: {
        type: String,
        require: true
    },
    grandTotal: {
        type: Number,
        require: true
    },
    status: {
        type: Boolean,
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
orderSchema.plugin(mongooseDateFormat)
module.exports = mongoose.model('order', orderSchema);