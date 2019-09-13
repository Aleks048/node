const client = require("mongodb").MongoClient
const ObjectId = require("mongodb").ObjectID//to create the id

//connecting to db

var url = 'mongodb://localhost:27017/myproject'


client.connect(url,(e,client)=>{
    if (e) throw e
    let db = client.db("myproject")

    console.log("Connected to db")
    db.collection("test_insert",(e,collection)=>{
        if (e) throw e
        console.log("can do queries now")

       // var myID = ""
        collection.insert(
            {"title":"shmitle",
             "body":"whatody"
            },
            {safe:true,
             w:1
            },//insert finished before callback
            (e,records)=>{
                if (e) throw e
                console.log("Document id is:"+records.ops[0]._id)
                //myID = records.ops[0]._id
            }
        )
        var myID = ObjectId("5d7bf34f0c775429e8155b51")
        collection.update({_id:myID},
                          {$set:{"title":"I hate mongo"}},
                          {safe:true},
                          e=>{if (e) throw e}
        )
        collection.find({"title":"I hate mongo"}).toArray(
            (e,results)=>{
                if (e) throw e
                console.log(results)
            }
        )
        collection.remove({_id:myID},{safe:true},e=>{if (e) throw e})
    })
})

