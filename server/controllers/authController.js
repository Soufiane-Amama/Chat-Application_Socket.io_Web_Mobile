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
    .catch(next); // اذا حصل خطأ ما سيتم تمريره الى وسيط في نظام Express مدمج مخصص لمعالجة الاخطاء وارسالها للمستخدم
};


// Login User
exports.login = (req, res, next) => {
    const { username, password } = req.body;
    
    // Find user by username.
    User.findOne({username}).then(user => {
        // if user not found or password is wrong then create error.
        if(!user || !user.checkPassword(password)){
            throw createError(401, 'الرجاء التحقق من اسم المستخدم وكلمة المرور');
        }
        // Generate user token.
        res.json(user.signJwt());
    })
    .catch(next);
};
