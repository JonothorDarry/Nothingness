import Algorithm from '../../Base/Algorithm.js';
import Modern_representation from '../../Base/Modern_representation.js';
import Representation_utils from '../../Base/Representation_utils.js';
import NTMath_presentation from '../../Base/NTMath_presentation.js';

class Simple_factorizer extends Algorithm{
	logical_box(){
		this.logic.limit = Math.ceil(Math.sqrt(this.logic.x));
		var cur_x=this.logic.x, count;
		this.logic.xp = [];
		this.logic.factors = [];
		
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
export default Simple_factorizer
