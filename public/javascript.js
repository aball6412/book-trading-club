$(document).ready(function() {
    
    
    $(".search_books").click(function() {

        //Get the search term
        var search_term = $(".search_term").val();
        
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
                
                
                $(".search_results").append("<div data-info='" + info.id + "," + info.title + "," + info.img + "' class='search_image col-xs-4'><img src='" + data[i].img + "' /></div>");
                $(".search_results").append("<div data-info='" + info.id + "," + info.title + "," + info.img + "' class='search_title col-xs-8'><b>" + data[i].title + "<b></div>");
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
            
            
            console.log(data);
            
        }); //End get request
        
        
        
        
    }); //End search results click
    
    
    
}); //End document