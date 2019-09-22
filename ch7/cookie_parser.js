const connect = require("connect")
const cookieParser = require("cookie-parser")

var app = connect()
            .use(cookieParser("tobi wobi"))//create the cookie parser//provide a secret string to get the signed cookies on constructor
            .use((req,res)=>{
                console.log(req.cookies)//regular cookies
                console.log(req.signedCookies)//signed cookies

                //setting outgoing cookies
                res.setHeader("Set-Cookie","foo=bar;")
                res.end()
            }).listen(3000)