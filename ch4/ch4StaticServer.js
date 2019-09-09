const http = require("http")
const parse = require("url").parse
const join = require("path").join
const fs = require("fs")//inerits from event emitter

var root = __dirname

var server = http.createServer((req,res)=>{
    var url  = parse(req.url)
    var path =  join(root,url.pathname)//get the requested filename

    fs.stat(path,(err,stat)=>{//we open the static file with stat// this way we can check the version ,data and other stuff
        if (err){
            if ("ENOENT"==err.code){//if the named file does not exist
                res.statusCode = 404
                res.end("the file not found")
            }else{//any other error
                res.statusCode = 500
                res.end("internal server error")
            }
        }else{
            res.setHeader("Content-Length",stat.size)
            var stream = fs.createReadStream(path)

            // // not convenient way of streaming
            // stream.on("data",(chunk)=>{
            //     res.write(chunk)
            // })
            // stream.on("end",()=>{
            //     res.end()
            // })

            //streaming with pipes
            stream.pipe(res)//response is a writable stream here
            //listen to errors
            stream.on("error",(err)=>{
                res.statusCode = 500
                res.end("Internal server error")
            })
        }
    })

}).listen(3001)