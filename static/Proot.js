class Order extends Partial{
	constructor(block, x){
		super(block);
		this.place.position="relative";
		this.ShowReality(x);
	}

	ShowReality(x=-1){
		var i=0, toth;
		if (x==-1) x=this.input.value;
		toth=this.sieve_mark(x);
		this.logic.lambda=this.find_carmichael(x);

		this.place.innerHTML='';

		this.present={}
		this.present.content = Modern_representation.div_creator('', {'general':{'position':'relative'}});
		this.place.appendChild(this.present.content);

		this.create_upper_div(x, toth);

		this.known=[];
		for (i=0;i<x;i++) this.known.push(0);
		for (i=1;i<x;i++){
			if (this.marked[i]==1) continue;
			this.create_standard_div(i, x, toth);
		}

		this.create_summary(x, toth);
	}

	sieve_mark(x){
		var i=0, j, lim=x, toth=x;
		this.marked=[];
		for (i=0; i<x; i++) this.marked.push(0);
		for (i=2; i*i<=x; i++) {
			if (x%i==0){
				toth=Math.floor(toth/i)*(i-1);
				for (j=i;j<lim;j+=i) this.marked[j]=1;
			}
			while (x%i==0) x=Math.floor(x/i);
		}

		if (x>1){
			toth=Math.floor(toth/x)*(x-1);
			for (j=x;j<lim;j+=x) this.marked[j]=1;
		}
		return toth;
	}

	find_carmichael(x){
		var i=0, lambda=1, k=0, pw=i;
		for (i=2; i*i<=x; i++){
			if (x%i != 0) continue;
			pw=1,  k=0;
			while (x%i==0) x=Math.floor(x/i), pw=pw*i, k+=1;
			if (i==2 && k>=3) lambda=NTMath.lcm(lambda, Math.floor(pw/4));
			else lambda = Number(NTMath.lcm(lambda, pw-Math.floor(pw/i)));
		}

		if (x>1) lambda = Number(NTMath.lcm(lambda, (x-1)));
		return lambda;
	}

	create_standard_div(g, mod, toth){
		var i, a=g;
		var dv=document.createElement("DIV"), btn=[];
		dv.style.position="relative";
		dv.style.width=`${(this.logic.lambda+6)*40}px`;
		dv.style.height="40px"
		var lst=['x', g, 'x', 0, 'x'];
		for (i=1;i<mod;i++){
			lst.push(a);
			if (a==1) break;
			a=(a*g)%mod;
		}
		lst[3]=i;
		this.known[i]+=1;

		for (i=0; i<lst.length; i++){
			btn.push(this.buttCreator(lst[i]));
			if (i==1) {
				btn[i].style.position='sticky';
				btn[i].style.left=0;
			}
			else {
				btn[i].style.position='relative';
				btn[i].style.zIndex=-1;
			}
			btn[i].style.display="inline-block";

			if (lst[i]=='x') Representation_utils.Painter(btn[i], 3);
			dv.append(btn[i]);
		}
		//Tocjent
		if (lst[3]==toth) Representation_utils.Painter(btn[1], 8);
		this.present.content.appendChild(dv);
	}

	create_upper_div(x, toth){
		var i;
		var dv=document.createElement("DIV"), btn=[];
		this.place.position="relative";
		dv.style.position="sticky";
		dv.style.top=0;
		dv.style.width=`${(this.logic.lambda+6)*40}px`;
		dv.style.height="40px"
		var lst=['x', 'g', `ord<sub>${x}</sub>(g)`, 'g<sup>i</sup>; i='];

		for (i=1; i<=this.logic.lambda; i++) lst.push(i);
		for (i=0; i<lst.length; i++){
			btn.push(this.buttCreator(lst[i]));
			btn[i].style.position="relative";
			btn[i].style.display="inline-block";
			if (lst[i]=='x') Representation_utils.Painter(btn[i], 3);
			else Representation_utils.Painter(btn[i], 5);
			dv.append(btn[i]);
		}
		btn[2].style.width="80px";
		this.present.content.appendChild(dv);
	}

	create_summary(x, toth){
		var i, btn, lefts, rights, proper;
		var dv_upper=document.createElement("DIV"), dv_lower=document.createElement("DIV");
		var dv_upper_r=document.createElement("DIV"), dv_lower_r=document.createElement("DIV"), dv_upper_l=document.createElement("DIV"), dv_lower_l=document.createElement("DIV");
		var titles=[`Order x=ord<sub>${x}</sub>(g) for some g`, `Number of occurences of x: |{g: ord<sub>${x}</sub>(g)=x}|`];
		lefts=[dv_upper_l, dv_lower_l];
		rights=[dv_upper_r, dv_lower_r];
		proper=[dv_upper, dv_lower];

		for (i=0;i<=toth;i++){
			if (this.known[i]>0){
				btn=this.buttCreator(i);
				if (i==toth) Representation_utils.Painter(btn, 8);
				else Representation_utils.Painter(btn, 5);
				dv_upper_r.append(btn);
			}
		}
		for (i=0;i<=toth;i++){
			if (this.known[i]>0){
				btn=this.buttCreator(this.known[i]);
				dv_lower_r.append(btn);
			}
		}
		for (i=0;i<2;i++){
			lefts[i].style.width="450px";
			lefts[i].innerHTML=titles[i];
			lefts[i].style.display="inline-block";
			rights[i].style.display="inline-block";
			proper[i].append(lefts[i]);
			proper[i].append(rights[i]);
			this.place.append(proper[i]);
		}
	}
}

