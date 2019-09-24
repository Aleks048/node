const connect = require('connect')
const cookieParser = require("cookie-parser")
const session = require("express-session")
const favicon = require("connect-favicons")

// var app = connect()
//            // .use(favicon())
//             .use(cookieParser("sectret pekret"))
//             .use(session())
//             .use((req,res,next)=>{
//                 sess = req.session
//                 if (sess.views){
//                     sess.views++
//                     console.log(sess.views)
//                     res.setHeader("Content-Type","text/html")
//                     res.write("<p> Views "+sess.views+"</p>")
//                     res.end()
                    
//                 }else{                   
//                     sess.views = viewCount
//                     res.end("wielkommen .refresh")
//                 }
//             })
//             .listen(3000)

//expiring session
var hour = 3600000
var sessionOpts = {
    key:'myapp_sid',
    cookie:{maxAge:hour*24,secure:true}
}

var app = connect()
           // .use(favicon())
            .use(cookieParser("sectret pekret"))
            .use(session(sessionOpts))
            .use((req,res,next)=>{
                sess = req.session
                if (sess.views){
                    viewCount+=1
                    sess.views++
                    sess.cart.items.push(4)
                    console.log(sess.views)
                    console.log(sess.cart)
                    res.setHeader("Content-Type","text/html")
                    res.write("<p> Views "+sess.views+"</p>")
                    res.write("<p> Expires in "+(sess.cookie.maxAge/1000)+"</p>")
                    res.write("<p> httpOnly "+sess.cookie.httpOnly+"</p>")
                    res.write("<p> path: "+sess.cookie.path+"</p>")
                    res.write("<p> domain: "+sess.cookie.domain+"</p>")
                    res.write("<p> secure: "+sess.cookie.secure+"</p>")
                    res.end()                  
                }else{                   
                    sess.views = 1
                    req.session.cart={items:[1,2,3]}
                    res.end("wielkommen .refresh")
                }
            })
            .listen(3000)
