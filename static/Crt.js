class Crt extends Algorithm{
	logical_box(){
		function Result(validity, c1, s1, c2, s2, gcd, ps1_base, ps2_base, multipla_const, ps1_final, ps2_final, final_congruent, final_mod){
			this.validity = validity;
			this.c1 = c1;
			this.s1 = s1;
			this.c2 = c2;
			this.s2 = s2;
			this.gcd = gcd;
			this.ps1_base = ps1_base;
			this.ps2_base = ps2_base;
			this.multipla_const = multipla_const;

			this.ps1_final = ps1_final;
			this.ps2_final = ps2_final;
			this.final_congruent = final_congruent;
			this.final_mod = final_mod;
		}
		this.logic.results = [];

		var current_pair = this.logic.systems[0];
		for (var cs of this.logic.systems.slice(1)){
			var c1 = current_pair[0];
			var s1 = current_pair[1];

			var c2 = cs[0];
			var s2 = cs[1];

			var ext_gcd_res = NTMath.ext_gcd(s1, s2);
			var gcd = ext_gcd_res[0];
			var ps1_base = ext_gcd_res[1];
			var ps2_base = ext_gcd_res[2];

			if (((c2-c1)%gcd) != 0){
				this.logic.results.push(new Result(false, c1, s1, c2, s2, gcd, ps1_base, ps2_base));
				this.logic.proto_results = [new Result(), ...this.logic.results];
				break;
			}
			var multipla_const = Math.floor((c2-c1)/gcd);
			var ps1_final = ps1_base*multipla_const;
			var ps2_final = ps2_base*multipla_const;

			var final_mod = Math.floor(s1*s2 / gcd);
			var final_congruent = (ps1_final*s1 + c1) % final_mod;
			if (final_congruent < 0) final_congruent += final_mod;

			current_pair = [final_congruent, final_mod];
			this.logic.results.push(new Result(true, c1, s1, c2, s2, gcd, ps1_base, ps2_base, multipla_const, ps1_final, ps2_final, final_congruent, final_mod));
		}
		this.logic.proto_results = [new Result(), ...this.logic.results];
	}

	presentation(){
		this.buttons = {};
		var all_systems = Modern_representation.div_creator('', {});
		this.place.appendChild(all_systems);

		var formula = `<sup>(c<sub>2</sub> - c<sub>1</sub>)</sup> / <sub>gcd(s<sub>1</sub>, s<sub>2</sub>)</sub>`;
		var list_operations = [`ks<sub>1</sub> + c<sub>1</sub> = ls<sub>2</sub> + c<sub>2</sub>`, 
			`ks<sub>1</sub> - ls<sub>2</sub> = c<sub>2</sub> - c<sub>1</sub>`,
			`ps<sub>1</sub> + qs<sub>2</sub> = gcd(s<sub>1</sub>, s<sub>2</sub>)`,
			`c<sub>2</sub> - c<sub>1</sub> &equiv; 0 (mod gcd(s<sub>1</sub>, s<sub>2</sub>))?`,
			`${formula}ps<sub>1</sub> + ${formula}qs<sub>2</sub> = c<sub>2</sub> - c<sub>1</sub>`,
			`k = p(c<sub>2</sub> - c<sub>1</sub>) / gcd(s<sub>1</sub>, s<sub>2</sub>)`,
			`ks<sub>1</sub> + c<sub>1</sub> &equiv; c<sub>12</sub> (mod ${formula})`
		];

		var all_cols = 5;
		var all_rows = 1+Math.max(list_operations.length, this.logic.systems.length);

		var table = Representation_utils.proto_divsCreator(1, all_rows, [], null, all_systems, this.stylistic);

		var grid = new Grid(all_rows, all_cols, this.stylistic, {'place':table.zdivs});
		var position_systems_input = 0;
		var position_systems_partial_results = 1;
		var position_calculation_constants = 3;
		var position_calculation_variables = 4;
		var standard_width = 250;

		grid.single_filler([0, position_systems_input], 'System of equations', {'color':5, 'stylistic':{'px':{'width':standard_width}}});
		this.buttons.systems_input = grid.filler([[1, this.logic.systems.length], position_systems_input], 
			this.logic.systems.map(e => `x &equiv; ${e[0]} (mod ${e[1]})`), 
			{'color':0, 'stylistic':{'px':{'width':standard_width}}}
		);
		grid.filler([[this.logic.systems.length+1, all_rows-1], position_systems_input], [], {'stylistic':{'px':{'width':standard_width}}});

		grid.single_filler([0, position_systems_partial_results], 'Partial results', {'color':5, 'stylistic':{'px':{'width':standard_width}}});
		grid.single_filler([1, position_systems_partial_results], '', {'stylistic':{'px':{'width':standard_width}}});
		this.buttons.systems_partial_results = grid.filler([[2, this.logic.results.length+1], position_systems_partial_results], 
			this.logic.results.map(e => `x &equiv; ${e.final_congruent} (mod ${e.final_mod})`), 
			{'stylistic':{'px':{'width':standard_width}}}
		);
		grid.filler([[this.logic.results.length+2, all_rows-1], position_systems_partial_results], [], {'stylistic':{'px':{'width':standard_width}}});

		grid.single_filler([0, position_calculation_constants], 'Expression', {'color':5, 'stylistic':{'px':{'width':2*standard_width}}});
		this.buttons.const_operations = grid.filler([[1, list_operations.length], position_calculation_constants], 
			list_operations, 
			{'color':5, 'stylistic':{'px':{'width':2*standard_width}}}
		);
		grid.single_filler([0, position_calculation_variables], 'Value', {'color':5, 'stylistic':{'px':{'width':2*standard_width}}});

		var list_of_values = ['equation', 'transposition', 'gcd_result', 'validity', 'full_expression', 'keq', 'finale']; //repeating pattern - thrice
		var value_buttons = grid.filler([[1, list_operations.length], position_calculation_variables], [],
			{'stylistic':{'px':{'width':2*standard_width}}}
		);

		for (var i=0; i<list_of_values.length; i++) this.buttons[list_of_values[i]] = value_buttons[i];
	}

	statial(){
		this._statial_binding('equation', this.logic.proto_results.map(e => `${e.s1}k + ${e.c1} = ${e.s2}l + ${e.c2}`), this.buttons.equation);
		this._statial_binding('transposition', this.logic.proto_results.map(e => `${e.s1}k - ${e.s2}l = ${e.c2} - ${e.c1}`), this.buttons.transposition);
		this._statial_binding('gcd_result', this.logic.proto_results.map(e => `${e.ps1_base}k - ${e.ps2_base}l = ${e.gcd}`), this.buttons.gcd_result);
		this._statial_binding('validity', this.logic.proto_results.map(e => ((e.validity==true)?`Yes, ${e.c2}-${e.c1} &equiv; 0 (mod ${e.gcd})`:`No, ${e.c2}-${e.c1} &equiv; ${(e.c2-e.c1) % e.gcd} (mod ${e.gcd})`)), this.buttons.validity);
		this._statial_binding('full_expression', this.logic.proto_results.map(e => `${e.multipla_const} * ${e.ps1_base} * ${e.s1} + ${e.multipla_const} * ${e.ps2_base} * ${e.s2} = ${e.c2} - ${e.c1}`), this.buttons.full_expression);
		this._statial_binding('keq', this.logic.proto_results.map(e => `k = ${e.multipla_const} * ${e.ps1_base} = ${e.ps1_final}`), this.buttons.keq);
		this._statial_binding('finale', this.logic.proto_results.map(e => `${e.ps1_final}*${e.s1} + ${e.c1} &equiv; ${e.final_congruent} (mod ${e.final_mod})`), this.buttons.finale);
	}

	palingenesia(){
		this.logical_box();
		this.presentation();
		this.statial();
	}

	read_data(){
		var fas=this.input.value;
		var c=this.dissolve_input(fas);
		this.logic.n=c.get_next();
		this.logic.systems = [];
		for (i=0;i<this.logic.n;i++) this.logic.systems.push([c.get_next(), c.get_next()]);
	}

	constructor(block, n, systems){
		super(block);
		this.logic.n=n;
		this.logic.systems = systems;

		this.version=5;
		this.palingenesia();
	}

	BeginningExecutor(){
		this.read_data();
		this.palingenesia();
		this.lees.push([0, 1]);
	}

	StateMaker(s){
		var staat=[], i;
		var staat=this.ephemeral.staat, passer=this.ephemeral.passer;

		//Next pair of equations: either start(0) or continuation(10)
		if (s[0] == 0){
			if (s[1] != 1){
				staat.push([0, this.buttons.systems_input[s[1]-1], 0]);
				if (s[1] == 2) staat.push([0, this.buttons.systems_input[s[1]-2], 0]);
				else staat.push([0, this.buttons.systems_partial_results[s[1]-3], 2]);
			}

			staat.push([0, this.buttons.systems_input[s[1]], 14]);
			if (s[1] == 1) staat.push([0, this.buttons.systems_input[s[1]-1], 14]);
			else staat.push([0, this.buttons.systems_partial_results[s[1]-2], 14]);
			staat.push([6, this.state.equation]);
			this.modern_pass_color(this.buttons.equation, 1);

			staat.push([0, this.buttons.transposition, 4]);
			staat.push([0, this.buttons.gcd_result, 4]);
			staat.push([0, this.buttons.validity, 4]);
			staat.push([0, this.buttons.full_expression, 4]);
			staat.push([0, this.buttons.keq, 4]);
			staat.push([0, this.buttons.finale, 4]);
		}

		//Transposing the variables
		if (s[0] == 1){
			staat.push([6, this.state.transposition]);
			this.modern_pass_color(this.buttons.transposition, 1);
		}

		//Extended euclid
		if (s[0] == 2){
			staat.push([6, this.state.gcd_result]);
			this.modern_pass_color(this.buttons.gcd_result, 1);
		}

		//Validity, provided valid, and then expression blossoming in its glory
		if (s[0] == 3){
			staat.push([6, this.state.validity]);
			this.modern_pass_color(this.buttons.validity, 1);
			staat.push([6, this.state.full_expression]);
			this.modern_pass_color(this.buttons.full_expression, 1);
		}

		//Finito - find k and formulate grande finale, then show partial result
		if (s[0] == 4){
			staat.push([6, this.state.keq]);
			this.modern_pass_color(this.buttons.keq, 1);
			staat.push([6, this.state.finale]);
			this.modern_pass_color(this.buttons.finale, 1);
			this.modern_pass_color(this.buttons.systems_partial_results[s[1]-1], 1);
		}
		
		//Final with answer
		if (s[0] == 100){
			staat.push([0, this.buttons.systems_input[this.buttons.systems_input.length-1], 0]);
			if (this.logic.results.length > 1) staat.push([0, this.buttons.systems_partial_results[this.logic.results.length-2], 2]);
			else staat.push([0, this.buttons.systems_input[this.buttons.systems_input.length-2], 0]);
			staat.push([0, this.buttons.systems_partial_results[this.logic.results.length-1], 8]);
		}

		if (s[0] == 101){
			staat.push([6, this.state.validity]);
			this.modern_pass_color(this.buttons.validity, 30); //or 20
		}

	}

	NextState(){
		var l=this.lees.length;
		var s=this.lees[l-1];

		if (s[0] == 0) return [1, s[1]];
		if (s[0] == 1) return [2, s[1]];
		if (s[0] == 2 && this.logic.results[s[1]-1].validity) return [3, s[1]];
		if (s[0] == 2) return [101];
		if (s[0] == 3) return [4, s[1]];

		if (s[0] == 4 && s[1] < this.logic.results.length) return [0, s[1]+1];
		if (s[0] == 4) return [100];
	}

	StatementComprehension(){
		var l=this.lees.length;
		var s=this.lees[l-1], x=s[1];

		if (s[0]==0) return `Whatever`;
	}
}

var feral1 = Algorithm.ObjectParser(document.getElementById('Algo1'));
var eg1=new Crt(feral1, 3, [[2, 3], [5, 7], [8, 33]]);
