import Lca_binary from './Lca_binary.js'

class Lca_binary_querier extends Algorithm{
	logical_prepare_kth(){
		this.logic.operations = [['S', this.logic.x, this.logic.y]];
		this.logic.subsequent_pairs = [[this.logic.x, this.logic.y]];

		var _y = this.logic.y;
		var _x = this.logic.x;
		var bit_nr=0, opera_type, sum_opera_type=0;

		while (_y>0){
			opera_type = 0;
			if ((_y%2) == 1) opera_type=1;
			sum_opera_type += opera_type;
			this.logic.operations.push(['O', _x, _y, bit_nr, opera_type, sum_opera_type]);

			if ((_y%2) == 1) {
				_x = this.parent_algorithm.logic.lca_parents[_x][bit_nr];
				this.logic.subsequent_pairs.push([_x, (_y>>1)*(1<<(bit_nr+1))]);
			}

			bit_nr += 1;
			_y>>=1;
		}
		this.logic.operations.push(['F', _x]); //Finito
		this.logic.res = _x;

		var prev_y = this.logic.y;
		this.logic.bit_representation = ArrayUtils.range(0, this.parent_algorithm.logic.depth_lca).map(x => (prev_y & (1<<x)));
	}

	logical_anc(tree, a, b){
		if (tree.pre[a] <= tree.pre[b] && tree.pre[a]+tree.sons[a] > tree.pre[b]) return true;
		return false;
	}

	logical_prepare_lca(){
		this.logic.operations = [['S']];
		var first_anc = this.logical_anc(this.parent_algorithm.logic.tree, this.logic.x, this.logic.y);

		this.logic.operations.push(['A', this.logic.x, first_anc]);
		if (first_anc == 1){
			this.logic.operations.push(['F', this.logic.x]);
			this.logic.quick_killa = true;
			this.logic.lca_ans = this.logic.x;
			return;
		}

		var _x = this.logic.x;
		var _k = this.parent_algorithm.logic.depth_lca;

		while (_k>=0){
			var anc = this.logical_anc(this.parent_algorithm.logic.tree, this.parent_algorithm.logic.lca_parents[_x][_k], this.logic.y);
			if (anc){
				this.logic.operations.push(['L', _x, _k, this.parent_algorithm.logic.lca_parents[_x][_k], anc]); //left
				_k-=1;
			}
			else{
				this.logic.operations.push(['U', _x, _k, this.parent_algorithm.logic.lca_parents[_x][_k], anc]); //down
				_x = this.parent_algorithm.logic.lca_parents[_x][_k];
			}
		}
		this.logic.operations.push(['F', this.parent_algorithm.logic.lca_parents[_x][0]]); //down
		this.logic.lca_ans = this.parent_algorithm.logic.lca_parents[_x][0];
	}

	logical_box(){
		if (this.logic.type == 'k') this.logical_prepare_kth();
		else this.logical_prepare_lca();
	}

	presentation_change_color_edge(arc, color_start, color_end){
		Lca_binary.presentation_color_edge(arc, color_end);
	}

	presentation_revert_color_edge(arc, color_start, color_end){
		Lca_binary.presentation_color_edge(arc, color_start);
	}

	presentation_create_belt_kth_ancestor(){
		var amount_buttons = this.logic.subsequent_pairs.length;
		var grid = new Grid(amount_buttons+2, 1, {'px':{'width':200}});
		this.place.appendChild(grid.place.full_div);
		this.buttons.closer_vertices = [];

		var btn_name = grid.get(0, 0);
		for (var i=1; i<=amount_buttons+1; i++) this.buttons.closer_vertices.push(grid.get(i, 0));

		btn_name.innerHTML = `Subsequent expressions`;
		Representation_utils.Painter(btn_name, 5);

		for (var i=0; i<amount_buttons; i++){
			this.buttons.closer_vertices[i].innerHTML = `par<sub>${this.logic.subsequent_pairs[i][1]}</sub>(${this.logic.subsequent_pairs[i][0]})`;
			Representation_utils.Painter(this.buttons.closer_vertices[i], 4);
		}

		this.buttons.closer_vertices[amount_buttons].innerHTML = this.logic.res;
		Representation_utils.Painter(this.buttons.closer_vertices[amount_buttons], 4);
	}

