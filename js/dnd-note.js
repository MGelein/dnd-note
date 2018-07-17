/**Markdown convertor using Showndown JS */
var converter;

/**
 * Entry point for all the code
 */
$(document).ready(function(){
    //Load campaigns file
    load("notes/campaigns.md");
    
    //Initialize markdown convertor
    converter = new showdown.Converter();
});

/**
 * Loads a file using the provided URL
 * @param {String} url the url to load the file from, can only be lower in the file
 * hierearchy!
 */
function load(url){
    $.get(url, function(data){
        $("body").html(convert(data));
    });
}

/**
 * Converts the given markdown string into HTML
 * @param {String} markdown 
 */
function convert(markdown){
    return converter.makeHtml(markdown);
}