const connect = require("connect")
const logger = require("morgan")
const url = require("url")
const fs = require("fs")

// //basic
// var app = connect()
//             .use(logger())//default logger options if no arguments provided
//             .use((req,res)=>{res.end("hello from the server siiide")})
//             .listen(3000)


//customize logger
// var app = connect()
//             .use(logger(":method"))
//             .use((req,res)=>{res.end("hello from the server siiide")})
//             .listen(3000)
//custom token
// logger.token(":qq",(req,res)=>{
//     return url.parse(req.url).query
// })

//options of the logger
var log = fs.createWriteStream("./l.log",{flags:"a"})
var app = connect()
            //immediate - to write the log when req received
            //buffer  - to save log into the buffer so that it is not written to disk or //takes # ms before flush
            .use(logger({format:":method :url",stream:log,immediate:true,buffer:3}))
            .use((req,res)=>{res.end("hello from the server siiide")})
            .listen(3000)