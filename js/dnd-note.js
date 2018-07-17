/**Markdown convertor using Showndown JS */
var converter;

/**
 * Entry point for all the code
 */
$(document).ready(function(){
    //Load campaigns file
    load("notes/campaigns.md");
    
    //Initialize markdown convertor
    converter = new showdown.Converter({tables: true});
});

/**
 * Loads a file using the provided URL
 * @param {String} url the url to load the file from, can only be lower in the file
 * hierearchy!
 */
function load(url){
    $.get(url, function(data){
        var html = convert(data);
        html = replaceSymbols(html);
        $("body").html(html);
    });
}

/**
 * Checks for any of the agreed upon symbols in the text and replaces them
 * for the appropriate HTML elements
 */
function replaceSymbols(html){
    //Initiative number input textfield
    html = html.replace(/INITIATIVE/g, '<input type="number" size="3">');
    //Hp number input textfield
    html = html.replace(/HITPOINTS/g, '<input type="number" size="3">');
    return html;
}

/**
 * Converts the given markdown string into HTML
 * @param {String} markdown 
 */
function convert(markdown){
    return converter.makeHtml(markdown);
}