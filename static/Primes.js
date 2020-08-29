class ExtendedSieve extends Sieve{
	//Unmake last move in list of states
	StateUnmaker(){
		var l=this.lees.length;
		var s=this.lees[l-1];
		if (s[0]==1 && this.marked[s[2]]==s[2])	this.marked[s[2]]=0;
		super.StateUnmaker();
	}
	
	//When is algorithm ending?
	EscapeCondition(v, lim){
		if (v+1>lim) return 1;
		return 0;
	}
	
	Darken(v){
		var bt=this.place.getElementsByTagName("div")[v];
		super.Darken(v, "fullNumb");
		super.Darken(v, "divisNumb");
		if (this.PrimeCheck(v)==1){
			this.marked[v]=v;
			bt.getElementsByClassName("divisNumb")[0].innerHTML=this.marked[v];
		}
	}

	MarkNormally(v){
		var bt=this.place.getElementsByTagName("div")[v];
		super.MarkNormally(v, "fullNumb");
		super.MarkNormally(v, "divisNumb");
		bt.getElementsByClassName("divisNumb")[0].innerHTML=this.marked[v];
	}

	//Color prime and change subscript note
	PrimeColor(v1, v2){
		var bt=this.place.getElementsByTagName("div")[v1];
		super.PrimeColor(v1, v2, "fullNumb");
		super.PrimeColor(v1, v2, "divisNumb");
		bt.getElementsByClassName("divisNumb")[0].innerHTML=this.marked[v1];
	}
	
	//Statement printed on the output
	StatementComprehension(){
		var l=this.lees.length;
		if (l==1) return `This is just before the beginning of the sieve - I mark 0 as not factorizable, by definition`;
		if (l==2) return `This is just before the beginning of the sieve - I mark 0 and 1 as not divisible factorizable, by definition`;


		var prev=this.lees[l-2], last=this.lees[l-1];
		var strr=``;
		if (prev[0]==0 && last[0]==1) strr=`I've already marked all integers lower or equal to limit divisible by ${prev[3]}, so I search for next primes, starting from last prime I've found +1 - ${prev[3]+1}. `;
		if (prev[0]==1 && last[0]==1) strr=`Last number I checked (${prev[2]}) was not a prime, so I search further. `;
		if (prev[0]==1 && last[0]==0) strr=`I found a prime (${last[3]}), so I start finding numbers divisible by it, starting from ${last[3]}*${last[3]}=${last[2]}, because every lower number divisible by ${last[3]} is already marked and it's lowest divisor must be lower than ${last[3]} - read proof(2) above. `;
		if (last[0]==0) strr+=`This number's lowest divisor >1 is ${this.marked[last[2]]!=last[3]?`not ${last[3]}, but ${this.marked[last[2]]} - so it was already marked with it's lowest divisor.`:`${last[3]} - so it's marked with it's lowest divisor just from now.`} `;
		if (last[0]==1 && super.EscapeCondition(last[2], last[1])==false) strr+=`This number is ${this.PrimeCheck(last[2])?`a prime - so I'll mark this prime with it's lowest prime divisor - itself and start marking perhaps-primes as divisible by it.`:`not a prime - so I have to search further.`}`;
		else if (last[0]==1) strr+=`This number is ${this.PrimeCheck(last[2])?`a prime and I mark it's lowest divisor as itself, but I won't start marking other numbers as divisible by it because ${last[2]}*${last[2]}>${last[1]}}`:`not a prime - so I have to search further.`}`;
		if (last[0]==100) strr=`${prev[2]}+1 > ${prev[1]} (given limit) - and so, all prime numbers up to the given limit were found along with their lowest divisors, sieve ends.`;
		return strr;
	}

	//Create Button
	buttCreator(v){
		//var sub= document.createElement("SUB");
		//if (v>1) sub.innerHTML=0;
		//else sub.innerHTML=-1;
		//sub.style.fontSize="10px";
		var butt1=super.buttCreator(v);
		var butt2=super.buttCreator(v);
		butt1.classList.add("fullNumb");
		butt2.classList.add("divisNumb");
		if (v>1) butt2.innerHTML=0;
		else butt2.innerHTML=-1;

		var dv = document.createElement("DIV");
		dv.style.display="inline-block";
		dv.style.position="relative";

		butt1.style.position="absolute";
		butt2.style.position="absolute";

		butt1.style.top="0";
		butt2.style.bottom="0";
		butt1.style.width="40px";
		butt2.style.width="40px";
		butt1.style.height="20px";
		butt2.style.height="20px";
		butt1.style.textAlign="center";
		butt2.style.textAlign="center";

		butt1.style.margin="0";
		butt2.style.margin="0";

		dv.style.width="40px";
		dv.style.height="40px";
		dv.backgroundColor="#000000";
		dv.appendChild(butt1);
		dv.appendChild(butt2);
		
		return dv;
	}
}





