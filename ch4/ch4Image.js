const http = require("http")
const formidable = require("formidable")

function show(req,res){
    var html = "<html><head><title>image</title></head><body>"
                +"<h1>image</h1>"
                +"<form method='post' action='/' enctype='multipart/form-data'>"
                + "<p><input type='text' name='name'></p>"
                + "<p><input type='file' name='file'></p>"
                + "<p><input type='submit' value='Upload'></p>"
                + "</form></body></html>"
    
    res.setHeader("Content-Type","text/html")
    res.setHeader("Content-Length",Buffer.byteLength(html))
    res.end(html)
}

function upload(req,res){
    if (!isFormData(req)){
        res.statusCode= 400
        res.end("Bad request for a bad day\n")
        return
    }

    let form  = new formidable.IncomingForm()//streams file uploads to the tmp/ folder


    ////wordy way of doing things
    // form.on("field",(field,value)=>{//what is entered in the name text field
    //     console.log(field)
    //     console.log(value)
    // })

    // form.on("file",(name,file)=>{//when file upload is complete//file object has size,path and other things to uploaded file
    //     console.log(name)
    //     console.log(file)
    // })
    // form.on("end",()=>{console.log("done uploading")})
    // form.parse(req)

    form.parse(req,(err,fields,files)=>{
        console.log(fields)
        console.log(files)
        res.end("Uploaded !")
    })
}
function isFormData(req){//check if the input is of the right format
    let type = req.headers["content-type"]||""
    return 0==type.pe.indexOf("multipart/form-data")
}

var server = http.createServer((req,res)=>{
    switch (req.method){
        case "GET":
            show(req,res)
            break
        case "POST":
            upload(req,res)
            break
    }
}).listen(3000)