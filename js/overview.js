/**Holds all methods related the overview*/
var overview = {};
/**
 * Anonymous function to prevent global namespace pollution
 */
(function(overview){
    /**
     * Initializes the overview
     */
    overview.init = function(){
        io.makeTree("../");
    }
})(overview);