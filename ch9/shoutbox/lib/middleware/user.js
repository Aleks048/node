var User = require("../user.js")

module.exports = function(req,res,next){
    var uid = req.session.uid
    if (!uid) return next()
    User.get(uid,(e,user)=>{//get data from redis
        if (e) return next(e)
        res.user=res.locals.user=user//res.locals is used by express to give data to templates
        next()
    })
}