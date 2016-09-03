var express = require("express");
var app = express();


var port = process.env.PORT || 3000;


app.use("/", express.static(__dirname + "/public"));
app.set("view engine", "ejs");





app.get("/", function(request, response) {
    
    response.render("index");
    
});


app.get("/profile", function(request, response) {
    
    
    response.render("profile");
    
});

app.get("/settings", function(request, response) {
    
    
    response.render("settings");
    
    
});







app.listen(port);





