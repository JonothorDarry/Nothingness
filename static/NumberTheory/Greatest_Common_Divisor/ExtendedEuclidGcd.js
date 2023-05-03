import Algorithm from '../../Base/Algorithm.js';
import ArrayUtils from '../../Base/ArrayUtils.js';
import Representation_utils from '../../Base/Representation_utils.js';
import Modern_representation from '../../Base/Modern_representation.js';
import Object_utils from '../../Base/Object_utils.js';
import SuperEuclid from './SuperEuclid.js'

class ExtendedEuclidGcd extends Algorithm{
	logical_box(){
		var logica = SuperEuclid.logical_box(this.logic.w, this.logic.v);
		Object_utils.merge(this.logic, logica)
	}

	presentation(){
		var ln=this.logic.a.length;
		SuperEuclid._presentation_shower(this);
		var elems = SuperEuclid._presentation_construct_div_and_grid(this, ln, 6);
		var grid=elems.grid;
		var div=elems.div;

		var max = function(a,b){return (a>b)?a:b;};
		var mx_width = Representation_utils.get_width(max(this.logic.v, this.logic.w), 30);
		var partial_stylistic = {'general':{'border':'1px solid white'}, 'px':{'width':mx_width, 'height':30, 'lineHeight':30}};
		var standard_stylistic = {'color':4, 'stylistic':partial_stylistic};

		grid.filler([0, [0, 5]], ['i', 'a<sub>i</sub>', 'b<sub>i</sub>', 'z<sub>i</sub>', 'p<sub>i</sub>', 'q<sub>i</sub>'], {'color':5, 'stylistic':partial_stylistic});


		var elements=[
			['index', ArrayUtils.range(0, ln)],
			['a', this.logic.a],
			['b', this.logic.b],
			['z', this.logic.z],
			['p', this.logic.p],
			['q', this.logic.q],
		];
		
		var i=0;
		for (var x of elements){
			this.buttons[x[0]] = grid.filler([[1, ln+1], i], x[1], standard_stylistic);
			Modern_representation.style(this.buttons[x[0]][0], SuperEuclid.no_background_color_styles[0]);
			if (x[0]!='z') Modern_representation.style(this.buttons[x[0]][1], SuperEuclid.no_background_color_styles[0]);
			i+=1;
		}
	}

	palingnesia(){
		this.logical_box();
		this.presentation();
	}

	read_data(){
		var fas=this.input.value;
		var c=this.dissolve_input(fas, true);
		this.logic.w=c.get_next();
		this.logic.v=c.get_next();
	}

	constructor(block, a, b){
		super(block);
		this.logic.w=a;
		this.logic.v=b;
		this.version=4;
		this.check=block.check;
		this.palingnesia();
	}

	BeginningExecutor(){
		this.shower = this.check.checked;
		this.read_data();
		this.palingnesia();
		this.lees.push([0, 2]);
	}

	StateMaker(s){
		SuperEuclid.StateMaker(this, s);

		var staat=[], i;
		var staat=this.ephemeral.staat, passer=this.ephemeral.passer;
		var index=s[1];


		if (s[0]==0 || s[0]==1){
			SuperEuclid.local_pass_style(this, this.buttons.z[index-1]);
			SuperEuclid.local_pass_style(this, this.buttons.a[index-1], 14);
			SuperEuclid.local_pass_style(this, this.buttons.b[index-1], 14);
		}
		if (s[0]==3){
			SuperEuclid.local_pass_style(this, this.buttons.p[index-1], 13);
			SuperEuclid.local_pass_style(this, this.buttons.q[index-1], 14);
                        
			SuperEuclid.local_pass_style(this, this.buttons.p[index-2], 13);
			SuperEuclid.local_pass_style(this, this.buttons.q[index-2], 14);
			SuperEuclid.local_pass_style(this, this.buttons.z[index-1], [13,14]);

			SuperEuclid.local_pass_style(this, this.buttons.p[index]);
			SuperEuclid.local_pass_style(this, this.buttons.q[index]);
		}
		if( s[0]==100){
			staat.push([7, this.buttons.b[this.logic.b.length-2], SuperEuclid.no_background_color_styles[0], SuperEuclid.no_background_color_styles[8]]);
			staat.push([7, this.buttons.p[this.logic.b.length-2], SuperEuclid.no_background_color_styles[0], SuperEuclid.no_background_color_styles[101]]);
			staat.push([7, this.buttons.a[1], SuperEuclid.no_background_color_styles[0], SuperEuclid.no_background_color_styles[101]]);

			staat.push([7, this.buttons.b[1], SuperEuclid.no_background_color_styles[0], SuperEuclid.no_background_color_styles[15]]);
			staat.push([7, this.buttons.q[this.logic.b.length-2], SuperEuclid.no_background_color_styles[0], SuperEuclid.no_background_color_styles[15]]);
		}
	}

	NextState(){
		return SuperEuclid.NextState(this);
	}

	StatementComprehension(){
		var prev=this.lees[this.state_nr-1], last=this.lees[this.state_nr];
		var ln=last[1], index=last[1];
		var a=this.logic.a, b=this.logic.b, z=this.logic.z, p=this.logic.p, q=this.logic.q;
		var strr=SuperEuclid.StatementComprehension(last[0], this.logic.a, this.logic.b, index);

		if (last[0]==1 || last[0]==0) strr+=`. Result of dividing a by b is z=a/b=${a[index-1]}/${b[index-1]}=${z[index-1]} - it will be used to calculate next p and q`;
		if (last[0]==3) strr+=`. I also change p<sub>i</sub>=p<sub>i-2</sub>-z*p<sub>i-1</sub>, q=q<sub>i-2</sub>-z*q<sub>i-1</sub>, so that p<sub>i</sub>*u+q<sub>i</sub>*v are equal to current b=${b[index]} in the algorithm`;
		if (last[0]==100) strr+=`. Numbers x, y such that u*x+v*y=gcd(u,v) are x=p<sub>i-1</sub>=${p[p.length-2]}, y=q<sub>i-1</sub>=${q[q.length-2]}: u*x+v*y=${this.logic.w}*${p[p.length-2]}+${this.logic.v}*${q[q.length-2]}=${this.logic.w*p[p.length-2]+this.logic.v*q[q.length-2]}`;
		return strr;
	}
}
export default ExtendedEuclidGcd;
