class Sieve extends Algorithm{
	logical_box(){
		this.logic.lpf = NTMath.sievify(this.logic.n);
	}

	_presentation_colors_set(){
		this.present.colors={
			'composite':2,
			'iterated':15,
		}
	}

	presentation(){
		this.present={};
		this._presentation_colors_set();
		var buttons={'sieve':[]}, i=0, j=0, btn;
		var dv = Modern_representation.div_creator('', {'general':{'width':null}});
		for (i=0; i<=this.logic.n; i++){
			btn = Modern_representation.button_creator(i, {'general':{'backgroundColor':'#440000'}});
			Representation_utils.Painter(btn, 0);
			buttons.sieve.push(btn);
			dv.appendChild(btn);
		}
		this.place.appendChild(dv);
		this.buttons=buttons;
	}

	palingnesia(){
		this.logical_box();
		this.presentation();
	}

	read_data(){
		var fas=this.input.value;
		var c=this.dissolve_input(fas);
		this.logic.n=c.get_next();
	}

	constructor(block, n){
		super(block);
		this.logic.n=n;
		this.version=4;
		this.palingnesia();
	}

	BeginningExecutor(){
		this.read_data();
		this.palingnesia();
		this.lees.push([0]);
	}

	StateMaker(s){
		var staat=[], i;
		var staat=this.ephemeral.staat, passer=this.ephemeral.passer;

		if (s[0]==0){
			this.modern_pass_color(this.buttons.sieve[0], 1, this.present.colors.composite);
			this.modern_pass_color(this.buttons.sieve[1], 1, this.present.colors.composite);
		}
		if (s[0]==1){
			this.modern_pass_color(this.buttons.sieve[s[2]], 1, this.present.colors.composite);
			this.modern_pass_color(this.buttons.sieve[s[1]], 15, 0);
		}
		if (s[0]==2){
			var prime_color = (this.logic.lpf[s[1]]==s[1])?0:this.present.colors.composite;
			this.modern_pass_color(this.buttons.sieve[s[1]], this.present.colors.iterated, prime_color);
		}
	}

	NextState(){
		var l=this.lees.length;
		var s=this.lees[l-1], staat=[], i;
		var staat=this.ephemeral.staat, passer=this.ephemeral.passer;

		if (s[0]==0) return [2, 2];
		if (s[0]==1){
			if (s[2]+s[1] <= this.logic.n) return [1, s[1], s[1]+s[2]];
			else if ((s[1]+1)*(s[1]+1) <= this.logic.n) return [2, s[1]+1];
			else return [100];
		}

		else if (s[0]==2){
			if (s[1]*s[1] >= this.logic.n) return [100];
			else if (this.logic.lpf[s[1]]==s[1] && s[1]*s[1]<=this.logic.n) return [1, s[1], s[1]*s[1]];
			else return [2, s[1]+1];
		}
	}

	StatementComprehension(){
		if (this.state_nr == 0) return `This is just before the beginning of the sieve - I mark 0 and 1 as non-prime, by definition`;

		var prev=this.lees[this.state_nr-1], last=this.lees[this.state_nr];
		var strr=``;
		if (prev[0]==1 && last[0]==2) strr=`I've already marked all integers lower or equal to limit divisible by ${prev[1]}, so I search for next primes, starting from last prime I've found +1 - ${prev[1]+1}. `;
		if (prev[0]==2 && last[0]==2) strr=`Last number I checked (${prev[1]}) was not a prime, so I search further. `;
		if (prev[0]==1 && last[0]==1) strr=`I mark the next number (${last[2]-last[1]}+${last[1]}=${last[2]}) as composite number, because it is divisible by ${last[1]}. `;
		if (prev[0]==2 && last[0]==1) strr=`I found a prime (${last[1]}), so I start finding numbers divisible by it, starting from ${last[1]}*${last[1]}=${last[2]}, because every lower number divisible by ${last[1]} is already marked. `;
		if (last[0]==1) strr+=`${(this.logic.lpf[last[2]]!=last[1])?`This number was already marked.`:`This number is marked just from now.`} `;
		if (last[0]==2) strr+=`This number is ${(this.logic.lpf[last[1]]==last[1])?`a prime - so I'll start marking composite numbers as divisible by it.`:`not a prime - so I have to search further.`}`;
		if (last[0]==100) strr=`${prev[1]+1}*${prev[1]+1} > ${this.logic.n} (given limit) - and so, all prime numbers up to the given limit were found, sieve ends.`;
		return strr;
	}
}

