const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const mongooseDateFormat = require('mongoose-date-format');
const userSchema = new Schema({
    username: {
        type: String,
        require: true,
        min: 6
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true,
        min: 6
    },
    isAdmin: {
        type: Boolean,
        require: true
    },
    createAt: {
        type: Date,
        require: true
    },
    updateAt: {
        type: Date,
        require: true
    }
})
userSchema.plugin(mongooseDateFormat)
module.exports = mongoose.model('user', userSchema);