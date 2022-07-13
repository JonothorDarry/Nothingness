class Lca_binary extends Algorithm{
	logical_box(){
		var tree = this.logic.tree;
		var depth_lca = Math.ceil(Math.log(tree.n)/Math.log(2));
		this.logic.depth_lca = depth_lca;
		var lca_parents = ArrayUtils.steady(tree.n+1, 0).map(x => []);

		var v, prev_parent, i;
		lca_parents[1].push(1);
		for (v=2; v<=tree.n; v++) lca_parents[v].push(tree.par[v]);
		for (i=1; i<=depth_lca; i++){
			for (v=1; v<=tree.n; v++) {
				prev_parent = lca_parents[v][i-1];
				lca_parents[v].push(lca_parents[prev_parent][i-1]);
			}
		}
		this.logic.lca_parents = lca_parents;
	}

	presentation_append_companion(vertex, x, y, name, color=5){
			var platz = this.buttons.present_tree.get_place_for_companion_button(vertex, x, y);
			var btn = Modern_representation.button_creator(name, {'general':{'position':'absolute', 'left':platz.left, 'top':platz.top}, 'px':{'width':20, 'height':20, 'font-size':9}});
			Representation_utils.Painter(btn, color);

			this.buttons.div_tree.appendChild(btn);
			return btn;
	}

	presentation_place_preorder(){
		this.buttons.preorder = [null];
		for (var v=1; v<=this.logic.tree.n; v++){
			this.presentation_append_companion(v, -2, -1, 'pre');
			this.buttons.preorder.push(this.presentation_append_companion(v, -1, -1, this.logic.tree.pre[v], 0));
		}
	}

	presentation_place_sons(){
		this.buttons.sons = [null];
		for (var v=1; v<=this.logic.tree.n; v++){
			this.presentation_append_companion(v, 2, -1, 'sons');
			this.buttons.sons.push(this.presentation_append_companion(v, 1, -1, this.logic.tree.sons[v], 0));
		}
	}

	presentation_place_parents(){
		var degree = this.logic.depth_lca;
		this.buttons.lca_parents = ArrayUtils.create_2d(this.logic.tree.n+1, degree+1);
		this.buttons.kth_queries = ArrayUtils.create_2d(this.logic.tree.n+1, degree+1);

		for (var v=1; v<=this.logic.tree.n; v++){
			for (var i=0; i<=degree; i++){
				var kth_btn = this.presentation_append_companion(v, i+1, 3, `0`, 42);
				this.buttons.kth_queries[v][i] = kth_btn;

				this.presentation_append_companion(v, i+1, 2, `&#x2191;<sub>${1<<i}</sub>`);
				this.buttons.lca_parents[v][i] = this.presentation_append_companion(v, i+1, 1, this.logic.lca_parents[v][i], (i==0?0:4));
				Modern_representation.button_modifier(this.buttons.lca_parents[v][i], {'stylistic':{'general':{'borderRadius':'100%'}}});
			}
		}
	}

	presentation_place_arc(vertex_a, vertex_b){
		var tr = this.buttons.present_tree;

		var div = Graph_utils.create_edge(tr.parameters.vertexes[vertex_a], tr.parameters.vertexes[vertex_b], {'height':2, 'backgroundColor':'rgba(255, 255, 255, .0)'}, {'width':tr.width, 'height':tr.height});
		var empty = `rgba(255, 255, 255, 0.0)`;
		Modern_representation.button_modifier(div, {'stylistic':{'general':{'border':'2px dashed #440000', 'zIndex':-3, 'borderRadius':'0 0 100% 100%', 'borderColor': `${empty} ${empty} ${empty} ${empty}`}}});
		div.style.height = div.style.width;
		tr.place.appendChild(div);
		return div;
	}

	static presentation_color_edge(arc, color){
		var style = {'general':{'zIndex':-2}};
		if (color.length == 2){
			//style.general.borderColor = `rgba(255,255,255,0.0) ${color[0]}  ${color[1]}`; //Discontinued - no border-left-image or sth
		}
		else style.general.borderColor = `rgba(255,255,255,0.0) ${color} ${color} ${color}`;

		Modern_representation.button_modifier(arc, {'stylistic':style});
	}

	presentation_change_color_edge(arc, color_start, color_end){
		Lca_binary.presentation_color_edge(arc, color_end);
	}

	presentation_revert_color_edge(arc, color_start, color_end){
		Lca_binary.presentation_color_edge(arc, color_start);
	}

	presentation_create_tree(){
		var width = 200*this.logic.tree.get_width()+50*this.logic.depth_lca, height = 200*this.logic.tree.get_height();
		var div_tree = Modern_representation.div_creator('', {'px':{'width':width, 'height':height}});
		Modern_representation.button_modifier(div_tree, {'general':{'display':'inline-block'}});
		this.buttons.present_tree = new Modern_tree_presenter(this.logic.tree, {'div':div_tree, 'width':width, 'height':height}, {
			'vertex':{'width':40, 'height':40, 'radius':100},
			'edge':{'height':2},
			'nonsense':this.stylistic
		});
		this.buttons.div_tree = div_tree;

		var present_tree = this.buttons.present_tree;
		this.buttons.vertexes = present_tree.buttons.vertexes;
		this.buttons.edges = present_tree.buttons.edges;

		this.presentation_place_preorder();
		this.presentation_place_sons();
		this.presentation_place_parents();

		this.buttons.edge_lca_parents = ArrayUtils.create_2d(this.logic.tree.n+1, this.logic.depth_lca+1);
		for (var v0=1; v0<=this.logic.tree.n; v0+=1){
			for (var v1=0; v1<=this.logic.depth_lca; v1+=1){
				this.buttons.edge_lca_parents[v0][v1] = this.presentation_place_arc(v0, this.logic.lca_parents[v0][v1]);
			}
		}

		return div_tree;
	}

	presentation(){
		this.buttons = {};
		var div_tree = this.presentation_create_tree();
		div_tree.style.display='inline-block';
		this.wisdom.style.width = div_tree.style.width;

		this.place.appendChild(div_tree);
		this.place.style.width = 'max-content';
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
		var edges=Modern_tree.tree_reader(c);
		this.logic.tree = new Modern_tree(edges);
	}

	constructor(block, edges){
		super(block);
		this.logic.tree = new Modern_tree(edges);

		this.version=5;
		this.palingenesia();
	}

	BeginningExecutor(){
		this.starter();
		this.read_data();
		this.palingenesia();
		this.lees.push([0, 0]);
	}

	StateMaker(){
		var l=this.lees.length;
		var s=this.lees[l-1], staat=[], i;
		var staat=this.ephemeral.staat, passer=this.ephemeral.passer;

		if (s[0] == 0){
			for (var v=1; v<=this.logic.tree.n; v++){
				this.modern_pass_color(this.buttons.preorder[v], 1, 0);
				this.modern_pass_color(this.buttons.sons[v], 1, 0);
				this.modern_pass_color(this.buttons.lca_parents[v][0], 1, 0);
			}
		}

		if (s[0] == 1){
			this.modern_pass_color(this.buttons.vertexes[s[1]], 101, 0);
			this.modern_pass_color(this.buttons.lca_parents[s[1]][s[2]], [13, 14], 0);
			this.modern_pass_color(this.buttons.lca_parents[s[1]][s[2]-1], 13, 0);
			this.modern_pass_color(this.buttons.vertexes[this.logic.lca_parents[s[1]][s[2]-1]], 13, 0);

			var post_parent = this.logic.lca_parents[s[1]][s[2]-1];
			var post_post_parent = this.logic.lca_parents[post_parent][s[2]-1];

			this.modern_pass_color(this.buttons.vertexes[post_parent], 13, 0);
			this.modern_pass_color(this.buttons.lca_parents[post_parent][s[2]-1], 14, 0);
			this.modern_pass_color(this.buttons.vertexes[post_post_parent], 14, 0);

			var empty = `rgba(255, 255, 255, 0.0)`;
			var c13=Modern_representation.colors[13], c14 = Modern_representation.colors[14]
			staat.push([5, this.presentation_change_color_edge, this.presentation_revert_color_edge, [this.buttons.edge_lca_parents[s[1]][s[2]], empty, [c13, c14]]]);
			passer.push([5, this.presentation_change_color_edge, this.presentation_revert_color_edge, [this.buttons.edge_lca_parents[s[1]][s[2]], [c13, c14], empty]]);

			staat.push([5, this.presentation_change_color_edge, this.presentation_revert_color_edge, [this.buttons.edge_lca_parents[s[1]][s[2]-1], empty, c13]]);
			passer.push([5, this.presentation_change_color_edge, this.presentation_revert_color_edge, [this.buttons.edge_lca_parents[s[1]][s[2]-1], c13, empty]]);

			staat.push([5, this.presentation_change_color_edge, this.presentation_revert_color_edge, [this.buttons.edge_lca_parents[post_parent][s[2]-1], empty, c14]]);
			passer.push([5, this.presentation_change_color_edge, this.presentation_revert_color_edge, [this.buttons.edge_lca_parents[post_parent][s[2]-1], c14, empty]]);
		}
	}

	NextState(){
		var l=this.lees.length;
		var s=this.lees[l-1], op=s[1];

		if (s[0] == 0) return [1, 1, 1]; //1: find lca table(upwards): args -> vertex, parent nr
		if (s[0] == 1 && s[1] < this.logic.tree.n) return [1, s[1]+1, s[2]];
		else if (s[2] < this.logic.depth_lca) return [1, 1, s[2]+1];
		else return [100];

		return [0];
	}

	StatementComprehension(){
		var l=this.lees.length;
		var s=this.lees[l-1], x=s[1];

		if (s[0] == 0) return `The tree is processed using dfs, for each vertex: (1) Size of its subtree, (2) its parent and (3) its preorder number are found.`;
		if (s[0] == 1) return `Now, ${1<<s[2]}-th parent of ${s[1]} is equal to par<sub>${1<<s[2]}</sub>(${s[1]}) = par<sub>${1<<(s[2]-1)}</sub>(par<sub>${1<<(s[2]-1)}</sub>(${s[1]})) = par<sub>${1<<(s[2]-1)}</sub>(${this.logic.lca_parents[s[1]][s[2]-1]}) = ${this.logic.lca_parents[s[1]][s[2]]}`;
		if (s[0] == 100) return `Now, all necessary parents were found, time for query solving.`
	}
}

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
			this.logic.res = this.logic.x;
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
			this.buttons[x.button_name] = grid.filler([[1, x.array.length], x.column_index], x.array, {'color':0, 'stylistic':{'px':{'width':x.width}}});
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
		this.logic.type = type; //l for lca, k for kth parent
		this.logic.x = x;
		this.logic.y = y;
		this.querier = true;
		this.parent_algorithm = lca_tree;

		this.version=5;
		this.palingenesia();
	}

	BeginningExecutor(){
		this.starter();
		this.read_data();

		if (this.parent_algorithm.finito == false) {
			this.lees.push([101]);
			return;
		}
		this.palingenesia();
		
		if (this.logic.type == 'k') this.lees.push([10, 0]); //kth anc
		else this.lees.push([20, 0]); //lca
	}

	StateMaker(){
		var l=this.lees.length;
		var s=this.lees[l-1], staat=[], i;
		var staat=this.ephemeral.staat, passer=this.ephemeral.passer;

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

			if (a==par){
				staat.push([1, this.parent_algorithm.buttons.kth_queries[par][bit], 1, 0]);
			}

			passer.push([0, this.parent_algorithm.buttons.vertexes[a], 0]);
			this.modern_pass_color(this.parent_algorithm.buttons.vertexes[par], 101, 15);

			for (var i=0; i<bit; i++){
				staat.push([0, this.parent_algorithm.buttons.kth_queries[par][i], 2]);
				if (a!=par) passer.push([0, this.parent_algorithm.buttons.kth_queries[a][i], 42]);
			}

			if (a!=par) this.modern_pass_color(this.parent_algorithm.buttons.kth_queries[a][bit], 14, 42);
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
			this.modern_pass_color(this.parent_algorithm.buttons.vertexes[this.logic.x], 101, 0);
			this.modern_pass_color(this.parent_algorithm.buttons.vertexes[this.logic.y], 101, 0);
		}

		if (s[0] == 21){ //Checkin' anc(a, b)
			this.modern_pass_color(this.parent_algorithm.buttons.preorder[this.logic.x], 14, 0);
			this.modern_pass_color(this.parent_algorithm.buttons.sons[this.logic.y], 14, 0);
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

		}
	}

	StatementComprehension(){
		var l=this.lees.length;
		var s=this.lees[l-1], x=s[1];

		return ``;
	}
}

var feral2=Algorithm.ObjectParser(document.getElementById('Algo2'));
var eg2=new Lca_binary(feral2, [[1, 2], [1, 3], [3, 4], [4, 5], [3, 6], [3, 7], [7, 8]]);
//var eg2=new Lca_binary(feral2, [[1, 2], [2, 3], [3, 4], [4, 5], [2, 6], [6, 7]]);
//var eg2=new Lca_binary(feral2, [[1, 2], [1, 3], [2, 4], [4, 6], [6, 7], [6, 8], [8, 9], [3, 11], [3, 12], [12, 13], [2, 5], [5, 10]]);

var feral3=Algorithm.ObjectParser(document.getElementById('Algo3'));
var eg3=new Lca_binary_querier(feral3, eg2, 'l', 7, 4);
