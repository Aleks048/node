const connect = require("connect")
const bodyParser = require("body-parser")
var app = connect()
            .use(bodyParser())
            .use((req,res)=>{
                console.log(req.body.username)
                res.end("New user: " + req.body.username)
            }).listen(3000)