class Sieve extends Algorithm{
	constructor(block, len){
		super(block);
		this.createMarked(len);	

		var butt;
		for (var i=0;i<len;i++){
			/*Button Stylization*/ 
			butt = this.buttCreator(i);
			//document.getElementById('Primez').innerHTML=i;
			this.place.appendChild(butt);
		}
	}


	BeginningExecutor(){
		this.lees=[];
		var fas=this.input.value;
		this.place.textContent='';

		this.bs_butt_width=`${Math.max(40, fas.length*10)}px`
		this.createMarked(fas);
		for (var i=0;i<=fas;i++){
			var butt = this.buttCreator(i);
			this.place.appendChild(butt);
		}
		this.lees.push([1, fas, 0]);
		this.StateMaker();
		this.lees.push([1, fas, 1]);
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

	//Three function concerned just with object marking
	//Mark number depending on values defined in sieve
	MarkNormally(v, granted="sieveBut"){
		var bt=this.place.getElementsByClassName(granted)[v];
		if (this.PrimeCheck(v)==1) this.Painter(bt, 0);
		if (this.PrimeCheck(v)==0) this.Painter(bt, 2);
	}

	//Color processed slaying number
	Darken(v, granted="sieveBut"){
		this.Painter(this.place.getElementsByClassName(granted)[v], 15, 1);
	}

	//Color processed just slain by prime
	PrimeColor(v1, v2, granted="sieveBut"){
		var bt=this.place.getElementsByClassName(granted)[v1];
		this.Painter(bt, 1);
		this.Darken(v2);
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
		if (prev[0]==0 && last[0]==0) strr=`I mark the next number (${last[2]-last[3]}+${last[3]}=${last[2]}) as composite number, because it is divisible by ${last[3]}. `;
		if (prev[0]==1 && last[0]==0) strr=`I found a prime (${last[3]}), so I start finding numbers divisible by it, starting from ${last[3]}*${last[3]}=${last[2]}, because every lower number divisible by ${last[3]} is already marked - read proof(2) above. `;
		if (last[0]==0) strr+=`${this.marked[last[2]]!=last[3]?`This number was already marked.`:`This number is marked just from now.`} `;
		if (last[0]==1) strr+=`This number is ${this.PrimeCheck(last[2])?`a prime - so I'll start marking composite numbers as divisible by it.`:`not a prime - so I have to search further.`}`;
		if (last[0]==100) strr=`${prev[2]}*${prev[2]} > ${prev[1]} (given limit) - and so, all prime numbers up to the given limit were found, sieve ends.`;
		return strr;
	}

	EscapeCondition(v, lim){
		if (v*v>lim) return 1;
		return 0;
	}

	//Go to the next state of the algorithm
	NextState(){
		var l=this.lees.length;
		var s=this.lees[l-1];
		var lim=s[1];
		if (s[0]==0){
			if (s[2]+s[3]<=lim) this.lees.push([0, lim, s[2]+s[3], s[3]]);
			else if (s[3]<=lim) this.lees.push([1, lim, s[3]+1]);
			else this.lees.push([100]);
		}

		else if (s[0]==1){
			if (this.EscapeCondition(s[2], s[1])==1) this.lees.push([100]);
			else if (this.PrimeCheck(s[2])==1 && s[2]*s[2]<=s[1]) this.lees.push([0, lim, s[2]*s[2], s[2]]);
			else this.lees.push([1, lim, s[2]+1]);
		}
	}

	//Make the last state in list of states
	StateMaker(){
		var l=this.lees.length;
		var s=this.lees[l-1];
		if (s[0]==0) {
			this.DestroyPrime(s[2], s[3]);
			this.PrimeColor(s[2], s[3]);
		}
		if (s[0]==1) this.Darken(s[2]);
		if (l>1){
			s=this.lees[l-2];
			if (this.lees[l-1][0]!=0 || this.lees[l-2][0]!=1) this.MarkNormally(s[2]);
			if (s[0]==0 && s[2]+s[3]>s[1]) this.MarkNormally(s[3]);
		}
	}


	//Unmake last move in list of states
	StateUnmaker(){
		var l=this.lees.length;
		var s=this.lees[l-1];
		if (s[0]==0) this.MakePrime(s[2], s[3]);
		if (s[0]!=100) this.MarkNormally(s[2]);

		if (l>1){
			s=this.lees[l-2];
			if (s[0]==1) this.Darken(s[2]);
			if (s[0]==0) this.PrimeColor(s[2], s[3]);
		}
		super.StateUnmaker();
	}

	//Create Button
	buttCreator(numb=null){
		var butt = super.buttCreator(numb);
		butt.classList.add("sieveBut");
		return butt;
	}
}
