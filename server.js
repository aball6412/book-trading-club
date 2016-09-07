var express = require("express");
var app = express();
var https = require("https");
var mongodb = require("mongodb");
var MongoClient = mongodb.MongoClient;


var db_url = process.env.MONGOLAB_URI || "mongodb://localhost:27017/book_trading_club";
var port = process.env.PORT || 3000;


//Set up MongoDB connection
MongoClient.connect(db_url, function(err, db) {
    
    if (err) {
        console.log("Unable to connect to database");
    }
    else {
        console.log("Successfully connected to " + db_url);
    }
    
    //Set up db variables
    
}); //End db connection



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
    url = url + search_term + "&projection=lite&maxResults=5";
    

    //Make API call
    https.get(url, function(res) {
        
        var str = "";
        var search_results = [];
        
        res.on("data", function(chunk) {
            
            str += chunk;
            
        });
        
        res.on("end", function() {
            
            //Parse the data to JSON object
            var data = JSON.parse(str);
            
            
            
            //For each result get title and image and put into search results array
            for (var i in data.items) {
    
                try {
                    var id = data.items[i].id;
                    var title = data.items[i].volumeInfo.title;
                    var img = data.items[i].volumeInfo.imageLinks.thumbnail;

                    var data_results = {
                        id: id,
                        title: title,
                        img: img
                    }

                    search_results.push(data_results);
                      
                }
                
                catch(err) {
                    //Do nothing
                }
                

            } //End for loop
            
            
            //Send the data back to the client
            response.send(search_results);
            
        });
        
    });
    
    
}); //End /search_books endpoint



app.get("/add_book", function(request, response) {
    
    //Get the book id
    var book_id = request.query.book_id;
    var img_link = request.query.img_link;
    
    console.log(img_link);
    
    //Save book id to the database
    
    
    
    response.send("Book added");
    
    
    
}); //End add book enpoint






app.listen(port);





