const http = require("http")

module.exports = http.createServer((req,res)=>{
    res.end("hello from the expressjs server\n")
})