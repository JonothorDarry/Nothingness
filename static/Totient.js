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
		if (last[0]==1 && last[2]+last[2]<=last[1]) strr+=`This number is ${this.PrimeCheck(last[2])?`a prime - so I mark it's totient as &#x3d5;(${last[2]})=${last[2]-1} and start marking perhaps-primes as divisible by it, changing their totient in process.`:`not a prime - so I have to search further.`}`;
		else if (last[0]==1) strr+=`This number is ${this.PrimeCheck(last[2])?`a prime and I mark it's totient as &#x3d5;(${last[2]})=${last[2]-1}, but I won't start changing other totients because ${last[2]}+${last[2]}>${last[1]}}`:`not a prime - so I have to search further.`}`;
		if (last[0]==100) strr=`${prev[2]}+1 > ${prev[1]} (given limit) - and so, all prime numbers up to the given limit were found along with value of their totient, sieve ends.`;
		return strr;
	}

	buttCreator(v){
		return this.doubleButtCreator(v, Representation_utils.button_creator)[0];
	}
}

class PowerTower extends Algorithm{
	constructor(block, n=-1, m, lees){
		super(block);
		if (n==-1) return;

		var i, j, btn;
		this.divsCreator();
		for (i=0;i<5;i++){
			for (j=0;j<n;j++){
				if (i==0) btn=this.buttCreator(j);
				else if (i==1) btn=this.buttCreator(lees[j]);
				else btn=this.buttCreator();
				console.log(i, j);
				this.zdivs[i].buttons.appendChild(btn);
			}
		}
	}

	BeginningExecutor(){
		this.starter();
		var fas=this.input.value;
		var a=0, n, x, i=0, c, dis, j, btn;
		this.dt=[];
		this.toth=[];

		this.btnlist=[];
		for (i=0;i<5;i++) this.btnlist.push([]);
		
		c=this.dissolve_input(fas);
		n=c.get_next(), this.n=n;
		this.toth.push(c.get_next());
		for (i=0;i<n;i++)	this.dt.push(c.get_next());

		this.lees.push([1, 0]);
		this.divs=this.divsCreator();

		for (i=0;i<5;i++){
			for (j=0;j<n;j++){
				if (i==0) btn=this.buttCreator(j);
				else if (i==1) btn=this.buttCreator(this.dt[j]);
				else btn=this.buttCreator();
				this.btnlist[i].push(btn);
				this.zdivs[i].buttons.appendChild(btn);
			}
		}
	}

	StateMaker(){
		var l=this.lees.length;
		var s=this.lees[l-1], tot;
		if (s[0]==1){
			if (s[1]!=0) this.Painter(this.btnlist[2][s[1]-1], 0);
			this.Painter(this.btnlist[2][s[1]], 1);
			tot=this.toth[s[1]];
			this.btnlist[2][s[1]].innerHTML=tot;
		}

		if (s[0]==2){
			if (s[3]==this.n-1) this.Painter(this.btnlist[2][s[3]], 0);
			else{
				this.Painter(this.btnlist[3][s[3]+1], 0);
				this.Painter(this.btnlist[4][s[3]+1], 0);
			}

			this.Painter(this.btnlist[4][s[3]], 1);
			this.btnlist[4][s[3]].innerHTML=s[1];
		}

		if (s[0]==3){
			this.Painter(this.btnlist[3][s[3]], 1);
			this.btnlist[3][s[3]].innerHTML=s[2];
		}
		if (s[0]==100){
			this.Painter(this.btnlist[4][0], 0);
		}
	}

	StateUnmaker(){
		var l=this.lees.length;
		var s=this.lees[l-1], tot;
		if (s[0]==1){
			if (s[1]!=0) this.Painter(this.btnlist[2][s[1]-1], 1);
			this.Painter(this.btnlist[2][s[1]], 4);
		}

		if (s[0]==2){
			if (s[3]==this.n-1) this.Painter(this.btnlist[2][s[3]], 1);
			else{
				this.Painter(this.btnlist[3][s[3]+1], 1);
				this.Painter(this.btnlist[4][s[3]+1], 1);
			}

			this.Painter(this.btnlist[4][s[3]], 4);
		}

		if (s[0]==3){
			this.Painter(this.btnlist[3][s[3]], 4);
		}
		if (s[0]==100){
			this.Painter(this.btnlist[4][0], 1);
		}
		super.StateUnmaker();
	}