class ExtendedSieve extends Sieve{
	logical_box(){
		this.logic.lpf = NTMath.sievify(this.logic.n);
	}

	_presentation_colors_set(){
		this.present.colors={
			'composite':2,
			'iterated':15,
		}
	}

	_presentation_button_creator(v){
		var btn = this.doubleButtCreator(v, Representation_utils.button_creator);
		Representation_utils.Painter(btn[0], 0);
		btn[1].innerHTML = 'lpf(' + btn[1].innerHTML + ')';
		for (var x of btn){
			x.style.width='80px';
		}
		btn[0].style.border = '1px solid grey';
		btn[0].style.verticalAlign = 'top';

		return btn[0];
	}

	presentation(){
		this.present={};
		this._presentation_colors_set();
		var buttons={'sieve':[]}, i=0, j=0, btn;
		var dv = Modern_representation.div_creator('', {'general':{'width':null}});
		for (i=0; i<=this.logic.n; i++){
			btn = this._presentation_button_creator(i);
			buttons.sieve.push(btn);
			dv.appendChild(btn);
		}
		this.place.appendChild(dv);
		this.buttons=buttons;
	}

	palingnesia(){
		this.logical_box();
		this.presentation();
	}

	read_data(){
		var fas=this.input.value;
		var c=this.dissolve_input(fas);
		this.logic.n=c.get_next();
	}

	constructor(block, n){
		super(block);
		this.logic.n=n;
		this.version=4;
		this.palingnesia();
	}

	BeginningExecutor(){
		this.read_data();
		this.palingnesia();
		this.lees.push([0]);
	}

	StateMaker(s){
		var staat=[], i;
		var staat=this.ephemeral.staat, passer=this.ephemeral.passer;

		if (s[0]==0){
			this.modern_pass_color(this.buttons.sieve[0], 1, this.present.colors.composite);
			this.modern_pass_color(this.buttons.sieve[1], 1, this.present.colors.composite);
		}
		if (s[0]==1){
			this.modern_pass_color(this.buttons.sieve[s[2]], 1, this.present.colors.composite);
			this.modern_pass_color(this.buttons.sieve[s[1]], 15, 0);
			if (s[1]==this.logic.lpf[s[2]]) staat.push([1, this.buttons.sieve[s[2]].lower, this.buttons.sieve[s[2]].lower.innerHTML, this.logic.lpf[s[2]]]);
		}
		if (s[0]==2){
			var prime_color = (this.logic.lpf[s[1]]==s[1])?0:this.present.colors.composite;
			this.modern_pass_color(this.buttons.sieve[s[1]], this.present.colors.iterated, prime_color);
		}
	}

	NextState(){
		var l=this.lees.length;
		var s=this.lees[l-1], staat=[], i;
		var staat=this.ephemeral.staat, passer=this.ephemeral.passer;

		if (s[0]==0) return [2, 2];
		if (s[0]==1){
			if (s[2]+s[1] <= this.logic.n) return [1, s[1], s[1]+s[2]];
			else if ((s[1]+1)*(s[1]+1) <= this.logic.n) return [2, s[1]+1];
			else return [100];
		}

		else if (s[0]==2){
			if (s[1]*s[1] >= this.logic.n) return [100];
			else if (this.logic.lpf[s[1]]==s[1] && s[1]*s[1]<=this.logic.n) return [1, s[1], s[1]*s[1]];
			else return [2, s[1]+1];
		}
	}

