const http = require("http")

module.exports = (req,res)=>{
    http.createServer((req,res)=>{
    res.end("hello from the expressjs server\n")})
}