	presentation_create_belt_lca(){
		var amount_buttons = 12;
		var grid = new Grid(amount_buttons+2, 3, {'px':{'width':200}});
		this.place.appendChild(grid.place.full_div);
		grid.place.full_div.style.zIndex = -5;
		this.buttons.closer_vertices = [];

		function System(column_name, column_index, array, width, button_name){
			this.column_name = column_name;
			this.column_index = column_index;
			this.array = array;
			this.width = width;
			this.button_name = button_name;
			return this;
		}

		var list_operas = this.logic.operations.filter(e => (e[0]=='L' || e[0]=='U'));
		var systems = [[`Movement`, 0, list_operas.map(e => e[0]=='L'?'&larr;':'&uarr;'), 100, 'movement'],
			[`Expression`, 1, list_operas.map(e => `anc(par<sub>${1<<e[2]}</sub>(${e[1]}), ${this.logic.y}) = anc(${e[3]}, ${this.logic.y}) = `), 200, 'expression'], 
			[`Logical value`, 2, list_operas.map(e => e[4]==1?'True':'False'), 100, 'logical']
		];
		var proper_systems = systems.map(e => new System(...e));

		for (var x of proper_systems){
			var name = grid.get(0, x.column_index);
			name.innerHTML = x.column_name;
			Representation_utils.Painter(name, 5);
			Modern_representation.button_modifier(name, {'stylistic':{'px':{'width':x.width}}});
			this.buttons[x.button_name] = grid.filler([[1, x.array.length], x.column_index], x.array, {'color':4, 'stylistic':{'px':{'width':x.width}}});
		}

		for (var x of this.buttons.expression) x.style.textAlign = 'right';
		for (var x of this.buttons.logical) x.style.textAlign = 'left';
	}

	presentation_make_up_kth_ancestor(){
		var i=0, prev_x=-1;

		for (var x of this.logic.subsequent_pairs){
			if (prev_x == x[0]) continue;
			for (var i=0; i<=this.parent_algorithm.logic.depth_lca; i++){
				this.parent_algorithm.buttons.kth_queries[x[0]][i].innerHTML = ((((1<<i) & x[1])==0) ? 0 : 1);
			}
			prev_x = x[0];
		}
	}

	presentation(){
		this.buttons = {};
		this.place.style.width = 'max-content';
		if (this.logic.type == 'k'){
			this.presentation_create_belt_kth_ancestor();
			this.presentation_make_up_kth_ancestor();
		}
		else{
			this.presentation_create_belt_lca();
		}
	}

	statial(){
	}

	palingenesia(){
		this.logical_box();
		this.presentation();
		this.statial();
	}

	read_data(){
		var fas=this.input.value;
		var c=this.dissolve_input(fas);
		this.logic.type = c.get_next();
		this.logic.x = c.get_next();
		this.logic.y = c.get_next();
	}

	constructor(block, lca_tree, type, x, y){
		super(block);
		Modern_representation.button_modifier(this.wisdom, {'stylistic':{'px':{'width':600}}});

		this.logic.type = type; //l for lca, k for kth parent
		this.logic.x = x;
		this.logic.y = y;
		this.querier = true;
		this.parent_algorithm = lca_tree;

		this.version=5;
		this.palingenesia();
	}

	BeginningExecutor(){
		this.read_data();

		if (!this.parent_algorithm.is_runtime_finished()) {
			this.lees.push([105]);
			return;
		}
		this.palingenesia();
		
		if (this.logic.type == 'k') this.lees.push([10, 0]); //kth anc
		else this.lees.push([20, 0]); //lca
	}

