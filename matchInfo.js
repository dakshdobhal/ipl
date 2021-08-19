const request = require("request");
const fs = require("fs");
const path = require("path")
const cheerio = require("cheerio");
const matchCard = require("./matchInfo")
const xlsx = require("xlsx");

function callBack(error,response,body){
    if(error){
        console.log(error);
    }
    else{
        extract(body);
    }
}

function getMatchInfo(url){
    request(url,callBack);
}

function excelWriter(filePath, json, sheetName) {
    // workbook create
    let newWB = xlsx.utils.book_new();
    // worksheet
    let newWS = xlsx.utils.json_to_sheet(json);
    xlsx.utils.book_append_sheet(newWB, newWS, sheetName);
    // excel file create 
    xlsx.writeFile(newWB, filePath);
}
// // json data -> excel format convert
// // -> newwb , ws , sheet name
// // filePath
// read 
//  workbook get
function excelReader(filePath, sheetName) {
    if (fs.existsSync(filePath) == false) {
        return [];
    }
    // player workbook
    let wb = xlsx.readFile(filePath);
    // get data from a particular sheet in that wb
    let excelData = wb.Sheets[sheetName];
    // sheet to json 
    let ans = xlsx.utils.sheet_to_json(excelData);
    return ans;
}


function extract(body){
    let $ = cheerio.load(body);
    // let teams = $("a.name-link p.name");
    // let team1 = teams[0].data;
    // let team2 = teams[1].data;
    
    let inningsList = $("div.card.content-block.match-scorecard-table div.Collapsible");

    for(let i=0;i<inningsList.length;i++){

        let team = $(inningsList[i]).find("h5").text().split("INNINGS")[0].trim();
        let opponent = $(inningsList[1-i]).find("h5").text().split("INNINGS")[0].trim();


        let allRows = $(inningsList[i]).find(".table.batsman tbody tr");

        for (let j = 0; j < allRows.length; j++) {
            let allCols = $(allRows[j]).find("td");
            let isWorthy = $(allCols[0]).hasClass("batsman-cell");
            if (isWorthy == true) {
                //       Player  runs balls fours sixes sr 
                let playerName = $(allCols[0]).text().trim();
                let runs = $(allCols[2]).text().trim();
                let balls = $(allCols[3]).text().trim();
                let fours = $(allCols[5]).text().trim();
                let sixes = $(allCols[6]).text().trim();
                let sr = $(allCols[7]).text().trim();
                console.log(`${playerName} ${runs} ${balls} ${fours} ${sixes} ${sr}`);
                processPlayer(team, playerName, runs, balls, fours, sixes, sr, opponent);
            }
        }        
    }

    // console.log(teams[0].text+" vs "+teams[1].text);
}


function createDir(path){
    if(!fs.existsSync(path)){
        fs.mkdirSync(path);
    }
}


function processPlayer(team, playerName, runs, balls, fours, sixes, sr, opponent){

    let dirPath = path.join(__dirname,"ipl",team);
    createDir(dirPath);

    let filePath = path.join(dirPath,playerName+".xlsx");
    let content = excelReader(filePath, playerName);
    let playerObj = {
        team, playerName, runs, balls, fours, sixes, sr, opponent
    }
    content.push(playerObj);
    // excel write
    excelWriter(filePath, content, playerName);
}

module.exports={
    getMatchInfo:getMatchInfo
}