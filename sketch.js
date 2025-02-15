var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;

var clouds;
var mountains;
var trees_x;
var canyons;
var collectables;

var game_score;
var flagpole;

var lives;

var enemies;

var platforms;
var isContact;

var jumpSound;
var restart;

let leftBtn, rightBtn, jumpBtn, restartBtn;

function preload()
{
    soundFormats('mp3','wav');
    
    //load your sounds here
    jumpSound = loadSound('assets/jump.wav');
    jumpSound.setVolume(0.1);
}

function setup() {
    createCanvas(1024, 576);
    floorPos_y = height * 3 / 4;
    lives = 3;
    startGame();

    // Create mobile control buttons outside the canvas and large
    leftBtn = createButton('←');
    leftBtn.position(20, height + 20);
    leftBtn.size(200, 200);
	leftBtn.style('font-size', '100px');
    leftBtn.mousePressed(() => isLeft = true);
    leftBtn.mouseReleased(() => isLeft = false);
    leftBtn.touchStarted(() => isLeft = true);
    leftBtn.touchEnded(() => isLeft = false);

    rightBtn = createButton('→');
    rightBtn.position(240, height + 20);
    rightBtn.size(200, 200);
	rightBtn.style('font-size', '100px');
    rightBtn.mousePressed(() => isRight = true);
    rightBtn.mouseReleased(() => isRight = false);
    rightBtn.touchStarted(() => isRight = true);
    rightBtn.touchEnded(() => isRight = false);

    jumpBtn = createButton('↑');
    jumpBtn.position(width - 240, height + 20);
    jumpBtn.size(200, 200);
	jumpBtn.style('font-size', '100px');

    jumpBtn.mousePressed(() => {
        if (gameChar_y == floorPos_y || isContact) {
            gameChar_y -= 100;
            jumpSound.play();
        }
    });
    jumpBtn.touchStarted(() => {
        if (gameChar_y == floorPos_y || isContact) {
            gameChar_y -= 100;
            jumpSound.play();
        }
    });

    // Create restart button
    restartBtn = createButton('Restart');
    restartBtn.position(width / 2 - 10, height + 20);
    restartBtn.size(200, 200);
    restartBtn.hide();
    restartBtn.mousePressed(() => {
        
        restartBtn.hide();
		setup();
    });
}

function draw() {
    background(250, 198, 104);
    noStroke();
    fill(0, 155, 0);
    rect(0, floorPos_y, width, height / 4);

    push();
    translate(scrollPos, 0);

    for (let i = 0; i < clouds.length; i++) {
        drawClouds(clouds[i]);
        clouds[i].x_pos += 1;
        if (clouds[i].x_pos > width + 500) clouds[i].x_pos = -100;
    }

    drawMountains();
    drawTrees();

    for (let i = 0; i < platforms.length; i++) {
        platforms[i].draw();
    }

    for (let i = 0; i < canyons.length; i++) {
        drawCanyon(canyons[i]);
        checkCanyon(canyons[i]);
    }

    for (let i = 0; i < collectables.length; i++) {
        if (!collectables[i].isFound) {
            drawCollectable(collectables[i]);
            checkCollectable(collectables[i]);
        }
    }

    for (let i = 0; i < enemies.length; i++) {
        enemies[i].draw();
        if (enemies[i].checkEnemyContact(gameChar_world_x, gameChar_y)) {
            if (lives > 0) {
                lives--;
                startGame();
                break;
            }
        }
    }

    renderFlagpole();
    pop();

    drawGameChar();

    fill(1);
    noStroke();
    text("Score: " + game_score, 20, 20);
    text("Lives: " + lives, 20, 40);

    for (let i = 0; i < lives; i++) {
        fill(255, 0, 0);
        ellipse(25 + i * 20, 50, 10, 10);
    }

    if (lives < 1) {
        fill(1);
        text("Game over. Press Restart", width / 2 - 100, height / 4);
        restartBtn.show();
		restart = true;

        return;
    }

    if (flagpole.isReached) {
        fill(1);
        text("Level complete.", width / 2 - 100, height / 4);
        restartBtn.show();
		restart = true;

        return;
    }

    if (isLeft) {
        if (gameChar_x > width * 0.2) gameChar_x -= 10;
        else scrollPos += 10;
    }

    if (isRight) {
        if (gameChar_x < width * 0.8) gameChar_x += 10;
        else scrollPos -= 10;
    }

    if (gameChar_y < floorPos_y) {
        isContact = false;
        for (let i = 0; i < platforms.length; i++) {
            if (platforms[i].checkContact(gameChar_world_x, gameChar_y)) {
                isContact = true;
                break;
            }
        }
        if(isContact == false)
            {
		          gameChar_y+=5  
			  isFalling=true;
            }
    } else {
        isFalling = false;
    }

    if (isPlummeting) gameChar_y += 15;

    if (!flagpole.isReached) checkFlagpole();
    checkPlayerDie();
    gameChar_world_x = gameChar_x - scrollPos;
}

