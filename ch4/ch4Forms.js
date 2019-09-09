const http = require("http")
const url = require("url")
const qs = require("querystring")//to parse the form data send from the user

var items = []

function show(res){
    var html = "<html><head><title>To-do-do-do</title></head><body>"
                +"<h1>Todododo list</h1>"
                +"<ul>"
                +items.map(function(item){
                    return "<li>"+item+"</li>"
                }).join(" ")
                +"</ul>"
                +"<form method='post' action='/'>"
                + "<p><input type='text' name='itemmm'></p>"
                + "<p><input type='submit' value='Add item'></p>"
                + "</form></body></html>"
    
    res.setHeader("Content-Type","text/html")
    res.setHeader("Content-Length",Buffer.byteLength(html))
    res.end(html)
}
function notFound(res){
    res.statusCode = 404
    res.setHeader("Content-Type","text/plain")
    res.end("Not foubnd what you're looking for, heh?\n")
}
function badRequest(res){
    res.statusCode = 400
    res.setHeader("Content-Type","text/plain")
    res.end("Bad request for a bad day.\n")
}
function add(req,res){
    var body =""
    req.setEncoding("utf8")
    req.on("data",(chunk)=>{body+=chunk})//get the data from input form
    req.on("end",()=>{
        var obj = qs.parse(body)//we receive a string of type "item=a+b+fdasa" and returns {item:"a b fdasa"}
        console.log(obj)
        items.push(obj.itemmm)//the key in the object is the form name
        show(res)//return to the original form
    })
}


var server = http.createServer((req,res)=>{
    if ("/"==req.url){
        switch (req.method){
            case "GET":
                show(res)
                break
            case "POST":
                add(req,res)
                break
            default:
                badRequest(res)
        }
    }else{
        notFound(res)
    }
}).listen(3000)