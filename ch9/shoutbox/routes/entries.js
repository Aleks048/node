const Entry = require("../lib/entry.js")
const router = require("express").Router()

router.get("/",(req,res,next)=>{
    
    Entry.getRange(0,-1,(e,entries)=>{
        if (e) return next(e)
        console.log("entrie",entries)
        res.render("entries",{
            title:"Entries",
            entries:entries
        })
    })
})
exports.list= router
exports.form = function(req,res,next){
    res.render("post",{title:"Post"})
}
exports.submit = function(req,res,next){
    var data= req.body.entry
    var entry = new Entry({
        "username":"u",//avoid login here res.locals.user.name
        "title":data.title,
        "body":data.body
    })
    entry.save(e=>{
        if (e) return next(e)
        res.redirect("/")
    })
}