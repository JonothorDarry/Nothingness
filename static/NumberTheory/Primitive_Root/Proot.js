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
		this.logic.standard_number = true;
		if (this.logic.full_m == 1 || this.logic.full_m == 2 || this.logic.full_m == 4){
			this.logic.standard_number = false;
			return;
		}
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

	_logical_find_proot(deterministic){
		var potential_root=1;
		this.logic.all_potential_roots = []
		while(true){
			if (!deterministic) potential_root = Math.floor(Math.random()*(Number(this.logic.partial_m)-2))+2;
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

		if (ArrayUtils.get_elem(this.logic.m_factors, -1)[1] > 1 && NTMath.pow(root.potential_root, prime-1n, prime*prime) == 1n)
			this.logic.post_expo_primitive_root = this.logic.proto_primitive_root + prime;
		else
			this.logic.post_expo_primitive_root = this.logic.proto_primitive_root;

		if (this.logic.full_m%2n == 0n && this.logic.post_expo_primitive_root%2n == 0n)
			this.logic.full_primitive_root = this.logic.post_expo_primitive_root + this.logic.full_m/2n;
		else
			this.logic.full_primitive_root = this.logic.post_expo_primitive_root;
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
		all_powers = ArrayUtils.revert(all_powers);
		for (var x of all_powers){
			list_of_divisors_per_depth[x.divisors].push({'value':x.value, 'factors':x.factors});
		}
		this.logic.divisors_per_depth = list_of_divisors_per_depth;
	}

	logical_box(){
		this._logical_factorize_m();
		if (!this.logic.standard_number){
			var mapping = {'1':1, '2':1, '4':3};
			this.logic.full_primitive_root = mapping[this.logic.full_m];
		}

		if (!this.logic.correct_number || !this.logic.standard_number)
			return;
		this._logical_factorize_totient();
		this._logical_find_proot(this.logic.is_deter);
		this._logical_make_all_divisors();
	}

	_presentation_create_factored_part(name, value, button_name, to_factor=null, to_factor_name=null){
		var div = Modern_representation.div_creator('', {'general':{'display':'block'}});
		var title = Modern_representation.button_creator(name, {'px':{'width':50}});
		var button = Modern_representation.button_creator(value, {'px':{'width':100}});
		Representation_utils.Painter(title, 5);
		Representation_utils.Painter(button, 4);
		div.appendChild(title);
		div.appendChild(button);
		this.buttons[button_name] = button;

		if (to_factor != null){
			var equality_sign = Modern_representation.button_creator('=', {'px':{'width':20}, 'general':{'color':'#000000'}});
			div.appendChild(equality_sign);
			Representation_utils.Painter(equality_sign, 4);
			this.buttons[`${button_name}_equality`] = equality_sign;

			this.buttons[to_factor_name] = [];
			for (var x of to_factor){
				var factor_button = Representation_utils.expo_style_button_creator(this.stylistic, {'base':x[0], 'expo':x[1]});
				Modern_representation.button_modifier(factor_button.base, {'stylistic':{'px':{'width':this.presentation_factor_length}}});
				div.appendChild(factor_button.base);
				div.appendChild(factor_button.expo);
				Representation_utils.Painter(factor_button.base, 4);
				Representation_utils.Painter(factor_button.expo, 4);
				this.buttons[to_factor_name].push(factor_button);
			}
		}

		return div;
	}

	_presentation_factor_part(){
		var factor_div = Modern_representation.div_creator('', {'general':{'display':'block'}});

		factor_div.appendChild(this._presentation_create_factored_part('m', this.logic.full_m, 'full_m', this.logic.m_factors, 'm_factors'));
		if (this.logic.correct_number){
			factor_div.appendChild(this._presentation_create_factored_part('m\'', this.logic.partial_m, 'partial_m'));
			factor_div.appendChild(this._presentation_create_factored_part('&phi;(m\')', this.logic.totient, 'totient', this.logic.totient_factors, 'totient_factors'));
		}

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

		this.buttons.candidates = [];
		for (var x of this.logic.all_potential_roots){
			var candidate = Modern_representation.button_creator(x.potential_root, {'px':{'width':mid_width}, 'general':{'display':'block'}});
			Representation_utils.Painter(candidate, 4);
			candidates_div.appendChild(candidate);
			this.buttons.candidates.push(candidate);
		}

		return candidates_div;
	}

	_presentation_create_factors_and_append(base, expo, div_to_pass){
		var factor_button = Representation_utils.expo_style_button_creator(this.stylistic, {'base':base, 'expo':expo});
		Modern_representation.button_modifier(factor_button.base, {'stylistic':{'px':{'width':this.presentation_factor_length}}});
		div_to_pass.appendChild(factor_button.base);
		div_to_pass.appendChild(factor_button.expo);
		return factor_button;
	}

	_presentation_final_modifier(){
		var mid_width = 300;
		var for_grid = {'px':{'width':Math.max(150, this.presentation_factor_length*2+40)}};

		var grid = new Grid(4, 2, for_grid, {'top_margin':1});
		var factorization_column = 0;
		var proot_column = 1;
		grid.filler([0, [0, 1]], ['mod', 'Primitive root'], {'color':5})
		if (!this.logic.standard_number){
			Modern_representation.button_modifier(grid.get(1, proot_column), {'inner_html':this.logic.full_primitive_root})
			Representation_utils.Painter(grid.get(1, proot_column), 4);

			Modern_representation.button_modifier(grid.get(1, factorization_column), {'inner_html':this.logic.full_m})
			Representation_utils.Painter(grid.get(1, factorization_column), 4);
			this.buttons.final_proot_proto = {'value': grid.get(1, proot_column), 'factor': grid.get(1, factorization_column)};

			return grid.place.full_div;
		}

		var prime = ArrayUtils.get_elem(this.logic.m_factors, -1);
		var factorz = this._presentation_create_factors_and_append(prime[0], 1, grid.get(1, factorization_column));
		Modern_representation.button_modifier(grid.get(1, proot_column), {'inner_html':this.logic.proto_primitive_root})
		Representation_utils.Painter(grid.get(1, proot_column), 4);
		var next_to_fill=2;
		this.buttons.final_proot_proto = {'value': grid.get(1, proot_column), 'factor': factorz};

		if (ArrayUtils.get_elem(this.logic.m_factors, -1)[1] > 1){
			var factorz = this._presentation_create_factors_and_append(prime[0], prime[1], grid.get(next_to_fill, factorization_column));

			Modern_representation.button_modifier(grid.get(next_to_fill, 1), {'inner_html':this.logic.post_expo_primitive_root})
			Representation_utils.Painter(grid.get(next_to_fill, proot_column), 4);
			this.buttons.final_proot_expo = {'value': grid.get(next_to_fill, proot_column), 'factor': factorz};

			next_to_fill=3;
		}

		if (this.logic.full_m%2n == 0n){
			var factorz_1 = this._presentation_create_factors_and_append(2, 1, grid.get(next_to_fill, factorization_column));
			var factorz_2 = this._presentation_create_factors_and_append(prime[0], prime[1], grid.get(next_to_fill, factorization_column));

			Modern_representation.button_modifier(grid.get(next_to_fill, proot_column), {'inner_html':this.logic.full_primitive_root});
			Representation_utils.Painter(grid.get(next_to_fill, 1), 4);
			this.buttons.final_proot_final = {'value': grid.get(next_to_fill, proot_column), 'factor': [factorz_1, factorz_2]};
		}

		return grid.place.full_div;
	}

	_presentation_left_belt(){
		if (this.logic.standard_number) this.presentation_factor_length = Math.max(this.logic.partial_m.toString().length*10, 40);

		var full_div = Modern_representation.div_creator('');
		var div_upper = this._presentation_factor_part();

		full_div.appendChild(div_upper);

		if (this.logic.correct_number){
			var div_mid = this._presentation_candidates();
			full_div.appendChild(div_mid);
		}

		if (this.logic.correct_number || !this.logic.standard_number){
			var div_lower = this._presentation_final_modifier();
			full_div.appendChild(div_lower);
		}

		return full_div;
	}

	//Currently dead
	_presentation_html_as_factors(factors){
		var res = ``;
		for (var x of factors){
			res += `${x[0]}<sup>${x[1]}</sup>`;
		}
		return res;
	}

	_presentation_get_fall(x, y){ //brute - nie ma sensu zmieniać
		var vertexes=[], edges=[];
		for (var i=0; i<this.logic.divisors_per_depth.length; i++){
			for (var j=0; j<this.logic.divisors_per_depth[i].length; j++){
				if (this.logic.divisors_per_depth[x][y].value % this.logic.divisors_per_depth[i][j].value == 0){
					vertexes.push(this.buttons.vertexes[i][j]);
					for (var edge of this.buttons.edges[i][j]) edges.push(edge);
				}
			}
		}
		return {'vertexes':vertexes, 'edges':edges};
	}

	_presentation_graph(){
		var button_width = Math.max(this.logic.partial_m.toString().length*10*4+120, 240), button_height=40;
		var params_box = {'width':Math.max(...this.logic.divisors_per_depth.map(e => e.length))*(button_width+160), 'height':this.logic.divisors_per_depth.length*180};

		var full_div = Modern_representation.div_creator('', {'px':params_box});
		full_div.style.border = '4px grey dotted'
		var divisor_positions = ArrayUtils.steady(this.logic.divisors_per_depth.length, 0).map(e => []);
		this.buttons.vertexes = ArrayUtils.steady(this.logic.divisors_per_depth.length, 0).map(e => []);
		this.buttons.edges = ArrayUtils.steady(this.logic.divisors_per_depth.length, 0).map(e => []);

		var edges = ArrayUtils.steady(this.logic.divisors_per_depth.length, 0).map(e => []);
		var sgns = [' ? ', ' &equiv; ', ' &nequiv; '];

		var min_top_diff = 1/(2*(this.logic.divisors_per_depth.length+1))*100;
		for (var i=0; i<this.logic.divisors_per_depth.length; i++){
			var top_percent = ((this.logic.divisors_per_depth.length - i)/(this.logic.divisors_per_depth.length+1))*100;
			for (var j=0; j<this.logic.divisors_per_depth[i].length; j++){
				var x=this.logic.divisors_per_depth[i][j];
				var left_percent = ((j+1)/(this.logic.divisors_per_depth[i].length+1) - button_width/(params_box.width*2))*100;

				var post_basis = `1 (mod ${this.logic.partial_m})`;
				var basis = `g<sup>${x.value}</sup>`; 
				//var basis = `g${this._presentation_html_as_factors(x.factors)} = g<sup>${x.value}</sup> ? 1`; //Uncomment for full factorization
				if (i == this.logic.divisors_per_depth.length-1) basis = `g<sup>&phi;(${this.logic.partial_m})</sup> = g<sup>${x.value}</sup>`;
				if (i == this.logic.divisors_per_depth.length-2) basis = `g<sup>&phi;(${this.logic.partial_m})/${this.logic.totient_factors[j][0]}</sup> = ` + basis;

				var standard_value = basis + sgns[0] + post_basis;
				if (i == this.logic.divisors_per_depth.length-1) standard_value = basis + sgns[1] + post_basis;
				var btn = Modern_representation.button_creator(standard_value, {'general':{'top':`${top_percent}%`, 'left':`${left_percent}%`, 'position':'absolute'}, 'px':{'width':button_width, 'height':button_height}, '%':{'borderRadius':40}});

				//Utils for writing stuff
				btn._data_values = [];
				for (var sgn of sgns) btn._data_values.push(basis + sgn + post_basis);
				btn._data_values = [...btn._data_values, basis, post_basis];


				this.buttons.vertexes[i].push(btn);
				Representation_utils.Painter(btn, 4);
				full_div.appendChild(btn);

				divisor_positions[i].push({'y':top_percent/100 + button_height/(params_box.height*2), 'x':left_percent/100 + button_width/(params_box.width*2)});
			}
		}

		for (var i=0; i<this.logic.divisors_per_depth.length; i++){
			edges[i] = ArrayUtils.steady(this.logic.divisors_per_depth[i].length, 0).map(e => []);
			this.buttons.edges[i] = ArrayUtils.steady(this.logic.divisors_per_depth[i].length, 0).map(e => []);
		}

		for (var i=0; i<this.logic.divisors_per_depth.length-1; i++){
			for (var j=0; j<this.logic.divisors_per_depth[i].length; j++){
				for (var ij=0; ij<this.logic.divisors_per_depth[i+1].length; ij++){
					if (this.logic.divisors_per_depth[i+1][ij].value % this.logic.divisors_per_depth[i][j].value == 0){
						var edge = Graph_utils.create_edge(divisor_positions[i][j], divisor_positions[i+1][ij], {'height':2}, params_box);
						edges[i+1][ij].push([i, j]);
						this.buttons.edges[i+1][ij].push(edge);


						Modern_representation.button_modifier(edge, {'stylistic':{'general':{'zIndex':-1}}});
						Representation_utils.Painter(edge, 4);
						full_div.appendChild(edge);
					}
				}
			}
		}
		return full_div;
	}

	presentation(){
		this.buttons = {};
		this.place.style.width = 'max-content';

		var div_left = this._presentation_left_belt();
		this.place.appendChild(div_left);

		if (this.logic.correct_number && this.logic.standard_number){
			var div_right = this._presentation_graph();
			this.place.appendChild(div_right);
		}
	}

	palingenesia(){
		this.logical_box();
		this.presentation();
	}

	read_data(){
		var fas=this.input.value;
		var c=this.dissolve_input(fas);
		this.logic.full_m = BigInt(c.get_next());
		this.logic.is_deter = this.deter.checked;
	}

	constructor(block, full_m){
		super(block);
		this.logic.full_m = full_m;
		this.deter = block.radio_d;
		this.logic.is_deter = this.deter.checked;

		this.version=5;
		this.palingenesia();
	}

	BeginningExecutor(){
		this.read_data();
		this.palingenesia();
		if (this.logic.standard_number) this.lees.push([1]);
		else this.lees.push([102]);
	}

	StateMaker(s){
		var staat=this.ephemeral.staat, passer=this.ephemeral.passer;

		if (s[0] == 1){
			this.modern_pass_color(this.buttons.full_m, 1);
			staat.push([0, this.buttons.full_m_equality, 102]);

			for (var x of this.buttons.m_factors){
				this.modern_pass_color(x.base, 1);
				this.modern_pass_color(x.expo, 1);
			}
		}

		if (s[0] == 2){
			this.modern_pass_color(ArrayUtils.get_elem(this.buttons.m_factors, -1).base, 14);
			this.modern_pass_color(this.buttons.partial_m, 1);
		}

		if (s[0] == 3){
			this.modern_pass_color(this.buttons.totient, 1);
			staat.push([0, this.buttons.totient_equality, 102]);

			for (var x of this.buttons.totient_factors){
				this.modern_pass_color(x.base, 1);
				this.modern_pass_color(x.expo, 1);
			}

			for (var i=0; i<this.buttons.vertexes.length; i++){
				var level_vertexes = this.buttons.vertexes[i];
				for (var vertex of level_vertexes){
					if (i != this.buttons.vertexes.length-1) staat.push([0, vertex, 6]);
					else staat.push([0, vertex, 31]);
				}
			}

			for (var level_edges of this.buttons.edges){
				for (var set_edges of level_edges){
					for (var edge of set_edges) staat.push([0, edge, 5]);
				}
			}
		}

		if (s[0] == 4){
			var color_past_glory = 14;
			this.modern_pass_color(this.buttons.candidates[s[1]], 1, color_past_glory);
			if (s[1] > 0) staat.push([0, this.buttons.candidates[s[1]-1], 0]);

			for (var i=0; i<this.buttons.vertexes.length-1; i++){
				var level_vertexes = this.buttons.vertexes[i];
				for (var vertex of level_vertexes){
					if (i != this.buttons.vertexes.length-1) staat.push([0, vertex, 6]);
					else staat.push([0, vertex, 31]);
					staat.push([1, vertex, vertex.innerHTML, vertex._data_values[0]]);
				}
			}
		}

		if (s[0] == 5){
			var candidate = this.logic.all_potential_roots[s[1]];
			var factor = candidate.results[s[2]].factor;
			var result = candidate.results[s[2]].result;

			if (result == 1){
				var x = ArrayUtils.get_elem(this.buttons.vertexes, -2)[s[2]];
				staat.push([0, x, 31]);
				staat.push([1, x, x.innerHTML, x._data_values[1]]);
			}

			else{
				//staat.push([0, ArrayUtils.get_elem(this.buttons.vertexes, -2)[s[2]], 30]);
				var falling = this._presentation_get_fall(this.buttons.vertexes.length-2, s[2]);
				for (var x of falling.vertexes){
					staat.push([0, x, 30]);
					staat.push([1, x, x.innerHTML, x._data_values[2]]);
				}
				for (var x of falling.edges) this.modern_pass_color(x, 30);

				var btn = ArrayUtils.get_elem(this.buttons.vertexes, -2)[s[2]];
				staat.push([1, btn, btn._data_values[2], btn._data_values[3] + ` &equiv; ${result} (mod ${this.logic.partial_m})`]);
			}
		}

		if (s[0] == 6){
			if (s[1] == 0){
				this.modern_pass_color(ArrayUtils.get_elem(this.buttons.candidates, -1), 14, 0);
				this.modern_pass_color(this.buttons.final_proot_proto.value, 1, 14);
			}

			if (s[1] == 1){
				if (ArrayUtils.get_elem(this.logic.m_factors, -1)[1] > 1) this.modern_pass_color(this.buttons.final_proot_expo.value, 1, 14);
				else staat.push([0, this.buttons.final_proot_final.value, 1]);
			}
			if (s[1] == 2){
				staat.push([0, this.buttons.final_proot_proto.value, 0]);
				staat.push([0, this.buttons.final_proot_final.value, 1]);
			}
		}

		if (s[0] == 100){
			if (this.logic.m_factors.length == 1 && this.logic.m_factors[0][1] == 1) staat.push([0, this.buttons.final_proot_proto.value, 8]);
			else if (this.logic.m_factors.length == 2){
				if (this.logic.m_factors[1][1] > 1) staat.push([0, this.buttons.final_proot_expo.value, 0]);
				else staat.push([0, this.buttons.final_proot_proto.value, 0]);
				staat.push([0, this.buttons.final_proot_final.value, 8]);
			}

			else{
				staat.push([0, this.buttons.final_proot_proto.value, 0]);
				staat.push([0, this.buttons.final_proot_expo.value, 8]);
			}
		}

		if (s[0] == 102){
			staat.push([0, this.buttons.full_m, 0]);
			staat.push([0, this.buttons.final_proot_proto.factor, 0]);
			staat.push([0, this.buttons.final_proot_proto.value, 8]);
		}
	}

	NextState(){
		var l=this.lees.length;
		var s=this.lees[l-1];

		if (s[0] == 1 && this.logic.correct_number) return [2];
		if (s[0] == 1) return [101];
		if (s[0] == 2) return [3];
		if (s[0] == 3) return [4, 0];
		if (s[0] == 4) return [5, s[1], 0];
		if (s[0] == 5 && this.logic.all_potential_roots[s[1]].results.length-1 > s[2]) return [5, s[1], s[2]+1]; //Babool
		else if (s[0] == 5){
			if (s[1]+1 == this.logic.all_potential_roots.length) return [6, 0];
			else return [4, s[1]+1];
		}
		if (s[0] == 6 && s[1] == 0 && (this.logic.full_m%2n == 0 || ArrayUtils.get_elem(this.logic.m_factors, -1)[1] > 1)) return [6, 1];
		else if (s[0] == 6 && s[1] == 1 && (this.logic.full_m%2n == 0 && ArrayUtils.get_elem(this.logic.m_factors, -1)[1] > 1)) return [6, 2];
		else if (s[0] == 6) return [100];
	}

	StatementComprehension(){
		var s=this.lees[this.state_nr];

		if (s[0] == 1) return `The algorithm commences: first, one can get the factorization of m=${this.logic.full_m}. It can be obtained in any way, if m a has a primitive root, it can be obtained in polynomial time - because of its peculiar structure (2<sup>something</sup>p<sup>some_other_thing</sup>). Regardless of used method, the result is ${this.logic.full_m} = ${this._presentation_html_as_factors(this.logic.m_factors)}.`;
		if (s[0] == 2) return `Then, instead of finding primitive root modulo ${this.logic.full_m}, we can find primitive root modulo odd prime factor of ${this.logic.full_m} - that is, ${this.logic.partial_m}, and then transform the resulting primitive root into primitive root for ${this.logic.full_m}.`;
		if (s[0] == 3) return `In order to find primitive root mod ${this.logic.partial_m}, one can first find factorization of &phi;(${this.logic.partial_m}). Note, that from the lemmas, if for a certain number g, for all divisors d:d|&phi;(${this.logic.partial_m}) except for d=&phi;(${this.logic.partial_m}), g<sup>d</sup> &nequiv; 1 (mod ${this.logic.partial_m}), then g is a primitive root modulo ${this.logic.partial_m}.`;
		if (s[0] == 4) return `Next candidate is drawn: ${this.logic.all_potential_roots[s[1]].potential_root}.`
		if (s[0] == 5) return `Now, a check occurs: is ${this.logic.all_potential_roots[s[1]].potential_root}<sup>&phi;(${this.logic.partial_m}/${this.logic.totient_factors[s[2]][0]})</sup> &equiv; 1 (mod ${this.logic.partial_m})? ${(this.logic.all_potential_roots[s[1]].results[s[2]].result==1)?`It is, and so, ${this.logic.all_potential_roots[s[1]].potential_root} is not a primitive root, next candidate has to be found`:`No, ${this.logic.all_potential_roots[s[1]].potential_root}<sup>${(this.logic.partial_m-1n)/this.logic.totient_factors[s[2]][0]}</sup> &equiv; ${this.logic.all_potential_roots[s[1]].results[s[2]].result} (mod ${this.logic.partial_m}). Note that this implies, that for any divisor d of ${(this.logic.partial_m-1n)/this.logic.totient_factors[s[2]][0]}, that ${this.logic.all_potential_roots[s[1]].potential_root}<sup>d</sup> &nequiv; 1 (mod ${this.logic.partial_m}).`}`

		if (s[0] == 6 && s[1] == 0) return `So, it appears, that ${this.logic.proto_primitive_root} is a primitive root modulo ${this.logic.partial_m}`;
		if (s[0] == 6 && s[1] == 1 && ArrayUtils.get_elem(this.logic.m_factors, -1)[1] > 1){
			var prime = ArrayUtils.get_elem(this.logic.m_factors, -1)[0];
			return `Now, primitive root modulo ${(this.logic.full_m % 2n == 0n) ? (this.logic.full_m/2n) : this.logic.full_m} is either equal to ${this.logic.proto_primitive_root} or ${this.logic.proto_primitive_root + this.logic.partial_m}. As ${this.logic.proto_primitive_root}<sup>${this.logic.partial_m-1n}</sup> &equiv; ${NTMath.pow(this.logic.proto_primitive_root, prime-1n, prime*prime)} (mod ${this.logic.partial_m*this.logic.partial_m}), then primitive root modulo ${(this.logic.full_m % 2n == 0n) ? (this.logic.full_m/2n) : this.logic.full_m} is equal to ${this.logic.post_expo_primitive_root}.`;
		}

		if (s[0] == 6){
			if (this.logic.post_expo_primitive_root % 2n == 0n) return `As the primitive root modulo ${this.logic.full_m/2n} is divisible by 2, then ${this.logic.post_expo_primitive_root} cannot be a primitive root modulo ${this.logic.full_m}, because it is not coprime to 2; but ${this.logic.post_expo_primitive_root} + ${this.logic.full_m}/2 = ${this.logic.final_primitive_root} can be, and is a primitive root.`;
			else return `As the primitive root modulo ${this.logic.full_m/2n} is not divisible by 2, then ${this.logic.post_expo_primitive_root} is a primitive root modulo ${this.logic.full_m}.`;
		}

		if (s[0] == 100) return `And so, the primitive root modulo ${this.logic.full_m} was found, it is equal to ${this.logic.full_primitive_root}.`;
		if (s[0] == 101){
			var base = `As the factorization of ${this.logic.full_m} doesn't follow patter bp<sup>x</sup>, where p is an odd prime and b is either 1 or 2, and it is not equal to 1, 2 or 4, then there is no primitive root modulo ${this.logic.m}. In particular, `;
			var sub_message;
			if (this.logic.problem == 'too many factors') sub_message = `${this.logic.full_m} has more than two prime factors in its factorization.`;
			if (this.logic.problem == 'two odd factors') sub_message = `${this.logic.full_m} has two odd prime factors in factorization.`;
			if (this.logic.problem == 'too many twos' || this.logic.problem == '2 to k above 8') sub_message = `${this.logic.full_m} is divisible by 4, yet not equal to 4.`;
			return base + sub_message;
		}
		if (s[0] == 102) return `This number - ${this.logic.full_m} is one of three special cases (1, 2, 4) and thus has predefined primitive root - ${this.logic.full_primitive_root}. For those three numbers, one can use an algorithm, but one would need to adapt it a bit, which seems futile.`;
	}
}
export default Proot
