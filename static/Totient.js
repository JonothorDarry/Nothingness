class Totient_CRT extends Partial{
	presentation(){
		this.place.position='relative';
		this.place.style.width='max-content';
		this.buttons={'upper':null, 'lefty':null};

		var table = Representation_utils.proto_divsCreator(1, this.logic.n+4, [], null, this.place, this.stylistic);
		var grid = new Grid(this.logic.n+3, this.logic.m+3, this.stylistic, {'place':table.zdivs, 'top_margin':1, 'left_margin':1});

		var i, j, color, phi_nm=0;
		for (i=0; i<this.logic.n; i++){
			for (j=0; j<this.logic.m; j++){
				if (NTMath.gcd(this.logic.table[i][j], this.logic.n*this.logic.m) > 1) color = 2;
				else color = 0, phi_nm+=this.logic.redundant[i][j];

				if (this.logic.table[i][j] == 0) grid.single_filler([i, j], `-`, {'color':32});
				else grid.single_filler([i, j], this.logic.table[i][j], {'color':color});
			}
		}

		grid.single_filler([-1, -1], 'n\\m', {'color':5});
		this.buttons.upper = grid.filler([-1, [0, this.logic.m-1]], ArrayUtils.range(0, this.logic.m-1), {'color':101});
		this.buttons.lefty = grid.filler([[0, this.logic.n-1], -1], ArrayUtils.range(0, this.logic.n-1), {'color':101});
		var phi_n = this.logic.n, phi_m = this.logic.m;
		for (i=0; i<this.logic.m; i++){
			if (NTMath.gcd(i, this.logic.m) > 1) Representation_utils.Painter(this.buttons.upper[i], 6), phi_m--;
		}
		for (i=0; i<this.logic.n; i++){
			if (NTMath.gcd(i, this.logic.n) > 1) Representation_utils.Painter(this.buttons.lefty[i], 6), phi_n--;
		}

		var _size=90;
		table.divs[this.logic.n+2].style.display = "none";
		table.divs[this.logic.n+3].style.display = "none";
		grid.single_filler([this.logic.n, -1], `&phi;(${this.logic.n}) = ${phi_n}`, {'color':8, 'stylistic':{'general':{'writing-mode':'vertical-rl'}, 'px':{'height':_size}}});
		grid.single_filler([-1, this.logic.m], `&phi;(${this.logic.m}) = ${phi_m}`, {'color':8, 'stylistic':{'px':{'width':_size}}});
		grid.single_filler([this.logic.n, this.logic.m], `&phi;(${this.logic.n * this.logic.m}) = ${phi_nm}`, {'color':8, 'stylistic':{'px':{'height':_size, 'width':_size}}});
	}

	read_data(){
		var c=this.dissolve_input(this.input.value);
		this.logic.n = c.get_next();
		this.logic.m = c.get_next();
	}

	logical_box(){
		this.logic.table = ArrayUtils.create_2d(this.logic.n, this.logic.m);
		this.logic.redundant = ArrayUtils.create_2d(this.logic.n, this.logic.m);

		for (var i=1; i <= this.logic.n * this.logic.m; i++){
			this.logic.redundant[i%this.logic.n][i%this.logic.m]++;
			this.logic.table[i%this.logic.n][i%this.logic.m] = i;
		}
	}

	ShowReality(){
		this.starter();
		this.read_data();
		this.logical_box();
		this.presentation();
	}

	constructor(block, n, m){
		super(block);
		this.logic.n = n;
		this.logic.n = m;
		this.ShowReality();
	}
}

class Totient_IEP extends Partial{

	_logical_mark_numbers(){
		var i=0, j, x=this.logic.n;
		for (i=2; i*i<=x; i++){
			if (x % i == 0) this.logic.prime_factors.push(i);
			while (x % i == 0) x = Math.floor(x/i);
		}
		if (x>1) this.logic.prime_factors.push(x);
		for (i=0; i<this.logic.prime_factors.length; i++) this.logic.inverse_factors[this.logic.prime_factors[i]] = i;

		this.logic.prime_divs = ArrayUtils.steady(this.logic.n+1, 0).map(e => []);
		for (i=1; i<=this.logic.n; i++){
			for (j=0; j<this.logic.prime_factors.length; j++){
				if (i % this.logic.prime_factors[j] == 0) this.logic.prime_divs[i].push(this.logic.prime_factors[j]);
			}
		}
	}

	_logical_generate_power_sets(){
		this.logic.power_sets = [{'set':[], 'amount':this.logic.n, 'parity':1}];

		var lim=0, x, i;
		for (var p of this.logic.prime_factors){
			lim = this.logic.power_sets.length;
			for (i=0; i<lim; i++){
				x = this.logic.power_sets[i];
				this.logic.power_sets.push({'set':x.set.slice().concat(p), 'amount':Math.floor(x.amount/p), 'parity':-x.parity});
			}
		}
	}

	logical_box(){
		this.logic.prime_factors = [];
		this.logic.inverse_factors = {};

		this._logical_mark_numbers();
		this._logical_generate_power_sets();
	}