class Proot extends Algorithm{
	_logical_get_distinct_factors(factors){
		var distinct_factors = [];
		for (var x of factors){
			if (distinct_factors.length == 0 || x != ArrayUtils.get_elem(distinct_factors, -1)[0])
				distinct_factors.push([x, 1]);
			else
				distinct_factors[distinct_factors.length-1][1]++;
		}
		return distinct_factors;
	}

	_logical_factorize_m(){
		var factors = NTMath.pollard_rho_factorize(this.logic.full_m);
		this.logic.m_factors = this._logical_get_distinct_factors(factors);
		var distinct_factors = [];
		for (var x of factors){
			if (x != ArrayUtils.get_elem(distinct_factors, -1))
				distinct_factors.push(x);
		}

		this.logic.correct_number = false;
		if (distinct_factors.length > 2)
			this.logic.problem = 'too many factors';
		else if (distinct_factors.length == 2 && distinct_factors[0] != 2)
			this.logic.problem = 'two odd factors';
		else if (distinct_factors.length == 2 && factors[1] == 2)
			this.logic.problem = 'too many twos';
		else if (factors.length >= 3 && factors[2] == 2)
			this.logic.problem = '2 to k above 8';
		else{
			this.logic.correct_number = true;
			this.logic.partial_m = ArrayUtils.get_elem(distinct_factors, -1);
			this.logic.signature = {
				'twos': ((distinct_factors.length == 2)?true:false), 
				'prime': ArrayUtils.get_elem(distinct_factors, -1), 
				'prime_times': factors.length - ((distinct_factors.length == 2)?1:0)
			};
		}
	}

	_logical_factorize_totient(){
		this.logic.totient = this.logic.partial_m-1n;
		var factorized_totient = NTMath.pollard_rho_factorize(this.logic.totient);
		this.logic.totient_factors = this._logical_get_distinct_factors(factorized_totient);
	}

	_logical_find_proot(prob){
		var potential_root=1;
		this.logic.all_potential_roots = []
		while(true){
			if (prob==true) potential_root = Math.floor(Math.random()*(this.logic.partial_m-2))+2;
			else potential_root += 1;
			var root = {
				'potential_root': BigInt(potential_root),
				'results': []
			}

			var lypa=false;
			for (var factor of this.logic.totient_factors){
				var part_res = NTMath.pow(potential_root, this.logic.totient/factor[0], this.logic.partial_m);
				root.results.push({'factor':factor[0], 'result':part_res});
				if (part_res == 1n){
					lypa=true;
					break;
				}
			}
			this.logic.all_potential_roots.push(root);
			if (!lypa) break;
		}

		var prime = ArrayUtils.get_elem(this.logic.m_factors, -1)[0];
		this.logic.proto_primitive_root = ArrayUtils.get_elem(this.logic.all_potential_roots, -1).potential_root;
		if (ArrayUtils.get_elem(this.logic.m_factors, -1)[1] > 1 && NTMath.pow(root.potential_root, prime-1n, prime*prime) != 1n)
			this.logic.post_expo_primitive_root = this.logic.proto_primitive_root + prime;

		if (this.logic.full_m%2n == 0n && this.logic.post_expo_primitive_root%2n == 0n)
			this.logic.full_primitive_root = this.logic.post_expo_primitive_root + this.logic.full_m/2n;
	}

	_logical_make_all_divisors(){
		var factors = {};
		for (var factor of this.logic.totient_factors) factors[factor[0]] = 0;
		var all_powers = [{'value':1n, 'divisors':0, 'factors':factors}];

		for (var factor of this.logic.totient_factors){
			var k = factor[0];

			var ap_old_length = all_powers.length;
			for (var expo=1; expo <= factor[1]; expo++){

				for (var i=0; i<ap_old_length; i++){
					var partial = structuredClone(all_powers[i].factors);
					partial[factor[0]] = expo;

					all_powers.push({'value': all_powers[i].value * k, 'divisors': all_powers[i].divisors + expo, 'factors': partial});
				}
				k *= factor[0];
			}
		}

		var list_of_divisors_per_depth = ArrayUtils.steady(ArrayUtils.get_elem(all_powers, -1).divisors+1, 0).map(e => []);
		for (var x of all_powers){
			list_of_divisors_per_depth[x.divisors].push({'value':x.value, 'factors':x.factors});
		}
		this.logic.divisors_per_depth = list_of_divisors_per_depth;
	}

