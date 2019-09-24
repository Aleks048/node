const express = require("express")
const basicAuth = require("express-basic-auth")

var users = {
    tobi:"coocoo",
    dobi:"tootoo"
}
// example
app=express()
        .use(basicAuth({
               // users:users,
                authorizer:(user,pass)=>{
                    console.log(user)
                    console.log(pass)
                    return users[user]===pass}
        }))
        .use((req,res)=>{res.end("secret")})
        .listen(3000)