	_presentation_fill_div_with_prime_factors(div, factors){
		var colors = [30, 32, 33, 101, 15];
		var buttons = [];

		for (var i=0; i<factors.length; i++){
			var prime = factors[i];

			var button_factor = Modern_representation.button_creator(prime, {'general':{'backgroundColor':Modern_representation.colors[colors[this.logic.inverse_factors[prime]]], 'color':'#FFFFFF', 'bottom':0, 'left':0, 'position':'relative', 'verticalAlign':'top'}, 'px':{'height':this.presentation.radius, 'width':this.presentation.radius}, '%':{'borderRadius':100}});
			buttons.push(button_factor);

			div.appendChild(button_factor);
		}
		return buttons;
	}

	_presentation_make_dubs(number){
		var radius = Math.max(20, 10*Math.max(...this.logic.prime_factors).toString().length);
		var width = Math.max(80, radius*this.logic.prime_factors.length), height_small=radius, height_huge=radius;
		var height_full = height_small+height_huge;

		this.presentation.radius = radius;
		this.presentation.width = width;
		this.presentation.height_small = height_small;

		var div_double = Modern_representation.div_creator('', {'general':{'border':'1px solid grey'}, 'px':{'height':height_full, 'width':width}});
		var div_upper = Modern_representation.div_creator('', {'general':{'position':'absolute'}, 'px': {'height':height_small, 'width':width, 'top':0}});
		var div_lower = Modern_representation.div_creator('', {'general':{'position':'absolute'}, 'px':{'height':height_huge, 'width':width, 'bottom':0}});
		var button_upper = Modern_representation.button_creator(number, {'general':{'backgroundColor':Modern_representation.colors[0], 'color':'#FFFFFF', 'top':0, 'position':'relative', 'verticalAlign':'top'}, 'px':{'height':height_huge, 'width':width}});

		if (this.logic.prime_divs[number].length == 0) Modern_representation.button_modifier(div_lower, {'stylistic':{'general':{'backgroundColor':Modern_representation.colors[0]}}});
		else this.Painter(button_upper, 2);

		this._presentation_fill_div_with_prime_factors(div_lower, this.logic.prime_divs[number]);

		div_upper.appendChild(button_upper);
		div_double.appendChild(div_upper);
		div_double.appendChild(div_lower);

		return {'number':button_upper, 'full':div_double};
	}

	_presentation_sieve_like(){
		var div_sievelike = Modern_representation.div_creator('', {'%':{'width':60}});
		this.place.appendChild(div_sievelike);
		this.buttons.sieve_like = [];

		var i, btn;
		for (i=1; i <= this.logic.n; i++){
			btn = this._presentation_make_dubs(i);
			this.buttons.sieve_like.push(btn);
			div_sievelike.appendChild(btn.full);
		}
	}

	_presentation_summarizer(){
		var div_summary = Modern_representation.div_creator('', {'%':{'width':35}});
		this.place.appendChild(div_summary);

		var ln = this.logic.power_sets.length+4;
		var table = Representation_utils.proto_divsCreator(1, ln, [], null, div_summary, this.stylistic);
		var grid = new Grid(ln-1, 4, this.stylistic, {'place':table.zdivs, 'top_margin':1, 'left_margin':1, 'divs':true});
		'&#8709;'

		var div;
		for (var i=0; i<this.logic.power_sets.length; i++){
			div = grid.get(i, 0);
			Modern_representation.button_modifier(div, {'stylistic':{'general':{'border':'1px solid grey'}, 'px':{'width':80}}});
			var buttons = this._presentation_fill_div_with_prime_factors(div, ArrayUtils.revert(this.logic.power_sets[i].set));

			for (var x of buttons){
				Modern_representation.button_modifier(x, {'stylistic':{'general':{'verticalAlign':'baseline', 'left':'', 'float':'right'}, 'px':{'right':0}}});
			}
		}
	}

	presentation(){
		this.buttons = {};
		this._presentation_sieve_like();
		this._presentation_summarizer();
	}

	read_data(){
		var c=this.dissolve_input(this.input.value);
		this.logic.n = c.get_next();
	}

	ShowReality(){
		this.starter();
		this.read_data();
		this.logical_box();
		this.presentation();
	}

	constructor(block, n){
		super(block);
		this.logic.n = n;
		this.ShowReality();
	}
}

class TotientSieve extends Algorithm{
	logical_box(){
		this.logic.lpf = NTMath.sievify(this.logic.n);
		this.logic.series_of_toths = ArrayUtils.range(0, this.logic.n);
		var series_of_temps = ArrayUtils.range(0, this.logic.n);

		//Totient construction
		var i, j, last, element;
		for (i=0; i<=this.logic.n; i++){
			this.logic.series_of_toths[i]={'-': this.logic.series_of_toths[i]};
			series_of_temps[i]=[series_of_temps[i]];
		}
		
		for (i=2; i<=this.logic.n; i++){
			if (this.logic.lpf[i] != i) 
				continue;

			for (j=i; j<=this.logic.n; j+=i){
				last = series_of_temps[j][series_of_temps[j].length-1];
				element = Math.floor((last/i)*(i-1));
				this.logic.series_of_toths[j][i] = element;
				series_of_temps[j].push(element);
			}
		}
	}

