
const express = require('express');
const router = express.Router();
const controller = require('../controllers/accountController');
const auth = require('../middlewares/auth');
const path = require('path');
const multer  = require('multer');


// Handel multipart/form-data. - مخزن الصور
const storage = multer.diskStorage({
    destination: 'public/uploads/', // مكان تخزين الصورة الشخصية
    filename: function (req, file, cb) { // تابع لتوليد اسم فريد لملف الصورة الشخصية
        cb(null, Date.now() + path.extname(file.originalname))
    }
});


// User profile middleware.
const upload = multer({
    limits: { fileSize: 1024 * 1024 }, // تحديد حجم ملف الصورة 
    storage: storage , // تحديد مخزن الملف
    fileFilter: (req, file, cb) => { // تابع لتحقق من نوع الملف المرفوع
        let fileTypes = /jpeg|jpg|png/;
        let mimeType = fileTypes.test(file.mimetype);
        let extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        if (mimeType && extname)  return cb(null, true);
        cb(new Error('غبر مسموح رفع هذا الملف')); // في حال لم تكن صورة سيتم ارسال رسالة خطأ
    },
});


// [POST] update profile.
router.post('/', [auth.authenticated, upload.single('avatar')], controller.profile);


// [POST] Change password.
router.post('/password', auth.authenticated, controller.password);


module.exports = router;