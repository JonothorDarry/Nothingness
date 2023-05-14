import Partial from '../../Base/Partial.js';
import ArrayUtils from '../../Base/ArrayUtils.js';
import Modern_representation from '../../Base/Modern_representation.js';
import Representation_utils from '../../Base/Representation_utils.js';
import Grid from '../../Base/Grid.js';

class Totient_IEP extends Partial{
	_logical_mark_numbers(){
		var i=0, j, x=this.logic.n;
		for (i=2; i*i<=x; i++){
			if (x % i == 0) this.logic.prime_factors.push(i);
			while (x % i == 0) x = Math.floor(x/i);
		}
		if (x>1) this.logic.prime_factors.push(x);
		this.logic.inverse_factors['&empty;'] = 0;
		for (i=0; i<this.logic.prime_factors.length; i++) this.logic.inverse_factors[this.logic.prime_factors[i]] = i+1;

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
		this.logic.summa = this.logic.power_sets.reduce((acc, value) => acc+value.amount*value.parity, 0);
	}

	logical_box(){
		this.logic.prime_factors = [];
		this.logic.inverse_factors = {};

		this._logical_mark_numbers();
		this._logical_generate_power_sets();
	}

	_presentation_fill_div_with_prime_factors(div, factors){
		var colors = [5, 30, 32, 33, 101, 15];
		var buttons = [];

		for (var i=0; i<factors.length; i++){
			var prime = factors[i];

			var button_factor = Modern_representation.button_creator(prime, {'general':{'background':Modern_representation.colors[colors[this.logic.inverse_factors[prime]]], 'color':'#FFFFFF', 'bottom':0, 'left':0, 'position':'relative', 'verticalAlign':'top'}, 'px':{'height':this.presentation.radius, 'width':this.presentation.radius}, '%':{'borderRadius':100}});
			buttons.push(button_factor);

			div.appendChild(button_factor);
		}
		return buttons;
	}

	//double div: above number, below place for divs
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
		var button_upper = Modern_representation.button_creator(number, {'general':{'background':Modern_representation.colors[0], 'color':'#FFFFFF', 'top':0, 'position':'relative', 'verticalAlign':'top'}, 'px':{'height':height_huge, 'width':width}});

		if (this.logic.prime_divs[number].length == 0) Modern_representation.button_modifier(div_lower, {'stylistic':{'general':{'background':Modern_representation.colors[0]}}});
		else Representation_utils.Painter(button_upper, 2);

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

	//for div-buttons
	_presentation_summarizer_colorful(grid){
		var div, seta;
		for (var i=0; i<this.logic.power_sets.length; i++){
			div = grid.get(i, 0);
			Modern_representation.button_modifier(div, {'stylistic':{'px':{'width':80, 'height':30, 'lineHeight':40, 'paddingTop':10}}});

			if (i == 0) seta = ['&empty;'];
			else seta = this.logic.power_sets[i].set;
			var buttons = this._presentation_fill_div_with_prime_factors(div, ArrayUtils.revert(seta));

			if (i == 0) Modern_representation.button_modifier(buttons[0], {'stylistic':{'general':{'font-weight': 'bold'}}});
			for (var x of buttons){
				Modern_representation.button_modifier(x, {'stylistic':{'general':{'verticalAlign':'bottom', 'left':'', 'float':'right'}, 'px':{'right':0}}});
			}
		}
	}

	_presentation_expression(power_set){
		var str = `${this.logic.n}`;
		if (power_set.set.length%2 == 1) str = `-` + str;

		for (var i=0; i<power_set.set.length; i++)
			str += ` <sup>${1}</sup> &frasl; <sub>${power_set.set[i]}</sub>`;
		return str;
	}

	_presentation_full_expression(){
		var str = `${this.logic.n}`;
		for (var i=0; i<this.logic.prime_factors.length; i++)
			str += ` (1 - <sup>${1}</sup> &frasl; <sub>${this.logic.prime_factors[i]}</sub>)`;
		return str;
	}

	_presentation_summarizer(){
		var div_summary = Modern_representation.div_creator('', {'%':{'width':40}});
		this.place.appendChild(div_summary);

		var simple_ln = this.logic.power_sets.length;
		var ln = this.logic.power_sets.length+4;
		var table = Representation_utils.proto_divsCreator(1, ln, [], null, div_summary, this.stylistic);
		var grid = new Grid(ln-1, 4, this.stylistic, {'place':table.zdivs, 'top_margin':1, 'left_margin':1, 'divs':true});

		this._presentation_summarizer_colorful(grid);


		var expr_width = 40 + this.logic.prime_factors.length*90;
		var amount_width = 60;
		grid.single_filler([-1, 0], '', {'color':4, 'stylistic':{'px':{'width':80, 'height':40, 'lineHeight':40}}});
		grid.single_filler([-1, 1], 'Amount', {'color':5, 'stylistic':{'general':{'borderBottom':`1px solid white`, 'textAlign':'center'}, 'px':{'fontSize':12, 'width':amount_width, 'height':39, 'lineHeight':40}}});
		grid.single_filler([-1, 2], `Expression part`, {'color':5, 'stylistic':{'general':{'borderBottom':`1px solid white`, 'borderLeft':'1px solid white', 'textAlign':'center'}, 'px':{'width':expr_width, 'height':39, 'lineHeight':40}}});

		var buttons_iep_values = grid.filler([[0, simple_ln-1], 1], this.logic.power_sets.map(e => e.amount), {'color':30});
		var general_button_style = {'stylistic':{'general':{'textAlign':'center', 'verticalAlign':'top'}, 'px':{'width':amount_width, 'height':40, 'lineHeight':40}}};
		for (var i=0; i<buttons_iep_values.length; i++){
			var x = buttons_iep_values[i];
			Modern_representation.button_modifier(x, general_button_style);
			if (this.logic.power_sets[i].parity == 1) Modern_representation.button_modifier(x, {'stylistic':{'general':{'background':Modern_representation.colors[31]}}});
		}

		var exprs = this.logic.power_sets.map(e => this._presentation_expression(e));
		var buttons_expressions = grid.filler([[0, simple_ln-1], 2], exprs, {'color':30});
		for (var i=0; i<buttons_expressions.length; i++){
			var x = buttons_expressions[i];
			Modern_representation.button_modifier(x, general_button_style);
			Modern_representation.button_modifier(x, {'stylistic':{'general':{'borderLeft':'1px solid white', 'background':Modern_representation.colors[5]}, 'px':{'width':expr_width}}});
		}

		grid.single_filler([simple_ln, 0], '', {'color':4, 'stylistic':{'px':{'width':80, 'height':40, 'lineHeight':40}}});
		var btn_endet = grid.single_filler([simple_ln, 1], this.logic.summa, {'color':8, 'stylistic':{'general':{'textAlign':'center'}, 'px':{'width':amount_width, 'height':40, 'lineHeight':40}}});
		var btn_expr_full = grid.single_filler([simple_ln, 2], this._presentation_full_expression(), {'color':8, 'stylistic':{'general':{'borderLeft':'1px solid white', 'textAlign':'center'}, 'px':{'width':expr_width, 'height':40, 'lineHeight':40}}});
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
export default Totient_IEP;
