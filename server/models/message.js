const mongoose = require('mongoose');

const Schema = mongoose.Schema;


// Define Message Schema.
const ModelSchema = new mongoose.Schema({
    sender: { // مرسل الرسالة
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiver: { // مستقبل الرسالة
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: { // محتوى الرسالة
        type:String,
        required: true
    },
    seen: { // مقرؤة ام لا
        type: Boolean,
        default: false
    },
    date: { // تاريخ الارسال
        type: Date,
        default: Date.now // تعيين القيمة الافتراضية لحظة انشاء الرسالة
    },
});


const Model = mongoose.model('Message', ModelSchema);
module.exports = Model;