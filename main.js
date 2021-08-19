//packages
const request = require("request");
const fs = require("fs");
const path = require("path")
const cheerio = require("cheerio");
const allMatch = require("./allMatches");

//other constants
const homeURL = "https://www.espncricinfo.com/series/ipl-2020-21-1210595";
const outputPath = path.join(__dirname,"batsmenStatistics");
function createDir(path){
    if(!fs.existsSync(path)){
        fs.mkdirSync(path);
    }
}
createDir(outputPath);


//callback function
function callBack(error,response,body){
    if(error){
        console.log("Error: ",error);
    }
    else{
        extractBody(body);
    }
}


//extracting information
function extractBody(body){

    let $ = cheerio.load(body)
    let anchor = $("a[data-hover = 'View All Results']") 
    let fullLink = "https://www.espncricinfo.com"+anchor.attr("href")
    // console.log(fullLink);
    allMatch.extractAllMatches(fullLink);    
}


//making request
request(homeURL,callBack);
