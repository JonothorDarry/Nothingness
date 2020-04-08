alldict={};

function ObjectParser(v){
	dick={
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
	
	//Printing statement on the output
	ChangeStatement(){
		var p=this.StatementComprehension();
		var l=this.wisdom;
		l.innerHTML=p;
	}
	
	FinishingSequence(){
		while (this.lees[this.lees.length-1][0]!=100){
			this.NextState();
			this.StateMaker();
			this.ChangeStatement();
		}
	}
}

class EuclidGcd extends Algorithm{
	StatementComprehension(){}
	NextState(){
		var l=this.lees.length;
		var s=this.lees[l-1];

		if (s[0]==100) return;
		var a=s[1], b=s[2], i=0;

		if (s[0]==1 || s[0]==0) this.lees.push([2, a%b, b]);
		if (s[0]==2) this.lees.push([3, b, a]);
		if (s[0]==3 && b>0)	this.lees.push([1, a, b]);
		if (s[0]==3 && b==0)	this.lees.push([100]);
	}

	StateMaker(){
		var l=this.lees.length;
		var s=this.lees[l-1], col;

		if (s[0]==100) return;
		var a=s[1], b=s[2], i=0;

		if (s[0]==0){
			for (i=0;i<2;i++) this.divs[i].innerHTML='';
			var butt;
			for (i=0;i<a;i++){
				if (i%b==0) col=this.colorGenerator();
				butt=this.buttCreator(col);
				this.divs[0].appendChild(butt);
			}
			col=this.colorGenerator();

			for (i=0;i<b;i++){
				butt=this.buttCreator();
				this.divs[1].appendChild(butt);
			}
		}

		else if (s[0]==1){
			for (i=0;i<a;i++){
				if (i%b==0) col=this.colorGenerator();
				this.divs[0].getElementsByTagName("button")[i].style.backgroundColor=col;
			}
		}

		else if (s[0]==3){
			var tmp=this.divs[0].innerHTML;
			this.divs[0].innerHTML=this.divs[1].innerHTML;
			this.divs[1].innerHTML=tmp;
		}

		else if (s[0]==2){
			var dp=this.lees[l-2][1];
			for (i=dp;i>a;i--) 	this.divs[0].getElementsByTagName("button")[0].outerHTML="";
		}
		document.getElementById("debug").innerHTML=this.lees;
	}

	StateUnmaker(){
		var l=this.lees.length;
		var s=this.lees[l-1], col;

		var a=s[1], b=s[2], i=0;
		
		if (s[0]==3){
			var tmp=this.divs[0].innerHTML;
			this.divs[0].innerHTML=this.divs[1].innerHTML;
			this.divs[1].innerHTML=tmp;
		}

		else if (s[0]==2){
			var dp=this.lees[l-2][1], bt;
			for (i=a;i<dp;i++){
				if ((i-a)%b==0) col=this.colorGenerator();
				bt=this.buttCreator(col);
				this.divs[0].prepend(bt);
			}
		}
		
		else if (s[0]==1){
			col=this.colorGenerator();
			for (i=0;i<a;i++) this.divs[0].getElementsByTagName("button")[i].style.backgroundColor=col;
		}

		if (s[0]!=0)	this.lees.pop();
	}

	BeginningExecutor(){
		this.lees=[]
		this.place.innerHTML='';
		var fas=this.input.value;
		var a=0, b=0, x, i=0;
		
		for (i=0;i<fas.length;i++){
			x=fas.charCodeAt(i);
			if (x<58 && x>=48) a=a*10+x-48;
			else break;
		}
		i+=1;

		for (;i<fas.length;i++){
			x=fas.charCodeAt(i);
			if (x<58 && x>=48) b=b*10+x-48;
			else break;
		}
		this.lees.push([0, a, b])
		this.divs=this.divsCreator();
		//document.createElement("BUTTON");
	}


	colorGenerator(){
		var col="#", s=0;
		for (var i=0;i<3;i++){
			s=Math.ceil(Math.random()*255).toString(16);
			if (s.length==1) s="0"+s;
			col=col+s;
		}
		return col;
	}

	buttCreator(col="#440000"){
		var butt=document.createElement("BUTTON");
		butt.style.width="30px";
		butt.style.height="30px";
		butt.style.border="1px solid";
		butt.style.backgroundColor=col;
		return butt;
	}

	divsCreator(){
		var d1=document.createElement("DIV");
		var d2=document.createElement("DIV");
		var lees=[d1,d2];
		for (var i=0;i<2;i++){
			lees[i].style.position="relative";
			lees[i].style.width="49%";
			lees[i].style.display="inline-block";
			lees[i].style.verticalAlign="top";
		}
		lees[0].style.left=0;
		lees[1].style.rigth=0;
		lees[0].style.marginRight="10px";

		this.place.appendChild(d1);
		this.place.appendChild(d2);
		return lees;
	}

}


var feral=ObjectParser(document.getElementById('Algo1'));
var eg1=new EuclidGcd(feral);
document.getElementById("Comprehend").innerHTML="AHHASHPenis";
