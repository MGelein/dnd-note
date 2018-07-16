/**
 * Entry point for all the code
 */
$(document).ready(function(){
    load("notes/campaigns.txt");

    
    var convertor = new showdown.Converter();
    var text = "# Hello World";
    var html = convertor.makeHtml(text);
    console.log(html);
});

/**
 * Loads a file using the provided URL
 * @param {String} url the url to load the file from, can only be lower in the file
 * hierearchy!
 */
function load(url){
    $.get(url, function(data){
        console.log(data);
    });
}