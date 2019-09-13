const mongoose = require("mongoose")

//connect to db
var db = mongoose.connect("mongodb://localhost/tasks")


//creating schema
var Schema = mongoose.Schema
var Tasks = new Schema({
    project:String,
    description:String
})
mongoose.model("Task",Tasks)//wrapper for the schema// gives interface for quering,creating,updating records

//creating new entry
var Task = mongoose.model("Task")
var task = new Task()
task.project = "Prrrrrrrrrr"
task.description = "This is the desctription"
//saving the entry
task.save(e=>{
    if (e) throw e
    console.log("Task saved")
})
// searching for the entry
var Task  = mongoose.model("Task")
Task.find({"project":"Prrrrrrrrrr"},(e,tasks)=>{
    if (e) throw e
    for (var i = 0;i<tasks.length;i++){
        console.log("ID:" + tasks[i]._id)
        console.log(tasks[i].description)
    }
})

//updating
var Task = mongoose.model("Task")
Task.update(
    {_id:"5d7bfecc25c2954614324cef"},
    {description:"Hahahah"},
    {multi:false},//update only one document
    (e,rows_updated)=>{
        if (e) throw e
        console.log("Upd")
    }
)

var Task = mongoose.model("Task")

Task.findById("5d7bfecc25c2954614324cef",(e,task)=>{
    task.remove()
}).then(()=>{mongoose.disconnect()})
