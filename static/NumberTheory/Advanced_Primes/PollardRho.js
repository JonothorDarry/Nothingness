import NTMath from '../../Base/NTMath.js';
import ArrayUtils from '../../Base/ArrayUtils.js';
import Modern_representation from '../../Base/Modern_representation.js';
import Representation_utils from '../../Base/Representation_utils.js';
import Algorithm from '../../Base/Algorithm.js';
import Graph_utils from '../../Base/Graph_utils.js';

class PollardRho extends Algorithm{
	_logic_calculate_poly(x){
		var value=0n, i;
		for (i=this.logic.poly_deg; i>=0; i--)
			value=(value*x+this.logic.poly[i])%this.logic.m;
		return value;
	}

	presentation_get_polynomial(){
		var res = ``;
		for (var i=this.logic.poly.length-1; i >= 0; i--){
			if (this.logic.poly[i] == 0) continue;

			if (this.logic.poly[i] > 0 && i<this.logic.poly.length-1) res += '+'
			var number='', expo='';
			if (this.logic.poly[i] == 1 && i>0) number = ''
			else if (this.logic.poly[i] == -1) number = '-';
			else number = `${this.logic.poly[i]}`;

			if (i == 0) expo = '';
			else if (i == 1) expo = 'x';
			else expo = `x<sup>${i}</sup>`;
			res += number + expo;
		}

		return res;
	}

	fill_floyd(){
		var cur_k, cur_2k, gcd, k, diff;
		this.logic.w=[this.logic.starter];
		this.logic.gcds=[null];
		this.logic.diff=[null];

		var cur_k=this.logic.starter, cur_2k=this.logic.starter;
		for (k=0; true; k+=1){
			cur_k=this._logic_calculate_poly(cur_k);

			cur_2k = this._logic_calculate_poly(cur_2k);
			this.logic.w.push(cur_2k);
			cur_2k = this._logic_calculate_poly(cur_2k);
			this.logic.w.push(cur_2k);

			var abs = function(a){return ((a>0)?a:(-a));};
			diff = abs(cur_2k-cur_k);
			gcd=NTMath.gcd(diff, this.logic.m);

			this.logic.gcds.push(gcd);
			this.logic.diff.push(diff);

			if (gcd!=1) break;
		}
		this.logic.last_k=k+1;
	}

	//lenth_braid, length_circle, subsequent values
	_logical_cometize(full_list, factor){
		var values = ArrayUtils.steady(0, this.logic.m);

		var i=2, x=this.logic.starter;
		var array = [x];
		values[x] = 1;

		while(true){
			x = this._logic_calculate_poly(x)%factor;
			array.push(x);
			if (values[x]>0) break;
			values[x] = i;
			i++;
		}
		return {'array':array, 'cycle_length':i-values[x], 'braid_length':values[x]-1, 'factor':factor}; //braid+1 - real bride (includin' overlappin' vertex)
	}


	_logical_prepare_single(){
		var factor = ArrayUtils.get_elem(this.logic.gcds, -1);
		this.logic.factor_comets = {};
		this.logic.factor_comets[factor] = this._logical_cometize(this.logic.w, factor);
	}

	_logical_prepare_fully(){
		var factors = NTMath.pollard_rho_factorize(this.logic.m);
		this.logic.factor_comets = {};
		var _current_pow = {};

		for (var x of factors){
			if (!_current_pow[x]) _current_pow[x] = x;
			else _current_pow[x] *= x;

			this.logic.factor_comets[_current_pow[x]] = this._logical_cometize(this.logic.w, _current_pow[x]);
		}
	}

	logical_box(){
		if (this.logic.poly_deg == null){
			this.logic.poly_deg = 2;
			this.logic.poly = [1n, 0n, 1n];
		}
		if (this.logic.starter == null)
			this.logic.starter = 3n;

		this.fill_floyd();

		if (this.logic.mono_prime) this._logical_prepare_single();
		if (this.logic.multi_prime) this._logical_prepare_fully();
		this.logic.poly_str = this.prepare_poly();
	}

