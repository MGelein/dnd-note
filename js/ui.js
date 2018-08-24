/**
 * This variable contains all UI code
 */
var ui = {};
/**
 * Give the variable to anonymous function once, to add all necessary functionality
 */
(function(ui){
    /**
     * Adds starting event listeners to buttons and other components
     */
    ui.addListeners = function(){
        $("#notes").click(function(){
            ui.toggleNotesView();
        });
    };

    /**
     * Possible values for the notesview
     */
    ui.notesView = {
        CURRENT: 0,
        PREVIEW: 0,
        SPLIT_1 : 1,
        EDITOR : 2,
        SPLIT_2: 3,
    };

    /**
     * Sets the notesView to the next mode
     */
    ui.toggleNotesView = function(){
        ui.notesView.CURRENT ++;
        if(ui.notesView.CURRENT > ui.notesView.SPLIT_2){
            ui.notesView.CURRENT = 0;
        }
        ui.setNotesView(ui.notesView.CURRENT);
    };
    
    /**
     * Set the notesView to one of the prepared values of
     * `ui.notesViews`
     * @param {Integer} notesView 
     */
    ui.setNotesView = function(notesView){
        //First fetch the two parts we need to edit, and remove any width classes.
        let preview = $('#notePreview');
        let editor = $('#noteEditor');
        //Now remove all width classes
        preview.removeClass("noWidth halfWidth wholeWidth");
        editor.removeClass("noWidth halfWidth wholeWidth");
        //Now see what we have to set them to
        switch(notesView){
            case ui.notesView.EDITOR:
                console.log('set to EDITOR');
                preview.addClass("noWidth");
                editor.addClass("wholeWidth");
            break;
            case ui.notesView.SPLIT_1:
            case ui.notesView.SPLIT_2:
                console.log("set to SPLIT");
                preview.addClass("halfWidth");
                editor.addClass("halfWidth");
            break;
            default:
            case ui.notesView.PREVIEW:
                console.log("set to PREVIEW");
                preview.addClass("wholeWidth");
                editor.addClass("noWidth");
            break;
        }
    };
})(ui);