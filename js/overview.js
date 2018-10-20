/**Holds all methods related the overview*/
var overview = {};
/**
 * Anonymous function to prevent global namespace pollution
 */
(function (overview) {

    const FOLDER_CLOSED = '<i class="fas fa-folder"></i>';
    const FOLDER_OPEN = '<i class="fas fa-folder-open"></i>';
    const NEW_FILE = '<i class="fas fa-plus"></i>';

    /**
     * Initializes the overview
     */
    overview.init = function () {
        overview.update();
    }

    /**
     * Updates the overview
     */
    overview.update = function(){
        io.makeTree("../");
        overview.viewTree();
        $('#overview a[ondragstart]').contextmenu(function(event){
            ui.rightClicked = this;
            //First load the correct menu
            $('#popup').html(
                "<span onclick='overview.removeItem()'><i class=\"fas fa-trash-alt\"></i>&nbsp;Remove Item</span>"  
            );
            //Now show the popup menu
            $('#popup').show().offset({top: event.pageY, left: event.pageX});
        });
        
    }

    /**
     * Removes the provided item from the disk and itemlist
     */
    overview.removeItem = function(){
        let url = $(ui.rightClicked).attr('href');
        io.removeFile(url);
        overview.update();
    }

    /**
     * The visualization of the visible tree
     */
    overview.viewTree = function () {
        html = overview.renderFolder("", io.workTree, "../");
        $('#overview').html(html);

        //Prevent default link clicking
        $('#overview a').unbind('click').click(function (event) {
            event.preventDefault();
            //Now handle click based on what this is
            if ($(this).parent().has("ul").length > 0) {//This is a dir
                if ($(this).parent().find("ul").is(":visible")) {
                    $(this).find("i").removeClass("fa-folder-open").addClass("fa-folder");
                    $(this).parent().find("ul").hide();
                } else {
                    $(this).find("i").removeClass("fa-folder").addClass("fa-folder-open");
                    $(this).parent().find("ul").show();
                }
            } else {//This is a file, switch based on that
                let fileName = $(this).attr('href');
                if (io.isMarkdown(fileName)) {
                    editor.load(fileName);
                }
            }
        });

        //Now click every folder once to collapse everything
        $('#overview li:has(ul)>a').click();

        //Add listeners for the foldercontrols
        $('.folderControls i').unbind('click').click(function () {
            overview.addNewFile(this);
        });
    }

    /**
     * Starts the file creation dialogue
     * @param {JQueryReference} jqObject 
     */
    overview.addNewFile = function (jqObject) {
        //If we clicked the new file button
        let folder = $(jqObject).parent().parent();
        let filelist = folder.find("ul").show();
        let html = filelist.html();
        //add the newFile HTML 
        let newItem = "<li id='newFile'><span contenteditable='true'></span><li>";
        filelist.html(newItem + html);
        //Focus the contenteditable
        let span = $('#newFile span').focus();
        span.keydown(function(event){
            //Test if we pressed enter
            if(event.originalEvent.keyCode == 13){
                //Okay, store this result
                overview.makeNewFile();
            }else if(event.originalEvent.keyCode == 27){//ESC
                //Ignore result, remove this thing and continue
                $('#newFile').remove();
            }
            let key = event.originalEvent.key;
            if(!key.match(/[_\-\.a-zA-Z0-9 ]/g)){//Prevent illegal characters
                event.stopPropagation();
                return false;
            }
        }).blur(function(){//Also remove on blur
            $('#newFile').remove();
        });
    }

    /**
     * Creates a new file once the file creation dialog is finished.
     */
    overview.makeNewFile = function(){
        //Get the data from the newfile span
        let fileName = $('#newFile span').html().trim();
        let folderUrl = $('#newFile').parent().parent().find('a').first().attr('href');
        //Now remove it
        $('#newFile').remove();
        //After that check if the length is ok
        if(fileName.length == 0) return;
        //If so, let's continue, if the name has no extension, it's a folder
        //First see where, if it is there, the extension is
        let index = fileName.lastIndexOf(".");
        let isFolder = index < 0;
        //Now grab the extension
        let ext = fileName.substr(index);
        if(isFolder){
            io.makeDir(folderUrl + "/" + fileName);
        }else{
            //Check extension, if it is .md open it, else just leave it
            if(ext === '.md'){
                io.save(folderUrl + "/" + fileName, "");
            }else{
                //On other extensions, ignore for now
            }
        }
        //If we have done this, update overview anyway
        overview.update();
        //Now check if we can also open it
        if(!isFolder && ext === '.md') editor.load(folderUrl + "/" + fileName);
    }

    /**
     * Renders the provided folder object
     * @param {String} html the html we're creating
     * @param {Object} folder 
     */
    overview.renderFolder = function (html, folder, path) {
        html += "<ul>";
        let keys = Object.keys(folder);
        keys.forEach(function (key) {
            //Open the link item
            html += "<li><a href='" + path + "/" + key + "'";
            //Check what kind of item it is
            if (folder[key] === "file") {//If this is just a file, add it
                html += "ondragstart='ui.dragStart(event, this)'>";
                html += io.getIcon(key) + "&nbsp;" + key;
                html += "</a>";

            } else {
                html += ">"
                html += FOLDER_CLOSED + "&nbsp;" + key;
                html += "</a><span class='folderControls text-primary'>" + NEW_FILE + "</span>";
                html = overview.renderFolder(html, folder[key], path + "/" + key);
            }
            //Now close the link item
            html += "</li>";
        });
        html += "</ul>";
        return html;
    }

})(overview);