	_presentation_get_positions(comet){
		var left_margin = 100, right_margin = 60, top_margin = 60, low_margin = 60;
		var edge_length = 80;
		var braid_length = comet.braid_length * edge_length;

		var radius = (comet.cycle_length*edge_length)/(2*Math.PI);

		var div_width = radius + Math.max(radius, braid_length) + left_margin + right_margin;

		if (div_width < 500){ //remove magic
			right_margin = right_margin + 500 - div_width;
			div_width = 500;
		}

		var div_height = 2*radius + top_margin + low_margin;

		var center = {
			'x': left_margin + Math.max(radius, braid_length),
			'y': top_margin + radius
		}

		var degree_change = (2*Math.PI) / comet.cycle_length;

		var positions_cycle = ArrayUtils.range(0, comet.cycle_length-1).map(
			e => {
				return {
					'x': center.x + radius * Math.cos(- Math.PI/2 + 2*Math.PI * e/comet.cycle_length),
					'y': center.y + radius * Math.sin(- Math.PI/2 - 2*Math.PI * e/comet.cycle_length)
				}
			}
		);

		var purifier = 40;
		var positions_braid = ArrayUtils.revert(ArrayUtils.range(1, comet.braid_length).map(
			e => {
				return {
					'x': center.x - purifier - edge_length * e,
					'y': center.y - radius
				}
			}
		));
		return {'width':div_width, 'height':div_height, 'positions_cycle':positions_cycle, 'positions_braid':positions_braid};
	}

	//full div size - overlaying trash, dict with width and height
	_presentation_create_arrow(div, sgn, full_div_size){
		function get_to_pixels(x, normalizer){return parseFloat(x.slice(0, x.length-1)) * normalizer / 100;};
		function get_to_percentages(x, normalizer){return `${100 * x / normalizer}%`;};
		function get_wo_px(x){return x.slice(0, x.length-2);};

		var arrow = Modern_representation.button_creator('', {});
		for (var [_, x] of Object.entries(div.style)) arrow.style[x] = div.style[x];
		var rotation = parseFloat(div.style.transform.slice(7, div.style.transform.length-5));
		if (!rotation) rotation = 0;

		var lefty = get_to_pixels(div.style.left, full_div_size.width);
		var toppy = get_to_pixels(div.style.top, full_div_size.height);

		var c = get_wo_px(div.style.width);
		arrow.style.left = get_to_percentages(lefty + Math.cos(rotation)*c, full_div_size.width);
		arrow.style.top = get_to_percentages(toppy + Math.sin(rotation)*c, full_div_size.height);

		arrow.style.transform = `rotate(${(sgn==1) ? rotation+3*Math.PI/4 : rotation-3*Math.PI/4}rad)`;
		arrow.style.width = `6px`;
		return arrow
	}

	_presentation_generate_parallel(place, edge, full_div_size){
		var arrow_1 = this._presentation_create_arrow(edge, 1, full_div_size);
		var arrow_2 = this._presentation_create_arrow(edge, -1, full_div_size);

		place.appendChild(arrow_1);
		place.appendChild(arrow_2);
	}

	_presentation_create_pair_of_pointers_comet(positions_xy, large_radius=20){
		var small_radius = 10;
		var position_center = {'x':positions_xy.x+large_radius, 'y':positions_xy.y+large_radius};
		var button_properties = {'width':small_radius, 'height':small_radius};

		function make_button(x, color){
			var place = Representation_utils.get_place_for_companion_button(position_center, x, 1, 40, button_properties);
			var btn_style = {'general':{'position':'absolute'}, 'px':{'width':small_radius, 'height':small_radius, 'font-size':9, 'left':place.left, 'top':place.top}};
			var btn = Modern_representation.button_creator('', btn_style);
			Modern_representation.button_modifier(btn, {'stylistic':{'%':{'border-radius':100}}});
			Representation_utils.Painter(btn, color);
			return btn;
		}

		return {'p0':make_button(-1, 104), 'p1':make_button(1, 104)};
	}

