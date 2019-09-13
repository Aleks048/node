const http = require("http")
const work = require("./lib/timetrack")//??
const mysql = require("mysql")

var db = mysql.createConnection({//we establish a connection to the database
    host:"127.0.0.1",
    user:"myuser",
    password:"password",
    database:"timetrack"
})
//create server
var server = http.createServer((req,res)=>{
    switch (req.method){
        case "POST":
            console.log("posting preparing.\n")
            console.log(req.url,"\n")
            switch(req.url){
                case "/":
                    console.log("adding stuff")
                    work.add(db,req,res)
                    break
                case "/archive":
                    work.archive(db,req,res)
                    break
                case "/delete":
                    work.delete(db,req,res)
                    break
            }
            break
        case "GET":
            console.log("Get req received.\n")
            console.log("requested url",req.url,"\n")
            switch(req.url){                
                case "/":
                    work.show(db,res)
                    break
                case "/archived":
                    console.log("archive is requested")
                    work.showArchived(db,res)
            }
                
            break
    }
})

//create the table query//start the server
db.query(
    "CREATE TABLE IF NOT EXISTS work("
    +"id INT(10) NOT NULL AUTO_INCREMENT,"
    +"hours DECIMAL(5,2) DEFAULT 0,"
    +"date DATE,"
    +"archived INT(1) DEFAULT 0,"
    +"description LONGTEXT,"
    +"PRIMARY KEY (id));",
    (err)=>{
        if (err) {throw err}
        console.log("Server started. You're doomed")
        server.listen(3000,"127.0.0.1")
    }
)