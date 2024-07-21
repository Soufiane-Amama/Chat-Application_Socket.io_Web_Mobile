const User = require('../models/user');
const createError = require('http-errors');



// Register User
exports.register = (req, res, next) => {
    let data = { name, username, password } = req.body;
    
    // Check if username already exist.
    User.findOne({username})
    .then(user => {
        // if username already exist then create error.
        if(user) throw createError(422, "اسم المستخدم موجود مسبقاً");
        // Create new user.
        return User.create(data);
    })
    .then(user => {
        // Generate user token.
        res.json(user.signJwt());
        // Broadcast created user profile to users.
        sendNewUser(user);
    })
    .catch(next);
};