	_presentation_create_rho(div, positions, comet){
		var local_buttons = {};
		local_buttons.braid = [];
		local_buttons.cycle = [];
		local_buttons.edges = [];

		//hardcoded button-radius stuff - beware! 
		function normalize_coordinates(coordinates){
			return {
				'x' : (coordinates.x + 20) / positions.width,
				'y' : (coordinates.y + 20) / positions.height
			}
		}
		Modern_representation.button_modifier(div, {'stylistic':{'px':{'width':positions.width, 'height':positions.height}}});
		local_buttons.braid_iterators = ArrayUtils.steady(comet.braid_length);

		var edge_style = {'height':3};
		for (var i=0; i<comet.braid_length; i++){
			local_buttons.braid[i] = Modern_representation.button_creator(comet.array[i], {'general':{'position':'absolute'}, 'px':{'width':40, 'height':40, 'left':positions.positions_braid[i].x, 'top':positions.positions_braid[i].y}, '%': {'borderRadius':100}});

			var buttons = this._presentation_create_pair_of_pointers_comet(positions.positions_braid[i], 20);
			local_buttons.braid_iterators[i] = [buttons.p0, buttons.p1];

			if (i < comet.braid_length - 1) local_buttons.edges[i] = Graph_utils.create_edge(normalize_coordinates(positions.positions_braid[i]), normalize_coordinates(positions.positions_braid[i+1]), edge_style, {'width':positions.width, 'height':positions.height});
			else local_buttons.edges[i] = Graph_utils.create_edge(normalize_coordinates(positions.positions_braid[i]), normalize_coordinates(positions.positions_cycle[0]), edge_style, {'width':positions.width, 'height':positions.height});

			div.appendChild(local_buttons.braid[i]);
			div.appendChild(local_buttons.braid_iterators[i][0]);
			div.appendChild(local_buttons.braid_iterators[i][1]);

			div.appendChild(local_buttons.edges[i]);
		}

		local_buttons.cycle_iterators = ArrayUtils.steady(comet.cycle_length);
		for (var i=0; i<comet.cycle_length; i++){
			local_buttons.cycle[i] = Modern_representation.button_creator(comet.array[i+comet.braid_length], {'general':{'position':'absolute'}, 'px':{'width':40, 'height':40, 'left':positions.positions_cycle[i].x, 'top':positions.positions_cycle[i].y}, '%': {'borderRadius':100}});
			local_buttons.edges[i+comet.braid_length] = Graph_utils.create_edge(normalize_coordinates(positions.positions_cycle[i]), normalize_coordinates(positions.positions_cycle[(i+1)%comet.cycle_length]), edge_style, {'width':positions.width, 'height':positions.height});

			var buttons = this._presentation_create_pair_of_pointers_comet(positions.positions_cycle[i], 20);
			local_buttons.cycle_iterators[i] = [buttons.p0, buttons.p1];

			div.appendChild(local_buttons.cycle_iterators[i][0]);
			div.appendChild(local_buttons.cycle_iterators[i][1]);

			div.appendChild(local_buttons.cycle[i]);
			div.appendChild(local_buttons.edges[i+comet.braid_length]);
		}

		for (var x of local_buttons.braid) Representation_utils.Painter(x, 0);
		for (var x of local_buttons.cycle) Representation_utils.Painter(x, 0);
		for (var x of local_buttons.edges){
			Modern_representation.button_modifier(x, {'stylistic':{'general':{'zIndex':-1}}});
			x.style.width = `${Number(x.style.width.slice(0, x.style.width.length-2))-20}px`; //to allow arrow
			this._presentation_generate_parallel(div, x, positions);

			Representation_utils.Painter(x, 5);
		}

		return local_buttons;
	}