	logical_box(){
		this._logical_factorize_m();
		if (!this.logic.correct_number)
			return;
		this._logical_factorize_totient();
		this._logical_find_proot(false);
		this._logical_make_all_divisors();
	}

	_presentation_create_factored_part(name, value, to_factor=null){
		var div = Modern_representation.div_creator('', {'general':{'display':'block'}});
		var title = Modern_representation.button_creator(name, {'px':{'width':50}});
		var button = Modern_representation.button_creator(value, {'px':{'width':100}});
		Representation_utils.Painter(title, 5);
		Representation_utils.Painter(button, 0);
		div.appendChild(title);
		div.appendChild(button);

		if (to_factor != null){
			var equality_sign = Modern_representation.button_creator('=', {'px':{'width':20}, 'general':{'color':'#000000'}});
			div.appendChild(equality_sign);

			for (var x of to_factor){
				var factor_button = Representation_utils.expo_style_button_creator(this.stylistic, {'base':x[0], 'expo':x[1]});
				div.appendChild(factor_button.base);
				div.appendChild(factor_button.expo);
			}
		}

		return div;
	}

	_presentation_factor_part(){
		var factor_div = Modern_representation.div_creator('', {'general':{'display':'block'}});

		factor_div.appendChild(this._presentation_create_factored_part('m', this.logic.full_m, this.logic.m_factors));
		factor_div.appendChild(this._presentation_create_factored_part('m\'', this.logic.partial_m));
		factor_div.appendChild(this._presentation_create_factored_part('&phi;(m\')', this.logic.totient, this.logic.totient_factors));

		return factor_div;
	}


	_presentation_candidates(){
		var candidates_div = Modern_representation.div_creator('', {'general':{'display':'block'}});
		var mid_width = 180;

		var filler = Modern_representation.button_creator('', {'px':{'width':mid_width}});
		candidates_div.appendChild(filler);

		var title = Modern_representation.button_creator('Potential roots', {'px':{'width':mid_width}, 'general':{'display':'block'}});
		Representation_utils.Painter(title, 5);
		candidates_div.appendChild(title);

		for (var x of this.logic.all_potential_roots){
			var candidate = Modern_representation.button_creator(x.potential_root, {'px':{'width':mid_width}, 'general':{'display':'block'}});
			Representation_utils.Painter(candidate, 0);
			candidates_div.appendChild(candidate);
		}

		return candidates_div;
	}

	_presentation_final_modifier(){
		var mid_width = 300;

		var grid = new Grid(3, 2, this.stylistic, {'top_margin':1});
		grid.filler([0, [0, 1]], ['mod', 'Primitive root'], {'color':5})

		return grid.place.full_div;
	}

	_presentation_left_belt(){
		var full_div = Modern_representation.div_creator('');
		var div_upper = this._presentation_factor_part();
		var div_mid = this._presentation_candidates();
		var div_lower = this._presentation_final_modifier();

		full_div.appendChild(div_upper);
		full_div.appendChild(div_mid);
		full_div.appendChild(div_lower);
		return full_div;
	}

	_presentation_graph(){
	}

	presentation(){
		this.buttons = {};
		this.place.style.width = 'max-content';

		var div_left = this._presentation_left_belt();
		var div_right = this._presentation_graph();

		this.place.appendChild(div_left);
		// this.place.appendChild(div_right);
	}

	palingenesia(){
		this.logical_box();
		this.presentation();
	}

	read_data(){
		var fas=this.input.value;
		var c=this.dissolve_input(fas);
		this.logic.full_m = BigInt(c.get_next());
	}

	constructor(block, full_m){
		super(block);
		this.logic.full_m = full_m;
		this.version=5;
		this.palingenesia();
	}

	BeginningExecutor(){
		this.read_data();
		this.palingenesia();
		this.lees.push([0]);
	}

	StateMaker(){
		var l=this.lees.length;
		var s=this.lees[l-1], staat=[], i;
		var staat=this.ephemeral.staat, passer=this.ephemeral.passer;

		if (s[0]==0){
			for (i=0; i<=this.logic.L; i++){
				this.pass_color(this.buttons.counts[i], 0, 1);
			}
		}
	}

	NextState(){
		var l=this.lees.length;
		var s=this.lees[l-1];

		if (s[0]==0) return [100];
	}

	StatementComprehension(){
		var l=this.lees.length;
		var s=this.lees[l-1], x=s[1];

		if (s[0]==0) return `Whatever`;
	}
}

var feral1=Partial.ObjectParser(document.getElementById('Algo1'));
var sk1=new Order(feral1, 7);

var feral2=Algorithm.ObjectParser(document.getElementById('Algo2'));
feral2.radio_p=document.getElementById('Probabilistic');
feral2.radio_d=document.getElementById('Deterministic');
var sk2=new Proot(feral2, 334562n);

//Prime: 20731
//Composite: 859548722
//Ultra-composite: 
//Problematic-deterministic: 409
//Large primes: 33456259, 998244353, 1000000007
