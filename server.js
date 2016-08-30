var express = require("express");
var app = express();


var port = process.env.PORT || 3000;


app.use("/", express.static(__dirname + "/public"));
app.set("view engine", "ejs");





app.get("/", function(request, response) {
    
    console.log("I'm in the server");
    
    response.render("index");
    
});







app.listen(port);





