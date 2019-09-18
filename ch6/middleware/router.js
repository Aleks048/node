const parse = require("url").parse

module.exports = (obj)=>{//obj is the routes object
    return (req,res,next)=>{
        if (!obj[req.method]){//check if we have req.method in the defined in the routes obj
            next()//skip to next if  not defined
            return
        }

        let routes = obj[req.method]
        let url = parse(req.url)//standardize the 
        let paths = Object.keys(routes)//get the paths to req.methods as an array

        //attempt to find a match for the requested url
        for (var i =0;i<paths.length;i++){
            var path = paths[i]
            var fn = routes[path]
            path = path
                    .replace(/\//g,"\\/")//replacing the paths/ /g for global mathing
                    .replace(/:(\w+)/g,"([^\\/]+)")//remove garbage
            var re = new RegExp("^"+path+"$")//matches if starts and ends with the path

            var captures = url.pathname.match(re)//check match against path
            if (captires){
                var args = [req,res].concat(captures.slice(1))//?
                fn.apply(null,args)//apply the function that is specified for the 
                return //to prevent the next call when we found the requested url
            }
        }
    next()
    }
}