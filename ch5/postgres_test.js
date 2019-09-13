const pg = require("pg")

//connecting to the postges
const conString = "tcp://myuser:pass@localhost:5433/mydatabase"
client = new pg.Client(conString)
client.connect()

//sending queries//insert
client.query(
    "INSERT INTO users"+
    "(username,age) VALUES ($1,$2) "+
    "RETURNING id",
    ["Mo",55])
    .then((result)=>{
            console.log(result.rows[0].id)
    })
    .catch(e =>{throw e})


//returning queries
const q  = client.query(
    "SELECT * FROM users WHERE age>$1",
    [53])
    .then(res=>{res.rows.forEach(row=>{console.log(row)})})
    .then(()=>client.end()) //ending the connection


