
//const connect = require("connect")

var setup = (format)=>{
    var regexp = /:(\w+)/g //regular expression to mathch request properties
    return (req,res,next)=>{//the logger component
        let str = format.replace(regexp,(match,property)=>{//use regex to format log entry for request
            return req[property]
        })
        console.log(str)//print request log entry
        next()
    }
}
module.exports = setup