import Algorithm from '../../Base/Algorithm.js';
import Modern_representation from '../../Base/Modern_representation.js';
import Representation_utils from '../../Base/Representation_utils.js';
import NTMath from '../../Base/NTMath.js';

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
export default Sieve;
