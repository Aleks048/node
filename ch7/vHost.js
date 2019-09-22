const connect = require("connect")
const vHost = require("vhost")

const app = require("./sites/expressjs")

var server = connect()

server.use(vhost("expressjs",app))