	_presentation_add_data(div, comet){
		var mod_length = 100, braid_length = 200, cycle_length = 200;
		var summa_length = mod_length + braid_length + cycle_length;

		this.buttons.comets_data[comet.factor] = {};
		this.buttons.comets_data[comet.factor].mod = Modern_representation.button_creator(`(mod ${comet.factor})`, {'px':{'width':mod_length}});
		this.buttons.comets_data[comet.factor].braid_size = Modern_representation.button_creator(`Braid length: ${comet.braid_length}`, {'px':{'width':braid_length}});
		this.buttons.comets_data[comet.factor].comet_size = Modern_representation.button_creator(`Cycle length: ${comet.cycle_length}`, {'px':{'width':cycle_length}});

		for (var x in this.buttons.comets_data[comet.factor]){
			Representation_utils.Painter(this.buttons.comets_data[comet.factor][x], 5);
			div.appendChild(this.buttons.comets_data[comet.factor][x]);
		}

		Modern_representation.button_modifier(div, {'stylistic':{'px':{'width':summa_length}}});
	}

	_presentation_comet(comet){
		var positions = this._presentation_get_positions(comet);
		var div = Modern_representation.div_creator('', {'general':{'border':'5px dotted gray', 'position':'relative', 'display':'block'}});
		this._presentation_add_data(div, comet);
		var buttons = this._presentation_create_rho(div, positions, comet);
		this.buttons.comet[comet.factor] = buttons;
		
		return div;
	}

	_presentation_stack(){
		this.bs_butt_width_h=100;
		this.bs_butt_width=`${this.bs_butt_width_h}px`;
		Representation_utils.change_button_width(this.stylistic, this.logic.m, this.bs_butt_width_h);
		var ln=this.logic.w.length;

		//buttons name, span - data, title place, title, array, color
		var margin_top=2, margin_left=1;
		var amount_rows = margin_top+ln+2;
		var dvs=this.modern_divsCreator(1, amount_rows, []);
		Modern_representation.button_modifier(dvs.full_div, {'stylistic':{'general':{'display':'inline-block', 'position':'relative'}}});

		var grid=Representation_utils.gridify_div(dvs.zdivs, amount_rows, margin_left+4, this.stylistic);
		var order_of_destiny=[
			['k', [[2, ln+2], 0], [1, 0], 'k', ArrayUtils.range(0, ln), 4],
			['w_k', [[2, ln+2], 1], [1, 1], 'w<sub>k</sub>', this.logic.w, 4],
			['diff', [[2, ((ln+1)>>1)+2], 2], [1, 2], '|w<sub>2k</sub>-w<sub>k</sub>|', this.logic.diff, 4],
			['gcd', [[2, ((ln+1)>>1)+2], 3], [1, 3], 'gcd(w<sub>2k</sub>-w<sub>k</sub>, m)', this.logic.gcds, 4],
		];

		var x, y, titular;
		for (x of order_of_destiny){
			var btns=ArrayUtils.subsetting(grid, [margin_top+x[1][0][0], margin_top+x[1][0][1]], margin_left+x[1][1]);
			this.buttons[x[0]]=btns;

			btns.forEach((e,i) => {
				Representation_utils.Painter(e, x[5]);
				e.innerHTML=x[4][i];
			});
			titular=grid[margin_top+x[2][0]][margin_left+x[2][1]];
			Representation_utils.Painter(titular, 5);
			titular.innerHTML=x[3];
		}
		Representation_utils.Painter(this.buttons.k[0], 5);
		Representation_utils.Painter(this.buttons.w_k[0], 0);

		var small_radius = 10;
		var style_mini_pointer = {'general':{'position':'relative', 'display':'block'}, 'px':{'width':small_radius, 'height':small_radius, 'top':20-small_radius/2}, '%':{'border-radius':100}};
		this.buttons.pointer_stack = ArrayUtils.range(0, ln);
		for (var i=0; i<ln; i++){
			var div_buttons = Modern_representation.div_creator('', {'general':{'position':'absolute'}, 'px':{'right':0, 'top':0}});
			var btn_1 = Modern_representation.button_creator('', style_mini_pointer);
			this.buttons.pointer_stack[i] = btn_1;
			Representation_utils.Painter(btn_1, 104);
			div_buttons.appendChild(btn_1);

			Modern_representation.button_modifier(this.buttons.w_k[i], {'stylistic':{'general':{'position':'relative'}}});
			this.buttons.w_k[i].appendChild(div_buttons);
		}

		var new_world_order = [
			['m', 1, 1, 0, this.logic.m],
			['m_title', 0, 1, 5, 'm'],
			['polynomial', 1, 2, 0, this.presentation_get_polynomial()],
			['polynomial_title', 0, 2, 5, 'polynomial']
		];

		for (var x of new_world_order){
			this.buttons[x[0]] = grid[x[1]][x[2]];
			Representation_utils.Painter(this.buttons[x[0]], x[3]);
			this.buttons[x[0]].innerHTML = x[4];
		}
	}

