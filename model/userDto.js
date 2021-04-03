const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const mongooseDateFormat = require('mongoose-date-format');
const userSchema = new Schema({
    username: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    isAdmin: {
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
    },
    deleteAt: {
        type: Date,
        default: Date.now
    }
})
userSchema.plugin(mongooseDateFormat)
module.exports = mongoose.model('user', userSchema);