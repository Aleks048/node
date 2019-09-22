const connect = require("connect")
const logger = require("morgan")
const bodyParser = require("body-parser")
const methodOverride = require("method-override")

// connect()
//     .use(methodOverride("__method__"))
//     .listen(3000)

//to send the for to the user
var edit = (req,res,next)=>{
    if ("GET"!=req.method) return next()
    res.setHeader("Content-Type","text/html")
    res.write("<form method='post' action='/resource?_method=PUT'>")
    //res.write("<input type='hidden' name='_method' value='PUT'>")
    res.write("<input type='text' name='user[name]' value='Tobi'>")
    res.write("<input type='submit' value='Update'>")
    res.write("</form>")
    res.end()
}
var update = (req,res,next)=>{
    console.log("updating..",req.method)
    if("PUT" !=req.method) return next()
    res.end("Updated user with "+ req.body.user.name)
}

var app = connect()
            .use(logger('dev'))
            .use(bodyParser())
            .use(methodOverride('_method'))
            .use(edit)
            .use(update)
            .listen(3000)