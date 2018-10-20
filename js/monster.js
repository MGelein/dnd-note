var monster = {};
/**
 * The monster loading and caching module
 */
(function(monster){
    /**
     * Tries to load the specified monster from cache,
     * if it is not in cahce yet, cache it now. Return
     * the result after that.
     */
    monster.load = function(name){
        //See if a cache file exists
        let url = "..//monsters/" + name + ".json";
        if(fs.existsSync(url)){
            return io.load(url);//If the file exists, return that file
        }else{
            //We have to cache the file return loading for now
            return "Loading...";
        }
    }
})(monster);