	presentation(){
		this.buttons={'comets_data': {}};
		this.place.style.width = 'max-content';

		this._presentation_stack();
		if (this.logic.mono_prime || this.logic.multi_prime){
			var godfather_div = Modern_representation.div_creator('', {});
			Modern_representation.button_modifier(godfather_div, {'stylistic':{'px':{'margin-left':50}}});

			this.buttons.comet = {};
			if (this.logic.multi_prime || this.logic.mono_prime){
				for (var x in this.logic.factor_comets){
					var div = this._presentation_comet(this.logic.factor_comets[x]);
					godfather_div.appendChild(div);
				}
			}
			this.place.appendChild(godfather_div);
		}
	}

	palingnesia(){
		this.logical_box();
		this.presentation();
	}

	read_part(c){
		var v=c.get_next(), i;

		if (v=='X'){
			this.logic.poly_deg=c.get_next();
			this.logic.poly = ArrayUtils.steady(this.logic.poly_deg+1n, 0);

			for (i=this.logic.poly_deg; i>=0; i--){
				this.logic.poly[i] = c.get_next();
			}
		}

		else if (v=='Y'){
			this.logic.starter = c.get_next();
		}
	}

	read_data(){
		var fas=this.input.value;
		var c=this.dissolve_input(fas, true);
		
		this.logic.mono_prime = this.radio_factor.checked;
		this.logic.multi_prime = this.radio_all.checked;

		this.logic.m=c.get_next();
		this.read_part(c);
		this.read_part(c);
	}

	constructor(block, m){
		super(block);
		this.radio_simple = block.radio_simple;
		this.radio_factor = block.radio_factor;
		this.radio_all = block.radio_all;

		this.logic.m=m;
		this.version=4;
		this.palingnesia();
	}

	BeginningExecutor(){
		this.read_data();
		this.palingnesia();
		this.lees.push([0, 1]);
	}

