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
    ui.init = function(){
        $('#editor').keyup(ui.updatePreview);
    };

    //This array holds random values, if empty, it means no key was pressed recently
    ui.updateTimeout = [];

    /**
     * Updates the MD preview
     */
    ui.updatePreview = function(){
        //Add a random value to the timeout array
        var r = Math.random();
        ui.updateTimeout.push(r);
        //Now wait for some time and remove it again, checking if this was the last one
        setTimeout(function(){
            let index = ui.updateTimeout.indexOf(r);
            ui.updateTimeout.splice(index, 1);

            //Only update if this was last change   
            if(ui.updateTimeout.length < 1){
                //First check for symbols and do other pre-processing
                let mdCode = $('#editor').val();
                mdCode = editor.preProcess(mdCode);

                //Now convert the data into HTML
                $('#preview').html(marked(mdCode));

                //Overwrite default link behaviuor
                $('#preview a').click(function(e){
                    //Prevent default behaviour
                    e.preventDefault();
                    //If this is a md file, load it.
                    let fileName = $(this).attr('href').toLowerCase();
                    let fileExt = fileName.substr(fileName.lastIndexOf("."));
                    if(fileExt === ".md"){
                        //Load the file
                        let file = io.load(fileName);
                        $('#editor').val(file);
                        ui.updateTimeout = [];
                        ui.updatePreview();
                    }
                });
            }
        }, 200);
    }

    /**
     * Possible values for the notesview
     */
    ui.notesView = {
        CURRENT: 2,
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
        //Update the global current value
        ui.notesView.CURRENT = notesView;
        //First fetch the two parts we need to edit, and remove any width classes.
        let preview = $('#notePreview');
        let editor = $('#noteEditor');
        //Now remove all width classes
        preview.removeClass("noWidth halfWidth wholeWidth");
        editor.removeClass("noWidth halfWidth wholeWidth");
        //Now see what we have to set them to
        switch(notesView){
            case ui.notesView.EDITOR:
                //Set widths
                preview.addClass("noWidth");
                editor.addClass("wholeWidth");
                //Manage visibility
                (preview.is(":visible")) ? preview.fadeOut(): undefined;
                (editor.is(":visible")) ? undefined: editor.fadeIn();
                ui.updateNotesViewButton();
            break;
            case ui.notesView.SPLIT_1:
            case ui.notesView.SPLIT_2:
                preview.addClass("halfWidth");
                editor.addClass("halfWidth");
                //Manage visibility
                (preview.is(":visible")) ? undefined: preview.fadeIn();
                (editor.is(":visible")) ? undefined: editor.fadeIn();
                ui.updateNotesViewButton();
            break;
            default:
            case ui.notesView.PREVIEW:
                preview.addClass("wholeWidth");
                editor.addClass("noWidth");
                //Manage visibility
                (preview.is(":visible")) ? undefined: preview.fadeIn();
                (editor.is(":visible")) ? editor.fadeOut(): undefined;
                ui.updateNotesViewButton();
            break;
        }
    };

    /**
     * Updates the noteViewButtongroup to reflect the current view
     * status of the notes editor
     */
    ui.updateNotesViewButton = function(){
        //First set all buttons to outline
        $('#notesViewBtn button').removeClass("btn-primary btn-outline-primary").addClass("btn-outline-primary");
        //Now set the right one to no outline
        switch(ui.notesView.CURRENT){
            case ui.notesView.EDITOR:
                $("#viewEditorBtn").removeClass("btn-outline-primary").addClass("btn-primary");
                break;
            case ui.notesView.PREVIEW:
                $("#viewPreviewBtn").removeClass("btn-outline-primary").addClass("btn-primary");
                break;
            case ui.notesView.SPLIT_1:
            case ui.notesView.SPLIT_2:
                $("#viewSplitBtn").removeClass("btn-outline-primary").addClass("btn-primary");
                break;
        };
    };

})(ui);