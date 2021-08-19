const request = require("request");
const fs = require("fs");
const path = require("path")
const cheerio = require("cheerio");
const matchCard = require("./matchInfo")


function extractAllMatches(url){
    request(url,callBack);
}

function callBack(error,response,body){
    if(error){
        console.log(error);
    }
    else{
        extractAllLinks(body);
    }
}


function extractAllLinks(body){
    let $ = cheerio.load(body);
    matchesList = $("a.match-info-link-FIXTURES");
    console.log("number of matches = "+matchesList.length);
    for(let i=0;i<matchesList.length;i++){
        let matchLink = $(matchesList[i]).attr("href");
        let fullLink = "https://www.espncricinfo.com"+matchLink;
        // console.log(fullLink);
        matchCard.getMatchInfo(fullLink);

    }
}


module.exports ={
    extractAllMatches : extractAllMatches
}