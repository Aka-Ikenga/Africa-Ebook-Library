const mongoose = require('mongoose');

const {genPwd, isValid} = require('../config/pass');

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password:{
        hash: {
            type: String,
            required: true
        },
        salt: String,

    },
    admin: Boolean
});

const User = mongoose.model('Users', UserSchema);

// User.findOne({email: 'ichingasamuel@gmail.com'}, (err, user) => {
//     if(user){console.log('Admin has been created')}
//     else{
//         let pwd = process.env.PASSWORD;
//         pwd = genPwd(pwd);
//         User.create({name: 'Ichinga Samuel', email: 'ichingasamuel@gmail.com', password: pwd, admin: true})
//             .then(console.log('ok'))
//             .catch(console.error);
//     }
// });

module.exports = User;





