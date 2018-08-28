/**Holds all ini methods */
var ini = {};
//Setup temporary init function, get's replaced with instance of ini class later
ini.init = function(){
    ini = new Ini("config.ini");
}

/**
 * Ini class, used to load and save key value pairs
 * @param {String} url the url to load the file from
 */
function Ini(url){
    //This is the map object, holds all key value pairs
    this.map = {};
    //The location this file was loaded from
    this.url = url;
    //First load the data and split into lines
    let lines = io.load(url).replace(/\r/g, '').split("\n");
    //Self ref for scoping issues
    var self = this;
    //Now parse every line
    lines.forEach(function(line){
        //First clean the line
        line = line.replace(/;/g, '');
        line = line.trim();
        //Check if not empty line
        if(line.length < 2) return;
        //Check if it is not a comment line, or starts with illegal charactrer, if so, abort.
        if(line.charAt(0) == '[' || line.charAt(0) == '#') return;
        //Now split the line
        let parts = line.split('=');
        //Now store this in the map.
        self.map[parts[0].trim()] = parts[1].trim();
    });

    /**
     * Sets the provided key to the provided value
     * @param {String} key the key to set
     * @param {any} value the value to set
     */
    this.set = function(key, value){
        this.map[key] = "" + value;
        this.save();
    }

    /**
     * Returns the value associated with the provided key in this ini file.
     * This should be a string, but can ofcourse be parsed.
     * @param {String} key 
     */
    this.get = function(key){
        return this.map[key];
    }

    /**
     * Saves the changes back to the original INI file
     */
    this.save = function(){
        //Save back to dsk at original location
        io.save(this.url, this.stringify());
    }

    /**
     * Returns a string representation of this object, mostly used for saving
     */
    this.stringify = function(){
        //Get all existing keys in the map
        let keys = Object.keys(this.map);
        let output = "";
        //Self ref for scoping
        var self = this;
        //Go thorugh all the keys one by one
        keys.forEach(function(key){
            output += key + "=" + self.map[key] + ";\n";
        });
        //Now return the output
        return output;
    }
}