//routes object
var routes = {//each entry has a url request and the callback to be called
    GET:{
        "/users":(req,res)=>{
            res.end("tobi, loki, ferret")
        },
        "/user/:id":(req,res,id)=>{//after semicolon we have the part that comes from the user 
            res.end("user" + id)
        }
    },
    DELETE:{
        "/user/:id":(req,res,id)=>{
            res.end("deleted user" + id)
        }
    }
}
module.exports = routes