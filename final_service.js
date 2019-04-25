/*
Jojo Mills
Final Project
Web Programming 337
April 24, 2019

This page was pretty simple. It was just the formatting of the message for the POST and the JSON that is sent
to the GET. 


*/

const express = require("express");
const app = express();

var fs = require('fs');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", 
               "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.use(express.static('public'));

console.log('web service started');

app.post('/', jsonParser, function (req, res) { //POST function to append text to txt file
	res.header("Access-Control-Allow-Origin", "*");
	let player = req.body.player;
	let score = req.body.score;

	let newPost = "\n" + player + ":::" + score; //creates correct format to turn into JSON

	//how to get information from page

	fs.appendFile("scoreboard.txt", newPost, function(err) { //appends to file
    	if(err) {
			console.log(err);
			res.status(400);
    	}
    	console.log("The file was saved!");
    	res.send("Success!"); //success when file was saved successfully to the file
	});	
})

app.get('/', function (req, res) { //reads url and determines which mode to be in
	res.header("Access-Control-Allow-Origin", "*");
	let json = {};
	let scoreboard = [];
	let file = fs.readFileSync("scoreboard.txt", 'utf8');
	console.log(file);
	let lines = file.split("\n"); //splits info when finds new line
	for(let i =0; i<lines.length; i++){
		let info = lines[i].split(":::");
		let newScore = {};
		newScore["player"] = info[0]; //puts data into corret format
		newScore["score"] = info[1];
		scoreboard.push(newScore);
	}
	json["Scores"] = scoreboard;
	res.send(JSON.stringify(json));
})

app.listen(process.env.PORT);