	StateMaker(s){
		var staat=this.ephemeral.staat, passer=this.ephemeral.passer, i;
		if (s[0] == 105) return;

		var opera = this.logic.operations[s[1]];
		if (s[0] == 10){ //start kth anc
			this.modern_pass_color(this.buttons.closer_vertices[0], 1, 0);

			for (var i=0; i <= this.parent_algorithm.logic.depth_lca; i++){
				this.modern_pass_color(this.parent_algorithm.buttons.kth_queries[opera[1]][i], 1, 0);
			}
			staat.push([0, this.parent_algorithm.buttons.vertexes[opera[1]], 15]);
		}

		if (s[0] == 11){ //Nothin' happens
			var a = opera[1], bit=opera[3];
			this.modern_pass_color(this.parent_algorithm.buttons.kth_queries[a][bit], 1, 2);
		} 

		if (s[0] == 12){ //Movement above
			var a = opera[1], bit=opera[3];
			var par = this.parent_algorithm.logic.lca_parents[a][opera[3]];

			if (a == par){
				staat.push([1, this.parent_algorithm.buttons.kth_queries[par][bit], 1, 0]);
			}

			this.modern_pass_color(this.parent_algorithm.buttons.lca_parents[a][bit], 101, 0);
			passer.push([0, this.parent_algorithm.buttons.vertexes[a], 0]);
			this.modern_pass_color(this.parent_algorithm.buttons.vertexes[par], 101, 15);

			for (var i=0; i<bit; i++){
				staat.push([0, this.parent_algorithm.buttons.kth_queries[par][i], 2]);
				if (a!=par) passer.push([0, this.parent_algorithm.buttons.kth_queries[a][i], 42]);
			}

			if (a != par) this.modern_pass_color(this.parent_algorithm.buttons.kth_queries[a][bit], 14, 42);
			this.modern_pass_color(this.parent_algorithm.buttons.kth_queries[par][bit], 1, 2);

			var empty = `rgba(255, 255, 255, 0.0)`;
			var c14 = Modern_representation.colors[14];
			staat.push([5, this.presentation_change_color_edge, this.presentation_revert_color_edge, [this.parent_algorithm.buttons.edge_lca_parents[a][bit], empty, c14]]);
			passer.push([5, this.presentation_change_color_edge, this.presentation_revert_color_edge, [this.parent_algorithm.buttons.edge_lca_parents[a][bit], c14, empty]]);

			for (var i=bit+1; i<=this.parent_algorithm.logic.depth_lca; i++){
				staat.push([0, this.parent_algorithm.buttons.kth_queries[par][i], 0]);
				if (a!=par) passer.push([0, this.parent_algorithm.buttons.kth_queries[a][i], 42]);
			}

			staat.push([0, this.buttons.closer_vertices[opera[5]-1], 2]);
			this.modern_pass_color(this.buttons.closer_vertices[opera[5]], 1, 0);
		}

		if (s[0] == 20){ //Lca start
			var a=opera[1];
			staat.push([0, this.parent_algorithm.buttons.vertexes[this.logic.x], 101]);
			staat.push([0, this.parent_algorithm.buttons.vertexes[this.logic.y], 12]);
		}

		if (s[0] > 20 && s[0] < 26){
			var operation = this.logic.operations[s[1] + 2];
			var proper_bit = operation[2];
			var checked_parent = operation[3];
			var x = operation[1];
			var position = s[1];

			if (s[0] == 21){ 
				this.modern_pass_color(this.buttons.expression[position], 1, 0);
				staat.push([1, this.buttons.logical[position], this.buttons.logical[position].innerHTML, '?']);
				staat.push([0, this.buttons.logical[position], 6]);
				staat.push([0, this.parent_algorithm.buttons.lca_parents[x][proper_bit], 15]);
				staat.push([0, this.parent_algorithm.buttons.vertexes[checked_parent], 15]);
			}

			if (s[0] == 22 || s[0] == 24){
				this.modern_pass_color(this.buttons.logical[position], 1, 0);
				staat.push([1, this.buttons.logical[position], this.buttons.logical[position].innerHTML, ((s[0] == 22)?'True':'False')]);

				this.modern_pass_color(this.parent_algorithm.buttons.preorder[checked_parent], 14);
				this.modern_pass_color(this.parent_algorithm.buttons.sons[checked_parent], 14);
				this.modern_pass_color(this.parent_algorithm.buttons.preorder[this.logic.y], 14);

				for (var i=this.parent_algorithm.logic.tree.pre[checked_parent]; i < this.parent_algorithm.logic.tree.pre[checked_parent] + this.parent_algorithm.logic.tree.sons[checked_parent]; i++){
					var apre = this.parent_algorithm.logic.tree.apre[i];
					var button = this.parent_algorithm.buttons.vertexes[apre];
					if (apre == x) this.modern_pass_color(button, [101, 30], 101);
					else if (apre == this.logic.y) this.modern_pass_color(button, [12, 30], 12);
					else if (apre == checked_parent) this.modern_pass_color(button, [15, 30], 15);
					else this.modern_pass_color(button, 30);
				}
			}

			if (s[0] == 23 || s[0] == 25){
				this.modern_pass_color(this.buttons.movement[position], 1, 0);
				staat.push([0, this.parent_algorithm.buttons.lca_parents[x][proper_bit], 0]);
				if (s[0] == 23){
					if (this.logic.operations.length == s[1] + 4) this.modern_pass_color(this.parent_algorithm.buttons.vertexes[x], 101, 0);
					staat.push([0, this.parent_algorithm.buttons.vertexes[checked_parent], 0]);
					if (proper_bit != 0) staat.push([0, this.parent_algorithm.buttons.lca_parents[x][proper_bit-1], 15]);
				}

				else{
					staat.push([0, this.parent_algorithm.buttons.vertexes[x], 0]);
					if (this.logic.operations.length == s[1] + 4) this.modern_pass_color(this.parent_algorithm.buttons.vertexes[checked_parent], 101, 0);
					else staat.push([0, this.parent_algorithm.buttons.vertexes[checked_parent], 101]);
					staat.push([0, this.parent_algorithm.buttons.lca_parents[checked_parent][proper_bit], 15]);
				}
			}
		}
		if (s[0] == 26){
			var checked_parent = this.logic.x;
			this.modern_pass_color(this.parent_algorithm.buttons.preorder[checked_parent], 14);
			this.modern_pass_color(this.parent_algorithm.buttons.sons[checked_parent], 14);
			this.modern_pass_color(this.parent_algorithm.buttons.preorder[this.logic.y], 14);

			//copied temporarily(?) - almost
			for (var i=this.parent_algorithm.logic.tree.pre[checked_parent]; i < this.parent_algorithm.logic.tree.pre[checked_parent] + this.parent_algorithm.logic.tree.sons[checked_parent]; i++){
				var apre = this.parent_algorithm.logic.tree.apre[i];
				var button = this.parent_algorithm.buttons.vertexes[apre];
				if (apre == this.logic.x) this.modern_pass_color(button, [101, 30], 101);
				else if (apre == this.logic.y) this.modern_pass_color(button, [12, 30], 12);
				else this.modern_pass_color(button, 30);
			}
		}

		if (s[0] == 100){ //Query finished
			for (var i=0; i<=this.parent_algorithm.logic.depth_lca; i++){
				staat.push([0, this.parent_algorithm.buttons.kth_queries[this.logic.res][i], 42]);
			}

			staat.push([0, this.parent_algorithm.buttons.vertexes[this.logic.res], 8]);
			staat.push([0, this.parent_algorithm.buttons.vertexes[this.logic.x], 101]);

			staat.push([0, this.buttons.closer_vertices[this.logic.subsequent_pairs.length-1], 2]);
			staat.push([0, this.buttons.closer_vertices[0], 8]);
			staat.push([0, ArrayUtils.get_elem(this.buttons.closer_vertices, -1), 8]);
		}

		if (s[0] == 102){
			staat.push([0, this.parent_algorithm.buttons.vertexes[this.logic.y], 12]);
			if (this.logic.quick_killa){
				staat.push([0, this.parent_algorithm.buttons.vertexes[this.logic.lca_ans], [8, 12]]);
			}
			else{
				staat.push([0, this.parent_algorithm.buttons.vertexes[this.logic.lca_ans], 8]);
				staat.push([0, this.parent_algorithm.buttons.vertexes[this.logic.x], 12]);
			}
		}
	}

