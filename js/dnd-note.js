/**
 * Entry point for all the code
 */
$(document).ready(function(){
    //Initialize IO
    io.init();
    //Add listeners to the ui
    ui.init();
    //Initialize the overview
    overview.init();
});