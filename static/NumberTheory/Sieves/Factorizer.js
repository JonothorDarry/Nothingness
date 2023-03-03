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
export default Factorizer;
