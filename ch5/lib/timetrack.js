const qs = require("querystring")//used to create the js object from the query that comes as a string from req

//simply send the givel html to client 
exports.sendHtml = (res,html)=>{
    console.log("sending html to client ")
    res.setHeader("Content-Type","text/html")
    res.setHeader("Content-Length",Buffer.byteLength(html))
    res.end(html)
}

//receive the data from the user//parse it into the object//apply callback on the data
exports.parseReceivedData = (req,cb)=>{
    var body = ""
    req.setEncoding("utf8")
    req.on("data",(chunk)=>{body+=chunk})
    req.on("end",()=>{
        var data = qs.parse(body)
        console.log("data ",data.id)
        cb(data)
    })
}



//DATABASE QUERIES
//add a record to the DB
exports.add  = (db,req,res)=>{
    console.log("going to add.\n")
    exports.parseReceivedData(req,(work)=>{
        console.log(work.id)
        db.query(
            "INSERT INTO work(hours,date,description) "+//the query to the db
            "VALUES (?,?,?);",//placeholders for the actual data
            [work.hours,work.date,work.description],//data  from the work 
            (err)=>{
                if(err) {throw err}
                exports.show(db,res)//when done show the user the results
            }
        )
    })
}
//delee values
exports.delete = (db,req,res)=>{
    console.log("going to delete.\n")
    exports.parseReceivedData(req,(work)=>{
        db.query(
            "DELETE FROM work WHERE id=?;",//DB query
            [work.id],//actual data put into placeholders
            (err)=>{
                if (err) {throw err}
                exports.show(db,res)//show user the result
            }
        )
    })
}
//update values// we can only update by marking work done and archive it
exports.archive = (db,req,res)=>{
    console.log("going to set work as archived\n")
    exports.parseReceivedData(req,(work)=>{
        console.log(work.id)
        db.query(
            "update work set archived=1 where id=?;",
            [work.id],
            (err)=>{
                if (err) {throw err}
                exports.show(db,res)
            }
        )
    })
}

//SHOWING TO USER   
//retrieve the data from the database
exports.show = (db,res,showArchived)=>{
    console.log("going to show.\n")
    var query = "SELECT * FROM work "+
                 "WHERE archived=? "+
                 "ORDER BY work.id DESC;"
    var archivedValue = (showArchived)? 1 : 0
    db.query(
        query,
        [archivedValue],
        (err,rows)=>{
            if (err) {throw err}
            html = (showArchived)?"":"<a href='/archived'>Archived work</a><br/>"//if we already show archived ten no link  else link to show archived
            html= exports.workHitlistHtml(rows)//create html table from results
            
            html+= exports.workFormHtml()
            exports.sendHtml(res,html)
        }
    )
}
//if we only want the archived works
exports.showArchived = (db,res)=>{
    console.log("going to show archived\n")
    exports.show(db,res,true)
}
//shows the list of the entries in the database
exports.workHitlistHtml = (rows)=>{
    console.log("creating table html\n")
    var html = "<table>"
    
    for (var i in rows){
        console.log(i)
        console.log("rows",rows[i].id)
        html+="<tr>"
        html+="<td>"+rows[i].date +"</td>"
        //html+="<td>"+rows[i].hours +"</td>"
        html+="<td>"+rows[i].description +"</td>"

        if (!rows[i].archived){
            html+="<td>"+exports.workArchiveForm(rows[i].id)+"</td>"
        }
    
        html +="<td>"+exports.workDeleteForm(rows[i].id)+"</td>"
        html+="</tr>"
    }
    html+="</table>"
    return html
}


//blanc html form for entering new record
exports.workFormHtml = ()=>{
    console.log("creating work form html\n")
    
    let html =  "<a href='/archived'>Show Archived</a>"+
                "<form method='POST' action='/'>"+
                
                "<p>Date (YYYY-MM-DD):<br/><input name='date' type='text'/></p>"+
                "<p>Description:</br>"+
                "<textarea name='description'></textarea></p>"+
                "<input type='submit' value='Add'/>"+
                "</form>"
    return html
}
//returns an html  form as a string//used to have actions in the table
exports.actionForm = (id,path,label)=>{
    console.log("action form")
    let html = "<form method='POST' action='"+path+"'>"+
                "<input type='hidden' name='id' value='"+id+"'/>"+
                "<input type='submit' value='"+label+"'/>"+
                "</form>"
    return html
}
exports.workArchiveForm = (id)=>{
    return exports.actionForm(id,"/archive","Arch")
}
exports.workDeleteForm = (id)=>{
    return exports.actionForm(id,"/delete","Delete")
}
