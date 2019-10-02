const redis = require("redis")
const bcrypt = require("bcrypt")

var db = redis.createClient()//create redis connection


module.exports = User

function User (obj){//create an object from obj and take the properties
    for(var key in obj){
        this[key] = obj[key]
    }
}
User.prototype.hashPass = function(fn){
    var user = this
    bcrypt.genSalt(12,(e,salt)=>{//generating salt to avoid rainbow attacks//
        user.salt = salt
        bcrypt.hash(user.pass,salt,(e,hash)=>{//hash the user pass and save it there
            if (e) return fn(e)
            user.pass = hash
            fn()
        })
    })
}
//add a save func to the 
User.prototype.save = function(fn){//fn is the logging func and throwing errors
    //the original user does not have the id property
    console.log(this.name)
    if (this.id){// if we were able to find the user by id//user is already created
        this.update(fn)
    }else{//create new user
        var user = this
        
        db.incr("user:ids",(e,id)=>{//get a new id from the redis db
            if (e) return fn(e)
            user.id = id//set id so it is saved in the User instance
            user.hashPass(e=>{//get a hash of a pass and save it in the user
                if (e) return fn(e)
                user.update(fn)//update the db
           })
        })
    }
}
User.prototype.update = function(fn){//updating the user in redis db
    var user = this
    var id = user.id
    db.set("user:id:"+user.name,id,e=>{
        if (e) return fn(e)
        db.hmset("user:"+id,user,e=>{fn(e)})//set the values for the user in hash
    })
}
User.getByName = function(name,fn){
    User.getId(name,(e,id)=>{
        if (e) return fn(e)
        User.get(id,fn)
    })
}
User.getId = (name,fn)=>{
    db.get("user:id"+name,fn)
}
User.get = (id,fn)=>{
    db.hgetall("user: "+id,(e,user)=>{
        if (e) return fn(e)
        fn(null,new User(user))
    })
}
User.authenticate = (name,pass,fn)=>{
    User.getByName(name,(e,user)=>{
        if (e) return fn(e)
        if (!user.id) return fn()// since redis gives empty hash if record not found
        bcrypt.hash(pass,user.salt,(e,hash)=>{
            if (e) return fn(e)
            if (hash == user.pass) return fn(null,user)
            fn()
        })
    })
}



//testing
var test = new User({
    name:"fame",
    pass: "was ist das",
    age:"2"
})
console.log(typeof(test.hashPass))
test.save(e=>{
    if (e) throw e
    console.log("user id %d",this.id)
})