/*
to get the posts
*/
var redis = require("redis")
var db = redis.createClient()


function Entry(obj){//copy everything from the object// constructor
    for (var key in obj){
        this[key] = obj[key]
    }
}
Entry.prototype.save = function(fn){
    var entryJSON = JSON.stringify(this)//puts itself into a string
    console.log(entryJSON)
    db.lpush(//add to the db
        "entries",
        entryJSON,
        e=>{
            if (e) return fn(e)
            fn()
        }
    )
}
//to retrieve entries
Entry.getRange = function(from,to,fn){
    db.lrange("entries",from,to,(e,items)=>{//get items from db as string
        if (e) return fn(e)
        var entries = []
        items .forEach(i=>{//collect as JSONs
            entries.push(JSON.parse(i))
        })
        fn(null,entries)//call cb
    })
}

module.exports = Entry