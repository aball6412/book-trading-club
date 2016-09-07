$(document).ready(function() {
    
    
    $(".search_books").click(function() {

        //Get the search term
        var search_term = $(".search_term").val();
        
        //Send search term to the server
        $.get("/search_books", { search_term: search_term }, function(data) {
            
            //Server response data 
            //Append each response item onto user's screen
            for (var i in data) {
                $(".search_results").append("<div id='" + data[i].id + "' data-internalid='" + data[i].id + "' class='search_image col-xs-4'><img src='" + data[i].img + "' /></div>");
                $(".search_results").append("<div data-internalid='" + data[i].id + "' class='search_title col-xs-8'><b>" + data[i].title + "<b></div>");
                $(".search_results").append("<br />");
            }
            
            
            
        }); //End get request
        
        
        
        
    }); //End search books click
    
    
    
    
    //WHEN BOOK IS SELECTED
    $(".search_results").on("click", ".search_image, .search_title", function() {
        
        
        //Get the selected book id
        var id = $(this).data("internalid");
        var img_link = $(this).children().attr("src");
        
        
        if (img_link === undefined) {
            //Get image link from the sibling that has book id as it's id
            img_link = $(this).siblings("#" + id).children().attr("src"); 
        }
        

        
        //Send info to the API
        $.get("/add_book", { book_id: id, img_link: img_link }, function(data) {
            
            
            console.log(data);
            
        }); //End get request
        
        
        
        
    }); //End search results click
    
    
    
}); //End document