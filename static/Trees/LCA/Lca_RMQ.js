class Lca_RMQ extends Algorithm{
	_logical_dfs_eulerian(a){
		for (var vertex of this.logic.tree.kids[a]){
			this.logic.path.push(vertex);
			this.logic.time[vertex] = this.logic.path.length-1;
			this.logic.all_transitions.push(['enter', vertex]);
			this._logical_dfs_eulerian(vertex);
		}
		this.logic.path.push(this.logic.tree.par[a]);
		this.logic.all_transitions.push(['exit', a]);
	}

	logical_box(){
		this.logic.path = [1];
		this.logic.time = ArrayUtils.steady(this.logic.n+1, 0);
		this.logic.time[1] = 0;
		this.logic.all_transitions = [['start', 1]];
		this._logical_dfs_eulerian(1);
		this.logic.path.pop();

		var layers = Math.ceil(Math.log2(this.logic.tree.n))+1;
		this.logic.layers = layers;

		this.logic.rmq_table = [[]];
		for (var i=0; i<this.logic.path.length; i+=1) this.logic.rmq_table[0].push(this.logic.path[i]);
		for (var i=1; i<=layers; i+=1){
			this.logic.rmq_table.push([]);
			for (var j=0; j+(1<<(i-1))<this.logic.path.length; j+=1){
				var vertex_a = this.logic.rmq_table[i-1][j];
				var vertex_b = this.logic.rmq_table[i-1][j+(1<<(i-1))];
				if (this.logic.tree.depth[vertex_a] < this.logic.tree.depth[vertex_b]) this.logic.rmq_table[i].push(vertex_a);
				else this.logic.rmq_table[i].push(vertex_b);
			}
			for (var j=this.logic.path.length-(1<<(i-1)); j<this.logic.path.length; j+=1) this.logic.rmq_table[i].push(this.logic.rmq_table[i-1][j]);
		}
	}

	presentation_append_companion(vertex, x, y, name, color=5){
			var platz = this.buttons.present_tree.get_place_for_companion_button(vertex, x, y);
			var btn = Modern_representation.button_creator(name, {'general':{'position':'absolute', 'left':platz.left, 'top':platz.top}, 'px':{'width':20, 'height':20, 'font-size':9}});
			Representation_utils.Painter(btn, color);

			this.buttons.div_tree.appendChild(btn);
			return btn;
	}

	_presentation_create_arrow(div, sgn){
		var arrow = Modern_representation.button_creator('', {});
		for (var x of div.style) arrow.style[x] = div.style[x];
		Modern_representation.button_modifier(arrow, {'stylistic':{
			'px':{'height':2, 'borderTop':0, 'borderBottom':0}
		}});
		Representation_utils.Painter(arrow, 104);
;
		var rotation = parseFloat(div.style.transform.slice(7, div.style.transform.length-5));
		arrow.style.transform = `rotate(${(sgn==1) ? rotation+Math.PI/4 : rotation-Math.PI/4}rad)`;
		arrow.style.width = `6px`;
		return arrow
	}

	_presentation_create_subedge(div, left, tree_presenter, a, b){
		var e = Modern_representation.button_creator('', {});
		for (var x of div.style) e.style[x] = div.style[x];
		var width = parseFloat(div.style.width.slice(0, div.style.width.length-2));

		var sub=0.25, degree = 1-sub;
		var tops_upper = tree_presenter.parameters['vertexes'][a]['y'];
		var tops_lower = tree_presenter.parameters['vertexes'][b]['y'];
		var tops_canon = (tops_upper+(tops_lower-tops_upper)*degree)*100;

		var lefts_upper = tree_presenter.parameters['vertexes'][a]['x'];
		var lefts_lower = tree_presenter.parameters['vertexes'][b]['x'];
		var lefts_canon = (lefts_upper+(lefts_lower-lefts_upper)*degree)*100;
		if (left!=1){
			tops_canon = (tops_lower-(tops_lower-tops_upper)*degree)*100;
			lefts_canon = (lefts_lower-(lefts_lower-lefts_upper)*degree)*100;
		}

		var distance_to_edge = 12;
		var style_border = '1px dashed #FFFFFF';
		Modern_representation.button_modifier(e, {'stylistic':{
			'general':{
				'left':`calc(${lefts_canon}% + ${((left==1) ? (-distance_to_edge) : distance_to_edge)}px)`, 
				'zIndex':-1,
				'borderTop':style_border,
				'borderBottom':style_border,
				'backgroundColor': '#FFFFFF',
			},
			'%':{'top':tops_canon, 'height':0},
			'px':{'width':width*(1-2*sub)}
		}});

		return e;
	}

	presentation_generate_parallel(place, tree_presentation, ideal, secondary, left, orientation=1){
		var e2;
		if (orientation==1) e2 = this.buttons.edges[ideal];
		else{
			var tr = tree_presentation;
			e2 = Graph_utils.create_edge(tr.parameters.vertexes[tr.tree.par[ideal]], tr.parameters.vertexes[ideal], {}, {'width':tr.width, 'height':tr.height});
		}

		var e2_parallel = this._presentation_create_subedge(e2, left, tree_presentation, ideal, secondary);
		place.appendChild(e2_parallel);

		var e2_arrow_1 = this._presentation_create_arrow(e2_parallel, 1);
		var e2_arrow_2 = this._presentation_create_arrow(e2_parallel, -1);
		place.appendChild(e2_arrow_1);
		place.appendChild(e2_arrow_2);
		return {
			'edge': e2_parallel,
			'arrows': [e2_arrow_1, e2_arrow_2]
		}
	}

	presentation_place_depth(){
		this.buttons.depth = [null];
		for (var v=1; v<=this.logic.tree.n; v++){
			this.presentation_append_companion(v, -1, -1, 'dep');
			this.buttons.depth.push(this.presentation_append_companion(v, -2, -1, this.logic.tree.depth[v], 104));
		}
	}

	presentation_place_time(){
		this.buttons.time = [null];
		for (var v=1; v<=this.logic.tree.n; v++){
			this.presentation_append_companion(v, 1, -1, 'time');
			this.buttons.time.push(this.presentation_append_companion(v, 2, -1, this.logic.time[v], 104));
		}
	}

	presentation_create_tree(){
		var width = 200*this.logic.tree.get_width(), height = 120*this.logic.tree.get_height();
		this.buttons.div_tree = Modern_representation.div_creator('', {'px':{'width':width, 'height':height}});
		this.buttons.present_tree = new Modern_tree_presenter(this.logic.tree, {'div':this.buttons.div_tree, 'width':width, 'height':height}, {
			'vertex':{'width':40, 'height':40, 'radius':100},
			'edge':{'height':2},
			'nonsense':this.stylistic
		});
		this.presentation_place_depth();
		this.presentation_place_time();

		this.buttons.vertexes = this.buttons.present_tree.buttons.vertexes;
		this.buttons.edges = this.buttons.present_tree.buttons.edges;

		this.buttons.edges_in_time = [];
		for (var i=1; i<this.logic.path.length; i++){
			var vertex_in_question = this.logic.all_transitions[i][1];
			if (this.logic.all_transitions[i][0] == 'enter')
				this.buttons.edges_in_time.push(this.presentation_generate_parallel(this.buttons.div_tree, this.buttons.present_tree, vertex_in_question, this.logic.tree.par[vertex_in_question], -1, 1));
			else 
				this.buttons.edges_in_time.push(this.presentation_generate_parallel(this.buttons.div_tree, this.buttons.present_tree, vertex_in_question, this.logic.tree.par[vertex_in_question], 1, -1));
		}

		return this.buttons.div_tree;
	}

	presentation_create_sparse_table(){
		var full_table = new Grid(this.logic.layers+1, this.logic.path.length+1, {}, {'top_margin':1, 'left_margin':1});

		this.buttons.rmq_table = [];
		full_table.single_filler([-1, -1], 'Layer \\ index', {'color':6, 'stylistic':{'px':{'width':120}}});
		this.buttons.time_indexes = full_table.filler([-1, [0, this.logic.path.length-1]], ArrayUtils.range(0, this.logic.path.length-1), {'color':5});
		this.buttons.layer_indexes = full_table.filler([[0, this.logic.layers], -1], ArrayUtils.range(0, this.logic.layers), {'color':5, 'stylistic':{'px':{'width':120}}});
		for (var i=0; i<=this.logic.layers; i++){
			this.buttons.rmq_table.push([]);
			full_table.filler([i, [0, this.logic.path.length-1]], this.logic.rmq_table[i], {'color':104, 'stylistic':{'%':{'borderRadius':100}}});

			for (var j=0; j<this.logic.path.length; j++) this.buttons.rmq_table[i].push(full_table.get(i, j));
		}
		return full_table.place.full_div;
	}
	
	static presentation_color_edge(arc, color){
		Modern_representation.button_modifier(arc, {'stylistic':{'general':{
			'borderTopColor':color, 
			'borderBottomColor':color
		}}});
	}
	
	presentation_change_color_edge(arc, color_start, color_end){
		Lca_RMQ.presentation_color_edge(arc, color_end);
	}

	presentation_revert_color_edge(arc, color_start, color_end){
		Lca_RMQ.presentation_color_edge(arc, color_start);
	}

	presentation(){
		this.buttons = {};
		var div_tree = this.presentation_create_tree();
		this.wisdom.style.width = div_tree.style.width;
		this.place.appendChild(div_tree);

		var outer_block = this.presentation_create_sparse_table();
		outer_block.style.display='block';
		this.place.appendChild(outer_block);
		this.place.style.width = 'max-content';
	}

	palingenesia(){
		this.logical_box();
		this.presentation();
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
		this.read_data();
		this.palingenesia();
		this.lees.push([0, 0]);
	}

	mark_edge(staat, full_edge, color){
		var valid_arrow_color;
		if (ArrayUtils.is_iterable(color)) {
			valid_arrow_color = color[1];
			staat.push([5, this.presentation_change_color_edge, this.presentation_revert_color_edge, [full_edge.edge, full_edge.edge.style.borderTopColor, Modern_representation.colors[color[0]]]]);
		}
		else{
			valid_arrow_color = color;
			staat.push([5, this.presentation_change_color_edge, this.presentation_revert_color_edge, [full_edge.edge, full_edge.edge.style.borderTopColor, Modern_representation.colors[color]]]);
		}
		staat.push([0, full_edge.arrows[0], valid_arrow_color]);
		staat.push([0, full_edge.arrows[1], valid_arrow_color]);
	}

	StateMaker(s){
		var i, staat=this.ephemeral.staat, passer=this.ephemeral.passer;

		if (s[0] == 0){
			var vertex = this.logic.path[s[1]];
			var the_lower_one = this.logic.all_transitions[s[1]][1];

			var message = this.logic.all_transitions[s[1]][0];
			this.modern_pass_color(this.buttons.vertexes[vertex], 15);
			if (message == 'start' || message == 'enter'){
				this.modern_pass_color(this.buttons.depth[vertex], 1, 0);
				this.modern_pass_color(this.buttons.time[vertex], 1, 0);
				this.modern_pass_color(this.buttons.time_indexes[this.logic.time[vertex]], 14, 5);
			}

			if (message == 'enter'){
				staat.push([0, this.buttons.vertexes[this.logic.tree.par[vertex]], 5]);
				this.modern_pass_color(this.buttons.depth[this.logic.tree.par[vertex]], 13, 0);
			}

			var edge_to_paint = this.buttons.edges_in_time[s[1]-1];
			this.modern_pass_color(this.buttons.rmq_table[0][s[1]], 15, 0);
			if (message != 'start'){
				staat.push([5, this.presentation_change_color_edge, this.presentation_revert_color_edge, [edge_to_paint.edge, Modern_representation.colors[4], Modern_representation.colors[15]]]);
				passer.push([5, this.presentation_change_color_edge, this.presentation_revert_color_edge, [edge_to_paint.edge, Modern_representation.colors[15], Modern_representation.colors[4]]]);
				this.modern_pass_color(edge_to_paint.arrows[0], 15, 104);
				this.modern_pass_color(edge_to_paint.arrows[1], 15, 104);
			}
		}
		if (s[0] == 1){
			var next_pos = s[2]+(1<<(s[1]-1));
			this.modern_pass_color(this.buttons.rmq_table[s[1]][s[2]], 1, 0);
			this.modern_pass_color(this.buttons.rmq_table[s[1]-1][s[2]], 13, 0);

			/// Część odpowiedzialna za klepanie edge'y w trakcie RMQ
			if (s[2] == 0){
				var limit_1 = Math.min(this.logic.path.length-1, (1<<(s[1]-1))-1);
				var limit_2 = Math.min(this.logic.path.length-1, (1<<s[1])-1);
				for (var i=0; i<limit_1; i++){
					this.mark_edge(staat, this.buttons.edges_in_time[i], 13);
				}
				for (var i=Math.max(limit_1+1, 0); i<limit_2; i++){
					this.mark_edge(staat, this.buttons.edges_in_time[i], 14);
				}
				if (limit_1 < this.logic.path.length-1) this.mark_edge(staat, this.buttons.edges_in_time[limit_1], [13, 14]);
			}

			else{
				if (s[2] >= 1) this.mark_edge(staat, this.buttons.edges_in_time[s[2]-1], 104);
				if (s[1]!=1 && s[2]+(1<<s[1])-2 < this.logic.path.length-1) this.mark_edge(staat, this.buttons.edges_in_time[s[2]+(1<<s[1])-2], 14);
				var limiting_line = s[2]+(1<<(s[1]-1))-2;
				if (s[1]!=1 && limiting_line < this.logic.path.length-1) this.mark_edge(staat, this.buttons.edges_in_time[limiting_line], 13);
				if (limiting_line+1 < this.logic.path.length-1) this.mark_edge(staat, this.buttons.edges_in_time[limiting_line+1], [13, 14]);
			}

			if (next_pos < this.logic.path.length){
				this.modern_pass_color(this.buttons.rmq_table[s[1]-1][next_pos], 14, 0);

				var vertex_1 = this.logic.rmq_table[s[1]-1][s[2]];
				var vertex_2 = this.logic.rmq_table[s[1]-1][next_pos];
				this.modern_pass_color(this.buttons.depth[vertex_1], 13, 0);
				this.modern_pass_color(this.buttons.depth[vertex_2], 14, 0);
			}
		}
	}

	NextState(){
		var l=this.lees.length;
		var s=this.lees[l-1];
		if (s[0] == 0 && s[1]+1 < this.logic.path.length) return [0, s[1]+1];
		if (s[0] == 0) return [1, 1, 0];
		if (s[0] == 1 && s[2]+1 < this.logic.path.length) return [1, s[1], s[2]+1];
		if (s[0] == 1 && s[1]+1 <= this.logic.layers) return [1, s[1]+1, 0];
		return [100];
	}

	StatementComprehension(){
		var s=this.lees[this.state_nr], x=s[1];

		if (s[0]==0 && s[1]==0) return `The preprocessing phase for this LCA method starts - as usual - with dfs starting from an arbitrary vertex, such as vertex labeled as 1. Vertex 1 is added to the path, its depth set to 0, its time set to the first index of a path - 0.`;
		if (s[0]==0){
			var message = this.logic.all_transitions[s[1]][0];
			var vertex_operated = this.logic.all_transitions[s[1]][1];
			if (message=='enter') return `The vertex ${vertex_operated} is entered, so vertex ${vertex_operated} is added to the path. Its depth is set to the depth of its its parent plus one, so dep(${vertex_operated}) = dep(${this.logic.tree.par[vertex_operated]})+1 = ${this.logic.tree.depth[vertex_operated]}. Its time is set to the current index of the path - ${this.logic.time[vertex_operated]}.`;
			return `The vertex ${vertex_operated} is exited, its parent - vertex ${this.logic.tree.par[vertex_operated]} - is added to the path.`;
		}
		if (s[0] == 1){
			if (s[2] + (1<<(s[1]-1)) < this.logic.path.length) return `Now, the element of sparse table sparse<sub>${s[1]}, ${s[2]}</sub> is determined: it is equal to the vertex - either sparse<sub>${s[1]}-1, ${s[2]}</sub> = ${this.logic.rmq_table[s[1]-1][s[2]]} or sparse<sub>${s[1]}-1, ${s[2]}+2<sup>${s[1]}-1</sup></sub>=${this.logic.rmq_table[s[1]-1][s[2] + (1<<(s[1]-1))]}, depending on which one has lower (or equal) depth; The vertex ${this.logic.rmq_table[s[1]][s[2]]} has not higher depth, thus sparse<sub>${s[1]}, ${s[2]}</sub>=${this.logic.rmq_table[s[1]][s[2]]}.`;
			return `As the vertex sparse<sub>${s[1]}-1, ${s[2]}+2<sup>${s[1]}-1</sup></sub> doesn't exist, sparse<sub>${s[1]}, ${s[2]}</sub> = sparse<sub>${s[1]}-1, ${s[2]}</sub> = ${this.logic.rmq_table[s[1]][s[2]]}.`;
		}
		return `And so, the sparse table is constructed, now its time to answer queries.`;
	}
}
export default Lca_RMQ;
