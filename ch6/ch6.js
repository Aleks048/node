const connect = require("connect")


connect()
    .use(logger)
    .use("/admin",restrict)
    .use("admin",admin)
    .use(hello)//mounting to differentiate the requests
    .listen(3000)


//to log the requested urls
function logger(req,res,next){
    console.log("%s %s",req.method,req.url)
    next()
}
//to response with hello
function hello(req,res){
    res.setHeader("Content-Type","text/plain")
    res.end("hello from the server siiiide")
}
function restrict(req,res,next){
    var authorization = req.headers.authorization//check if the request has the authorization
    if (!authorization) return next(new Error("unauthorized"))

    let parts = authorization.split(" ")
    let scheme = parts[0]
    let auth = Buffer.from(parts[1],"base64").toString().split(":")//divide by user and pass
    let user = auth[0]
    let pass = auth[1]
    console.log(user)
    console.log(pass)
    //check if the credentials are in db
    let authenticateWithDatabase = (user,pass,cb)=>{(user=="tobi"&& pass=="ferret")?console.log("good"):cb(new Error("unauthorized"))}

    authenticateWithDatabase(user,pass,(err)=>{
        if (err) {
            console.log("unautherized")
            throw ext(err)}//notify connect that the error has occured
        next()
    })
}
//admin response
function admin(req,res,next){
    switch (req.url){
        case "/":
            res.end("try /users")
            break
        case "/users":
            res.setHeader("Content-Type","application/json")
            res.end(JSON.stringify(["tobi","loki","jane"]))
            break
    }

}


