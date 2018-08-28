/**Holds all methods related the overview*/
var overview = {};
/**
 * Anonymous function to prevent global namespace pollution
 */
(function (overview) {

    const FOLDER = '<i class="fas fa-folder"></i>';
    const FILE = '<i class="fas fa-file-alt"></i>';

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
        //What happens when you click a list item
        $('#overview li').has("ul").find("a").unbind('click').click(function(event){
            //Now check if it is visible
            if($(this).parent().find("ul").is(":visible")){
                $(this).parent().find("ul").hide();
            }else{
                $(this).parent().find("ul").show();
            }
        });
        //Prevent default link clicking
        $('#overview a').unbind('click').click(function(event){
            event.preventDefault();
            //Now handle click based on what this is
            if($(this).parent().has("ul").length > 0){//This is a dir
                
            }else{//This is a file, switch based on that
                let fileName = $(this).attr('href');
                if(io.isMarkdown(fileName)){
                    editor.load(fileName);
                }
            }
        });
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
                html += FILE + "&nbsp;" + key;
                html += "</a>";
            }else{
                html += ">"
                html += FOLDER + "&nbsp;" + key;
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