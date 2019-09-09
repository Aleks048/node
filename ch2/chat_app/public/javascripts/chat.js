//the userSide script for sending to server

//create Chat object
var Chat = function(socket){
    this.socket = socket
}

//send message
Chat.prototype.sendMessage = (room,text)=>{
    this.socket.emit("message",{
        room:room,
        text:text
    })
}
//change room
Chat.prototype.changeRoom = (room)=>{
    this.socket.emit("join",{newRoom:room})
}

//process commands
Chat.prototype.processCommand = (command)=>{
    var words = command.split(" ")
    var command = words[0].substring(1,words[0].length).toLowerCase()//parse command//take only the first form words nad ct 1st symbom

    switch(command){
        case "join":
            words.shift()//cut the first word
            var room = words.join(" ")
            this.changeRoom(room)
            break
        case "nick":
            words.shift()
            var name = words.join(" ")
            this.socket.emit("nameAttempt",name)
            break
        default:
            message =  "Unrecognized command"    
    }
    return message
}