$(document).ready(function() {
    
    
    $(".search_books").click(function() {

        //Get the search term
        var search_term = $(".search_term").val();
        
        //Send search term to the server
        $.get("/search_books", { search_term: search_term }, function(data) {
            
            //Server response data 
            //Append each response item onto user's screen
            for (var i in data) {
                $(".search_results").append("<div class='search_title'><h2>" + data[i].title + "</h2></div>");
                $(".search_results").append("<div class='search_image'><img src='" + data[i].img + "' /></div>");
            }
            
            
            
        }); //End get request
        
        
        
        
    }); //End search books click
    
    
    
}); //End document