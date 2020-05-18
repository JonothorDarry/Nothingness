class TotientSieve extends Sieve{
	//This function creates array of totient values
	createTotient(len){
		this.totient=[];
		for (var i=0;i<=len;i++) this.totient[i]=i;
	}

	BeginningExecutor(){
		var fas=this.input.value;
		this.createTotient(fas);
		super.BeginningExecutor();
	}

	//Unmake last move in list of states
	StateUnmaker(){
		var l=this.lees.length;
		var s=this.lees[l-1];
		if (s[0]==1 && this.marked[s[2]]==s[2])	this.marked[s[2]]=0;
		if (s[0]==1 && this.PrimeCheck(s[2])==1) this.totient[s[2]]=s[2];
		super.StateUnmaker();
	}
	StateMaker(){
		var l=this.lees.length;
		var s=this.lees[l-1];
		if (s[0]==1 && this.PrimeCheck(s[2])==1) this.totient[s[2]]=s[2]-1;
		super.StateMaker();
	}
	
	
	//Make value non-prime, divided by divisor, update totient
	DestroyPrime(value, divisor){
		super.DestroyPrime(value, divisor);
		this.totient[value]=Math.floor(this.totient[value]*(divisor-1)/divisor);
	}

	//Make value prime, change totient
	MakePrime(value, divisor){
		super.MakePrime(value, divisor);
		this.totient[value]=Math.floor(this.totient[value]*divisor/(divisor-1));
	}
	
	//Go to the next state of the algorithm
	NextState(){
		var l=this.lees.length;
		var s=this.lees[l-1];
		var lim=s[1];
		if (s[0]==0){
			if (s[2]+s[3]<=lim)	this.lees.push([0, lim, s[2]+s[3], s[3]]);
			else if (s[3]<=lim)	this.lees.push([1, lim, s[3]+1]);
			else	this.lees.push([100]);
		}

		else if (s[0]==1){
			if (this.EscapeCondition(s[2], s[1])==1) this.lees.push([100]);
			else if (this.PrimeCheck(s[2])==1 && s[2]+s[2]<=lim)	 this.lees.push([0, lim, s[2]+s[2], s[2]]);
			else this.lees.push([1, lim, s[2]+1]);
		}
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
			bt.getElementsByClassName("divisNumb")[0].innerHTML=this.totient[v];
		}
	}

	MarkNormally(v){
		var bt=this.place.getElementsByTagName("div")[v];
		super.MarkNormally(v, "fullNumb");
		super.MarkNormally(v, "divisNumb");
		bt.getElementsByClassName("divisNumb")[0].innerHTML=this.totient[v];
	}

	//Color prime and change subscript note
	PrimeColor(v1, v2){
		var bt=this.place.getElementsByTagName("div")[v1];
		super.PrimeColor(v1, v2, "fullNumb");
		super.PrimeColor(v1, v2, "divisNumb");
		bt.getElementsByClassName("divisNumb")[0].innerHTML=this.totient[v1];
	}
	
	//Statement printed on the output
	StatementComprehension(){
		var l=this.lees.length;
		if (l==1 || l==2) return `This is just before the beginning of the sieve - For each number, I mark it's totient as itself`;

		var prev=this.lees[l-2], last=this.lees[l-1];
		var strr=``;
		if (prev[0]==0 && last[0]==1) strr=`I've already changed totient of numbers lower or equal to limit divisible by ${prev[3]}, so I search for next primes, starting from last prime I've found +1 - ${prev[3]+1}. `;
		if (prev[0]==1 && last[0]==1) strr=`I search further for primes. `;
		if (prev[0]==1 && last[0]==0) strr=`I found a prime (${last[3]}), so I start finding numbers divisible by it, starting from ${last[3]}+${last[3]}=${last[2]} and multiplying their totients by ${last[3]-1}/${last[3]}. `;
		if (last[0]==0) strr+=`Totient of a given number is multiplied by ${last[3]-1}/${last[3]}: temp&#x3d5;(${last[2]})=${Math.floor(this.totient[last[2]]*last[3]/(last[3]-1))}*${last[3]-1}/${last[3]}=${this.totient[last[2]]}`;
		if (last[0]==1 && super.EscapeCondition(last[2], last[1])==false) strr+=`This number is ${this.PrimeCheck(last[2])?`a prime - so I mark it's totient as &#x3d5;(${last[2]})=${last[2]-1} and start marking perhaps-primes as divisible by it, changing their totient in process.`:`not a prime - so I have to search further.`}`;
		else if (last[0]==1) strr+=`This number is ${this.PrimeCheck(last[2])?`a prime and I mark it's totient as &#x3d5;(${last[2]})=${last[2]-1}, but I won't start changing other totients because ${last[2]}+${last[2]}>${last[1]}}`:`not a prime - so I have to search further.`}`;
		if (last[0]==100) strr=`${prev[2]}+1 > ${prev[1]} (given limit) - and so, all prime numbers up to the given limit were found along with value of their totient, sieve ends.`;
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
		butt2.innerHTML=v;

		var dv = document.createElement("DIV");
		dv.style.display="inline flow-root";
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


var feral=Algorithm.ObjectParser(document.getElementById('Algo1'));
var sk=new TotientSieve(100, feral);
