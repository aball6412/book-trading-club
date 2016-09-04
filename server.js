var express = require("express");
var app = express();
var https = require("https");


var port = process.env.PORT || 3000;


app.use("/", express.static(__dirname + "/public"));
app.set("view engine", "ejs");




//PAGE API END POINTS
app.get("/", function(request, response) {
    
    response.render("index");
    
});


app.get("/profile", function(request, response) {
    
    
    response.render("profile");
    
});

app.get("/settings", function(request, response) {
    
    
    response.render("settings");
    
    
});


//RETURNING DATA API ENDPOINTS

app.get("/search_books", function(request, response) {
    
    
    //Make the query string
    var url = "https://www.googleapis.com/books/v1/volumes?q=";
    var search_term = request.query.search_term;
    url = url + search_term + "&projection=lite";
    

    //Make API call
    https.get(url, function(res) {
        
        var str = "";
        
        res.on("data", function(chunk) {
            
            str += chunk;
            
        });
        
        res.on("end", function() {
            
            console.log(str);
            
        });
        
    });
    
    
    
    response.send("Success");
    
});






app.listen(port);





