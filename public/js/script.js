var game={ 
	level: 1, 
	turn: 0, 
	difficulty: 1, 
	score: 0, 
	active: false, 
	handler: false, 
	shape: '.shape', 
	genSequence: [], 
	plaSequence: [], 
	
	init: function(){					
		if(this.handler === false){		
			this.initPadHandler();		
		}
		this.newGame();				

	},

	initPadHandler: function(){

		that=this;

		$('.pad').on('mouseup',function(){

			if(that.active===true){

				var pad=parseInt($(this).data('pad'),10);
					
				that.flash($(this),1,300, pad);

				that.logPlayerSequence(pad);

			}
		});

		this.handler=true;

	},

	newGame: function(){			

		this.level=1;
		this.score=0;
		this.newLevel();
		this.displayLevel();
		this.displayScore();
	},

	newLevel: function(){
		
		this.genSequence.length=0;
		this.plaSequence.length=0;
		this.pos=0;
		this.turn=0;
		this.active=true;
		
		this.randomizePad(this.level); 
		this.displaySequence(); 
	},
	
	flash: function(element, times, speed, pad){ 

		var that = this;						

		if(times > 0){							
			that.playSound(pad);				
			element.stop().animate({opacity: '1'}, {		
				duration: 50,
				complete: function(){
				element.stop().animate({opacity: '0.6'}, 200);
				}
			});												

		}

		if (times > 0) {									 
			setTimeout(function () {
				that.flash(element, times, speed, pad);
			}, speed);
			times -= 1;						
		}
	},

	playSound: function(clip){				//plays the sound that corresponds to the pad chosen


		var sound= $('.sound'+clip)[0];
		sound.currentTime=0;				
		sound.play();						


	},

	randomizePad: function(passes){			//generate random numbers and push them to the generated number array iterations determined by current level

		for(i=0;i<passes;i++){
			
			this.genSequence.push(Math.floor(Math.random() * 4) + 1);
		}
	},

	logPlayerSequence: function(pad){		//log the player selected pad to user array and call the checker function

		this.plaSequence.push(pad);
		this.checkSequence(pad);
	},

	checkSequence: function(pad){			

		that=this;

		if(pad !== this.genSequence[this.turn]){	//if not correct 
				
				this.incorrectSequence();

			}else{									//if correct
				this.keepScore();					//update the score
				this.turn++;						//incrememnt the turn

			}

		if(this.turn === this.genSequence.length){	//if completed the whole sequence
			
			this.level++;							//increment level, display it, disable the pads wait 1 second and then reset the game
			this.displayLevel();
			this.active=false;
			setTimeout(function(){
				that.newLevel();
			},1000);
		}
	},

	displaySequence: function(){					//display the generated sequence to the user
		
		var that=this;

		$.each(this.genSequence, function(index, val) {		//iterate over each value in the generated array
			
			setTimeout(function(){
				
				that.flash($(that.shape+val),1,300,val);
			
			},500*index*that.difficulty);				// multiply timeout by how many items in the array so that they play sequentially and multiply by the difficulty modifier
		});
	},

	displayLevel: function(){							//just display the current level on screen
		
		$('.level h2').text('Level: '+this.level);

	},

	displayScore: function(){							//display current score on screen
		$('.score h2').text('Meows: '+this.score);
	},

	keepScore: function(){								//keep the score
		
		var multiplier=0;

		switch(this.difficulty)							//choose points modifier based on difficulty
		{
			case '2':
				multiplier=1;
				break;
			
			case '1':
				multiplier=2;
				break;

			case '0.5':
				multiplier = 3;
				break;
		}

		this.score += (1 * multiplier);					//work out the score

		this.displayScore();							//display score on screen
	},

	incorrectSequence: function(){						//if user makes a mistake

		var corPad = this.genSequence[this.turn],		//cache the pad number that should have been pressed
			
			that = this;
			this.active=false;
			this.displayLevel();
			this.displayScore();

		setTimeout(function(){							//flash the pad 4 times that should have been pressed
			that.flash($(that.shape+corPad),4,300,corPad);
		},500);

		$('.start').show();								//enable the start button again and allow difficulty selection again
		$('.difficulty').show();
	}

};
$(document).ready(function(){							

	$('.start').click(function(){				
		$(this).hide();
		game.difficulty = $('input[name=difficulty]:checked').val();
		$('.difficulty').hide();
		game.init();
	});

});

