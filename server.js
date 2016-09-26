//Initialpp
var express = require("express");
var app = express();
var https = require("https");
var mongodb = require("mongodb");
var MongoClient = mongodb.MongoClient;

//Passport
var passport = require("passport");
var Strategy = require("passport-twitter").Strategy;
var bodyparser = require("body-parser");
var cookieparser = require("cookie-parser");

//Mongo Collections
var book_collection;
var user_collection;


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
    book_collection = db.collection("book_collection");
    user_collection = db.collection("user_collection");
    
}); //End db connection



//Set up Passport Twitter Login Strategy
//Will be re-using my Twitter Voting App credentials
passport.use(new Strategy(
    {
        consumerKey: process.env.TWITTER_KEY,
        consumerSecret: process.env.TWITTER_SECRET,
        //callbackURL: "<PRODUCTION URL>"
        //Use below for development
        callbackURL: "http://localhost:3000/login/twitter/return"
        
    }, function(token, tokenSecret, profile, cb) {
        
        //Once user successfully logs on, query database to see if user already has profile
        //If they do not then create one
        
        var user = user_collection.find({ user_id: profile.id }).toArray(function(err, documents) {

            if(err) throw err;
            
            //If there are no results found then create new profile in database
            if(documents.length === 0) {
                
                user_collection.insert({ name: profile.displayName, user_id: profile.id, city: "", state: "" });
                
            }
            
        }); //End database find query
        
        
        return cb(null, profile);
    
        
}));



//Serialize User
//Which means we only save/remember a piece of the user profile and use that piece to reconstruct profile later
passport.serializeUser(function(user, cb) {
    cb(null, user.id);
});

//Deserialize User
//Here we take the part of profile that we remembered (userid usually) and search our database with it. 
//Once we find a match then we can pull the rest of the profile from our database
passport.deserializeUser(function(obj, cb) {
    
    
    user_collection.find({ user_id: obj }).toArray(function(err, documents) {
        
        name = documents[0].name;
        user_id = documents[0].user_id;

    });
    
    cb(null, obj); 
});


//Create all of the middleware needed for passport
//app.use(require("morgan")("combined"));
app.use(bodyparser.urlencoded({extended: false}));
app.use(cookieparser());
app.use(require("express-session")({ secret: "keyboard cat", resave: true, saveUninitialized: true }));

//Initialize passport session
app.use(passport.initialize());
app.use(passport.session());




//Server static files and set view engine
app.use("/", express.static(__dirname + "/public"));
app.set("view engine", "ejs");




//PAGE API END POINTS
app.get("/", function(request, response) {
    
    var user = request.user;
    //If user is logged in then tell EJS "yes" else, "no"
    if (request.user) { 
        var login = "yes";
    }
    
    else {
        var login = "no";
    }
    
    
    
    var book_list = [];
    
    book_collection.find().toArray(function(err, documents) {
        
        for (var i in documents) {
            
            var book_uploader = documents[i].user_id;
            var id = documents[i].book_id;
            var title = documents[i].book_title;
            var img_link = documents[i].img_link;
            
            var books = {
                book_uploader: book_uploader,
                id: id,
                title: title,
                img_link: img_link
            }
            
            book_list.push(books);
            
        } //End for loop
        
        
        response.render("index", { user: user, book_list: book_list, login: login });
        
    });
    
    
    
    
    
});


app.get("/profile", function(request, response) {
    
    var name;
    var city;
    var state;
    
    var user_books;
    var user_books_list = [];
    var book_id;
    var book_title;
    var img_link;
    
    //If user is logged in then tell EJS "yes" else, "no"
    if (request.user) { 
        
        var user_id = request.user;
        
        //Set login to yes
        var login = "yes";
        
        //Get user information from the database
        user_collection.find({ user_id: user_id }).toArray(function(err, documents) {
            
            if (err) throw err;
            
            //Get user information
            name = documents[0].name;
            city = documents[0].city;
            state = documents[0].state;
            
            //Get books user has added
            book_collection.find({ user_id: user_id }).toArray(function(err, documents) {
                
                if (err) throw err;
                
                if (documents.length > 0) {
                    
                    for (var i in documents) {
                        
                        user_books = {
                            book_id: documents[i].book_id,
                            book_title: documents[i].book_title,
                            img_link: documents[i].image_link  
                        }
                        
                        user_books_list.push(user_books);
                    }
                    
                }
                
                
                
                response.render("profile", { login: login, user_id: user_id, name: name, city: city, state: state, user_books: user_books_list });
                
            });
            
            
            
            
        });
        
    }
    
    else {
        var login = "no";
        
        response.redirect("/");
        //response.render("profile", { login: login, name: name, city: city, state: state });
    }
    

    
    
    
});

app.get("/settings", function(request, response) {
    
    //If user is logged in then tell EJS "yes" else, "no"
    if (request.user) { 
        var login = "yes";
    }
    
    else {
        var login = "no";
    }
    
    response.render("settings", { login: login });
    
    
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
    
    //Get the book information
    var user_id = request.user;
    var book_id = request.query.book_id;
    var book_title = request.query.book_title;
    var img_link = request.query.img_link;
    
    
    
    //Save book id to the database
    var result = book_collection.insert({ user_id: user_id, book_id: book_id, book_title: book_title, img_link: img_link }, function(err, results) {
        
        if (err) throw err;
        
        else { 
            response.send("Success");   
        }
       
        
        
    });

}); //End add book endpoint



app.get("/userupdate", function(request, response) {
    
    //Get user variables
    var user_id = request.query.user_id;
    var name = request.query.name;
    var city = request.query.city;
    var state = request.query.state;
    

    //Save information to the database
    var result = user_collection.find({ user_id: user_id }).toArray(function(err, results) {
        
        //If there is one result
        if (results.length === 1) {
            
            user_collection.update({ user_id: user_id }, { $set: { name: name, user_id: user_id, city: city, state: state } }, function(err, submit_results) {
                
                if (err) throw err;
                
                else {
                    response.send("Success");
                }
                
            });
        }
        
    });
    
    
});


app.get("/tradebook", function(request, response) {
    
    var book = request.query.book;
    var trade_requester = request.query.trade_requester;
    
    book_collection.update({ book_id: book }, { $set: { trade_requester: trade_requester } }, function(err, results) {
        
        if (err) throw err;
        
        else {
            response.send("Success");
        }
        
    });
    
    
    
});

app.get("/removebook", function(request, response) {
    
    
    response.send("Success");
    
});



app.get("/login/twitter", function(request, response) {
    

    passport.authenticate("twitter")(request, response);
    
});
    


app.get("/login/twitter/return", passport.authenticate("twitter", { failureRedirect: "/" }), function(request, response) { 
    
    //Retreive user query and redirect to the /searchapi to run search again before serving page back to user
    var userSearch = request.session.query;
    
    if (userSearch) {
        response.redirect("/searchapi?repop=yes&query=" + request.session.query); 
    }
    
    else {
        response.redirect("/");
    }
    
});



app.get("/logout", function(request, response) {
    
    console.log("Logging out...");
    request.logout();
    response.redirect("/");
       
});






app.listen(port);





