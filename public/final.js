/*
Jojo Mills
Final Project
Web Programming 337
April 24, 2019

This was the chunk of the project. Dealing with all the different cases of where the ball could hit the bricks
all over the canvas and being able to remove them and then account for the ones removed so you can re draw the bricks
and know where the bricks are and arent. I also used features of canvas to animate the ball bouncing around the screen
randomly. There is also a GET function that gets the leaderboard statistics from the text file. I also included a POST so 
the user could add new scores to the leaderboard. The top 5 scores are shown to the user. 


*/


(function(){
	let boardX = 260; //centers on gameArea
	let prevBoard = 260;
	let ballX = 320;
	let ballY = 225; //starts by falling onto board
	let down = true;
	let dy = 5;
	let dx = 0;
	let off = false;
	let lives = 3;
	let flag = 0;
	let remove = [];
	let draw = true;
	let moveBoard = 260;
	let score = 0;
	let newScore = true;
	let board = [];
	let brickx;
	let bricky;
	let exactX;
	let exactY;

	"use strict";

	window.onload = function() {
		newGame();
		resetGame();
		document.getElementById("start").onclick = startGame;
		document.getElementById("add").onclick = addScore;
		document.getElementById("new").onclick = startOver;
		drawBricks(); //draw the bricks initially
	
		document.getElementById("leaderboard").style.visibility = "hidden";
	}
	function startOver(){
		newGame();
		resetGame();
		document.getElementById("leaderboard").style.visibility = "hidden";
		document.getElementById("newScore").style.visibility = "hidden";

	}
	function newGame(){ //resets things to new game
		printBoard(); //prints the curent scoreboard to the page
		board = [[[0,0],[80,0],[160,0],[240,0],[320,0],[400,0],[480,0],[560,0]],
				[[0,25],[80,25],[160,25],[240,25],[320,25],[400,25],[480,25],[560,25]],
				[[0,50],[80,50],[160,50],[240,50],[320,50],[400,50],[480,50],[560,50]],
				[[0,75],[80,75],[160,75],[240,75],[320,75],[400,75],[480,75],[560,75]],
				[[0,100],[80,100],[160,100],[240,100],[320,100],[400,100],[480,100],[560,100]]];
		//console.log(board);
		newScore = true;
		lives = 3;
		remove = [];
		checkY = 137;
		rows = [5,5,5,5,5,5,5,5];
		Ythreshold = 137;
		score = 0;
		updateLives(); //sets to 3
		updateScore(); //sets to 0
		drawBricks(); //draws entire new board
		//document.getElementById("newSCORE").style.visibility = "hidden";
	}
	function resetGame(){ //resets ball and board when lives-1 >0
		//document.getElementById("leaderboard").style.visibility = "hidden";
		document.onkeydown = null;
		document.getElementById("start").disabled = false;
		let canvas = document.getElementById("canvas");
		let context = canvas.getContext("2d");
		context.fillStyle = "black";
		context.fillRect(0, 375, 640, 25);
		context.fillStyle = "white";
		context.fillRect(260, 375, 120, 20);

		prevBoard = 260;
		boardX = 260; //centers on gameArea
		ballX = 320;
		ballY = 225; //starts by falling onto board
		down = true;
		off = false;
		flag = 0;
		dy = 5;
		dx = 0;
		draw = true;
		moveBoard = 260;

		context.fillStyle = "white";
		context.beginPath();
		context.arc(ballX, ballY, 10, 0, 2 * Math.PI);
		context.fill();

	}
	function startGame(){
		//document.getElementById("leaderboard").style.visibility = "hidden";
		document.getElementById("start").disabled = true;
		newScore = false;
		document.onkeydown = movingBoard; //calls on function when key is pressed
		bounce();
	}
	function drawBricks() { //creates the tiles
		let brickX = 0;
		let brickY = 0;
		let canvas = document.getElementById("canvas");
		let context = canvas.getContext("2d");
		context.fillStyle = "black";
		context.fillRect(0,0,640,120);
	
		for(let i=0; i<5; i++){
			for(j =0; j<8; j++){
				if(remove != undefined){
					for(let k=0; k<remove.length; k++){
						if((remove[k][0] == brickX) && (remove[k][1]) == brickY){
							draw = false; //brick has been removed
							brickX+=80; //update to check next brick to the right
						}
					}
				}
				//console.log(draw);
				if(draw){
					context.beginPath();
					context.rect(brickX, brickY, 80, 25);
					if(i == 0){
						context.fillStyle = "#66FF66";
					}
					else if(i == 1){
						context.fillStyle = "#AAF0D1";
					}
					else if(i == 2){
						context.fillStyle = "#50BFE6";
					}
					else if(i == 3){
						context.fillStyle = "#FF6EFF";
					}
					else if(i ==4){
						context.fillStyle = "#E936A7";
					}
					context.fill();
					context.strokeStyle = "white";
					context.stroke();
					context.closePath();
					brickX+=80; //update to move to the next brick in the row
				}
				draw = true;

			}
			brickX=0; //resets x back to left of board
			brickY+=25; //moves down to next row
		}

	}

	function checkBoard(){ //sets flag when ball is off the moving board then -1 life
		if(ballX<boardX){
			off = true;
		}
		else if(ballX>boardX+120){
			off = true;
		}
	}
	function removeBrick(){ //determines the x and y value and if its a special case
		exactX = false;
		exactY = false;

		if((ballX>=78 && ballX<=80)|| ballX==80){ //first checks when ball hits side exactly
			brickx = 1; //if ballX is exactly value, then loop starts with right brick
			exactX = true;
		}
		else if((ballX>=80)&&(ballX<=82)){
			brickx = 0;
			exactX = true;
		}
		else if((ballX>=158 && ballX<=160)|| ballX==160){
			brickx = 2;
			exactX = true;
		}
		else if((ballX>=160)&&(ballX<=162)){
			brickx = 1;
			exactX = true;
		}
		else if((ballX>=238 && ballX<=240)|| ballX==240){
			brickx = 3;
			exactX = true;
		}
		else if((ballX>=240)&&(ballX<=242)){
			brickx = 2;
			exactX = true;
		}
		else if((ballX>=318 && ballX<=320)|| ballX==320){
			brickx = 4;
			exactX = true;
		}
		else if((ballX>=320)&&(ballX<=322)){
			brickx = 3;
			exactX = true;
		}
		else if((ballX>=398 && ballX<=400)|| ballX==400){
			brickx = 5;
			exactX = true;
		}
		else if((ballX>=400)&&(ballX<=402)){
			brickx = 4;
			exactX = true;
		}
		else if((ballX>=478 && ballX<=480)|| ballX==480){
			brickx = 6;
			exactX = true;
		}
		else if((ballX>=480)&&(ballX<=482)){
			brickx = 5;
			exactX = true;
		}
		else if((ballX>=558 && ballX<=560)|| ballX==560){
			brickx = 7;
			exactX = true;
		}
		else if((ballX>=560)&&(ballX<=562)){
			brickx = 6;
			exactX = true;
		}
		else if(ballX <78){ //now checks inbetween values
			brickx = 0;
		}
		else if(ballX >82 && ballX <158){
			brickx = 1;
		}
		else if(ballX >162 && ballX <238){
			brickx = 2;
		}
		else if(ballX >242 && ballX <318){
			brickx = 3;
		}
		else if(ballX >322 && ballX <398){
			brickx = 4;
		}
		else if(ballX >402 && ballX <478){
			brickx = 5;
		}
		else if(ballX >482 && ballX <558){
			brickx = 6;
		}
		else if(ballX >562){
			brickx = 7;
		}

		//finding y value
		if(ballY-10==25 || (ballY>=23 && ballY<=27)){
			bricky = 0;
			exactY = true;
		}
		else if(ballY-10==50 || (ballY>=48 && ballY<=52)){
			bricky = 1;
			exactY = true;
		}
		else if(ballY-10==75 || (ballY>=73 && ballY<=77)){
			bricky = 2;
			exactY = true;
		}
		else if(ballY-10==100 || (ballY>=98 && ballY<=102)){
			bricky = 3;
			exactY = true;
		}
		else if(ballY-10==125){
			bricky = 4;
			exactY = true;
		}
		else if(ballY > 102 && ballY< 125){
			bricky = 4;
		}
		else if(ballY <23){
			bricky = 0;
		}
		else if(ballY >37 && ballY <48){
			bricky = 1;
		}
		else if(ballY >52 && ballY <73){
			bricky = 2;
		}
		else if(ballY >77 && ballY <98){
			bricky = 3;
		}
	}
	function newBrickRemove(){ //tests each case only if the brick has not been removed yet

		let loop = 1;
		let bottom = false; //if loop stays as 1, bottom value doesnt matter
		let cornerLeft = false;
		let cornerRight = false;
	
		if(bricky==4 && exactX == true && exactY == true){
				bottom = true; //any doubles must be hit from the bottom
				loop = 2;
		}
		else if((exactX == true && exactY==false)||(exactX == false && exactY==true)){
			bottom = false;
			loop = 1;
		}
		else if(exactX == true && exactY==true){
				if(brickx==0){
					if(board[bricky][brickx+1] == [-1,-1]){
						bricky +=1;
						loop =1;
					}

				}
				else if(brickx==560){
					if(board[bricky][brickx-1] == [-1,-1]){
						bricky +=1;
						loop =1;
					}
				}
				if(board[bricky][brickx+1] == [-1,-1]){ //determine if hits on side or bottom
					bottom = false; //hit on side
					loop = 2; //from right
				}
				else if(board[bricky][brickx-1] == [-1,-1]){ //determine if hits on side or bottom
					bottom = false; //hit on side
					loop = 2; //from left
				}
				else if(board[bricky+1][brickx+1] == [-1,-1] && (board[bricky][brickx+1] != [-1,-1]) && (board[bricky+1][brickx] != [-1,-1]) && (bricky != 4)){
					cornerLeft = true;
					loop = 2;
				}
				else if(board[bricky+1][brickx-1] == [-1,-1] && (board[bricky][brickx-1] != [-1,-1]) && (board[bricky+1][brickx] != [-1,-1])&& (bricky != 4)){
					cornerRight = true;
					loop = 2;
				}
				else if(board[bricky][brickx+1] == [-1,-1] || board[bricky][brickx-1] == [-1,-1]){
					bricky +=1;
					loop=1;
				}
				else{
					loop = 2;
					bottom = true;
				}
		}

		for(let i = 0; i<loop; i++){ //loops through depending on where the ball is touching
			if(cornerLeft == true && i ==0){
				brickx +=1;
			}
			if(cornerRight == true && i ==0){
				brickx -=1;
			}
			//console.log(loop);
			let breakBrick = board[bricky][brickx]; //breakBrick is an array of size 2 representing x,y coordinate of brick

				if((breakBrick != [-1,-1]) || (breakBrick == undefined)){
					remove.push(breakBrick); //adds the coordinates to the remove array so can track what bricks have been removed
					
					board[bricky][brickx] = [-1,-1]; //sets values to -1 to show it's been removed in board

				}
				
			if(bottom==true){ //if hits from bottom, updates x and y to remove the second brick if needed
				brickx -= 1;
			}
			else if(bottom ==false){
				bricky += 1;
			}
			else if(cornerLeft == true){
				brickx -= 1;
				bricky += 1;

			}
			else if(cornerRight == true){
				brickx += 1;
				bricky += 1;
			}
		}
	}
	function movingBoard(event){ //moves the board along x axis when arrow keys are pressed
		let canvas = document.getElementById("canvas");
		let context = canvas.getContext("2d");
		moveBoard = boardX;
		if(event.keyCode == "39"){ //right
			if(boardX==520){
				boardX = 520; //stays same so does not leave canvas
			}
			else{
				prevBoard = boardX;
				boardX += 20; 
			}

			context.fillStyle = "black"; //creates the animation of the board moving
			context.fillRect(boardX-20, 375, 120, 20);

			context.fillStyle = "white";
			context.fillRect(boardX, 375, 120, 20);
		}
		if(event.keyCode == "37"){ //left
			if(boardX==0){
				boardX = 0; //stays same so does not leave canvas
			}
			else{
				prevBoard = boardX;
				boardX -= 20;
			}
			context.fillStyle = "black";
			context.fillRect(boardX+80, 375, 120, 20);

			context.fillStyle = "white";
			context.fillRect(boardX, 375, 120, 20);
		}


	}

	function bounce() { //function that creates the animation of the ball bouncing on the canvas
		let canvas = document.getElementById("canvas");
		let context = canvas.getContext("2d");
		// white out the background
		context.fillStyle = "black";
		context.fillRect(0, 0, 640, 400);

		drawBricks(); //redraws the bricks and board every time so dont need to keep prev x and y of ball
		context.fillStyle = "white";
		context.fillRect(boardX, 375, 120, 20);

		// draw the ball
		context.beginPath(); //draws white ball every time appearing like ball is moving
		context.arc(ballX, ballY, 10, 0, 2 * Math.PI);
		context.fillStyle = "white";
		context.fill();
		if(ballX >630 || ballX < 10){ //when hits canvas edges, change x direction
			dx = -dx;
		}
		if(down) { //when hits Y threshold, x and y values become opposite

			ballY += dy;
			ballX -= dx;
		} 
		else {

			ballY -= dy;
			ballX += dx;
		}
		context.stroke();

		if(off){ //if off the board it keeps drawing the ball until flag reaches certain value
			flag +=1;
		}

		if(ballY == 365) { //checks bottom
			checkBoard();
			if(off){
				flag = 0;
			}
			else{ //hits board
				down = false;
				let randomX = Math.random() * (2.5-0.3) + 0.3; //random value to change the x direction 
				if(remove.length>=15){ //once >=15 bricks have been broken, the angle becomes larger and randomizes more
					if(remove.length%2==0){
						randomX +=2;
					}
					else{
						randomX +=1;
					}
					
				}
				if(moveBoard == boardX){ //board does not move so x value becomes opposite
					dx = -dx;
				}
				else if(prevBoard<boardX){ //hit right key, knocks ball to the left
					dx = -randomX;
				}
				else if(prevBoard>boardX){ //hit left key, knocks ball to the right
					dx = randomX;
				}

			} 

		} 

		if(ballY <= 135 && ballY-5 >0) { //ball is within range of hitting bricks

			removeBrick(); //remove brick and determine x and y value where brick is located

			if((board[bricky][brickx][0] != -1) && (board[bricky][brickx][0] != undefined)){ //if brick already removed, animation continues
				newBrickRemove(); //only new bricks are added to remove array
				drawBricks(); //bricks redrawn to get rid of bricks that have been hit
				down = true; //then changes y direction
			}

		}
		if(ballY-5 == 0){ //if ball hits the top of the canvas change direction
			down=true;
		}

		if(flag >=8){ //flag to show the ball is out of the page
			updateLives();
			resetGame();
			return; //resets game and waits for user to press start button

		}

		updateScore(); //whenever bricks disappear, score is updated with the amount of objects in remove array
		window.requestAnimationFrame(bounce); //recalls function for animation
		
	}


	function updateScore(){ //score is the length of the array of the removed bricks
		score = remove.length;
		if(score == 40){ //player wins with perfect score

			document.getElementById("leaderboard").style.visibility = "visible";
			document.getElementById("newScore").style.visibility = "visible";
			document.getElementById("status").textContent = " "; 
			document.getElementById("status").textContent = "YOU WON!";
			document.getElementById("displayScore").textContent = " "; 
			document.getElementById("displayScore").textContent = "SCORE: " + score; 
		}
		else{
			document.getElementById("score").innerHTML = "score: " +  score;
		}
	}
	function updateLives(){
		//document.getElementById("leaderboard").style.visibility = "visible";
		if(newScore){
			lives = lives;
		}
		else{
			lives -= 1;
		}
		
		if(lives==0){ //when you score < 40 and out of lives
			document.getElementById("lives").innerHTML = "lives: " + lives;
			document.getElementById("leaderboard").style.visibility = "visible";
			document.getElementById("newScore").style.visibility = "visible";
			document.getElementById("status").textContent = " "; 
			document.getElementById("status").textContent = "GAMEOVER!";
			document.getElementById("displayScore").textContent = " "; 
			document.getElementById("displayScore").textContent = "SCORE: " + score; 
		}
		else{
		document.getElementById("lives").innerHTML = "lives: " +  lives;
		}
	}
	function addScore(){ //when button is pressed, the data is added to the txt file
		let player = document.getElementById("playerName").value;
		
		const message = {player: player, 
	                	 score: score}; //assigns name to fetch and format to the message
		const fetchOptions = {
			method : 'POST',
			headers : {
				'Accept': 'application/json',
				'Content-Type' : 'application/json'
			},
			body : JSON.stringify(message)
		};


		let url = "https://study-breaker.herokuapp.com";
		fetch(url, fetchOptions)
			.then(checkStatus)
			.then(function(responseText) {
				console.log(responseText);
				printBoard();
			})
			.catch(function(error) {
				console.log(error);
			});

		document.getElementById("playerName").value = "TYPE NAME HERE!"; //once you click to add the box disappears
		document.getElementById("newScore").style.visibility = "hidden";
	}

	function printBoard(){
		let url = "https://study-breaker.herokuapp.com";
		fetch(url)
			.then(checkStatus)
			.then(function(responseText) {

				let json = JSON.parse(responseText); 

							for(let i= 0; i<json["Scores"].length; i++){ //loops through entire file to be printed

								if(json["Scores"].length>=2){ //more than one player to print
									for(let j=i+1; j<json["Scores"].length; j++){ //ranks the scores in order to print top 5

										if((parseInt(json["Scores"][i]["score"])) < (parseInt(json["Scores"][j]["score"]))){ //converts to integers that can be compared
											let temp = json["Scores"][i];
											json["Scores"][i] = json["Scores"][j];
											json["Scores"][j] = temp;

										}


									}
								}
							}
				
							for(i = 0; i<json["Scores"].length && i < 5; i++){ //prints the top 5 scores on the leaderboard
										if(json["Scores"][i]["score"] == undefined){
											json["Scores"] = json["Scores"].splice(i);
										}
										let userScore = document.createElement("span");	
										userScore.className = "spanScore";		
										document.getElementById("score"+(i+1)).textContent = (i+1) + ". " + json["Scores"][i]["player"];
										document.getElementById("score"+(i+1)).appendChild(userScore);
										userScore.textContent = json["Scores"][i]["score"];
							}


					

			})
			.catch(function(error) {
				console.log(error);
			});
	}
	function checkStatus(response) {  
	    if (response.status >= 200 && response.status < 300) {  
	        return response.text();
	    } else if (response.status == 404) {
	    	// sends back a different error when we have a 404 than when we have
	    	// a different error
	    	return Promise.reject(new Error("Sorry, we couldn't find that page")); 
	    } else {  
	        return Promise.reject(new Error(response.status+": "+response.statusText)); 
	    } 
	}
	
}) ();
