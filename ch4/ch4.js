const http = require("http")
const url = require("url")

items = []

var server = http.createServer((req,res)=>{
    switch (req.method){
        case "POST":
            var item = ""
            req.setEncoding("utf8")//encode the coming data
            req.on("data",(chunk)=>{//collect the chunks of data
                item+=chunk
            })
            req.on("end",()=>{//when received all data store in the items and response
                items.push(item)
                res.end("OK\n")
            })
            break
        case "GET":
            var body = items.map((item,i)=>{//contructing the body of the response
                return i+")"+item
            }).join("\n")
            res.setHeader("Content-Length",Buffer.byteLength(body))//setup the max length of the response sent from the server//use Buffer.byteLength to avoid problem with multibyte chars
            res.setHeader("Content-Type","text/plain; charset='utf-8'")
            res.end(body)
            break
        case "DELETE":
            let path = url.parse(req.url).pathname//we get the url requested, take the pathname from it
            let i = parseInt(path.slice(1),10) //convert pathname to a number

            //check if we can delete from the todo list items
            if (isNaN(i)){
                res.statusCode = 400
                res.end("Its not the page you're looking for")
            }else if (!items[i]){
                res.statusCode = 400
                res.end("Its not the page you're looking for")
            }else{
                items.splice(i,1)
                res.end("OK\n")
            }
            break
        case "PUT":
            //retrieve the data
            var item = ""
            req.setEncoding("utf8")
            req.on("data",(chunk)=>{
                item +=chunk
            })
            req.on("end",()=>{
                //updating the list
                let path = url.parse(req.url).pathname//we get the url requested, take the pathname from it
                let i = parseInt(path.slice(1),10) //convert pathname to a number

                //check if we can delete from the todo list items
                if (isNaN(i)){
                    res.statusCode = 400
                    res.end("Its not the page you're looking for")
                }else if (!items[i-1]){
                    res.statusCode = 400
                    res.end("Its not the page you're looking for")
                }else{
                    items[i-1] = item
                    res.end("OK\n")
                }
            })
            break
    }
}).listen(3000)