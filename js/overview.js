/**Holds all methods related the overview*/
var overview = {};
/**
 * Anonymous function to prevent global namespace pollution
 */
(function (overview) {

    const FOLDER_CLOSED = '<i class="fas fa-folder"></i>';
    const FOLDER_OPEN = '<i class="fas fa-folder-open"></i>';

    /**
     * Initializes the overview
     */
    overview.init = function () {
        io.makeTree("../");
        overview.viewTree();
    }

    /**
     * The visualization of the visible tree
     */
    overview.viewTree = function () {
        html = overview.renderFolder("", io.workTree, "../");
        $('#overview').html(html);
        
        //Prevent default link clicking
        $('#overview a').unbind('click').click(function(event){
            event.preventDefault();
            //Now handle click based on what this is
            if($(this).parent().has("ul").length > 0){//This is a dir
                if($(this).parent().find("ul").is(":visible")){
                    $(this).find("i").removeClass("fa-folder-open").addClass("fa-folder");
                    $(this).parent().find("ul").hide();
                }else{
                    $(this).find("i").removeClass("fa-folder").addClass("fa-folder-open");
                    $(this).parent().find("ul").show();
                }
            }else{//This is a file, switch based on that
                let fileName = $(this).attr('href');
                if(io.isMarkdown(fileName)){
                    editor.load(fileName);
                }
            }
        });

        //Now click every folder once to collapse everything
        $('#overview li:has(ul)>a').click();
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
               
            }else{
                html += ">"
                html += FOLDER_CLOSED + "&nbsp;" + key;
                html += "</a>";
                html = overview.renderFolder(html, folder[key], path + "/" + key);
            }
            //Now close the link item
            html += "</li>";
        });
        html += "</ul>";
        return html;
    }

})(overview);