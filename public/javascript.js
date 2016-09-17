$(document).ready(function() {
    
    
    $(".search_books").click(function() {

        //Get the search term
        var search_term = $(".search_term").val();
        
        //Clear any previous search results
        $(".search_results").html("");
        
        //Send search term to the server
        $.get("/search_books", { search_term: search_term }, function(data) {
            
            //Server response data 
            //Append each response item onto user's screen
            for (var i in data) {
                
                var info = {
                    id: data[i].id,
                    title: data[i].title,
                    img: data[i].img
                }
                
                //If title has a single quote in it then escape it with xml
                info.title = info.title.replace(/'/g, "&#39;");
                info.title = info.title.replace(/,/g, "");


                $(".search_results").append("<div data-info='" + info.id + "," + info.title + "," + info.img + "' class='search_image col-xs-2'><img src='" + info.img + "' height='50' width='50' /></div>");
                $(".search_results").append("<div data-info='" + info.id + "," + info.title + "," + info.img + "' class='search_title col-xs-10'><p><b>" + info.title + "<b></p></div>");
                $(".search_results").append("<br />");
            }
            
            
            
        }); //End get request

        
    }); //End search books click
    
    
    
    
    //WHEN BOOK IS SELECTED
    $(".search_results").on("click", ".search_image, .search_title", function() {
        

        //Get the selected book information
        var info = $(this).data("info");
        

        
        info = info.split(",");
        
        var id = info[0];
        var title = info[1];
        var img_link = info[2];
        
        

        //Send info to the API
        $.get("/add_book", { book_id: id, book_title: title, img_link: img_link }, function(data) {
            
            if (data === "Success") {
                
                //If successfully added book then clear search field
                $(".search_results").html("");
                
                //Display only the book that was added
                $(".selection").append("<div data-info='" + id + "," + title + "," + img_link + "' class='search_image col-xs-4'><img src='" + img_link + "' /></div>");
                $(".selection").append("<div data-info='" + id + "," + title + "," + img_link + "' class='search_title col-xs-8'><b>" + title + "<b></div>");
            }
            
            
            
        }); //End get request
        
        
    }); //End search results click
    
    
    
    
    //PROFILE SECTION
    var original_info = {
        name: "",
        city: "",
        state: ""
    }
    
    
    
    $(".user_information").on("click", ".edit_button, .edit_info", function() {
  
        //Get variables from the page
        var name = $(".info_name").html();
        var city = $(".info_city").html();
        var state = $(".info_state").html();
        
        //Save variables to the object
        original_info.name = name;
        original_info.city = city;
        original_info.state = state;
        
        if (name === undefined) {
            
            $(".name").html("<input type='text' class='user_name' placeholder='Enter Name' />");
        }
        else {
            $(".name").html("<input type='text' class='user_name' value='" + name + "' />");
        }
        
        
        if (city === undefined) {
            $(".city").html("<input type='text' class='user_city' placeholder='Enter City' />");
        }
        else {
            $(".city").html("<input type='text' class='user_city' value='" + city + "' />");
        }
        
        
        if (state === undefined) {
            $(".state").html("<input type='text' class='user_state' placeholder='Enter State' />");
            
        }
        else {
            $(".state").html("<input type='text' class='user_state' value='" + state + "' />");
        }
        
        
        $(".info_button").html("<button type='button' class='btn btn-success submit_button'>Submit</button><span class='cancel'> Cancel</span>");

        
    });
    
    
    //When user chooses to cancel editing
    $(".info_button").on("click", ".cancel", function() {
        
        
        //Put name back
        $(".name").html("<strong>Name: </strong><span class='info_name'>" + original_info.name + "</span><br />");
        
    
        //Put city back
        if (original_info.city) {
            $(".city").html("<strong>Name: </strong><span class='info_city'>" + original_info.city + "</span><br />");
        }
        else {
            $(".city").html("<strong>City: </strong><span class='edit_info'>Add Info</span><br />");
        }
        
        
        //Put state back
        if (original_info.state) {
            $(".state").html("<strong>Name: </strong><span class='info_state'>" + original_info.state + "</span><br />");
        }
        else {
            $(".state").html("<p><strong>State: </strong><span class='edit_info'>Add Info</span>");
        }
        

        //Put edit button back
        $(".info_button").html("<button type='button' class='btn btn-primary edit_button'>Edit</button>");
        
    });
    
    
    $(".info_button").on("click", ".submit_button", function() {
        
        //Get user information
        var user_id = $(".name").data("userid");
        var name = $(".user_name").val();
        var city = $(".user_city").val();
        var state = $(".user_state").val();
        
        var user_data = {
            user_id: user_id,
            name: name,
            city: city,
            state: state
        }
        

        
        //Make http request to server
        $.get("/userupdate", user_data, function(data) {
            
            if (data === "Success") {
                location.reload();
            }
            else {
                console.log("There was an error");
            }    
            
        });
    });
    
    
}); //End document









