function divEscapedContentElement(message){//trusted text
    return $("<div></div>").text(message)
}
function divSystemContentElement(message){//untrasted text
    return $("<div></div>").html("<i>"+message+"</i>")
}
function processUserInput(chatApp,socket){//chatApp is Chat from chat.js
    var message = $("#send-message").val()

    var systemMessage
    console.log(message.charAt[0])
    console.log(message)
    if (message.charAt(0)=="/"){
        console.log("system message receeived")
        systemMessage = chatApp.processCommand(message)
        if (systemMessage){
            $("#messages").append(divSystemContentElement(systemMessage))}
    } else{
            chatApp.sendMessage($("#room").text(),message)//broadcast the message to other users
            $("#messages").append(divEscapedContentElement(message))
            $("#messages").scrollTop($("#messages").prop("scrollHeight"))
        }
    $("#send-message").val("")
}


var socket = io.connect("http://localhost:3000")//connect to the server Sockets

$(document).ready(()=>{
    var chatApp = new Chat(socket)

    socket.on("nameResult",(result)=>{
        var message
        if (result.success){
            message = "Yuo are "+result.name
        }else{
            message = result.message
        }
        $("#messages").append(divSystemContentElement(message))
    })

    socket.on("joinResult",(result)=>{
        $("#room").text(result.room)
        $("#messages").append(divSystemContentElement("Changed room"))
    })

    socket.on("message",(message)=>{
        console.log("message received by user: ",message.text)
        let element =  $("<div></div>").text(message.text)
        $("#messages").append(element)
    })

    socket.on("rooms",(rooms)=>{
        $("#room-list").empty()
        for (var room in rooms){
            room  = room.substring(1,room.length)
            if (room!=""){
                $("#room-list").append(divEscapedContentElement(room))
            }
        }
        $("$room-list div").click(()=>{
            chatApp.processCommand("/join "+$(this).text())
            $("#send-message").focus()
            })

        setInterval(()=>{
            socket.emit("rooms")
        },1000)
    })

    $("#send-form").submit(()=>{
        console.log("submitting the message")
        processUserInput(chatApp,socket)
        return false
    }) 
})