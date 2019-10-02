exports.form = (req,res)=>{
    res.render("login",{title:"LOgin"})
}

var User = require("../lib/user")
exports.submit = (req,res,next)=>{
    var data  = req.body.user
    User.authenticate(data.name,data.pass,(e,user)=>{
        if (e) return next(e)
        if (user){
            req.session.uis = user.id
            res.redirect("/")
        }else{
            res.error("Wrong stuff is given")
            res.redirect("back")
        }
    })
}

exports.logout = (req,res)=>{
    req.session.destroy(e=>{
        if (e) return next(e)
        res.redirect("/")
    })
}