const socketIO = require('socket.io');
const auth = require('./middlewares/auth');
const Message = require('./models/message');
const User = require('./models/user');

// كائن لتتبع حالة المستخدمين
const users = {};

// تصدير دالة تهيئة Socket.io باستخدام الخادم
module.exports = (server) => {
  const io = socketIO(server,{
    cors: {
      origin: "*",
    }
  });

  // استخدام middleware للتحقق من المصادقة قبل معالجة أي اتصالات
  io.use(auth.socket);

  // معالجة حدث الاتصال الجديد
  io.on('connection', (socket) => {
    onSocketConnected(socket);
    socket.on('message', data => onMessage(socket, data)); // معالجة الرسائل الجديدة
    socket.on('typing', receiver => onTyping(socket, receiver)); // معالجة حدث الكتابة
    socket.on('seen', sender => onSeen(socket, sender)); // معالجة حدث رؤية الرسائل
    initialData(socket); // إرسال البيانات الأولية عند الاتصال
    socket.on('disconnect', () => onSocketDisconnected(socket)); // معالجة حدث قطع الاتصال
  });

  // دالة لمعالجة الاتصال الجديد
  const onSocketConnected = (socket) => {
    console.log('New client connected: ' + socket.id);
    socket.join(socket.user.id); // إدخال المستخدم في غرفة بناءً على معرفه
    users[socket.user.id] = true; // تحديث حالة المستخدم
    let room = io.sockets.adapter.rooms[socket.user.id];
    if(!room || room.length === 1){
      io.emit('user_status', {
        [socket.user.id]: true  
      });
    }
  };

  // دالة لمعالجة قطع الاتصال
  const onSocketDisconnected = (socket) => {
    let room = io.sockets.adapter.rooms[socket.user.id];
    if(!room || room.length < 1){
      let lastSeen = new Date().getTime(); // تسجيل وقت آخر ظهور
      users[socket.user.id] = lastSeen;
      io.emit('user_status', {
        [socket.user.id]: lastSeen
      });
    }
    console.log('Client disconnected: ' + socket.user.username);
  };

  // دالة لمعالجة الرسائل الجديدة
  const onMessage = (socket, data) => {
    let sender = socket.user.id;
    let receiver = data.receiver;
    let message = {
      sender: sender, receiver: receiver, content: data.content, date: new Date().getTime()
    };
    Message.create(message); // حفظ الرسالة في قاعدة البيانات
    socket.to(receiver).to(sender).emit('message', message); // إرسال الرسالة للمستخدمين المعنيين
  };

  // دالة لمعالجة حدث الكتابة
  const onTyping = (socket, receiver) => {
    let sender = socket.user.id;
    socket.to(receiver).emit('typing', sender); // إرسال حدث الكتابة للمستلم
  };

  // دالة لمعالجة حدث رؤية الرسائل
  const onSeen = (socket, sender) => {
    let receiver = socket.user.id;
    console.log({sender, receiver, seen: false});
    Message.updateMany({sender, receiver, seen: false}, {seen: true}, {multi: true}).exec(); // تحديث حالة الرؤية للرسائل
  };

  // دالة لجلب الرسائل الخاصة بمستخدم معين
  const getMessages = (userId) => { // دالة جلب قائمة الرسائل سواء المرسلة او الصادرة من قاعدة البيانات
    let where = [
      {sender: userId}, {receiver: userId}
    ];
    return Message.find().or(where);
  };

  // دالة لجلب المستخدمين باستثناء المستخدم الحالي
  const getUsers = (userId) => { // دالة للحصول على جميع جهات الاتصال
    let where = {
      _id: {$ne: userId} // هنا $ne تعني "لا تساوي" وهي شرط. تستثني جلب المستخدم الحالي 
    };
    return User.find(where).select('-password'); // سيتم جلب جميع جهات الاتصال ما عدا المستخدم المسجل الحالي
  };

  // دالة لإرسال البيانات الأولية عند الاتصال
  const initialData = (socket) => {
    let user = socket.user;
    let messages = [];
    getMessages(user.id)
    .then(data => {
      messages = data;
      return getUsers(user.id);
    })
    .then(contacts => {
      socket.emit('data', user, contacts, messages, users);
    })
    .catch(() => socket.disconnect());
  };

  return io; // إعادة كائن Socket.io للاستخدام في مكان آخر
};