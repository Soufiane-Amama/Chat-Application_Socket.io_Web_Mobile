const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


// Define User Schema.
const ModelSchema = new mongoose.Schema({
    name: { // اسم العرض
        type: String,
        required: true,
        maxlength: 20
    },
    username: { // اسم المستخدم الفريد
        type: String,
        required: true,
        unique: true,
        maxlength: 20
    },
    password: { // كلمة السر
        type: String,
        required: true
    },
    about: { // حالة المستخدم
        type: String,
        maxlength: 100
    },
    avatar: String, // صورة المستخدم
});


// Append id attribute.
ModelSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

// Enable virtual attributes (id).
ModelSchema.set('toJSON', {
    virtuals: true
});

const Model = mongoose.model('User', ModelSchema);
module.exports = Model;