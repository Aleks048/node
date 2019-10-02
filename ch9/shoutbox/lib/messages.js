var express = require("express")
var res = express.response

res.message = function(msg,type){
    type = type || "info"
    var sess = this.req.session
    sess.messages = sess.messages || []
    sess.messages.push({type:type, string:msg})
}
res.error = function(msg){
    console.log(msg)
    return this.message(msg,"error")
}


module.exports =function messages (req,res,next){
    res.local.messages = req.session.messages || []
    res.local.removeMessages = ()=>{
        req.session.messages = []
    }
    next()
}