const fs = require("fs")
const path = require("path")
var args = process.argv.splice(2)//to get tasks from cli
var command = args.shift()//get the first argument (the command)
var taskDescription = args.join(" ")//join renaining arguments
var file = path.join(process.cwd(),"/.tasks")//get the path relative to the current directory

switch(command){
    case "list":
        listTasks(file)
        break
    case "add":
        addTask(file,taskDescription)
    default:
        console.log("beg for help!!")
}

//if the file exists load it  if not return []
function loadOrInitializeTaskArray(file,cb){//cb is a func that takes the tasks and prints them
    fs.exists(file,(exists)=>{
        var tasks = []
        if (exists){
            fs.readFile(file,"utf8",(err,data)=>{
                if (err) throw err
                var data = data.toString()
                var tasks = JSON.parse(data || "[]")
                cb(tasks)
            })
        }else{
            cb([])
        }
    })
}
//when listing is required
function listTasks(file){
    loadOrInitializeTaskArray(file,(tasks)=>{
        tasks.map((item)=>{console.log(item)})
    })
}
//to save the tasks into the file
function storeTasks(file,tasks){
    fs.write(file,JSON.stringify(tasks),(err)=>{
        if (err) throw err
        console.log("Saved")})
}
function addTask(file,taskDescription){
    loadOrInitializeTaskArray(file,(tasks)=>{
        tasks.push(taskDescription)
        storeTasks(file,tasks)
    })
}
