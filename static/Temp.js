class Algorithm{
	constructor(block){
		this.lees=[]
		this.place=block.primePlace;
		this.wisdom=block.output;
		this.input=block.input;
		this.inbut=block.sendButton;
		this.nextbut=block.nextButton;
		this.prevbut=block.prevButton;
		this.finitbut=block.finitButton;

		//Adding button ids to dictionary alldict
		alldict[this.inbut.id]=this;
		alldict[this.nextbut.id]=this;
		alldict[this.prevbut.id]=this;
		alldict[this.finitbut.id]=this;
		
		
		//Beginning button & sequence
		this.inbut.addEventListener('click', function(){
			var zis=alldict[this.id];
			zis.BeginningExecutor();
			zis.StateMaker();
			zis.ChangeStatement();
		});

		//Next value
		this.nextbut.addEventListener('click', function(){
			var zis=alldict[this.id];
			zis.NextState();
			zis.StateMaker();
			zis.ChangeStatement();
		});

		//Previous value
		this.prevbut.addEventListener('click', function(){
			var zis=alldict[this.id];
			if (zis.lees.length>1){
				zis.StateUnmaker();
				zis.ChangeStatement();
			}
		});
		
		//Finish Algorithm instantly	
		this.finitbut.addEventListener('click', function(){
			var zis=alldict[this.id];
			zis.FinishingSequence();
		});
	}

	isFinished(){
		if (this.lees[this.lees.length-1][0]==100) return true;
		return false;
	}

	FinishingSequence(){
		while (this.lees[this.lees.length-1][0]!=100){
			this.NextState();
			this.StateMaker();
			this.ChangeStatement();
		}
	}
  
	
	//Printing statement on the output
	ChangeStatement(){
		var p=this.StatementComprehension();
		var l=this.wisdom;
		l.innerHTML=p;
	} 
}
