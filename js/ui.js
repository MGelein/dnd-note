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

    /**
     * Called when a file is dropped on the editor
     * @param {Event} event 
     */
    ui.editorDrop = function(event){
        //Stop default response
        event.preventDefault();
        //Get the href, and do some magic with it
        let href = event.dataTransfer.getData("href");
        if(!href) return;
        //Clean the url, encode it
        href = encodeURI(href);
        //See what type of file it is
        if(io.isImage(href)){
            event.target.insertAtCaret("![50l](" + href + ")");
        }else if(io.isMarkdown(href)){
            if(event.ctrlKey){
                event.target.insertAtCaret("INCLUDE(" + href + ")");
            }else{
                event.target.insertAtCaret("[LINK](" + href + ")");
            }

        }
        //Else do nothing, we don't know what to do with it?
        //TODO: maybe make this popup as a normal link
        ui.updatePreview();
    }

    /**
     * Called by the links when they get dragged
     * @param {Event} event 
     */
    ui.dragStart = function(event, ref){
        event.dataTransfer.setData("href", $(ref).attr('href'));
    }

    //This array holds random values, if empty, it means no key was pressed recently
    ui.updateTimeout = [];

    /**
     * Updates the MD preview
     * @param {Boolean} force set to true, to force update even when preview is not visible
     */
    ui.updatePreview = function(force){
        //First check if the preview is even visible, if it isn't ignore the update request.
        if(!force && !$('#notePreview').is(":visible")) return;
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
                        editor.load(fileName);
                    }
                });


                //Set image width in percent to the alt-text of the image
                $('img').each(function(index, image){
                    //Retrieve ATL attribute, if set, else ignore, just use default settings
                    let alt = $(this).attr('alt');
                    if(!alt) return;
                    //Now check if there is a letter in there, afterwards, remove the letters
                    alt = alt.toLowerCase();
                    let float = "left";
                    //Set float according to letter found
                    if(alt.indexOf("l") != -1) float = "left";
                    else if(alt.indexOf("r") != -1) float = "right";
                    else if(alt.indexOf("c") != -1) float = "center";
                    float = "float:" + float + ";";
                    //Now remove that letter
                    let width = "50";
                    alt = alt.replace(/[c,l,r]/g, '');
                    //Check if the part is actually a number
                    if(!isNaN(alt)) width = alt;
                    width = "width:" + width + "%;";
                    //Now set this as the style of the img
                    $(this).attr("style", width + float);
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
        //Always update the preview window, in case it comes into view
    };
    
    /**
     * Set the notesView to one of the prepared values of
     * `ui.notesViews`
     * @param {Integer} notesView 
     */
    ui.setNotesView = function(notesView){
        //First update the preview
        ui.updatePreview(true);
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