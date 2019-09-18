const connect = require("connect")
const router = require("./middleware/router")



connect()
    .use(router(require("./routes/user")))
    .listen(3000)
