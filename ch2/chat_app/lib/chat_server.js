const socketio = require("socket.io")
var io
var guestNumber = 1
var nickNames = {}// keys:socket.id //values: names by the user 
var namesUsed = []
var currentRoom = {}//keys: socket.id //values: room

//user first logs in he is added to the nicknames
function assignGuestName(socket,guestNumber,nickNames,namesUsed){
    var name = "Guest"+guestNumber//create new guest name

    nickNames[socket.id] = name //associate guest name with socket id

    socket.emit(//send the user note with its guest name
        "nameResult",
        {success:true,name:name}
    )
    namesUsed.push(name)//add the guest name as used
    return guestNumber+1
}

//name change request
function handleNameChangeAttempts(socket,nickNames,namesUsed){
    //add a listener for the socket for the nameAttempt events
    socket.on("nameAttempt",(name)=>{
        if (name.indexOf("Guest")==0){//check if the name of the guest starts with Guest
            socket.emit(
                "nameResult",{success:true,message:"Names cant start with Guest"}
            )}
        else{
            if (namesUsed.indexOf(name)==-1){//if the name was not registered before
                var prevName = nickNames[socket.id]//get the name
                var prevNameIndex = namesUsed.indexOf(prevName)//index of prev name in used names
                //swap the names
                namesUsed.push(name)
                nickNames[socket.id] = name
                delete namesUsed[prevNameIndex]//remove previous name to make it available
                socket.emit("nameResult",{success:true,name:name})
                socket.broadcast.to(currentRoom[socket.id]).emit("message",//send to everyone in the room that the user changed his name
                {
                    text:prevName+" is known as "+name+"."
                })
            }else{//if the name is already used
                socket.emit("nameResult",{success:false,message:"That name is already used."})
            }
        }
    }) 
}

// request to join the room// room is just a channel in Socket.IO
function joinRoom(socket,room){
    console.log("request to create a room or change it to room:",room," received")
    socket.join(room)// add user to the room
    currentRoom[socket.id] = room// see that the user is now in the room

    socket.emit("joinResult",{room:room})//notify user that he has joined the room

    socket.broadcast.to(room).emit("message",{//notify all the users in the room that a user has joined
        text:nickNames[socket.id]+"has joined"+room+"."})

    var usersInRoom = Object.keys(io.sockets.sockets);//get all users in the room
    
    //summarize all other users in the room
    if (usersInRoom.length>1){
        var usersInRoomSummary = "Users curr in " + room +":"
        for (var index in usersInRoom){
            var userSocketId = usersInRoom[index].id//get the user
            if (userSocketId!=socket.id){
                if (index>0){usersInRoomSummary+=", "}//format if add not the first user
                usersInRoomSummary+=nickNames[userSocketId]//add users name
            }
        }
        usersInRoomSummary+="."
        socket.emit("message",{text:usersInRoomSummary})//send summary of the other users to the joined user
    }       
}

//sending messages
function handleMessageBroadcasting(socket){
    socket.on("message",(message)=>{//make the socket listen to the message//when message comes use the second argument
        console.log("server received the message",message.text," for the room: ",message.room)
        socket.broadcast.to(message.room).emit("message",{// .room is available for all sent messages//room is a string
            text:nickNames[socket.id]+": "+message.text
            })
        }
    )
}

//creating room or joining the existing room
function handleRoomJoining(socket){
    socket.on("join", (room)=>{//lisen for the join // and perform second arg
        socket.leave(currentRoom[socket.id])//leave the current room
        joinRoom(socket,room.newRoom)//join new room
        }
    )
}
//handling user disconnections
function handleClientDisconnection(){
    io.sockets.on("disconnect",function(){
        var nameIndex = namesUsed.indexOf(nickNames[socket.id])
        delete namesUsed[nameIndex]
        delete nickNames[socket.id]
        }
    )
}


module.exports.listen = function (server){
    io = socketio.listen(server)//start socketio server and allowing it to be on the existing server channel
    //io.set("log level",1)//?s
    io.sockets.on("connection",(socket)=>{//defines how each user connection will be handles//args: eventName,handlerFunction//add listener for "connection"
        console.log("connected")
           guestNumber = assignGuestName(socket,guestNumber,nickNames,namesUsed)//get the socket id of the user

           joinRoom(socket,"Lobby")//add a connected user to the lobby room //

        handleMessageBroadcasting(socket,nickNames)//handle user messages//add listener for "message"

        handleNameChangeAttempts(socket,nickNames,namesUsed)//handle user name Change attempts// add listener for naem attempt""

        handleRoomJoining(socket)//handle user creating the room// add lstener for "join"

        socket.on("rooms",()=>{socket.emit("rooms",io.sockets.manager.rooms)})//give user the name of occupied rooms when requested//add listener to "rooms"

        handleClientDisconnection(socket,nickNames,namesUsed)//handle cleanup when user is disconnected//add listener to disconnect
    })
}