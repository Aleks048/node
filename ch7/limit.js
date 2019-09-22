const connect = require("connect")
const limit = require("limits")
const bodyParser = require("body-parser")

// var app = connect()
//             .use(limit("32kb"))
//             .use(bodyParser())
//             .listen(3000)

//using the wrapper for different limits
var type = (type,fn)=>{
    return (req,res,next)=>{
        var ct = req.headers["content-type"]||""
        if (0!=ct.indexOf(type)){
            return next()
        }
        fn(req,res,next)
    }
}
var app = connect()
            .use(type("application/json",limit("32kb")))
            .use(bodyParser())
            .listen(3000)


