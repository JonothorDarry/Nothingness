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
	logical_box(){
		this.logic.operations = [['S', this.logic.x, this.logic.y]];
		this.logic.subsequent_pairs = [[this.logic.x, this.logic.y]];

		if (this.logic.type == 'k'){
			var _y = this.logic.y;
			var _x = this.logic.x;
			var bit_nr=0, opera_type;

			while (_y>0){
				opera_type = 0;
				if ((_y%2) == 1) opera_type=1;
				this.logic.operations.push(['O', _x, _y, bit_nr, opera_type]);

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
	}

	presentation_change_color_edge(arc, color_start, color_end){
		Lca_binary.presentation_color_edge(arc, color_end);
	}

	presentation_revert_color_edge(arc, color_start, color_end){
		Lca_binary.presentation_color_edge(arc, color_start);
	}

	presentation_create_belt(){
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

	presentation_make_up_lca(){
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
			this.presentation_create_belt();
			this.presentation_make_up_lca();
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

			passer.push([0, this.parent_algorithm.buttons.vertexes[a], 0]);
			this.modern_pass_color(this.parent_algorithm.buttons.vertexes[par], 101, 15);

			for (var i=0; i<bit; i++){
				staat.push([0, this.parent_algorithm.buttons.kth_queries[par][i], 2]);
				passer.push([0, this.parent_algorithm.buttons.kth_queries[a][i], 42]);
			}

			this.modern_pass_color(this.parent_algorithm.buttons.kth_queries[a][bit], 14, 42);
			this.modern_pass_color(this.parent_algorithm.buttons.kth_queries[par][bit], 1, 2);

			var empty = `rgba(255, 255, 255, 0.0)`;
			var c14 = Modern_representation.colors[14];
			staat.push([5, this.presentation_change_color_edge, this.presentation_revert_color_edge, [this.parent_algorithm.buttons.edge_lca_parents[a][bit], empty, c14]]);
			passer.push([5, this.presentation_change_color_edge, this.presentation_revert_color_edge, [this.parent_algorithm.buttons.edge_lca_parents[a][bit], c14, empty]]);

			for (var i=bit+1; i<=this.parent_algorithm.logic.depth_lca; i++){
				staat.push([0, this.parent_algorithm.buttons.kth_queries[par][i], 0]);
				passer.push([0, this.parent_algorithm.buttons.kth_queries[a][i], 42]);
			}
		}

		if (s[0] == 100){
			for (var i=0; i<=this.parent_algorithm.logic.depth_lca; i++){
				staat.push([0, this.parent_algorithm.buttons.kth_queries[this.logic.res][i], 42]);
			}
			staat.push([0, this.parent_algorithm.buttons.vertexes[this.logic.res], 8]);
		}
	}

	NextState(){
		var l=this.lees.length;
		var s=this.lees[l-1], op=s[1];

		var next_bit = this.logic.operations[s[1]+1][4];
		if (s[1]+2 == this.logic.operations.length) return [100];
		if (next_bit == 0) return [11, s[1]+1];
		if (next_bit == 1) return [12, s[1]+1];
	}

	StatementComprehension(){
		var l=this.lees.length;
		var s=this.lees[l-1], x=s[1];

		return ``;
	}
}

var feral2=Algorithm.ObjectParser(document.getElementById('Algo2'));
var eg2=new Lca_binary(feral2, [[1, 2], [2, 3], [3, 4], [4, 5], [2, 6], [6, 7]]);

var feral3=Algorithm.ObjectParser(document.getElementById('Algo3'));
var eg3=new Lca_binary_querier(feral3, eg2, 'l', 7, 4);
