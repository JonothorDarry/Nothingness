class Lca_RMQ_querier extends Algorithm{
	logical_box(){
		var t1 = this.parent_algorithm.logic.time[this.logic.x];
		var t2 = this.parent_algorithm.logic.time[this.logic.y];
		if (t1 > t2){
			[this.logic.x, this.logic.y] = [this.logic.y, this.logic.x];
			[t1, t2] = [t2, t1];
		}
		this.logic.time_1 = t1;
		this.logic.time_2 = t2;

		this.logic.layer = Math.floor(Math.log2(t2-t1+1));
		var v1 = this.parent_algorithm.logic.rmq_table[this.logic.layer][t1];
		var v2 = this.parent_algorithm.logic.rmq_table[this.logic.layer][t2-(1<<this.logic.layer)+1];
		this.logic.options = [v1, v2];
		var depths = this.parent_algorithm.logic.tree.depth;
		if (depths[v1] < depths[v2]) this.logic.lca = v1;
		else this.logic.lca = v2;
	}

	presentation_place_grid(){
		var base_width = 40;
		var grid = new Grid(7, 4, {'px':{'width':base_width}});
		var wide_style = {'px':{'width':2*base_width+100}};
		var somewhat_wide = {'px':{'width':100}};
		var round_style = {'%':{'borderRadius':100}};

		grid.single_filler([0, 0], 'a', {'color':5});
		this.buttons.x = grid.single_filler([0, 1], this.logic.x, {'stylistic':round_style});
		grid.single_filler([0, 2], 'time(a)', {'color':5, 'stylistic':somewhat_wide});
		this.buttons.times_1 = grid.single_filler([0, 3], this.logic.time_1);

		grid.single_filler([1, 0], 'b', {'color':5});
		this.buttons.y = grid.single_filler([1, 1], this.logic.y, {'stylistic':round_style});
		grid.single_filler([1, 2], 'time(b)', {'color':5, 'stylistic':somewhat_wide});
		this.buttons.times_2 = grid.single_filler([1, 3], this.logic.time_2);

		grid.single_filler([2, 0], '⌊log<sub>2</sub>(time(b)-time(a)+1)⌋', {'color':5, 'stylistic':wide_style});
		this.buttons.layer = grid.single_filler([2, 1], this.logic.layer);

		this.buttons.sparse_1 = grid.single_filler([4, 0], `sparse<sub>${this.logic.layer},${this.logic.time_1}</sub>`, {'stylistic':wide_style});
		this.buttons.v_1 = grid.single_filler([4, 1], this.logic.options[0], {'stylistic':round_style});
		this.buttons.depth_name_1 = grid.single_filler([4, 2], `depth`, {'stylistic':somewhat_wide});
		this.buttons.depth_1 = grid.single_filler([4, 3], this.parent_algorithm.logic.tree.depth[this.logic.options[0]]);

		this.buttons.sparse_2 = grid.single_filler([5, 0], `sparse<sub>${this.logic.layer},${this.logic.time_2}-(1<<${this.logic.layer})+1</sub>`, {'stylistic':wide_style});
		this.buttons.v_2 = grid.single_filler([5, 1], this.logic.options[1], {'stylistic':round_style});
		this.buttons.depth_name_2 = grid.single_filler([5, 2], `depth`, {'stylistic':somewhat_wide});
		this.buttons.depth_2 = grid.single_filler([5, 3], this.parent_algorithm.logic.tree.depth[this.logic.options[1]]);

		grid.single_filler([6, 0], `lca(${this.logic.x}, ${this.logic.y})`, {'color':5, 'stylistic':wide_style});
		this.buttons.lca = grid.single_filler([6, 1], this.logic.lca, {'stylistic':round_style});

		this.place.appendChild(grid.place.full_div);
	}

	presentation(){
		this.buttons = {};
		this.place.style.width = 'max-content';
		this.presentation_place_grid();
	}

	palingenesia(){
		this.logical_box();
		var buttons={};
		this.presentation();
	}

	read_data(){
		var fas=this.input.value;
		var c=this.dissolve_input(fas);
		this.logic.x = c.get_next();
		this.logic.y = c.get_next();
	}

	constructor(block, lca_tree, x, y){
		super(block);
		Modern_representation.button_modifier(this.wisdom, {'stylistic':{'px':{'width':900}}});
		this.logic.x = x;
		this.logic.y = y;
		this.querier = true;
		this.parent_algorithm = lca_tree;

		this.version=5;
		this.palingenesia();
	}

	BeginningExecutor(){
		this.read_data();
		this.palingenesia();
		this.lees.push([0]);
	}

	StateMaker(s){
		var i, staat=this.ephemeral.staat, passer=this.ephemeral.passer;

		if (s[0]==0){
			this.modern_pass_color(this.buttons.x, 1);
			this.modern_pass_color(this.buttons.y, 1);
			this.modern_pass_color(this.buttons.times_1, 1);
			this.modern_pass_color(this.buttons.times_2, 1);

			this.modern_pass_color(this.parent_algorithm.buttons.time[this.logic.x], 14);
			this.modern_pass_color(this.parent_algorithm.buttons.time[this.logic.y], 14);
		}
		if (s[0] == 1){
			this.modern_pass_color(this.buttons.layer, 1);
			this.modern_pass_color(this.buttons.times_1, 14);
			this.modern_pass_color(this.buttons.times_2, 14);
		}
		if (s[0] == 2){
			this.modern_pass_color(this.buttons.layer, 12);
			this.modern_pass_color(this.buttons.times_1, 14);
			this.modern_pass_color(this.buttons.times_2, 13);

			this.modern_pass_color(this.parent_algorithm.buttons.rmq_table[this.logic.layer][this.logic.time_1], 14);
			this.modern_pass_color(this.parent_algorithm.buttons.rmq_table[this.logic.layer][this.logic.time_2-(1<<this.logic.layer)+1], 13);
			this.modern_pass_color(this.parent_algorithm.buttons.time_indexes[this.logic.time_1], 14, 5);
			this.modern_pass_color(this.parent_algorithm.buttons.time_indexes[this.logic.time_2-(1<<this.logic.layer)+1], 13, 5);
			this.modern_pass_color(this.parent_algorithm.buttons.layer_indexes[this.logic.layer], 12, 5);
			staat.push([0, this.buttons.sparse_1, 5]);
			staat.push([0, this.buttons.sparse_2, 5]);

			this.modern_pass_color(this.buttons.v_1, 1);
			this.modern_pass_color(this.buttons.v_2, 1);
		}
		if (s[0] == 3){
			this.modern_pass_color(this.parent_algorithm.buttons.depth[this.logic.options[0]], 14);
			this.modern_pass_color(this.parent_algorithm.buttons.depth[this.logic.options[1]], 13);
			staat.push([0, this.buttons.depth_name_1, 5]);
			staat.push([0, this.buttons.depth_name_2, 5]);
			this.modern_pass_color(this.buttons.depth_1, 1);
			this.modern_pass_color(this.buttons.depth_2, 1);
			this.modern_pass_color(this.buttons.lca, 1, 8);
			if (this.logic.lca == this.logic.v2) this.modern_pass_color(this.buttons.v_1, 12);
			else this.modern_pass_color(this.buttons.v_2, 12);
		}
	}

	NextState(){
		var l=this.lees.length;
		var s=this.lees[l-1];

		if (s[0] == 0) return [1];
		if (s[0] == 1) return [2];
		if (s[0] == 2) return [3];
		if (s[0] == 3) return [101];
	}

	StatementComprehension(){
		var s=this.lees[this.state_nr];

		if (s[0]==0) return `And so, our aim is to find lca(${this.logic.x}, ${this.logic.y}). First, for simplicity, a and b will get swapped if time(a) is higher than time(b).`;
		if (s[0]==1) return `Now - in order to find lca(x, y), I want to find the vertex with lowest depth penetrated in dfs between finding x and finding y. In other words, my aim is to solve range minimum query for a range <time(x);time(y)>. As all I know is the answer to RMQ in form <f;f+2<sup>k</sup>>, I want to divide interval <time(a);time(b)> into two (maybe overallping) intervals of certain width - what width? such width W, that time(x)+W-1 &le; time(y) (otherwise I will include vertices I don't want to include) and time(x)+W+W-1 &ge; time(y) (otherwise I won't include all vertices on a path from x to y). So, I chose &lfloor; log<sub>2</sub>(time(y)-time(x)+1) &rfloor; as the layer (so W=2<sup>&lfloor; log<sub>2</sub>(time(y)-time(x)+1) &rfloor;</sup>) - which is equal to &lfloor; log<sub>2</sub>(${this.logic.time_2}-${this.logic.time_1}+1) &rfloor; = ${this.logic.layer}. Note that to find logarithm, we either use math library (which is slow) or use log2 values from previously created table (which is effectively O(1)).`;
		if (s[0]==2) return `The result is a minimum on an array path either on an interval <time(x); time(x)+2<sup>${this.logic.layer}</sup>-1> or <time(y)-2<sup>${this.logic.layer}</sup>+1; time(y)>. Those values are equal to sparse<sub>${this.logic.layer}, ${this.logic.time_1}</sub>=${this.logic.options[0]} and sparse<sub>${this.logic.layer}, ${this.logic.time_2}-${1<<this.logic.layer}+1</sub>=${this.logic.options[1]}.`;
		if (s[0]==3) return `Out of those two vertices, the lca(${this.logic.x}, ${this.logic.y}) is equal to the one with lower (or equal) depth - which is ${this.logic.lca}.`;
		if (s[0]==101) return `And so, lca(${this.logic.x}, ${this.logic.y}) wa found, it is equal to ${this.logic.lca}.`;
	}
}
export default Lca_RMQ_querier;
