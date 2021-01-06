const User = require('../../models/Users');

module.exports = {async isAdmin(req, res, next){
    console.log(req.isAuthenticated);
    const user = await User.findById(req.user.id);
    if(user && user.admin){
        return next()
    }
    else{
        res.redirect('/auth/login')
    }
    }}
