const connect = require("connect")
const compress = require("compression")
const static = require("serve-static")
const bodyParser = require("body-parser")

var app = connect()
            .use(compress())
            .use((req,res)=>{
                res.end("hiho".repeat(100))})
            .listen(3000)
