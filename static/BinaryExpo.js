class BinaryExpo extends Algorithm{
	logical_box(){
		var i, a_pow=this.logic.a, bits=[], b=this.logic.b, res=1, multipla;

		this.logic.a_powers=[1];
		this.logic.b_bits=[];
		this.logic.b_values=[];
		this.logic.results=[1];
		this.logic.multiplas=[];
		this.logic.powers_2=[0, 1];

		while(b>0){
			multipla = (((b%2)==0)?1:a_pow);
			res = (res*multipla)%this.logic.m;

			this.logic.a_powers.push(a_pow);
			this.logic.b_bits.push(b%2);
			this.logic.b_values.push(b);
			this.logic.results.push(res);
			this.logic.multiplas.push(multipla);
			this.logic.powers_2.push(ArrayUtils.get_elem(this.logic.powers_2, -1)*2);

			a_pow = (a_pow*a_pow)%this.logic.m;
			b=Math.floor(b/2);
		}
		this.logic.powers_2.pop();
	}

	presentation_make_paint_append(inner_html, stylistic, place, color=null){
		var btn = Modern_representation.button_creator(inner_html, stylistic);
		if (color != null) Representation_utils.Painter(btn, color);
		place.appendChild(btn);

		return btn;
	}

	presentation_create_a_powers(){
		var gridlike_proto = Representation_utils.proto_divsCreator(1, 2, [], null, null, this.stylistic);
		Modern_representation.button_modifier(gridlike_proto.full_div, {'stylistic':{'general':{'display':'inline-block', 'borderRight':'3px dashed #888888'}}});
		var gridy = new Grid(2, this.logic.powers_2.length+2, this.stylistic, {'place':gridlike_proto.zdivs, 'left_margin':1});

		var a=this.logic.a;
		gridy.filler([0, [0, this.logic.powers_2.length-1]], ArrayUtils.revert(this.logic.powers_2).map(x => (`${a}<sup>${x}</sup>`)), {'color':5});
		this.buttons.a_powers = gridy.filler([1, [0, this.logic.powers_2.length-1]], ArrayUtils.revert(this.logic.a_powers), {'color':4});
		gridy.single_filler([0, this.logic.powers_2.length], `(mod ${this.logic.m})`, {'color':5, 'stylistic':{'px':{'width':150}}});
		gridy.single_filler([0, this.logic.powers_2.length+1], ``, {'color':4, 'stylistic':{'px':{'width':100}}});

		return gridlike_proto.full_div;
	}

	presentation_create_results(){
		var full_div = Modern_representation.div_creator('');
		var margin_button = this.presentation_make_paint_append(``, {'general':{'position':'relative', 'verticalAlign':'middle', 'color':'#000000'}, 'px':{'height':40, 'width':60}}, full_div, 4);

		
		var regular_power = Representation_utils.expo_style_button_creator(this.stylistic, {'base':this.logic.a, 'expo':this.logic.b});
		full_div.appendChild(regular_power.base);
		full_div.appendChild(regular_power.expo);
		Modern_representation.button_modifier(regular_power.expo, {'stylistic':{'px':{'width':Math.floor(this.stylistic.bs_butt_width_h/2+10)}}});
		Representation_utils.Painter(regular_power.base, 4);
		Representation_utils.Painter(regular_power.expo, 4);
		this.buttons.final_equal = this.presentation_make_paint_append(`&equiv;`, {'general':{'color':'#000000'}, 'px':{'height':20, 'width':20}}, full_div, 4);
		this.buttons.regular_power_base = regular_power.base;
		this.buttons.regular_power_expo = regular_power.expo;
		
		var binary_power = Representation_utils.expo_style_button_creator(this.stylistic, {'base':this.logic.a, 'expo':''});
		full_div.appendChild(binary_power.base);
		full_div.appendChild(binary_power.expo);
		var width_left_bracket=10, width_right_bracket=15;

		Modern_representation.button_modifier(binary_power.expo, {'stylistic':{'px':{'width':20*this.logic.b_bits.length+width_left_bracket+width_right_bracket}}});
		var reversed_bits = ArrayUtils.revert(this.logic.b_bits);


		this.buttons.b_bits = [];
		var btn = this.presentation_make_paint_append(`(`, {'general':{'verticalAlign':'top'}, 'px':{'height':20, 'width':width_left_bracket, 'top':0}}, binary_power.expo, 0);
		for (var i=0; i<this.logic.b_bits.length; i++){
			this.buttons.b_bits.push(this.presentation_make_paint_append(reversed_bits[i], {'general':{'verticalAlign':'top'}, 'px':{'height':20, 'width':20, 'top':0}}, binary_power.expo, 2));
		}
		var btn = this.presentation_make_paint_append(`)<sub>2</sub>`, {'general':{'verticalAlign':'top'}, 'px':{'height':20, 'width':width_right_bracket, 'top':0}}, binary_power.expo, 0);

		var btn = this.presentation_make_paint_append(`&equiv;`, {'general':{'color':'#000000'}, 'px':{'height':20, 'width':20, 'top':0}}, full_div, 102);
		this.buttons.res = this.presentation_make_paint_append('1', {'px':{'width':this.stylistic.bs_butt_width_h}}, full_div, 0);
		this.buttons.multiply_sign = this.presentation_make_paint_append(`*`, {'general':{'color':'#000000'}, 'px':{'height':20, 'width':20}}, full_div, 4);
		this.buttons.multipla = this.presentation_make_paint_append('', {}, full_div, 4);
		this.buttons.mod = this.presentation_make_paint_append(`(mod ${this.logic.m})`, {'general':{'color':'#000000'}, 'px':{'width':100}}, full_div, 102);

		return full_div;
	}

	statial(){
		this._statial_binding('res', this.logic.results, this.buttons.res);
		this._statial_binding('multipla', ['', ...this.logic.multiplas], this.buttons.multipla);
	}

	presentation(){
		this.buttons={};
		Representation_utils.change_button_width(this.stylistic, this.logic.m, 40);
		Representation_utils.change_button_width(this.stylistic, this.logic.b*this.logic.a, this.bs_butt_width_h);
		this.place.style.width = 'max-content';

		var div_left = this.presentation_create_a_powers();
		var div_right = this.presentation_create_results();

		this.place.appendChild(div_left);
		this.place.appendChild(div_right);
	}

	palingenesia(){
		this.logical_box();
		var buttons={};
		this.presentation();
		this.statial();
	}

	read_data(){
		var fas=this.input.value;
		var c=this.dissolve_input(fas);
		this.logic.a=c.get_next();
		this.logic.b=c.get_next();
		this.logic.m=c.get_next();
	}

	constructor(block, a=17, b=43, m=107){
		super(block);
		this.logic.a = a;
		this.logic.b = b;
		this.logic.m = m;

		this.version=5;
		this.palingenesia();
	}

	BeginningExecutor(){
		this.read_data();
		this.palingenesia();
		this.lees.push([0]);
	}

	StateMaker(s){
		var staat=[], i;
		var staat=this.ephemeral.staat, passer=this.ephemeral.passer;

		if (s[0] == 0){
			this.modern_pass_color(this.buttons.a_powers[this.logic.a_powers.length-1], 1, 0);
			this.modern_pass_color(this.buttons.a_powers[this.logic.a_powers.length-2], 1, 0);
		}

		if (s[0] == 1){
			this.modern_pass_color(this.buttons.a_powers[this.logic.a_powers.length-s[1]-2], 1, 0);
			this.modern_pass_color(this.buttons.a_powers[this.logic.a_powers.length-s[1]-1], 14, 0);
		}

		if (s[0] == 2){
			var last_bit = this.logic.b_bits[s[1]];
			this.modern_pass_color(this.buttons.b_bits[this.logic.b_bits.length-s[1]-1], 1, 0);

			this.modern_pass_color(this.buttons.multiply_sign, 102, 4);
			if (last_bit==1){
				this.modern_pass_color(this.buttons.a_powers[this.logic.a_powers.length-s[1]-2], 14, 0);
			}
			this.modern_pass_color(this.buttons.multipla, 14, 4);
			staat.push([6, this.state.multipla]);
		}

		if (s[0] == 3){
			this.modern_pass_color(this.buttons.res, 1, 0);
			staat.push([6, this.state.res]);
		}

		if (s[0] == 100){
			staat.push([0, this.buttons.regular_power_base, 8]);
			staat.push([0, this.buttons.regular_power_expo, 8]);
			staat.push([0, this.buttons.res, 8]);
			staat.push([0, this.buttons.final_equal, 102]);
		}
	}

	NextState(){
		var l=this.lees.length;
		var s=this.lees[l-1];

		if (s[0]==0) return [2, 0];
		if (s[0]==1) return [2, s[1]];
		if (s[0]==2) return [3, s[1]];

		if (s[0]==3 && s[1]+2 < this.logic.a_powers.length) return [1, s[1]+1];
		return [100];
	}

	StatementComprehension(){
		var s=this.lees[this.state_nr], x=s[1];

		if (s[0] == 0) return `An algorithm is initiated by initiating result to ${this.logic.a}<sup>0</sup>, and initiating a<sup>1</sup> = ${this.logic.a}.`;
		if (s[0] == 1){
			var index = s[1];
			var x = this.logic.powers_2[index];
			var value=this.logic.a_powers[index];

			return `Next a<sup>2x</sup> &equiv; a<sup>x</sup> a<sup>x</sup> (mod ${this.logic.m}): for x=${x}, a<sup>2*${x}</sup> &equiv; a<sup>${x}</sup> * a<sup>${x}</sup> &equiv; ${value}*${value} &equiv; ${this.logic.a_powers[index+1]} (mod ${this.logic.m}).`;
		}


		if (s[0] == 2){
			var last_bit = this.logic.b_bits[s[1]];

			return `As the last bit of current exponent is equal to ${last_bit}, the result will be multiplied by ${this.state.multipla.current()}.`;
		}
		if (s[0] == 3) return `Current result - is updated to given product - res=${this.state.res.previous()}*${this.state.multipla.current()} &equiv; ${this.state.res.current()} (mod ${this.logic.m}).`
		if (s[0] == 100) return `Now, the process ends ${this.logic.a}<sup>${this.logic.b}</sup> &equiv; ${this.state.res.current()} (mod ${this.logic.m}).`;
	}
}

var feral=Algorithm.ObjectParser(document.getElementById('Algo1'));
var eg1=new BinaryExpo(feral, 17, 43, 107);
