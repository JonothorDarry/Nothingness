alldict={};

class Algorithm{
	constructor(block){	
		this.place=block.primePlace;
		this.wisdom=block.output;
		this.input=block.input;
		this.inbut=block.sendButton;
		this.nextbut=block.nextButton;
		this.prevbut=block.prevButton;
		this.finitbut=block.finitButton;

		alldict[this.inbut.id]=this;
		alldict[this.nextbut.id]=this;
		alldict[this.prevbut.id]=this;
		alldict[this.finitbut.id]=this;
	}
}

class Sieve extends Algorithm{
	constructor(len, block){
		super(block);
		this.lees=[];
		this.createMarked(len);	

		var butt;
		for (var i=0;i<len;i++){
			/*Button Stylization*/ 
			butt = this.buttCreator(i);
			//document.getElementById('Primez').innerHTML=i;
			this.place.appendChild(butt);
		}
	    
		//Beginning button & sequence
		this.inbut.addEventListener('click', function(){
			var zis=alldict[this.id];
			zis.lees=[];
			var fas=zis.input.value;
			zis.place.textContent='';

			zis.createMarked(fas);
			for (var i=0;i<=fas;i++){
				var butt = zis.buttCreator(i);
				zis.place.appendChild(butt);
			}
			zis.lees.push([1, fas, 0]);
			zis.StateMaker();
			zis.lees.push([1, fas, 1]);
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
		
		//Previous value
		
		this.finitbut.addEventListener('click', function(){
			var zis=alldict[this.id];

			while (zis.lees[zis.lees.length-1][0]!=100){
				zis.NextState();
				zis.StateMaker();
				zis.ChangeStatement();
			}
		});
	}
  
	//Marked=1 - not prime
	//This function creates array of elements marked as primes
	createMarked(len){
		this.marked=[];
		for (var i=0;i<=len;i++) this.marked[i]=0;
		this.marked[0]=-1;
		this.marked[1]=-1;
	}

	//If value is currently evaluated as prime, returns 1, elsewise 0
	PrimeCheck(value){
		if (this.marked[value]!=value && this.marked[value]!=0) return 0;
		return 1;
	}

	//Make value non-prime, divided by divisor
	DestroyPrime(value, divisor){
		if (this.marked[value]==0) this.marked[value]=divisor;
	}
	//Make value prime
	MakePrime(value, divisor){
		if (this.marked[value]==divisor) this.marked[value]=0;
	}

	//Mark number depending on values defined in sieve
	MarkNormally(v){
		var bt=this.place.getElementsByTagName("button")[v];
		if (this.PrimeCheck(v)==1){
			bt.style.backgroundColor='#440000';
			bt.style.color='#FFFFFF';
		}
		if (this.PrimeCheck(v)==0){
			bt.style.backgroundColor='#FFFFFF';
			bt.style.color='#888888';
		}
	}

	//Color processed slaying number
	Darken(v){
		this.place.getElementsByTagName("button")[v].style.backgroundColor='#000000';
	}

	//Color processed just slain by prime
	PrimeColor(v1, v2){
		var bt=this.place.getElementsByTagName("button")[v1];
		bt.style.backgroundColor='#FFFF00';
		bt.style.color='#888888';
		this.Darken(v2);
	}

	//Printing statement on the output
	ChangeStatement(){
		var p=this.StatementComprehension(), l=this.wisdom;
		l.innerHTML=p;
	}
	
	//Statement printed on the output
	StatementComprehension(){
		var l=this.lees.length;
		if (l==1) return `This is just before the beginning of the sieve - I mark 0 as non-prime, by definition`;
		if (l==2) return `This is just before the beginning of the sieve - I mark 0 and 1 as non-prime, by definition`;


		var prev=this.lees[l-2], last=this.lees[l-1];
		var strr=``;
		if (prev[0]==0 && last[0]==1) strr=`I've already marked all integers lower or equal to limit divisible by ${prev[3]}, so I search for next primes, starting from last prime I've found +1 - ${prev[3]+1}. `;
		if (prev[0]==1 && last[0]==1) strr=`Last number I checked (${prev[2]}) was not a prime, so I search further. `;
		if (prev[0]==0 && last[0]==0) strr=`I mark the next number (${last[2]-last[3]}+${last[3]}=${last[2]}) as divisible by ${last[3]}. `;
		if (prev[0]==1 && last[0]==0) strr=`I found a prime (${last[3]}), so I start finding numbers divisible by it, starting from ${last[3]}*${last[3]}=${last[2]}, because every lower number divisible by ${last[3]} is already marked - read proof(2) above. `;

		if (last[0]==0) strr+=`This number's lowest divisor >1 is ${this.marked[last[2]]!=last[3]?`not ${last[3]}, but ${this.marked[last[2]]} - so it was already marked.`:`${last[3]} - so it's marked just from now.`} `;
		if (last[0]==1) strr+=`This number is ${this.PrimeCheck(last[2])?`a prime - so I'll start marking perhaps-primes as divisible by it.`:`not a prime - so I have to search further.`}`;
		if (last[0]==100) strr=`${prev[2]}*${prev[2]} > ${prev[1]} (given limit) - and so, all prime numbers up to the given limit were found, sieve ends.`;
		return strr;
	}


	//Go to the next state of the algorithm
	NextState(){
		var l=this.lees.length;
		var s=this.lees[l-1];
		var lim=s[1];
		//Debug line
		//document.getElementById('debug').innerHTML=lees;
		if (s[0]==0){
			if (s[2]+s[3]<=lim)	this.lees.push([0, lim, s[2]+s[3], s[3]]);
			else if (s[3]<=lim)	this.lees.push([1, lim, s[3]+1]);
			else	this.lees.push([100]);
		}

		else if (s[0]==1){
			if (s[2]*s[2]>lim) 			this.lees.push([100]);
			else if (this.PrimeCheck(s[2])==1) 		this.lees.push([0, lim, s[2]*s[2], s[2]]);
			else this.lees.push([1, lim, s[2]+1]);
		}
	}

	//Make the last state in list of states
	StateMaker(){
		var l=this.lees.length;
		var s=this.lees[l-1];
		var lim=s[1];
		if (s[0]==0) {
			this.DestroyPrime(s[2], s[3]);
			this.PrimeColor(s[2], s[3]);
		}
		if (s[0]==1) this.Darken(s[2]);
		if (l>1){
			s=this.lees[l-2];
			if (this.lees[l-1][0]!=0 || this.lees[l-2][0]!=1) this.MarkNormally(s[2]);
			if (s[0]==0 && s[2]+s[3]>s[1]) 		this.MarkNormally(s[3]);
		}
	}


	//Unmake last move in list of states
	StateUnmaker(){
		var l=this.lees.length;
		var s=this.lees[l-1];
		if (s[0]==0)	this.MakePrime(s[2], s[3]);
		if (s[0]!=100)	this.MarkNormally(s[2]);

		if (l>1){
			s=this.lees[l-2];
			if (s[0]==1)	this.Darken(s[2]);
			if (s[0]==0)	this.PrimeColor(s[2], s[3]);
		}
		this.lees.pop();
	}

	//Create Button
	buttCreator(v){
		var butt = document.createElement("BUTTON");
		butt.innerHTML=v;
		butt.style.backgroundColor="#440000"
		butt.style.color="#FFFFFF"
		butt.style.width="40px";
		butt.style.height="40px";
		butt.style.border="None";
		//butt.appendChild(sub);
		return butt;
	}
}

class ExtendedSieve extends Sieve{
	//Unmake last move in list of states
	StateUnmaker(){
		var l=this.lees.length;
		var s=this.lees[l-2];
		if (s[0]==1 && this.marked[s[2]]==s[2])	this.marked[s[2]]=0;
		super.StateUnmaker();
	}
	
	Darken(v){
		var bt=this.place.getElementsByTagName("button")[v];
		super.Darken(v);
		if (this.PrimeCheck(v)==1){
			this.marked[v]=v;
			bt.getElementsByTagName("sub")[0].innerHTML=this.marked[v];
		}
	}

	MarkNormally(v){
		var bt=this.place.getElementsByTagName("button")[v];
		super.MarkNormally(v);
		bt.getElementsByTagName("sub")[0].innerHTML=this.marked[v];
	}

	//Color prime and change subscript note
	PrimeColor(v1, v2){
		var bt=this.place.getElementsByTagName("button")[v1];
		super.PrimeColor(v1, v2);
		bt.getElementsByTagName("sub")[0].innerHTML=this.marked[v1];
	}

	//Create Button
	buttCreator(v){
		var sub= document.createElement("SUB");
		if (v>1)	sub.innerHTML=0;
		else sub.innerHTML=-1;
		sub.style.fontSize="10px";

		var butt=super.buttCreator(v);
		butt.appendChild(sub);
		//butt.appendChild(sub);
		return butt;
	}
}


class Querier extends Algorithm{
	constructor(value, block, assocSieve){
		super(block)

		this.sieve=assocSieve;
		this.lees=[];
		this.inbut.addEventListener('click', function(){
			var zis=alldict[this.id];
			zis.lees=[];
			var fas=zis.input.value;
			zis.place.textContent=fas+" : ";

			zis.lees.push([0, fas]);
			zis.StateMaker();
			//zis.ChangeStatement();
		});

		//Next value
		this.nextbut.addEventListener('click', function(){
			var zis=alldict[this.id];
			zis.NextState();
			zis.StateMaker();
			//zis.ChangeStatement();
		});

		//Previous value
		this.prevbut.addEventListener('click', function(){
			var zis=alldict[this.id];
			if (zis.lees.length>1){
				zis.StateUnmaker();
				//zis.ChangeStatement();
			}
		});
	}
	
	//Go to the next state of the algorithm
	StateMaker(){
		document.getElementById('debug').innerHTML=this.lees.length;
		var l=this.lees.length;
		var s=this.lees[l-1];
		if (s[0]==0){
			document.getElementById('debug').innerHTML=this.lees.length;
			this.place.textContent+=this.sieve.marked[s[1]];
			if (this.sieve.marked[s[1]]!=s[1]){
				this.place.textContent+="*";
			}
			document.getElementById('debug').innerHTML=this.lees;
		}

		//Debug line
		//document.getElementById('debug').innerHTML=lees;
	}

	//Make the last state in list of states
	StateUnmaker(){
		var l=this.lees.length;
		var s=this.lees[l-1];

		this.lees.pop();
	}


	//Unmake last move in list of states
	NextState(){
		var l=this.lees.length;
		var s=this.lees[l-1];
		if (s[0]==0){
			if (s[1]==1)	this.lees.append([100]);
			else{
				var sv=Math.floor(s[1]/this.sieve.marked[s[1]]);
				if (sv!=1)	this.lees.push([0, sv]);
				else this.lees.push([100]);
			}
		}
	}
}


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

var feral=ObjectParser(document.getElementById('Algo1'));
var sk=new Sieve(100, feral);

var feral2=ObjectParser(document.getElementById('Algo2'));
var sk2=new ExtendedSieve(100, feral2);


var foul=ObjectParser(document.getElementById('querySection'));
var sk3=new Querier(132, foul, sk2)


//x.value="Jonasz";
//var butt = document.createButton(1);
//x.appendChild(butt);
