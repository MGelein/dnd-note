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
})(io);