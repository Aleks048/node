const connect = require("connect")
const vHost = require("vhost")

const fs= require("fs")

var server = connect()

var sites = fs.readdirSync("./sites")

//single site
sites.forEach(site=>{
    server.use(vHost(site.slice(0,-3),require("./sites/"+site)))
})
server.listen(3000)

