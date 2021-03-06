/**
 * Holds the edtior functions
 */
var editor = {};
/**
 * Anonymous fuction to prevent global namespace pollution
 */
(function (editor) {

    /**
     * Location of the current file we're editing
     */
    editor.currentFile = "";

    /**
     * Checks for any pre-processing that needs to be done on the
     * provided MD code, mostly checking for symbols
     * @param {String} code 
     */
    editor.preProcess = function (code) {
        //First check for includes
        code = editor.processIncludes(code);
        code = editor.processMonsters(code);
        return code;
    };

    /**
     * FIrst load on startup
     */
    editor.init = function () {
        editor.load(ini.get("lastFile"));
    }

    /**
     * Loads the file associated with the provided URL
     * @param {String} url 
     */
    editor.load = function (url) {
        //Set a ref to the currentFile, also update config
        editor.currentFile = url;
        ini.set("lastFile", url);
        //Start loading the file
        let file = io.load(url);
        //Check if we have to disable or enable the file screen
        if (file === undefined) {
            file = "";
            $('#editor').addClass('enabled');
        } else {
            $('#editor').removeClass('disabled');
        }
        $('#editor').val(file);
        //Reset the updateTimeouts
        ui.updateTimeout = [];
        //And force an update
        ui.updatePreview();
        //Also look for this file in overview and highlight (removing older highlights)
        $('#overview a').removeClass("currentFile");
        $('#overview a[href="' + url + '"').addClass("currentFile");
        //Also expand the folder containing this file, keep expanding untill it's visible
        var expand = $('#overview .currentFile').parent();
        if ($('.currentFile').length >= 1) {
            while (!$('#overview .currentFile').is(":visible")) {
                expand.show();
                expand = expand.parent();
            }
        }
    }

    /**
     * Look for monster includes
     */
    editor.processMonsters = function (code) {
        const symbol = "MONSTER(";
        var index = code.indexOf(symbol);
        var endIndex;
        while (index > -1) {
            //Find the end Index
            endIndex = code.indexOf(")", index);
            let nextOpening = code.indexOf("(", index + symbol.length);
            //Check if it is already closed, if not, ignore, just remove
            if (endIndex < 0 || nextOpening < endIndex) {
                let prePart = code.substring(0, index);
                let postPart = code.substring(index + symbol.length);
                code = prePart + postPart;
            } else {
                let expression = code.substring(index, endIndex + 1);
                //Find the fileName that needs to be included
                let monsterName = code.substring(index + symbol.length, endIndex);
                let data = monster.load(monsterName);
                //Replace the include with the correct data
                while (code.indexOf(expression) > -1) {
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

    /**
     * Look for script includes
     */
    editor.processIncludes = function (code) {
        const symbol = "INCLUDE(";
        var index = code.indexOf(symbol);
        var endIndex;
        while (index > -1) {
            //Find the end Index
            endIndex = code.indexOf(")", index);
            //Check if it is already closed, if not, ignore, just remove
            if (endIndex < 0) {
                let prePart = code.substring(0, index);
                let postPart = code.substring(index + symbol.length);
                code = prePart + postPart;
            } else {
                let expression = code.substring(index, endIndex + 1);
                //Find the fileName that needs to be included
                let fileName = code.substring(index + symbol.length, endIndex);
                let data = io.load(fileName);
                //Replace the include with the correct data
                while (code.indexOf(expression) > -1) {
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