	StateMaker(s){
		var staat=[], i;
		var staat=this.ephemeral.staat, passer=this.ephemeral.passer;

		if (s[0]==0){
			this.modern_pass_color(this.buttons.w_k[s[1]], 1, 0);
			this.modern_pass_color(this.buttons.w_k[2*s[1]], 1, 4);

			staat.push([0, this.buttons.pointer_stack[2*s[1]-2], 104]);
			staat.push([0, this.buttons.pointer_stack[s[1]-1], 104]);
			staat.push([0, this.buttons.pointer_stack[2*s[1]], 15]);
			staat.push([0, this.buttons.pointer_stack[s[1]], 101]);

			var buttons_comet = this.buttons.comet;
			var button_getter = function get_btn_point(comet, pointer, iterator_nr){
				if (pointer < comet.braid_length) return buttons_comet[comet.factor].braid_iterators[pointer][iterator_nr];
				return buttons_comet[comet.factor].cycle_iterators[(pointer-comet.braid_length)%comet.cycle_length][iterator_nr];
			}

			if (this.logic.mono_prime || this.logic.multi_prime){
				for (var x in this.logic.factor_comets){
					var y = this.logic.factor_comets[x];
					staat.push([0, button_getter(y, s[1]-1, 0), 104]);
					staat.push([0, button_getter(y, s[1], 0), 101]);

					staat.push([0, button_getter(y, 2*s[1]-2, 1), 104]);
					staat.push([0, button_getter(y, 2*s[1], 1), 15]);
				}
			}

			staat.push([0, this.buttons.k[2*s[1]-1], 4, 5]);
			staat.push([0, this.buttons.k[2*s[1]], 4, 5]);
		}

		if (s[0]==1){
			this.modern_pass_color(this.buttons.diff[s[1]]);
			this.modern_pass_color(this.buttons.w_k[2*s[1]], 13);
			this.modern_pass_color(this.buttons.w_k[s[1]], 13);
		}
		if (s[0]==2){
			this.modern_pass_color(this.buttons.gcd[s[1]]);
			this.modern_pass_color(this.buttons.m, 13);
			this.modern_pass_color(this.buttons.diff[s[1]], 13);
		}
		if (s[0]==100){
			staat.push([0, this.buttons.gcd[this.logic.last_k], 0, 8]);
		}
	}

	NextState(){
		var l=this.lees.length;
		var s=this.lees[l-1];

		if (s[0]==0) return [1, s[1]];
		if (s[0]==1) return [2, s[1]];
		if (s[0]==2 && s[1]<this.logic.last_k) return [0, s[1]+1];
		else return [100];
	}

	prepare_poly(){
		var poly_strs=this.logic.poly.map((e,i) => `${(e==1)?``:e}x<sup>${i}</sup>`);
		poly_strs=poly_strs.filter((e,i) => this.logic.poly[i]!=0);
		poly_strs=poly_strs.reverse();
		function concat(str1, str2) {return str1+"+"+str2;}
		return poly_strs.reduce(concat, "").substr(1);
	}

	StatementComprehension(){
		var s=this.lees[this.state_nr], x=s[1];

		var poly_str=this.logic.poly_str;

		if (s[0]==0) return `Next values w<sub>k</sub>=w<sub>${s[1]}</sub>=f(w<sub>${s[1]-1}</sub>)=f(${this.logic.w[s[1]-1]}) and w<sub>2k</sub>=w<sub>${2*s[1]}</sub>=f(f(w<sub>${2*s[1]-2}</sub>))=f(f(${this.logic.w[2*s[1]-2]})) are found; for f(x)=${poly_str}, they're equal to ${this.logic.w[s[1]]} and ${this.logic.w[2*s[1]]}`;
		if (s[0]==1) return `Difference w<sub>k</sub>-w<sub>2k</sub> (taken as absolute value - it doesn't actually matter, because it will be used only for gcd finding, but looks better) is equal to |w<sub>k</sub>-w<sub>2k</sub>|=|${this.logic.w[s[1]]}-${this.logic.w[2*s[1]]}|=${this.logic.diff[s[1]]}`;
		if (s[0]==2) return `Gcd between difference of w<sub>k</sub> and w<sub>2k</sub> and m is equal to gcd(${this.logic.diff[s[1]]}, ${this.logic.m})=${this.logic.gcds[s[1]]}.`;
		if (s[0]==100) return `A factor of ${this.logic.m} was found - namely, ${this.logic.gcds[this.logic.gcds.length-1]}, algorithm ends.`;
	}
}
export default PollardRho
