//creating custom event emitters

var events = require("events").EventEmitter
var net  = require("net")

var channel = new events.EventEmitter();//create a listener-emitter
channel.clients = {};//we add clients properties to the channel
channel.subscriptions = {};//we add subscription properties to the channel

//when the client joins the channel
channel.on('join', function(id, client) {

  client.write("bon jour!")
  this.clients[id] = client;//add client to the channel clients

  //to let the client send messages
  this.subscriptions[id] = function(senderId, message) {//add the 
        //assign a func for each client that will be executed on client.emit("broadacst",senderId,message)
        if (id!=senderId){//to avoid sending message to yourself
            this.clients[id].write(message)
        }
    }
  this.on("broadcast",this.subscriptions[id])//add a listener on the channel for the broadcast message for each client
    
})
channel.on("leave",(id)=>{
    channel.removeListener(
        "broadcast",this.subscriptions[id])//remove broadcast listener for the client with "id"
    delete this.clients[id]
    delete this.subscriptions[id]
    channel.emit("broadcast",id,id+" has left the chat. \n")//let the other users know that the user left the chat
    
})
channel.on("shutdown",()=>{
    channel.emit("broadcast","","The chat is down.\n")//let the users know the chat is down
    channel.removeAllListeners("braodcast")//remove all listeners that listen to broadcast
})

//creating server
// takes a client and when the client sends "connect" it "join" him on the channel//when client emits "data", server makes channel.emit "broadcast" 
var server = net.createServer((client)=>{
    var id = client.remoteAddress+":"+client.remotePort//the address of the client
    //connect is the sandard message when the client tries to connect to channel
    channel.emit("join",id,client)

    client.on("data",(message)=>{//when the data is sent from the client
        message = message.toString()
        console.log("the server received",message)
        if (message=="shutdown\n"){
            channel.emit("shutdown")
        }else{
            console.log("emitting...")
            channel.emit("broadcast",id,message)}
    })
    client.on("close",()=>{
        console.log("client left")
        channel.emit("leave",id)})//emit leave when client disconnects
})
server.listen(8888)