	StatementComprehension(){
		if (this.state_nr == 0) return `This is just before the beginning of the sieve - I mark 0 and 1 as non-primes with factorizations: undefined (for 0) and consisting of 1 (for 1), by definition. Furthermore, I set (just for convenience) lowest prime factor of each number to itself.`;

		var prev=this.lees[this.state_nr-1], last=this.lees[this.state_nr];
		var strr=``;
		if (prev[0]==1 && last[0]==2) strr=`I've already marked all integers lower or equal to limit divisible by ${prev[1]}, so I search for next primes, starting from last prime I've found +1 - ${prev[1]+1}. `;
		if (prev[0]==2 && last[0]==2) strr=`Last number I checked (${prev[1]}) was not a prime, so I search further. `;
		if (prev[0]==1 && last[0]==1) strr=`I mark the next number (${last[2]-last[1]}+${last[1]}=${last[2]}) as composite number, because it is divisible by ${last[1]}. `;
		if (prev[0]==2 && last[0]==1) strr=`I found a prime (${last[1]}), so I start finding numbers divisible by it, starting from ${last[1]}*${last[1]}=${last[2]}, because every lower number divisible by ${last[1]} is already marked. `;
		if (last[0]==1) strr+=`${(this.logic.lpf[last[2]]!=last[1])?`This number was already marked, so I don't change its lowest prime factor.`:`This number is marked just from now - thus, lpf(${last[2]}) = ${last[1]}.`} `;
		if (last[0]==2) strr+=`This number is ${(this.logic.lpf[last[1]]==last[1])?`a prime - so I'll start marking composite numbers as divisible by it, possibly changing their lowest prime factor.`:`not a prime - so I have to search further.`}`;
		if (last[0]==100) strr=`${prev[1]+1}*${prev[1]+1} > ${this.logic.n} (given limit) - and so, all lowest divisors of numbers up to ${this.logic.n} were found, sieve ends.`;
		return strr;
	}
}

class Factorizer extends Algorithm{
	//Provide standard representation for Temp libraries
	_logical_defactor(){
		var factories=[];
		for (var x of this.logic.factor_list){
			factories.push({'base':x, 'expo':this.logic.factors[x]})
		}
		this.logic.factories = factories;
	}

	logical_box(){
		this.logic.lpf=this.sieve.logic.lpf;
		this.logic.factors={};
		var x=this.logic.a;

		while (x!=1){
			if (this.logic.lpf[x] in this.logic.factors)
				this.logic.factors[this.logic.lpf[x]]+=1;
			else
				this.logic.factors[this.logic.lpf[x]]=1;
			x=Math.floor(x/this.logic.lpf[x]);
		}
		this.logic.factor_list = Object.keys(this.logic.factors).map(x => Number(x));
		this.logic.factor_list.sort(function(a, b){return a - b;});

		this.logic.map_factor_to_index={};
		for (var i=0; i<this.logic.factor_list.length; i+=1){
			this.logic.map_factor_to_index[this.logic.factor_list[i]]=i;
		}
		this._logical_defactor();
	}

	presentation(){
		Representation_utils.change_button_width(this.stylistic, this.logic.a);
		this.buttons={'factors':null};
		
		var construction_site=this.modern_divsCreator(1, 1, null, `${this.stylistic.bs_butt_width_h+10}px`).zdivs;
		this.buttons.factors=Representation_utils.fill_with_buttons_horizontal(this.stylistic, construction_site[0].buttons, this.logic.factories, 4, -1, Representation_utils.expo_style_button_creator, {'size':20});
	}

	palingnesia(){
		this.logical_box();
		this.presentation();
	}

	read_data(){
		var fas=this.input.value;
		var c=this.dissolve_input(fas);
		this.logic.a=c.get_next();
	}

	constructor(block, a, associated_sieve){
		super(block);
		this.querier=true;
		this.logic.a=a;
		this.sieve=associated_sieve;
		this.version=4;
		this.palingnesia();
	}

	BeginningExecutor(){
		this.read_data();
		if (this.sieve.is_runtime_finished() == false){
			this.lees.push([101]);
		}

		else if (this.logic.a > this.sieve.logic.n) {
			this.lees.push([102]);
		}
		else{
			this.palingnesia();
			this.lees.push([0, this.logic.a, this.logic.lpf[this.logic.a], 1]);
		}
	}

