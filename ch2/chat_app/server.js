const http = require("http")//node module for http client and server functionality

const fs = require("fs")//filesystem functionality

const path = require("path")//path functionality

const chatServer = require("./lib/chat_server")//module to handle Socket.io server-chat functionality

const mime = require("mime")//derive mime type by filename extension 


var cache = {} //contents of the cached files will be stored here


//if file not found
function send404(response){
    response.writeHead(404,{"Content-Type":"text/plain"})
    response.write("Error 404: response not found.")
    response.end()
}
//if file requested is found
function sendFile(response,filePath,fileContents){
    response.writeHead(200,
        {"content-type":mime.lookup(path.basename(filePath))}
        )
    response.end(fileContents)
}

//check if the static assets are cashed if so send them else 404
function serveStatic(response,cache,absPath){
    if (cache[absPath]){
        sendFile(response,absPath,cache[absPath])
    }
    else{
        fs.exists(absPath,function(exists){//we use callbacks
            if (exists){//check if file exists
                fs.readFile(absPath,function(err,data){//trying to open it
                    if (err){
                        send404(response)
                    }
                    else{
                        cache[absPath] = data
                        sendFile(response,absPath,cache[absPath])
                    }
                })
            }else{
                send404(response)
            }
        })
    }
}

//creating the server
var server = http.createServer((request,response)=>{
    var filePath= false

    if (request.url=="/"){
        filePath = "public/index.html"
    }else{
        console.log("other urls","public/"+request.url)
        filePath = "public/"+request.url
    }
    var absPath = "./" + filePath
    serveStatic(response,cache,absPath)
})
//starting the server
server.listen(3000,()=>{console.log("I am listening at 3000")})

//start the socket.io functionality on the same tcp/ip port as server
chatServer.listen(server)