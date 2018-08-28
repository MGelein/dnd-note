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
        console.log(io.workTree);
    }

    /**
     * Scans the provided location, recursively checks for embedded directories,
     * adds them to the provided object
     * @param {String} path 
     */
    io.scanDir = function(path, object){
        console.log("Scanning directory: " + path);
        //Now scan this dir, recursively.
        let files = fs.readdirSync(path);
        files.forEach(function(file, index){
            //Ignore files that are hidden (start with '.')
            if(file.indexOf('.') == 0) return;
            //Else check if this is a directory
            if(fs.lstatSync(path + "/" + file).isDirectory()){
                object[file] = {};
                io.scanDir(path + "/" + file, object[file]);
            //If this is a file, also add it
            }else{
                object[file] = "file";
            }
        });
    }
})(io);