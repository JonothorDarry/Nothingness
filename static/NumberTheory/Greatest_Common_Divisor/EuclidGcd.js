import Algorithm from '../../Base/Algorithm.js';
import ArrayUtils from '../../Base/ArrayUtils.js';
import Representation_utils from '../../Base/Representation_utils.js';
import Object_utils from '../../Base/Object_utils.js';
import SuperEuclid from './SuperEuclid.js'

class EuclidGcd extends Algorithm{
	logical_box(){
		var logica = SuperEuclid.logical_box(this.logic.w, this.logic.v);
		Object_utils.merge(this.logic, logica)
	}

	presentation(){
		var ln=this.logic.a.length-1;
		SuperEuclid._presentation_shower(this);
		var elems = SuperEuclid._presentation_construct_div_and_grid(this, ln, 3);
		var grid=elems.grid;
		var div=elems.div;

		var max = function(a,b){return (a>b)?a:b;};
		var mx_width = Representation_utils.get_width(max(this.logic.v, this.logic.w), 30);
		var partial_stylistic = {'general':{'border':'1px solid white'}, 'px':{'width':mx_width, 'height':30, 'lineHeight':30}};
		var standard_stylistic = {'color':4, 'stylistic':partial_stylistic};

		grid.filler([0, [0, 2]], ['i', 'a<sub>i</sub>', 'b<sub>i</sub>'], {'color':5, 'stylistic':partial_stylistic});
		this.buttons.index = [null].concat(grid.filler([[1, ln], 0], ArrayUtils.range(1, ln), standard_stylistic));
		this.buttons.a = [null].concat(grid.filler([[1, ln], 1], this.logic.a.slice(1), standard_stylistic));
		this.buttons.b = [null].concat(grid.filler([[1, ln], 2], this.logic.b.slice(1), standard_stylistic));

		this.Painter(this.buttons.a[1], 0);
		this.Painter(this.buttons.b[1], 0);
		this.Painter(this.buttons.index[1], 0);
	}

	palingnesia(){
		this.logical_box();
		this.presentation();
	}

	read_data(){
		var fas=this.input.value;
		var c=this.dissolve_input(fas, true);
		this.logic.w = BigInt(c.get_next());
		this.logic.v = BigInt(c.get_next());
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
	}

	NextState(){
		return SuperEuclid.NextState(this);
	}

	Painter(btn, col=1, only_bg=0){
		if (typeof col === 'string' || col instanceof String){
			btn.style.backgroundColor = col;
			return;
		}
		var style_border=btn.style.border;
		super.Painter(btn, col, only_bg);
		btn.style.border=style_border;
	}

	StatementComprehension(){
		var s=this.lees[this.state_nr], index=s[1];

		return SuperEuclid.StatementComprehension(s[0], this.logic.a, this.logic.b, index);
	}
}
export default EuclidGcd;