	NextState(){
		var l=this.lees.length;
		var s=this.lees[l-1], op=s[1];

		var next_bit = this.logic.operations[s[1]+1][4];
		if (this.logic.type == 'k'){
			if (s[1]+2 == this.logic.operations.length) return [100];
			if (next_bit == 0) return [11, s[1]+1];
			if (next_bit == 1) return [12, s[1]+1];
		}

		if (this.logic.type == 'l'){
			if (s[0] == 20) return [26, 0];
			if (s[0] == 26 && this.logic.quick_killa) return [102, 0];
			if (s[0] == 26) return [21, 0]; //next condition - wat if straight A?

			if (s[0] == 21 && this.logic.operations[s[1]+2][0] == 'L') return [22, s[1]];
			if (s[0] == 21) return [24, s[1]];

			if (s[0] == 22) return [23, s[1]];
			if (s[0] == 24) return [25, s[1]];

			if ((s[0] == 23 || s[0] == 25) && s[1] == this.logic.operations.length-4) return [102];
			return [21, s[1]+1];
		}
	}

	StatementComprehension(){
		var s=this.lees[this.state_nr];
		if (s[0] == 105) return `In order to start a query you need to finish the lca preprocessing.`

		if (this.logic.type == 'k'){
			if (s[0] == 100) return `All we need to do right now is to find par<sub>0</sub>(${this.logic.res}) = ${this.logic.res} - and so, our quest has been completed, for par<sub>${this.logic.y}</sub>(${this.logic.x}) = ${this.logic.res}!`;

			var opera = this.logic.operations[s[1]];
			var _y = opera[2] << opera[3];
			if (s[0] == 10) return `The aim of this algorithm is to find ${this.logic.y}. ancestor of ${this.logic.x}.`;
			if (s[0] == 11) return `Notice, that ${_y} has a bit associated with ${1 << opera[3]} not set (i.e. ${_y}&${1 << opera[3]} = 0, where & denotes logical AND operator). Thus, nothing shall be done.`;
			if (s[0] == 12) return `Notice, that ${_y} has a bit associated with ${1 << opera[3]} set (i.e. ${_y}&${1 << opera[3]} > 0, where & denotes logical AND operator). Thus, we may move upwards in the tree, noticing, that par<sub>${_y}</sub>(${opera[1]}) = par<sub>${_y} - ${1 << opera[3]}</sub>(par<sub>${1 << opera[3]}</sub>(${opera[1]})) = par<sub>${_y - (1 << opera[3])}</sub>(${this.parent_algorithm.logic.lca_parents[opera[1]][opera[3]]}) - where we use information about all 2<sup>k</sup>-th ancestors of all vertexes. And so, only the last expression will be used to obtain the final solution.`;
		}

		else{
			if (s[0] == 102){
				var str=``;
				if (!this.logic.quick_killa) str = `Our aim was to find a vertex with lowest depth, an ancestor to ${this.logic.x}, than is not an ancestor of ${this.logic.y}, so that its parent is lowest common ancestor of both ${this.logic.x} and ${this.logic.y}. `;
				return str + `And so, the algorithm has ended, the result is equal to lca(${this.logic.x}, ${this.logic.y}) = ${this.logic.lca_ans}.`;
			}
			if (s[0] == 20) return `The query asks for finding lca(${this.logic.x}, ${this.logic.y}) in a given tree. It will be found by ascending from ${this.logic.x} to a vertex of highest depth, which is not an ancestor of ${this.logic.y}.`;
			if (s[0] == 26){
				var pre_x = this.parent_algorithm.logic.tree.pre[this.logic.x];
				var sons_x = this.parent_algorithm.logic.tree.sons[this.logic.x];
				var pre_y = this.parent_algorithm.logic.tree.pre[this.logic.y];
				return `First of all, if ${this.logic.x} is an ancestor of ${this.logic.y}, then the rest of the algorithm wouldn't correctly find a lowest ancestor; ${this.logic.x == this.logic.lca_ans ? `it is, as pre(${this.logic.x}) &le; pre(${this.logic.y}) < pre(${this.logic.x}) + sons(${this.logic.x}) (Or, substituting expressions for numbers, ${pre_x} &le; ${pre_y} < ${pre_x + sons_x}), so the algorithm shall end with an answer lca(${this.logic.x}, ${this.logic.y}) = ${this.logic.lca_ans}.`:`it isn't, because ${(pre_x > pre_y) ? `pre(${this.logic.x}) = ${pre_x} > pre(${this.logic.y}) = ${pre_y}` : `pre(${this.logic.x}) + sons(${this.logic.x}) = ${pre_x + sons_x} &le; pre(${this.logic.y}) = ${pre_y}`}  so, the algorithm continues.`}`;
			}

			var opera = this.logic.operations[s[1]+2];
			var pre_x = this.parent_algorithm.logic.tree.pre[opera[3]];
			var sons_x = this.parent_algorithm.logic.tree.sons[opera[3]];
			var pre_y = this.parent_algorithm.logic.tree.pre[this.logic.y];
			if (s[0] == 21) return `Now: is par<sub>${1<<opera[2]}</sub>(${opera[1]}) = ${opera[3]} an ancestor to ${this.logic.y}? ...`;
			if (s[0] == 22) return `It is, because pre(${opera[3]}) = ${pre_x} &le; pre(${this.logic.y}) = ${pre_y} and pre(${opera[3]}) + sons(${opera[3]}) = ${pre_x} + ${sons_x} = ${pre_x+sons_x} > pre(${this.logic.y}) = ${pre_y}, and so, lca(${opera[1]}, ${this.logic.y}) is equal to par<sub>k</sub>(${opera[1]}), where k < ${1<<opera[2]}.`;
			if (s[0] == 23) return `What follows, we can search for a non-ancestor of ${this.logic.y} among par<sub>k</sub>(${opera[1]}) for k being lower powers of two than ${1<<opera[2]}.`;

			if (s[0] == 24){
				var partial;
				if (pre_x > pre_y) partial = `pre(${opera[1]}) = ${pre_x} > pre(${this.logic.y}) = ${pre_y}`;
				else partial = `pre(${opera[3]}) + sons(${opera[3]}) = ${pre_x} + ${sons_x} = ${pre_x+sons_x} &le; pre(${this.logic.y}) = ${pre_y}`;
				return `It is not, because ${partial}, and so, lca(${opera[1]}, ${this.logic.y}) is equal to par<sub>k</sub>(${opera[3]}), where k &le; ${1<<opera[2]} (or < rather than &le;, if the last parent of the leaf with a greatest depth in the tree is a root).`;
			}
			if (s[0] == 25) return `What follows, we can search for a non-ancestor of ${this.logic.y} among par<sub>k</sub>(${opera[1]}) for k being lower powers of two than ${1<<opera[2]}.`;
		}
	}
}
export default Lca_binary_querier
