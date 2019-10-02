exports.form = (req,res)=>{
    res.render("register",{title:"Register"})
}

var User = require("../lib/user")

exports.submit = (req,res,next)=>{
    console.log(req.body)
    var data = req.body.user
    User.getByName(data.name,(e,user)=>{//check if the username is taken
        if (e) return next(e)
        
        if (user.id){//if we already have a user with this username
            req.error("The username is already taken")
            res.redirect("back")
        }else{
            user = new User({
                name:data.name,
                pass:data.pass
            })
            user.save(e=>{
                if (e) return next(e)
                req.session.uid = user.id
                res.redirect("/")
            })
        }
    })
}