/**
 * Holds the edtior functions
 */
var editor = {};
/**
 * Anonymous fuction to prevent global namespace pollution
 */
(function(editor){
    /**
     * Checks for any pre-processing that needs to be done on the
     * provided MD code, mostly checking for symbols
     * @param {String} code 
     */
    editor.preProcess = function(code){
        //First check for includes
        code = editor.processIncludes(code);
        return code;
    };

    editor.processIncludes = function(code){
        const symbol = "INCLUDE(";
        var index = code.indexOf(symbol);
        var endIndex;
        while(index > -1){
            //Find the end Index
            endIndex = code.indexOf(")", index);
            //Check if it is already closed, if not, ignore, just remove
            if(endIndex < 0){
                let prePart = code.substring(0, index);
                let postPart = code.substring(index + symbol.length);
                code = prePart + postPart;
            }else{
                let expression = code.substring(index, endIndex + 1);
                //Find the fileName that needs to be included
                let fileName = code.substring(index + symbol.length, endIndex);
                let data = io.load(fileName);
                //Replace the include with the correct data
                while(code.indexOf(expression) > -1){
                    let prePart = code.substring(0, code.indexOf(expression));
                    let postPart = code.substring(code.indexOf(expression) + expression.length);
                    code = prePart + data + postPart;
                }
            }
            //Now look for the next one
            index = code.indexOf(symbol);
        }
        return code;
    }
})(editor);