class Querier extends Algorithm{
	constructor(value, block, assocSieve){
		super(block)
		this.sieve=assocSieve;
	}

	BeginningExecutor(){
		for (var j=0;j<this.lees.length;j++){
			if (this.lees[j][0]==0) this.sieve.MarkNormally(this.lees[j][1]);
		}

		this.lees=[];
		var fas=this.input.value;
		var ts=this.sieve.lees;
		
		if (ts[ts.length-1][0]!=100 || ts[ts.length-2][1]<parseInt(fas)) return;
		this.place.textContent=fas+" : ";

		this.lees.push([0, fas]);

	}
	
	//Go to the next state of the algorithm
	StateMaker(){
		var l=this.lees.length;
		var s=this.lees[l-1];

		if (s[0]==0 && s[1]!=1){
			this.place.textContent+=this.sieve.marked[s[1]];
			if (this.sieve.marked[s[1]]!=s[1]){
				this.place.textContent+="*";
			}
		}
		if (s[0]!=100)	{
			this.Painter(this.sieve.place.getElementsByClassName("divisNumb")[s[1]], 10, 1);
			this.Painter(this.sieve.place.getElementsByClassName("fullNumb")[s[1]], 10, 1);
		}
		if (l>1){
			var prv=this.lees[l-2]
			this.Painter(this.sieve.place.getElementsByClassName("divisNumb")[prv[1]], 11, 1);
			this.Painter(this.sieve.place.getElementsByClassName("fullNumb")[prv[1]], 11, 1)
		}


		//Debug line
		//document.getElementById('debug').innerHTML=this.lees;
	}

	//Make the last state in list of states
	StateUnmaker(){
		var l=this.lees.length;
		var s=this.lees[l-1], prv=this.lees[l-2];
		var tex=this.place.textContent;
		var tlen=tex.length;
		var i;
		if (s[0]!=100)	this.sieve.MarkNormally(s[1]);
		if (s[0]!=100 && s[1]!=1) {
			for (i=tlen-2;i>=0;i--){
				if (tex[i]==':' || tex[i]=='*' || tex[i]=='\n') break;
			}
			this.place.textContent=tex.slice(0, i+1);
		}

		this.Painter(this.sieve.place.getElementsByClassName("divisNumb")[prv[1]], 10, 1);
		this.Painter(this.sieve.place.getElementsByClassName("fullNumb")[prv[1]], 10, 1);
	
		this.lees.pop();
	}


	//Unmake last move in list of states
	NextState(){
		var l=this.lees.length;
		var s=this.lees[l-1];
		if (s[0]==0){
			if (s[1]==1)	this.lees.push([100]);
			else{
				var sv=Math.floor(s[1]/this.sieve.marked[s[1]]);
				if (s[1]!=1)	this.lees.push([0, sv]);
				else this.lees.push([100]);
			}
		}
	}


	StatementComprehension(){
		var l=this.lees.length;
		
		var last=this.lees[l-1];
		var strr=``;
		if (last[0]==0 && last[1]==1) strr=`I've already factorized given number by finding all it's prime divisors, 1 cannot be divided further - query is finished`;
		else if (last[0]==0) strr=`Now I have to find factorization of ${last[1]} - I divide it by it's lowest prime divisor - ${this.sieve.marked[last[1]]}`;
		if (last[0]==100) strr=`Query is finished`;
		return strr;
	}
}


var feral=Algorithm.ObjectParser(document.getElementById('Algo1'));
var sk=new Sieve(100, feral);

var feral2=Algorithm.ObjectParser(document.getElementById('Algo2'));
var sk2=new ExtendedSieve(100, feral2);

var foul=Algorithm.ObjectParser(document.getElementById('querySection'));
var sk3=new Querier(132, foul, sk2);


//x.value="Jonasz";
//var butt = document.createButton(1);
//x.appendChild(butt);
//export Algorithm;
