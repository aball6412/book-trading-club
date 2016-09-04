$(document).ready(function() {
    
    
    $(".search_books").click(function() {

        //Get the search term
        var search_term = $(".search_term").val();
        
        //Send search term to the server
        $.get("/search_books", { search_term: search_term }, function(data) {
            
            //Server response data
            console.log(data);
            
            
            
            
        }); //End get request
        
        
        
        
    }); //End search books click
    
    
    
}); //End document