	StateMaker(s){
		var staat=[], i;
		var staat=this.ephemeral.staat, passer=this.ephemeral.passer;

		if (s[0]==0){
			if (s[1]!=1){
				var elem = this.buttons.factors[this.logic.map_factor_to_index[s[2]]];
				if (s[3]==1){
					this.modern_pass_color(elem.expo, 1, 0);
					this.modern_pass_color(elem.base, 1, 0);
				}
				else if (s[3]>1){
					this.modern_pass_color(elem.expo, 1, 0);
				}
				if (s[3]>=1){
					staat.push([1, elem.expo, elem.expo.innerHTML, s[3]])
				}
			}
			var color = ((this.logic.lpf[s[1]]==s[1])?0:2);
			this.modern_pass_color(this.sieve.buttons.sieve[s[1]], 1, color);
		}

		if (s[0]==100){
			for (var x of this.buttons.factors){
				staat.push([0, x.base, 0, 8]);
				staat.push([0, x.expo, 0, 8]);
			}
		}

	}

	NextState(){
		var l=this.lees.length;
		var s=this.lees[l-1];
		var next = Math.floor(s[1]/this.logic.lpf[s[1]]);

		if (s[1]==1) return [100];
		if (this.logic.lpf[next] == s[2]) return [0, next, s[2], s[3]+1];
		return [0, next, this.logic.lpf[next], 1];
	}

	StatementComprehension(){
		var l=this.lees.length;
		var s=this.lees[this.state_nr], x=s[1];

		if (s[0]==0 && s[1]!=1) return `As lowest factor of ${s[1]} is equal to ${this.logic.lpf[s[1]]}, then ${this.logic.lpf[s[1]]} is added to factorization of ${this.logic.a}, and remaining factors of ${this.logic.a} are factors of ${s[1]}/${this.logic.lpf[s[1]]} = ${Math.floor(s[1]/this.logic.lpf[s[1]])}`;
		if (s[0]==0) return `And so, 1 was reached, so full factorization of ${this.logic.a} was obtained.`;
		if (s[0]==100) return `${this.logic.a} was already factorized: ${this.logic.a} = ${NTMath_presentation.show_factorization(this.logic.factories)}`;
		if (s[0]==101) return `In order to start query You need to finish the sieve.`;
		if (s[0]==102) return `In order to start query You need to provide number lower than limit of the sieve - that is, ${this.sieve.logic.n}`; 
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

	StateMaker(s){
		var staat=[], i;
		var staat=this.ephemeral.staat, passer=this.ephemeral.passer;

		if (s[0]==0){
			this.modern_pass_color(this.buttons.factors[s[1]].expo);
			this.modern_pass_color(this.buttons.factors[s[1]].base);
			staat.push([1, this.buttons.factors[s[1]].expo, 0, 1]);
			staat.push([1, this.buttons.change_basis, this.logic.xp[s[2]], this.logic.xp[s[2]+1]]);
		}

		if (s[0]==1){
			this.modern_pass_color(this.buttons.factors[s[1]].expo, 1);
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
		if (s[0]==1 && this.logic.factors[s[1]].expo>s[3]+1) return [1, s[1], s[2]+1, s[3]+1];
		if (this.logic.factors.length>s[1]+1) return [0, s[1]+1, s[2]+1];
		return [100];
	}

	StatementComprehension(){
		var s=this.lees[this.state_nr];
		var x=s[1];

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
var sk=new Sieve(feral, 30);

var feral2=Algorithm.ObjectParser(document.getElementById('Algo2'));
var sk2=new ExtendedSieve(feral2, 30);

var foul=Algorithm.ObjectParser(document.getElementById('querySection'));
var sk3=new Factorizer(foul, 24, sk2);

//x.value="Jonasz";
//var butt = document.createButton(1);
//x.appendChild(butt);
//export Algorithm;