	_presentation_colors_set(){
		this.present.colors={
			'composite':2,
			'iterated':15,
		}
	}

	_presentation_button_creator(v){
		var btn=this.doubleButtCreator(v, Representation_utils.button_creator);
		btn[1].innerHTML = '&phi;(' + btn[1].innerHTML + ')';
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
			//btn = Modern_representation.button_creator(i, {'general':{'backgroundColor':'#440000'}});
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

	StateMaker(){
		var l=this.lees.length;
		var s=this.lees[l-1], staat=[], i;
		var staat=this.ephemeral.staat, passer=this.ephemeral.passer;

		if (s[0]==0){
			this.pass_color(this.buttons.sieve[0], 0, 1, this.present.colors.composite);
			this.pass_color(this.buttons.sieve[1], 0, 1, this.present.colors.composite);
		}
		if (s[0]==1){
			this.pass_color(this.buttons.sieve[s[2]], 0, 1, this.present.colors.composite);
			this.pass_color(this.buttons.sieve[s[1]], 0, 15, 0);
			staat.push([1, this.buttons.sieve[s[2]].lower, this.buttons.sieve[s[2]].lower.innerHTML, this.logic.series_of_toths[s[2]][s[1]]]);
		}
		if (s[0]==2){
			var prime_color = (this.logic.lpf[s[1]]==s[1])?0:this.present.colors.composite;
			this.pass_color(this.buttons.sieve[s[1]], prime_color, this.present.colors.iterated, prime_color);
		}
	}

	NextState(){
		var l=this.lees.length;
		var s=this.lees[l-1], staat=[], i;
		var staat=this.ephemeral.staat, passer=this.ephemeral.passer;

		if (s[0]==0) return [2, 2];
		if (s[0]==1){
			if (s[2]+s[1] <= this.logic.n) return [1, s[1], s[1]+s[2]];
			else if ((s[1]+1) <= this.logic.n) return [2, s[1]+1];
			else return [100];
		}

		else if (s[0]==2){
			if (s[1] >= this.logic.n) return [100];
			else if (this.logic.lpf[s[1]]==s[1] && s[1]<=this.logic.n) return [1, s[1], s[1]];
			else return [2, s[1]+1];
		}
	}

	//Statement printed on the output
	StatementComprehension(){
		var l=this.lees.length;
		var prev=this.lees[l-2], last=this.lees[l-1];
		var strr=``;

		if (last[0]==0) return `This is just before the beginning of the sieve - For each number, I mark it's totient as itself. Also, I evaluate totient of 0 and 1 from definition.`;
		if (prev[0]==1 && last[0]==2) strr=`I've already changed totient of numbers lower or equal to limit divisible by ${prev[1]}, so I search for next primes, starting from last prime I've found +1 - ${prev[1]+1}. `;
		if (prev[0]==2 && last[0]==2) strr=`I search further for primes. `;
		//if (prev[0]==1 && last[0]==2) strr=`I found a prime (${last[1]}), so I start finding numbers divisible by it, starting from ${last[1]} and multiplying their totients by ${last[1]-1}/${last[1]}. `;
		if (last[0]==1) strr+=`Totient of a given number is multiplied by ${last[1]-1}/${last[1]}: temp_&#x3d5;(${last[2]})=${Math.floor(this.logic.series_of_toths[last[2]][last[1]]*last[1]/(last[1]-1))}*(${last[1]-1}/${last[1]})=${this.logic.series_of_toths[last[2]][last[1]]}`;

		if (last[0]==2) strr+=`This number (${last[1]}) is ${(this.logic.lpf[last[1]]==last[1])?`a prime - so I start marking perhaps-primes as divisible by it, changing their totient in process.`:`not a prime - so I have to search further.`}`;
		//else if (last[0]==2) strr+=`This number is ${(this.logic.lpf[last[1]]==last[1])?`a prime, but I won't start changing other totients because ${last[1]}+${last[1]}>${this.logic.n}`:`not a prime - so I have to search further.`}`;
		if (last[0]==100) strr=`${prev[1]}+1 > ${this.logic.n} (given limit) - and so, all prime numbers up to the given limit were found along with value of their totient, sieve ends.`;
		return strr;
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

var feral3=Partial.ObjectParser(document.getElementById('Algo3'));
var sk3=new Totient_CRT(feral3, 10, 17);

var feral4=Partial.ObjectParser(document.getElementById('Algo4'));
var sk4=new Totient_IEP(feral4, 130);

var feral=Algorithm.ObjectParser(document.getElementById('Algo1'));
var sk=new TotientSieve(feral, 30);

var feral2=Algorithm.ObjectParser(document.getElementById('Algo2'));
var sk2=new PowerTower(feral2, 6, 107, [2, 7, 3, 12, 43, 25]);
//No help found here
//Only dreadful tears
