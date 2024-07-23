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


// Get user profile data.
ModelSchema.methods.getData = function(){
    return {
        id: this._id,
        name: this.name,
        username: this.username,
        about: this.about,
        avatar: this.avatar
    };
};

// Create Token - Generate user token with profile data.
ModelSchema.methods.signJwt = function(){
    let data = this.getData();
    data.token = jwt.sign(data, process.env.JWT_SECRET);
    return data;
};

// Pre save middleware (before save user document). - هذه الدالة للتحقق من شروط التشفير وتشفير كلمة المرور وهي جزء من نموذج المستخدم الذي يتعامل مع تجزئة كلمة المرور قبل حفظها
ModelSchema.pre('save', function(next) { // لدينا pre تعني يستخدم هذا لتعريف دالة يتم تنفيذها قبل عملية الحفظ  في قاعدة البيانات، ثم لدينا save، و هو الحدث الذي نريد أن نربط به هذه الدالة، في هذه الحالة هو حدث الحفظ. و next هي دالة رد اتصال يجب استدعاؤها للإشارة إلى اكتمال الخطاف، next() هي بمثابة إشارة للشخص الذي أمامك في الطابور، تخبره أنك انتهيت من دورك وأنه يمكنه التقدم.   
    if(this.isNew || this.isModified('password')){ // هنا نتحقق من شرطين this.isNew إن كان المستخدم جديدًا (أي أنه مستخدم جديد) و this.isModified('password') هل تم تعديل كلمة المرور (أي أن المستخدم يقوم بتحديث كلمته المرور). ولو تحقق أيًا من تلك الشروط، فسيتم تنفيذ الكود الموجود داخل if 
        this.password = bcrypt.hashSync(this.password, 8); // تجزءة كلمة المرور 
    }
    next(); // يتم استدعاء next() لإخبار Mongoose بالانتقال إلى الخطوة التالية وإتمام عملية الحفظ في قاعدة البيانات.
 });

// Check if given password is correct.
ModelSchema.methods.checkPassword = function (password) {
	return bcrypt.compareSync(password, this.password); // مقارنة كلمة المرور المدخلة اذا هي متطابقة مع المخزنة او لا 
}

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