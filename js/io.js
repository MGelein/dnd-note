/**Require file system access from the system */
const fs = require('fs');

/**
 * Contains all io functionality
 */
var io = {};

/**
 * Anonymoos wrapper function
 */
(function(io){

    const FILE = '<i class="fas fa-file-alt"></i>';
    const IMAGE = '<i class="far fa-file-image"></i>';
    const AUDIO = '<i class="far fa-file-audio"></i>';
    

    /**Initialzies IO functionality, basically mostly checks current working DIR */
    io.init = function(){
        io.directory = "..//" + __dirname.substr(__dirname.lastIndexOf("\\") + 1);
    }

    /**
     * Creates a directory at the specified location
     */
    io.makeDir = function(name){
        fs.mkdirSync(name);
    }

    /**
     * Loads the file designated by the provided url
     * @param {String} url 
     */
    io.load = function(url){
        if(fs.existsSync(url)) return fs.readFileSync(url, 'utf-8');
        else return undefined;
    }

    /**
     * Writes a file to disc, to the specified location
     */
    io.save = function(url, data){
        fs.writeFileSync(url, data);
    }

    /**
     * Scans a directory relative to the provided location,
     * which is stored in `io.workLocation`.
     * After that, stores this object in `io.workTree`
     * @param {String} url 
     */
    io.makeTree = function(url){
        //First set the workLocation
        io.workLocation = url;
        //Create a new empty tree.
        io.workTree = {};
        io.scanDir(io.workLocation, io.workTree);
        //Return the result, just to be sure
        return io.workTree;
    }

    /**
     * Updates the tree after something has changed, doesn't change the location
     */
    io.updateTree = function(){
        io.makeTree(io.workLocation);
    }

    /**
     * Scans the provided location, recursively checks for embedded directories,
     * adds them to the provided object
     * @param {String} path 
     */
    io.scanDir = function(path, object){
        //Now scan this dir, recursively.
        let files = fs.readdirSync(path);
        files.forEach(function(file, index){
            //Ignore files that are hidden (start with '.')
            if(file.indexOf('.') == 0) return;
            //Else check if this is a directory
            if(fs.lstatSync(path + "/" + file).isDirectory()){
                //First check if this is not the directory of the application
                if(path + "/" + file === io.directory) return;
                //If this is not the case, please expand the tree
                object[file] = {};
                io.scanDir(path + "/" + file, object[file]);
                //If this is a file, also add it, if it is allowed
            }else if(io.isAllowedFileType(file)){
                object[file] = "file";
            }
        });
    }

    /**
     * Removes the file signified by the provided url
     * @param {String} url the file to reove
     */
    io.removeFile = function(url){
        fs.unlinkSync(url);
    }

    /**
     * Checks to see if the extension of the provided file
     * matches any of the allowed extensions
     * @param {String} file 
     */
    io.isAllowedFileType = function(file){
        return io.isMarkdown(file) || io.isImage(file) || io.isAudio(file);
    }

    /**
     * Checks if the provided file type is an image file
     * @param {String} file 
     */
    io.isImage = function(file){
        //First see where, if it is there, the extension is
        let index = file.lastIndexOf(".");
        if(index < 1) return false;
        //Now grab the extension
        let ext = file.substr(index);
        let extIndex = [".jpg", ".jpeg", ".png", ".bmp", ".gif", ".svg"].indexOf(ext.toLowerCase().trim());
        //If the extension was in the whitelist, return true
        return (extIndex != -1);
    }

    /**
     * Check to see if the provided file type is considered an audio file
     */
    io.isAudio = function(file){
         //First see where, if it is there, the extension is
         let index = file.lastIndexOf(".");
         if(index < 1) return false;
         //Now grab the extension
         let ext = file.substr(index);
         let extIndex = [".mp3", ".ogg", ".wav", "wma"].indexOf(ext.toLowerCase().trim());
         //If the extension was in the whitelist, return true
         return (extIndex != -1);
    }

    /**
     * Check to see if it is a MD file
     * @param {String} file 
     */
    io.isMarkdown = function(file){
        //First see where, if it is there, the extension is
        let index = file.lastIndexOf(".");
        if(index < 1) return false;
        //Now grab the extension
        let ext = file.substr(index);
        return ext.toLowerCase() == ".md";
    }

    /**
     *Returns the appropriate ICON for the provided file type 
     * @param {String} file 
     */
    io.getIcon = function(file){
        if(io.isImage(file)) return IMAGE;
        else if(io.isAudio(file)) return AUDIO;
        else return FILE;
    }

})(io);