function keyPressed() {
    if (key == 'A' || keyCode == 37) isLeft = true;
    if (key == 'D' || keyCode == 39) isRight = true;
    if (keyCode == 32 && (gameChar_y == floorPos_y || isContact)) {
        gameChar_y -= 100;
        jumpSound.play();
    }
}

function keyReleased() {
    if (key == 'A' || keyCode == 37) isLeft = false;
    if (key == 'D' || keyCode == 39) isRight = false;
}


// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.
function drawGameChar()
{
    stroke(1);
	//the game character
	if(isLeft && isFalling)
	{
		// add your jumping-left code
		//head
		fill(255,198,153);
		ellipse(gameChar_x,gameChar_y-45,30,50);
		//arms
		rect(gameChar_x-20,gameChar_y-40,10,20);
		rect(gameChar_x+10 ,gameChar_y-40,10,20);
		//body
		fill(0,255,0);
		rect(gameChar_x-15,gameChar_y-45,30,25);
		//feet
		fill(255,198,153);
		rect(gameChar_x+3 ,gameChar_y-25,10,10);
		rect(gameChar_x-12 ,gameChar_y-25,10,10);
		//eyes
		fill(1);
		rect(gameChar_x-7,gameChar_y-62,3,3);
		//mouth
		ellipse(gameChar_x-6,gameChar_y-50,10,8);

	}
	else if(isRight && isFalling)
	{
		// add your jumping-right code
		//head
		fill(255,198,153);
		ellipse(gameChar_x,gameChar_y-45,30,50);
		//arms
		rect(gameChar_x-20,gameChar_y-40,10,20);
		rect(gameChar_x+10 ,gameChar_y-40,10,20);
		//body
		fill(0,255,0);
		rect(gameChar_x-15,gameChar_y-45,30,25);
		//feet
		fill(255,198,153);
		rect(gameChar_x+3 ,gameChar_y-25,10,10);
		rect(gameChar_x-12 ,gameChar_y-25,10,10);
		//eyes
		fill(0);
		rect(gameChar_x+5,gameChar_y-62,3,3);
		//mouth
		ellipse(gameChar_x+6,gameChar_y-50,10,8);
	

	}
	else if(isLeft)
	{
		// add your walking left code
		//head
		fill(255,198,153);
		ellipse(gameChar_x,gameChar_y-45,30,50);
		//feet
		rect(gameChar_x-5 ,gameChar_y-11,10,10);
		//body
		fill(0,255,0);
		rect(gameChar_x-15,gameChar_y-45,30,40);
		//arms
		fill(255,198,153);
		rect(gameChar_x-5,gameChar_y-40,10,20);
		//eyes
		fill(0);
		rect(gameChar_x-8,gameChar_y-62,3,8);
		//mouth
		ellipse(gameChar_x-10,gameChar_y-50,8,4);

	}
	else if(isRight)
	{
		// add your walking right code
		//head
		fill(255,198,153);
		ellipse(gameChar_x,gameChar_y-45,30,50);
		//feet
		rect(gameChar_x-5 ,gameChar_y-11,10,10);
		//body
		fill(0,255,0);
		rect(gameChar_x-15,gameChar_y-45,30,40);
		//arms
		fill(255,198,153);
		rect(gameChar_x-5,gameChar_y-40,10,20);
		//eyes
		fill(0);
		rect(gameChar_x+5,gameChar_y-62,3,8);
		//mouth
		ellipse(gameChar_x+10,gameChar_y-50,8,4);
	

	}
	else if(isFalling || isPlummeting)
	{
		// add your jumping facing forwards code
		//head
		fill(255,198,153);
		ellipse(gameChar_x,gameChar_y-45,30,50);
		//arms
		rect(gameChar_x-20,gameChar_y-40,10,20);
		rect(gameChar_x+10 ,gameChar_y-40,10,20);
		//body
		fill(0,255,0);
		rect(gameChar_x-15,gameChar_y-45,30,25);
		//feet
		fill(255,198,153);
		rect(gameChar_x+3 ,gameChar_y-25,10,10);
		rect(gameChar_x-12 ,gameChar_y-25,10,10);
		//eyes
		fill(0);
		rect(gameChar_x-6,gameChar_y-62,3,3);
		rect(gameChar_x+3,gameChar_y-62,3,3);
		ellipse(gameChar_x,gameChar_y-50,10,8);

	}
	else
	{
		 //head
		 fill(255,198,153);
		 ellipse(gameChar_x,gameChar_y-45,30,50);
		 //arms
		 rect(gameChar_x-20,gameChar_y-40,10,20);
		 rect(gameChar_x+10 ,gameChar_y-40,10,20);
		 //feet
		 rect(gameChar_x+5 ,gameChar_y-11,10,10);
		 rect(gameChar_x-15 ,gameChar_y-11,10,10);
		 //body
		 fill(0,255,0);
		 rect(gameChar_x-15,gameChar_y-45,30,40);
		 //eyes
		 fill(0);
		 rect(gameChar_x-6,gameChar_y-62,3,8);
		 rect(gameChar_x+3,gameChar_y-62,3,8);
		 //mouth
		 ellipse(gameChar_x,gameChar_y-50,10,4);
		

	}
}

// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.
function drawClouds()
{
	for (var i=0;i<clouds.length;i++)
	{
		fill(255);
        ellipse(clouds[i].x_pos *clouds[i].scale,clouds[i].y_pos,90*clouds[i].scale);
        ellipse((clouds[i].x_pos +40)*clouds[i].scale,clouds[i].y_pos-3,60*clouds[i].scale);
        ellipse((clouds[i].x_pos -43) *clouds[i].scale,clouds[i].y_pos,50*clouds[i].scale);
	}
}


// Function to draw mountains objects.
function drawMountains()
{
	for(var i=0;i<mountains.length;i++)
        {
            fill(160,82,45);
           quad(
               mountains[i].x_pos,mountains[i].y_pos+mountains[i].height,mountains[i].x_pos-mountains[i].dimensions,mountains[i].y_pos+382,mountains[i].x_pos,mountains[i].y_pos+382,mountains[i].x_pos+mountains[i].dimensions,mountains[i].y_pos+382);
            
            fill(139,69,19);
            triangle(mountains[i].x_pos,mountains[i].y_pos+mountains[i].height,mountains[i].x_pos,mountains[i].y_pos+382,mountains[i].x_pos+mountains[i].dimensions,mountains[i].y_pos+382);
        }
}

// Function to draw trees objects.
function drawTrees()
{
	for(var i = 0; i < trees_x.length; i++ )
        {
            fill(120, 100, 20);
            rect(trees_x[i], floorPos_y-149, 30, 150);
            //branches
            fill(255, 55, 100);
            triangle(
                trees_x[i]-70,floorPos_y-94,trees_x[i]+20,floorPos_y-194,trees_x[i]+100,floorPos_y-94);
            triangle(
                trees_x[i]-70,floorPos_y-144,trees_x[i]+20,floorPos_y-244,trees_x[i]+100,floorPos_y-144);
        }
}


// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.
function drawCanyon(t_canyon)
{
	fill(100, 155, 255);
	beginShape();
	vertex(t_canyon.x_pos,floorPos_y);
	vertex(t_canyon.x_pos,580); 
	vertex(t_canyon.x_pos + t_canyon.width,580);
	vertex(t_canyon.x_pos + t_canyon.width,floorPos_y);
	endShape(CLOSE);
}

// Function to check character is over a canyon.

function checkCanyon(t_canyon)
{
	if (gameChar_world_x>t_canyon.x_pos && gameChar_world_x<t_canyon.x_pos+t_canyon.width && isFalling==false && gameChar_y==floorPos_y)
	{
		isPlummeting = true;
	}
}
function renderFlagpole()
{
	push();
	strokeWeight(5);
	stroke(0);
	line(flagpole.x_pos, floorPos_y, flagpole.x_pos,floorPos_y - 250);
	fill(255,0,0);
	noStroke();
	var r = random(-2,2);

	if(flagpole.isReached)
	{
		rect(flagpole.x_pos + r, floorPos_y -250 +r, 80 + r*2,50);
	}
	else
	{
		rect(flagpole.x_pos, floorPos_y -50, 80,50);
		
	}
	pop();
}


function checkFlagpole()
{
	var d = abs(gameChar_world_x - flagpole.x_pos);

	if(d < 15)
	{
		flagpole.isReached = true;
	}
}

// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

// Function to draw collectable objects.

function drawCollectable(t_collectable)
{
    
	fill(255,215,0);
	rect(t_collectable.x_pos,t_collectable.y_pos,t_collectable.size,t_collectable.size/2);
	fill(255,165,0);
	rect(t_collectable.x_pos,t_collectable.y_pos,t_collectable.size*0.2,t_collectable.size*0.5);
}

// Function to check character has collected an item.

function checkCollectable(t_collectable)
{
	if (dist(gameChar_world_x,gameChar_y,t_collectable.x_pos,t_collectable.y_pos)<40)
	{
		t_collectable.isFound=true;
		game_score += 1;
	}
}

function checkPlayerDie()
{
	if(gameChar_y > floorPos_y + 50 )
	{
		lives -= 1;	
		if(lives > 0)
		{
			startGame();
		}
	}
	
	
}

function startGame()
{
	gameChar_x = width/2;
	gameChar_y = floorPos_y;

	// Variable to control the background scrolling.
	scrollPos = 0;

	// Variable to store the real position of the gameChar in the game
	// world. Needed for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;

	// Initialise arrays of scenery objects.
	trees_x = [20,450,1300];
	clouds = 
	[
		{x_pos:100, y_pos:100, scale:0.6},
		{x_pos:400, y_pos:180, scale:0.8},
		{x_pos:800, y_pos:150, scale:1.0},
		{x_pos:800, y_pos:100, scale:0.5},
		{x_pos:200, y_pos:150, scale:0.3}
        
        
	]
	mountains = 
	[
		{x_pos:100, y_pos:50,dimensions:100,height:120},
		{x_pos:500, y_pos:50,dimensions:100,height:120},
		{x_pos:800, y_pos:50,dimensions:100,height:60},
		{x_pos:1300, y_pos:50,dimensions:100,height:60},
		{x_pos:1700, y_pos:50,dimensions:100,height:100}
        

	]
	canyons = 
	[
		{x_pos:300, width:80},
		{x_pos:1000, width:100},
		{x_pos:1500, width:100},
		{x_pos:1400, width:400}
        
        
	]
	collectables = 
	[
		{x_pos:200,y_pos:400,size:40,isFound:false},
		{x_pos:100,y_pos:400,size:40,isFound:false},
		{x_pos:700,y_pos:400,size:40,isFound:false}

	]
    platforms=[];
    
    platforms.push(createPlatforms(150,floorPos_y-100,150));
    platforms.push(createPlatforms(550,floorPos_y-100,150));
    platforms.push(createPlatforms(-150,floorPos_y-100,150));
    platforms.push(createPlatforms(1300,floorPos_y-100,210));
    
    enemies=[];
    
    enemies.push(new Enemy(100, floorPos_y-10,100));
    enemies.push(new Enemy(2000, floorPos_y-10,100));

    
    
    
    
    
	game_score = 0;
	flagpole = {isReached: false, x_pos:2200};
}

function createPlatforms(x,y,length)
{
    var p = {
        x: x,
        y: y,
        length:length,
        draw: function()
        {
            fill(50,50,50);
            rect(this.x,this.y,this.length,20);
        },
        checkContact:function(gc_x,gc_y)
        {
            if(gc_x > this.x && gc_x < this.x + this.length)
            {
                var d = this.y - gc_y;
                if(d >= 0 && d < 2)
                    {
                       return true; 
                    }
                
            }
             return false
        }
    }
    
    return p;
}

function Enemy(x,y,range)
{
    this.x = x;
    this.y = y;
    this.range = range;
    
    this.currentX = x;
    this.inc = 5;
    
    this.update = function()
    {
        this.currentX += this.inc;
        
        if(this.currentX >= this.x + this.range)
            {
                this.inc = -5;

            }
        else if(this.currentX < this.x)
            {
                this.inc = 5;
            }
    }
    this.draw = function()
{
    this.update();
    fill(0,255,255);
    stroke(1);
    triangle(this.currentX,this.y,this.currentX+20,this.y-30,this.currentX+40,this.y)
    triangle(this.currentX,this.y-20,this.currentX+20,this.y+10,this.currentX+40,this.y-20)
    noStroke;
        
        
}

    this.checkEnemyContact = function(gc_x,gc_y)
    {
        var d = dist(gc_x,gc_y, this.currentX,this.y)
        
        if(d<20)
            {
                return true;
            }
        return false;
    }
}