	NextState(){
		var l=this.lees.length;
		var s=this.lees[l-1], tot;
		if (s[0]==1){
			tot=this.find_totient(this.toth[s[1]]);
			this.toth.push(tot);
			if (s[1]<this.n-1) this.lees.push([1, s[1]+1]);
			else this.lees.push([2, ((this.dt[s[1]]>32)?0:1), 1, s[1]]);
		}

		if (s[0]==2){
			var nxt=s[1], res, b;
			if (s[3]==this.n-1 || s[1]==1) b=s[2];
			else b=this.toth[s[3]+1]+s[2];

			if (nxt==0) res=this.pow(this.dt[s[3]], b, this.toth[s[3]]);
			else res=this.pow(this.dt[s[3]], b);

			this.lees.push([3, nxt, res, s[3]]);
		}

		if (s[0]==3){
			var nxt=1;
			if (s[1]==0 || s[2]*Math.log(this.dt[s[3]-1])>5) nxt=0;

			if (s[3]>0) this.lees.push([2, nxt, s[2], s[3]-1]);
			else this.lees.push([100]);
		}
	}

	StatementComprehension(){
		var l=this.lees.length;
		var last=this.lees[l-1], prev=this.lees[l-2], tot;
		
		if (last[0]==100) return `And so, the end has come: the result is ${prev[2]}`;
		if (last[0]==1) return `Now, I'm finding totients of last modulus, so that I'll be able to calculate exponent easily. ${((last[1]==0)?(`This is just the beginning of algorithm, so I assign most outer modulus to given m=${this.toth[last[1]]}`):(`&#x03D5;(${this.toth[last[1]-1]})=${this.toth[last[1]]}`))}`;

		if (last[0]==2 && prev[0]==1) return `This is the first exponent, that I will push further, so I treat current exponent as 1. ${((last[2]>32)?`This number is already higher than log<sub>2</sub>(maxmod)<32, so I treat number as high one`:`This number is small, so I treat it as it is, without changing it with modulo operator - ulitmately, purpose of mod is to get rid of huge numbers, not the mod operation itself.`)}`;
		else if (last[0]==2) return `${(prev[1]==0)?`Exponent res<sub>i+1</sub> is already high, and so is a<sub>i</sub><sup>res<sub>i+1</sub></sup>`:`${(last[1]==1)?`This number is low too, because for x<sup>y</sup>, ylog<sub>2</sub>(x)=${this.dt[last[3]]}log<sub>2</sub>(${last[2]})<=5`:`This number is high, a<sub>i</sub><sup>res<sub>i+1</sub></sup>>32, because res<sub>i+1</sub>log<sub>2</sub>(a<sub>i</sub>)=${last[2]}log<sub>2</sub>(${this.dt[last[3]]})>5`}`}`;

		if (last[0]==3 && last[1]==1) return `Partial result is calculated as a<sub>i</sub><sup>res<sub>i+1</sub></sup>=${this.dt[last[3]]}<sup>${prev[2]}</sup>=${last[2]} -  I keep whole number, because it's small`;
		else if (last[0]==3) return `Partial result is calculated as a<sub>i</sub><sup>&#x03D5;<sub>i+1</sub>(m) + res<sub>i+1</sub> mod &#x03D5;<sub>i+1</sub>(m)</sup> mod &#x03D5;<sub>i</sub>(m)=${this.dt[last[3]]}<sup>${this.toth[last[3]+1]}+${prev[2]%this.toth[last[3]+1]}</sup> mod ${this.toth[last[3]]}=${last[2]}`;

	}

	find_totient(x){
		var dv=1, i=2, rs=x;
		for(i=2;i*i<=rs;i++){
			if (rs%i==0) rs=Math.floor(rs/i), dv*=(i-1);
			while (rs%i==0) rs=Math.floor(rs/i), dv*=i;
		}
		if (rs>1) dv*=(rs-1);
		return dv;
	}

	pow(a, b, m=1000000007){
		var res=1;
		for (;b>0;b=Math.floor(b/2)){
			if (b%2==1) res=(res*a)%m;
			a=(a*a)%m;
		}
		return res;
	}

	divsCreator(){
		var title_list=["i", "a<sub>i</sub>", "Current &#x03D5;", "Result", "Is low"];
		super.divsCreator(5, 5, title_list);
	}
}


var feral=Algorithm.ObjectParser(document.getElementById('Algo1'));
var sk=new TotientSieve(feral, 100);

var feral2=Algorithm.ObjectParser(document.getElementById('Algo2'));
var sk2=new PowerTower(feral2, 6, 107, [2, 7, 3, 12, 43, 25]);
