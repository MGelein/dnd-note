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

    /**Initialzies IO functionality, basically mostly checks current working DIR */
    io.init = function(){
        io.directory = "..//" + __dirname.substr(__dirname.lastIndexOf("\\") + 1);
    }

    /**
     * Loads the file designated by the provided url
     * @param {String} url 
     */
    io.load = function(url){
        return fs.readFileSync(url, 'utf-8');
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
     * Checks to see if the extension of the provided file
     * matches any of the allowed extensions
     * @param {String} file 
     */
    io.isAllowedFileType = function(file){
        //First see where, if it is there, the extension is
        let index = file.lastIndexOf(".");
        if(index < 1) return false;
        //Now grab the extension
        let ext = file.substr(index);
        let extIndex = [".md", ".jpg", ".jpeg", ".png", "bmp", "gif", ".svg"].indexOf(ext.toLowerCase().trim());
        //If the extension was in the whitelist, return true
        return (extIndex != -1);
    }
})(io);