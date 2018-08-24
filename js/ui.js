/**
 * This variable contains all UI code
 */
const ui = {}
/**
 * Give the variable to anonymous function once, to add all necessary functionality
 */
(function(ui){
    /**
     * Adds starting event listeners to buttons and other components
     */
    ui.addListeners = function(){

    }

    /**
     * Possible values for the notesview
     */
    ui.notesView = {
        PREVIEW: 0,
        SPLIT : 1,
        EDITOR : 2
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
                preview.addClass("noWidth");
                editor.addClass("wholeWidth");
            break;
            case ui.notesView.SPLIT:
                preview.addClass("halfWidth");
                editor.addClass("halfWidth");
            break;
            default:
            case ui.notesView.PREVIEW:
                preview.addClass("wholeWidth");
                editor.addClass("noWidth");
            break;
        }
    }
})(ui);