import Algorithm from '../../Base/Algorithm.js';
import ArrayUtils from '../../Base/ArrayUtils.js';
import Modern_representation from '../../Base/Modern_representation.js';
import Representation_utils from '../../Base/Representation_utils.js';
import NTMath from '../../Base/NTMath.js';

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

	StateMaker(s){
		var staat=[], i;
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
		var last=this.lees[this.state_nr], prev=this.lees[this.state_nr-1];
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
export default TotientSieve;
