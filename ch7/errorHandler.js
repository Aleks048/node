const connect =require("connect")
const errorHandler = require("errorhandler")

var app = connect()
            .use((req,res,next)=>{setTimeout(()=>{next(new Error("broken fss"))},500)})
            .use(errorHandler)
            .listen(3000)