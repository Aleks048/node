const connect = require("connect")
const query = require("connect-query")

var app = connect()
            .use(query)
            .use((req,res)=>{
                res.setHeader("Content-Type","application/json")
                res.end(JSON.stringify(req.query))
            })