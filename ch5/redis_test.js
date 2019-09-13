const redis = require("redis")
const net  = require("net")

//connect to the db
var client  = redis.createClient(6379,"127.0.0.1")
client.on("error",err=>{console.log("Error "+err)})

//manipulating data

//key-value
client.set('color','red',redis.print)//redis.print to show the response
client.get('color',(e,v)=>{
    if (e) throw e
    console.log("Got ",v)})
//hash table
client.hmset("camping",{
    "shelter":1,
    "cooking":"mooking"
},redis.print)
client.hmget("camping","cooking",(e,v)=>{
    if (e) throw e
    console.log("the camping.cooking value is:",v)
})
client.hkeys("camping",(e,v)=>{
    if (e) throw e
    v.forEach((key,item)=>{
        console.log(" "+key)
    })
})
//lists
client.lpush("tasks","peeeepl",redis.print)
client.lpush("tasks","puuuupl",redis.print)
client.lrange("tasks",0,-1,(e,values)=>{
    if (e) throw e
    values.forEach((item)=>{
        console.log(" "+item)
    })
})
//sets //allways O(1)
client.sadd("id_adress","204.",redis.print)
client.sadd("id_adress","204.",redis.print)
client.sadd("id_adress","8.",redis.print)
client.smembers("id_adress",(e,values)=>{
    if (e) throw e
    console.log(values)
})

//channels
var server = net.createServer(socket=>{
    let subscriber
    let publisher

    socket.on("connect",()=>{
       subscriber = redis.createClient()
       subscriber.subscribe("main_room")
       subscriber.on("message",(channel,message)=>{
           socket.write("Channel" + channel +": "+ message)
       }) 
       publisher = redis.createClient()
    })
    socket.on("data",(data)=>{
        publisher.publish("main_room",data)
    })
    socket.on("end",()=>{
        subscriber.unsubscribe("main_room")
        subscriber.end()
        publisher.end()
    })
}).listen(3000)

