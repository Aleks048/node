exports.list = (req,res,next)=>{
    Photo.find({},(e,photos)=>{
        if(e)return next(err)
        res.render("photos",{
            title:"Photos",
            photos:photos
        })
    })
}
exports.form = (req,res)=>{
    res.render("photos/upload",{
        title:"Photos"
    })
}

var Photo = require("../models/photo")//get the mongoose model
var path = require("path")
var fs = require("fs")
var join = path.join

exports.submit = dir=>{
    return (req,res,next)=>{
        console.log("hi")
        var img = req.files.photo.image//get the image file
        var name = req.body.photo.name || img.name//get the image name
        var path = join(dir,img.name)
        
        console.log(img.path)
        console.log(path)
        fs.rename(img.path,path,e=>{
            if(e) return next(e)
            Photo.create({
                name:name,
                path:img.name
            },e=>{
                if (e) return next(e)
                res.redirect("/")//get back to the main page
            }
            )

        })
    }
}

exports.download = dir=>{
    return (req,res,next)=>{
        var id = req.params.id
        Photo.findById(id,(e,photo)=>{
            if (e) return next(e)
            var path  = join(dir,photo.path)
            res.sendfile(path)
        })
    }
}