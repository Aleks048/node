//constructor for the Watcher class
function Watcher(watchDir,processedDir){
    this.watchDir = watchDir
    this.processedDir  = processedDir
}
//inherit functionality for the EventEmitter
var events = require("events")
, util = require("util")//util is from Node builtin module

util.inherits(Watcher,events.EventEmitter)//inherits is from Node//the same as - Watcher.prototype = new events.EventEmitter

var fs = require("fs")
, watchDir = "./watch"
, processedDir = "./done"

Watcher.prototype.watch = ()=>{//extending EventEmitter with the method to process files
    var watcher = this;//store reference to this for use in callback in readdir
    fs.readdir(this.watchDir,(err,files)=>{
        if (err) throw err
        for  (var index in files){
            watcher.emit("process",files[index])
        }
    })
}
Watcher.prototype.start = ()=>{//extend with method to start watching for files
    var watcher = this
    fs.watchFile(watchDir,()=>{//watchFile is monitoring if any file is changes// when file changes the watch method is called
        watcher.watch()
    })
}

var watcherM = new Watcher(watchDir,processedDir)

watcherM.on("process",(file)=>{
    var watchFile = this.watchDir + "/"+ file
    var processedFile = this.processedDir + "/" + file.toLowerCase()

    fs.rename(watchFile,processedFile,(err)=>{
        if (err) throw err
    })
})

watcherM.start()
