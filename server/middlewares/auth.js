const User = require('../models/user');
const createError = require('http-errors');
const jwt = require('jsonwebtoken');


// Socket.io Middleware. - التحقق من المصادقة باستخدام Socket.io
exports.socket = (socket, next) => {
    if(!socket.handshake.query || !socket.handshake.query.token){
        return next(createError(401, 'auth_error'));
    }
    jwt.verify(socket.handshake.query.token, process.env.JWT_SECRET, (err, decoded) => {
        if(err) return next(createError(401, 'auth_error'));
        User.findById(decoded.id).then(user => {
            if(!user) return next(createError(401, 'auth_error'));
            socket.user = user;
            next();
        })
        .catch(next);
    })
};
/*
الوصف: هذا الوسيط يتحقق من وجود توكن في طلب الاتصال ثم يتحقق من صحته. إذا كان التوكن صالحًا، يتم إلحاق المستخدم المتحقق منه بجسم الـ 
socket. إذا كان هناك خطأ في المصادقة، يتم رفض الاتصال.
*/


// LoggedIn Middleware. - التحقق من المصادقة لطلبات HTTP
exports.authenticated  = (req, res, next) => {
    let token = req.headers['authorization'];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if(err) return next(createError(401));
        User.findById(decoded.id).then(user => {
            if(!user) throw createError(401);
            req.user = user;
            next();
        }).catch(next);
    });
 };
/*
الوصف: هذا الوسيط يتحقق من وجود توكن في رؤوس الطلبات ثم يتحقق من صحته. إذا كان التوكن صالحًا، يتم إلحاق المستخدم المتحقق منه بجسم الطلب. إذا كان هناك خطأ في المصادقة، يتم رفض الطلب.
*/