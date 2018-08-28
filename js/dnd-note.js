/**
 * Entry point for all the code
 */
$(document).ready(function () {
    //Initialize IO
    io.init();
    //Add listeners to the ui
    ui.init();
    //Initialize the overview
    overview.init();
    //Load the ini file
    ini.init();
});

//Overwrite TextArea prototype, from (https://stackoverflow.com/questions/11076975/insert-text-into-textarea-at-cursor-position-javascript)
HTMLTextAreaElement.prototype.insertAtCaret = function (text) {
    text = text || '';
    if (document.selection) {
        // IE
        this.focus();
        var sel = document.selection.createRange();
        sel.text = text;
    } else if (this.selectionStart || this.selectionStart === 0) {
        // Others
        var startPos = this.selectionStart;
        var endPos = this.selectionEnd;
        this.value = this.value.substring(0, startPos) +
            text +
            this.value.substring(endPos, this.value.length);
        this.selectionStart = startPos + text.length;
        this.selectionEnd = startPos + text.length;
    } else {
        this.value += text;
    }
};