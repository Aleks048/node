const connect = require("connect")
const favicon = require("connect-favicons")
const logger = require("morgan")

connect()
    .use(favicon("./Tree1.pnj"))
    .use(logger())
    .use((req,res)=>{
        res.end("Hi ho")
    }).listen(3000)