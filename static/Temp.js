class Algorithm{
	static alldict={};
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
		Algorithm.alldict[this.inbut.id]=this;
		Algorithm.alldict[this.nextbut.id]=this;
		Algorithm.alldict[this.prevbut.id]=this;
		Algorithm.alldict[this.finitbut.id]=this;
		
		
		//Beginning button & sequence
		this.inbut.addEventListener('click', function(){
			var zis=Algorithm.alldict[this.id];
			zis.BeginningExecutor();
			zis.StateMaker();
			zis.ChangeStatement();
		});

		//Next value
		this.nextbut.addEventListener('click', function(){
			var zis=Algorithm.alldict[this.id];
			zis.NextState();
			zis.StateMaker();
			zis.ChangeStatement();
		});

		//Previous value
		this.prevbut.addEventListener('click', function(){
			var zis=Algorithm.alldict[this.id];
			if (zis.lees.length>1){
				zis.StateUnmaker();
				zis.ChangeStatement();
			}
		});
		
		//Finish Algorithm instantly	
		this.finitbut.addEventListener('click', function(){
			var zis=Algorithm.alldict[this.id];
			zis.FinishingSequence();
		});
	}

	isFinished(){
		if (this.lees[this.lees.length-1][0]>=100) return true;
		return false;
	}

	FinishingSequence(){
		while (!this.isFinished()){
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

	getInput(beg, str){
		var a=0, i=0, x;
		for (i=beg;i<str.length;i++){
			x=str.charCodeAt(i);
			if (x<58 && x>=48) a=a*10+x-48;
			else break;
		}
		return [a, i];
	}

	dissolve_input(str){
		var lst=[], j=0, i=0, x, a=0;
		lst.iter=-1;
		lst.get_next=function(){this.iter+=1; return this[this.iter];}
		while (j<str.length){
			for (;i<str.length;i++){
				x=str.charCodeAt(i);
				if (x<58 && x>=48) a=a*10+x-48;
				else break;
			}
			if (j!=i) lst.push(a);
			else i++;
			j=i, a=0;
		}
		return lst;	
	}
	
	//0: red, 1:green, 2: gray, 3: dead white 8: gold
	Painter(btn, col=1){
		if (col==0 || col==1 || col==5 || col==6 || col==8) btn.style.color="#FFFFFF";
		else btn.style.backgroundColor="#FFFFFF";

		if (col==0) btn.style.backgroundColor="#440000";
		else if (col==1) btn.style.backgroundColor="#004400";
		else if (col==2 || col==7) btn.style.color="#666666";
		else if (col==3) btn.style.color="#FFFFFF";
		else if (col==5) btn.style.backgroundColor="#000000";
		else if (col==6) btn.style.backgroundColor="#888888";
		else if (col==8) btn.style.backgroundColor="#8A7400";

		if (col==7){
			btn.style.border="1px solid";
			btn.style.borderColor="#888888";
		}
		else btn.style.border="0px none";
	}

	static ObjectParser(v){
		var dick={
			'primePlace':v.getElementsByClassName('primez')[0],
			'sendButton':v.getElementsByClassName('sender')[0],
			'prevButton':v.getElementsByClassName('previous')[0],
			'nextButton':v.getElementsByClassName('next')[0],
			'input':v.getElementsByClassName('inputter')[0],
			'output':v.getElementsByClassName('comprehend')[0],
			'finitButton':v.getElementsByClassName('finish')[0]
		}
		return dick;
	}
}


