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

	buttCreator(v){
		return this.doubleButtCreator(v, super.buttCreator.bind(this))[0];
	}
}





class Querier extends Algorithm{
	constructor(value, block, assocSieve){
		super(block)
		this.sieve=assocSieve;
		this.post_lees=[];
	}

	BeginningExecutor(){
		for (var j=0;j<this.post_lees.length;j++){
			if (this.post_lees[j][0]==0) this.sieve.MarkNormally(this.post_lees[j][1]);
		}
		this.post_lees=[];

		var fas=this.input.value;
		var ts=this.sieve.lees;
		
		if (ts[ts.length-1][0]!=100 || ts[ts.length-2][1]<parseInt(fas)) return;
		this.place.textContent=fas+" : ";

		this.lees.push([0, fas]);
		this.post_lees=this.lees.slice();
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
		this.post_lees=this.lees.slice();
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
	
		super.StateUnmaker();
		this.post_lees=this.lees.slice();
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

class Simple_factorizer extends Algorithm{
	logical_box(){
		this.logic.limit=Math.ceil(Math.sqrt(this.logic.x));
		var cur_x=this.logic.x, count;
		this.logic.xp=[];
		this.logic.factors=[];
		
		for (var i=2; i<=this.logic.limit && cur_x>1; i++){
			count=0;
			while (cur_x%i==0) {
				this.logic.xp.push(cur_x);
				cur_x=Math.floor(cur_x/i);
				count+=1;
			}
			if (count==0) continue;
			this.logic.factors.push({'base':i, 'expo':count});
		}

		if (cur_x>1){
			this.logic.xp.push(cur_x);
			this.logic.factors.push({'base':cur_x, 'expo':1});
		}
		this.logic.xp.push(1);
	}

	palingnesia(){
		this.logical_box();
		Representation_utils.change_button_width(this.stylistic, this.logic.x);
		this.buttons={'change_basis':null, 'factors':[]};
		var i=0, x;

		var construction_site=this.modern_divsCreator(7, 1, ['x, x\' and its factorization'], `${2*this.stylistic.bs_butt_width_h+10}px`).zdivs;
		construction_site[0].title.style.width='300px';
		this.buttons.change_basis=Representation_utils.fill_with_buttons_horizontal(this.stylistic, construction_site[0].midian, this.logic.x, [5, 1])[1];
		this.buttons.factors=Representation_utils.fill_with_buttons_horizontal(this.stylistic, construction_site[0].buttons, this.logic.factors, 4, -1, Representation_utils.expo_style_button_creator, {'size':20});
	}

	read_data(){
		var fas=this.input.value;
		var c=this.dissolve_input(fas);
		this.logic.x=c.get_next();
	}

	constructor(block, x){
		super(block);
		this.logic.x=x;
		this.version=4;
		this.palingnesia();
	}

	BeginningExecutor(){
		this.read_data();
		this.palingnesia();
		this.lees.push([0, 0, 0]);
	}

	StateMaker(){
		var l=this.lees.length;
		var s=this.lees[l-1], staat=[], i;
		var staat=this.ephemeral.staat, passer=this.ephemeral.passer;

		if (s[0]==0){
			this.pass_color(this.buttons.factors[s[1]].expo);
			this.pass_color(this.buttons.factors[s[1]].base);
			staat.push([1, this.buttons.factors[s[1]].expo, 0, 1]);
			staat.push([1, this.buttons.change_basis, this.logic.xp[s[2]], this.logic.xp[s[2]+1]]);
		}

		if (s[0]==1){
			this.pass_color(this.buttons.factors[s[1]].expo, 0, 1);
			staat.push([1, this.buttons.factors[s[1]].expo, s[3], s[3]+1]);
			staat.push([1, this.buttons.change_basis, this.logic.xp[s[2]], this.logic.xp[s[2]+1]]);
		}

		if (s[0]==100){
			var x, y;
			staat.push([0, this.buttons.change_basis, 1, 0]);
			for (x of this.buttons.factors){
				for (y in x){
					if (y[0]!='_') staat.push([0, x[y], 0, 8]);
				}
			}
		}
	}

	NextState(){
		var l=this.lees.length;
		var s=this.lees[l-1];

		if (s[0]==0 && this.logic.factors[s[1]].expo>1) return [1, s[1], s[2]+1, 1];
		if (s[0]==1 && this.logic.factors[s[1]].expo>s[2]+1) return [1, s[1], s[2]+1, s[3]+1];
		if (this.logic.factors.length>s[1]+1) return [0, s[1]+1, s[2]+1];
		return [100];
	}

	StatementComprehension(){
		var l=this.lees.length;
		var s=this.lees[l-1], x=s[1];
		var str=`Our aim is to find next prime divisor of ${this.logic.x} - in order to do this, we'll try to find divisor of still unfactorized part of ${this.logic.x} equal to ${this.logic.xp[s[2]]}. We search for next divisor from ${(s[1]>0)?this.logic.factors[s[1]-1].base+1:2} to ${this.logic.limit}. `

		if (s[0]==0 && this.logic.factors[s[1]].base<this.logic.limit) return str+`Next divisor is ${this.logic.factors[s[1]].base}, thus, we divide our unfactorized part of ${this.logic.x} by ${this.logic.factors[s[1]].base}, obtaining ${this.logic.xp[s[2]]}/${this.logic.factors[s[1]].base}=${this.logic.xp[s[2]+1]}.`;
		if (s[0]==0) return str+`As there are no divisors in this range, then x'=${this.logic.xp[s[2]]} is the last prime divisor of ${this.logic.x}, and the algorithm can end.`;
		
		if (s[0]==1) return `As unfactorized part of ${this.logic.x} is still divisible by ${this.logic.factors[s[1]].base}, then it is divided by ${this.logic.factors[s[1]].base} (resulting in ${this.logic.xp[s[2]]}/${this.logic.factors[s[1]].base}=${this.logic.xp[s[2]+1]}). Then, ${this.logic.factors[s[1]].base} is added to factorization yet again.`;

		if (s[0]==100) return `As unfactorized part of ${this.logic.x} became 1, then we have found all prime divisors of ${this.logic.x}, and there is nothing more left to do. The ultimate factorization is: ${NTMath_presentation.show_factorization(this.logic.factors)}`;
	}
}


var feral4=Algorithm.ObjectParser(document.getElementById('Algo4'));
var eg4=new Simple_factorizer(feral4, 84);

var feral=Algorithm.ObjectParser(document.getElementById('Algo1'));
var sk=new Sieve(feral, 100);

var feral2=Algorithm.ObjectParser(document.getElementById('Algo2'));
var sk2=new ExtendedSieve(feral2, 100);

var foul=Algorithm.ObjectParser(document.getElementById('querySection'));
var sk3=new Querier(132, foul, sk2);

//x.value="Jonasz";
//var butt = document.createButton(1);
//x.appendChild(butt);
//export Algorithm;
