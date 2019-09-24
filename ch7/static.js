const connect = require("connect")
const static = require("serve-static")

app = connect()
        .use("/app/files",static("public"))//mount it for /app/files request
        .listen(3000)