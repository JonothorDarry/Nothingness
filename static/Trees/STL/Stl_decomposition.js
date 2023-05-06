import Algorithm from '../../Base/Algorithm.js';
import Modern_representation from '../../Base/Modern_representation.js';
import Representation_utils from '../../Base/Representation_utils.js';
import Modern_tree from '../../Base/Modern_tree.js';
import Modern_tree_presenter from '../../Base/Modern_tree_presenter.js';
import ArrayUtils from '../../Base/ArrayUtils.js';
import Grid from '../../Base/Grid.js';
import Graph_utils from '../../Base/Graph_utils.js';

class Stl_decomposition extends Algorithm{
	_logical_find_maxson(a){
		var maxson = -1;
		for (var x of this.logic.tree.kids[a]){
			if (maxson==-1 || this.logic.tree.sons[x]>this.logic.tree.sons[maxson]) maxson=x;
		}
		return maxson;
	}

	_logical_partial_dfs(a, ultraparent){
		var change = null;
		this.logic.globals[this.logic.tree.colors[a]].push(ArrayUtils.back(this.logic.globals[this.logic.tree.colors[a]])+1);
		ArrayUtils.back(this.logic.to_cleanse).push(this.logic.tree.colors[a]);
		if (ArrayUtils.back(this.logic.globals[this.logic.tree.colors[a]]) > ArrayUtils.back(this.logic.globals[ArrayUtils.back(this.logic.max_globals)])){
			change = ArrayUtils.back(this.logic.max_globals);
			this.logic.max_globals.push(this.logic.tree.colors[a]);
		}
		this.logic.steps.push(['P2 IN', a, ultraparent, change, ArrayUtils.back(this.logic.to_cleanse).length-1]);

		for (var x of this.logic.tree.kids[a])
			this._logical_partial_dfs(x, ultraparent);
		this.logic.steps.push(['P2 OUT', a, ultraparent]);
	}

	_logical_base_dfs(a){
		this.logic.steps.push(['P1 IN', a]);
		var next_elem = ArrayUtils.back(this.logic.globals[this.logic.tree.colors[a]]);

		for (var x of this.logic.tree.kids[a]){
			if (x != this.logic.tree.maxson[a]) this._logical_base_dfs(x);
		}
		if (this.logic.tree.maxson[a] != -1) this._logical_base_dfs(this.logic.tree.maxson[a]);

		for (var x of this.logic.tree.kids[a]){
			if (x != this.logic.tree.maxson[a]) this._logical_partial_dfs(x, a);
		}

		var change = null;
		this.logic.globals[this.logic.tree.colors[a]].push(ArrayUtils.back(this.logic.globals[this.logic.tree.colors[a]])+1);
		ArrayUtils.back(this.logic.to_cleanse).push(this.logic.tree.colors[a]);
		if (ArrayUtils.back(this.logic.globals[this.logic.tree.colors[a]]) > ArrayUtils.back(this.logic.globals[ArrayUtils.back(this.logic.max_globals)])){
			change = ArrayUtils.back(this.logic.max_globals);
			this.logic.max_globals.push(this.logic.tree.colors[a]);
		}

		this.logic.res[a] = ArrayUtils.back(this.logic.max_globals);
		this.logic.steps.push(['P1 OUT', a, change, ArrayUtils.back(this.logic.to_cleanse).length-1]);

		if (this.logic.tree.maxson[this.logic.tree.par[a]] != a){
			this.logic.steps.push(['P1 OUT LIGHT', a, this.logic.to_cleanse.length-1]);
			for (var x of ArrayUtils.back(this.logic.to_cleanse)){
				this.logic.globals[x].push(0);
			}
			this.logic.to_cleanse.push([]);
		}
		else this.logic.steps.push(['P1 OUT HEAVY', a]);
	}

	logical_box(){
		this.logic.steps = [];
		this.logic.tree.maxson = ArrayUtils.range(0, this.logic.tree.n).map((e) => this._logical_find_maxson(e));
		this.logic.colors_mx = Math.max(...this.logic.tree.colors);

		this.logic.max_globals = [1];
		this.logic.to_cleanse = [[]];
		this.logic.globals = ArrayUtils.steady(this.logic.colors_mx+1, 0).map(e => [0]);
		this.logic.res = ArrayUtils.steady(this.logic.tree.n+1, 0);
		this._logical_base_dfs(1);
	}

	presentation_get_color(color){
		return this._presentation.color_mapping[color%7]
	}

	presentation_append_companion(vertex, x, y, name, color=5){

		var width_height = 30;
		var platz = this.buttons.present_tree.get_place_for_companion_button(vertex, x, y, {'width':width_height, 'height':width_height});
		var btn = Modern_representation.button_creator(name, {'general':{'position':'absolute', 'left':platz.left, 'top':platz.top}, 'px':{'width':width_height, 'height':width_height, 'font-size':11}});
		Representation_utils.Painter(btn, color);

		this.buttons.div_tree.appendChild(btn);
		return btn;
	}

	presentation_add_son(){
		this.buttons.sons = [null];
		for (var i=1; i<=this.logic.tree.n; i++){
			var description = this.presentation_append_companion(i, -2, -1, 'sons', 104);
			var son = this.presentation_append_companion(i, -1, -1, this.logic.tree.sons[i], 104);
			this.buttons.sons.push({
				'description': description, 
				'son': son
			});
		}
	}

	presentation_add_color_base(){
		this.buttons.colors = [null];
		for (var i=1; i<=this.logic.tree.n; i++){
			this.presentation_append_companion(i, 1, -1, 'col');
			var colored = this.presentation_append_companion(i, 2, -1, '');
			Modern_representation.button_modifier(colored, {'inner_html':this.logic.tree.colors[i], 'stylistic':{'general':{'background':this.presentation_get_color(this.logic.tree.colors[i])}, '%':{'borderRadius':100}}});

			var overlay = this.presentation_append_companion(i, 2, -1, '', 104);
			Modern_representation.button_modifier(overlay, {'stylistic':{'general':{'zIndex':-1}}});
			this.buttons.colors.push(overlay);
		}
	}

	presentation_add_color_result(){
		this.buttons.results = [null];
		for (var i=1; i<=this.logic.tree.n; i++){
			var res = this.presentation_append_companion(i, 1, 1, 'res', 104);
			var colored = this.presentation_append_companion(i, 2, 1, '', 104);
			Modern_representation.button_modifier(colored, {'inner_html':this.logic.res[i], 'stylistic':{'%':{'borderRadius':100}}});
			var overlay = this.presentation_append_companion(i, 2, 1, '', 104);
			Modern_representation.button_modifier(overlay, {'stylistic':{'general':{'zIndex':-1}}});

			this.buttons.results.push({
				'description': res, 
				'color': colored,
				'overlay': overlay
			});
		}
	}

	presentation_color_decolor_edges(staat){
		var post_edge_height = 10;
		var past_edge_height = this._presentation.edge_height;

		for (var i=1; i<=this.logic.tree.n; i++){
			if (this.logic.tree.maxson[i] == -1) continue;
			staat.push([5, 
				function(edge, prev_weight, next_weight){
					Modern_representation.button_modifier(edge, {'stylistic':{'px':{'height':next_weight}}});
					Graph_utils.change_edge_height(edge, next_weight);
				},
				function(edge, prev_weight, next_weight){
					Modern_representation.button_modifier(edge, {'stylistic':{'px':{'height':prev_weight}}});
					Graph_utils.change_edge_height(edge, prev_weight);
				},
				[this.buttons.edges[this.logic.tree.maxson[i]], past_edge_height, post_edge_height]]
			);
		}
	}

	_presentation_construct_globals(){
		var rows=5;
		var div_globalists = new Grid(rows, Math.max(this.logic.colors_mx+1, this.logic.tree.n+1));
		this.buttons.maxes = div_globalists.filler([0, [1, this.logic.colors_mx]], ArrayUtils.steady(this.logic.colors_mx, 'Max'), {'color':104});
		Representation_utils.Painter(this.buttons.maxes[0], 5);

		this.buttons.globals = div_globalists.filler([2, [1, this.logic.colors_mx]], ArrayUtils.steady(this.logic.colors_mx, 0), {'color':0});

		this.buttons.global_colors = [null];
		for (var i=1; i<=this.logic.colors_mx; i++){
			var constraining_div = div_globalists.get(1, i);
			Modern_representation.style(constraining_div, {'position':'relative'});

			var btn = Modern_representation.button_creator(i, {'%':{'borderRadius':100}, 'general':{'background':this._presentation.color_mapping[i%7], 'position':'absolute', 'top':0, 'left':0}});
			var overlay = Modern_representation.button_creator('', {'general':{'background':Modern_representation.colors[104], 'position':'absolute', 'top':0, 'left':0}});
			constraining_div.appendChild(overlay);
			constraining_div.appendChild(btn);

			this.buttons.global_colors.push(overlay);
		}
		div_globalists.single_filler([1, 0], 'Color', {'color':5});
		div_globalists.single_filler([2, 0], 'Occurences', {'color':5});
		div_globalists.single_filler([4, 0], 'To clear', {'color':5});
		for (var i=0; i<rows; i++){
			Modern_representation.button_modifier(div_globalists.get(i, 0), {'stylistic':{'px':{'width':100}}});
		}

		this.buttons.to_cleanse = [];
		for (var i=1; i<=this.logic.tree.n; i++){
			var constraining_div = div_globalists.get(4, i);

			Modern_representation.style(constraining_div, {'position':'relative'});
			var btn = Modern_representation.button_creator('', {'%':{'borderRadius':100}, 'general':{'background':Modern_representation.colors[104], 'position':'absolute', 'top':0, 'left':0}});
			var overlay = Modern_representation.button_creator('', {'general':{'background':104, 'position':'absolute', 'top':0, 'left':0}});

			constraining_div.appendChild(overlay);
			constraining_div.appendChild(btn);
			this.buttons.to_cleanse.push({'color':btn, 'overlay':overlay});
		}

		return div_globalists;
	}

	_presentation_construct_tree(){
		this._presentation.edge_height = 2;
		var width = 400*this.logic.tree.get_width(), height = 240*this.logic.tree.get_height();
		var div_tree = Modern_representation.div_creator('', {'px':{'width':width, 'height':height}});
		Modern_representation.button_modifier(div_tree, {'general':{'display':'inline-block'}});
		var present_tree = new Modern_tree_presenter(this.logic.tree, {'div':div_tree, 'width':width, 'height':height}, {
			'vertex':{'width':50, 'height':50, 'radius':100},
			'edge':{'height':this._presentation.edge_height},
			'nonsense':this.stylistic
		});

		this.buttons.div_tree = div_tree;
		this.buttons.present_tree = present_tree;
		this.buttons.edges = present_tree.buttons.edges;
		this.buttons.vertexes = present_tree.buttons.vertexes;

		this.presentation_add_color_base();
		this.presentation_add_son();
		this.presentation_add_color_result();

		return div_tree;
	}

	presentation(){
		this._presentation = {};
		this._presentation.color_mapping = {
			0:'#fc5f05',
			1:'#001dfc',
			2:'#0a8c01',
			3:'#fc005c',
			4:'#8c8501',
			5:'#8c0101',
			6:'#01798c',
		};

		this.buttons={};
		var div_tree = this._presentation_construct_tree();
		var div_globalists = this._presentation_construct_globals();

		this.place.appendChild(div_tree);
		this.place.appendChild(div_globalists.place.full_div);
	}

	statial(){
		this._statial_binding('globals', this.logic.globals, [null, ...this.buttons.globals]);

		var cleansing = ArrayUtils.steady(this.logic.tree.n+1, 0).map(e => []);
		for (var i=0; i<this.logic.to_cleanse.length; i++){
			for (var j=0; j<this.logic.to_cleanse[i].length; j++)
				cleansing[j].push(this.logic.to_cleanse[i][j]);
		}
		this._statial_binding('to_cleanse', cleansing, this.buttons.to_cleanse.map(e => e.color));
	}

	palingenesia(){
		this.logical_box();
		this.presentation();
		this.statial();
	}

	read_data(){
		var fas=this.input.value;
		var c=this.dissolve_input(fas);
		var edges = [], colors = [null];

		var n=c.get_next();
		for (var i=1; i<=n; i++) colors.push(c.get_next());
		for (var i=1; i<n; i++) edges.push([c.get_next(), c.get_next()]);
		this.logic.tree = new Modern_tree(edges);
		this.logic.tree.colors = colors;
	}

	constructor(block, edges, colors){
		super(block);
		this.version=5;
		this.logic.tree = new Modern_tree(edges);
		this.logic.tree.colors = [null, ...colors];

		this.palingenesia();
	}

	BeginningExecutor(){
		this.read_data();
		this.palingenesia();
		this.lees.push([0]);
	}

	StateMaker(s){
		var i, staat=this.ephemeral.staat, passer=this.ephemeral.passer;

		if (s[0] == 0){
			for (var i=1; i<=this.logic.tree.n; i++){
				staat.push([0, this.buttons.sons[i].description, 5]);
				this.pass_color(this.buttons.sons[i].son);
			}
		}
		if (s[0] == 1){
			for (var i=1; i<=this.logic.tree.n; i++){
				if (this.logic.tree.maxson[i] == -1) continue;
				staat.push([0, this.buttons.edges[this.logic.tree.maxson[i]], 30]);
				this.presentation_color_decolor_edges(staat);
			}
		}

		if (s[0] == 2){
			var vertex = this.logic.steps[s[1]][1];
			staat.push([0, this.buttons.vertexes[vertex], 15]);
			if (vertex != 1) staat.push([0, this.buttons.vertexes[this.logic.tree.par[vertex]], 5]);
		}

		if (s[0] == 3){
			var vertex = this.logic.steps[s[1]][1];
			staat.push([0, this.buttons.vertexes[vertex], 7]);
			if (vertex != 1) staat.push([0, this.buttons.vertexes[this.logic.tree.par[vertex]], 15]);
		}

		if (s[0] == 4){
			var vertex = this.logic.steps[s[1]][1];
			for (var i=this.logic.tree.pre[vertex]; i<this.logic.tree.pre[vertex]+this.logic.tree.sons[vertex]; i++)
				staat.push([0, this.buttons.vertexes[this.logic.tree.apre[i]], 0]);
			if (vertex != 1) staat.push([0, this.buttons.vertexes[this.logic.tree.par[vertex]], 15]);
		}

		if (s[0] == 5){
			var for_cleansing = this.logic.to_cleanse[s[2]][s[3]];
			staat.push([6, this.state.globals[for_cleansing]]);
			this.modern_pass_color(this.buttons.globals[for_cleansing-1], 1);

			staat.push([6, this.state.to_cleanse[s[3]]]);
			staat.push([0, this.buttons.to_cleanse[s[3]].color, 104]);
			this.modern_pass_color(this.buttons.to_cleanse[s[3]].overlay, 14, 104);
		}

		if (s[0] == 6){
			var step = this.logic.steps[s[1]];
			var vertex = step[1];
			var ultraparent = step[2];
			var change = step[3];
			var to_clear = step[4];

			staat.push([6, this.state.globals[this.logic.tree.colors[vertex]]]);
			staat.push([0, this.buttons.vertexes[vertex], 101]);
			if (this.logic.tree.par[vertex] != ultraparent)
				staat.push([0, this.buttons.vertexes[this.logic.tree.par[vertex]], 7]);

			this.modern_pass_color(this.buttons.globals[this.logic.tree.colors[vertex]-1], 1, 0);
			if (change != null){
				staat.push([0, this.buttons.maxes[change-1], 104]);
				this.modern_pass_color(this.buttons.maxes[this.logic.tree.colors[vertex]-1], 1, 5);
			}

			staat.push([7, this.buttons.to_cleanse[to_clear].color, {
				'background':this.presentation_get_color(this.logic.tree.colors[vertex]),
				'color':'#FFFFFF'
			}]);
		}

		if (s[0] == 7){
			var ultraparent = this.logic.steps[s[1]][2];
			var vertex = this.logic.steps[s[1]][1];
			staat.push([0, this.buttons.vertexes[vertex], 7]);
			if (this.logic.tree.par[vertex] != ultraparent)
				staat.push([0, this.buttons.vertexes[this.logic.tree.par[vertex]], 101]);
		}

		if (s[0] == 8){
			var step = this.logic.steps[s[1]];
			var vertex = step[1];
			var change = step[2];
			var to_clear = step[3];

			staat.push([6, this.state.globals[this.logic.tree.colors[vertex]]]);
			this.modern_pass_color(this.buttons.globals[this.logic.tree.colors[vertex]-1], 1, 0);
			this.modern_pass_color(this.buttons.colors[vertex], 14, 104);
			if (change != null){
				staat.push([0, this.buttons.maxes[change-1], 104]);
				this.modern_pass_color(this.buttons.maxes[this.logic.tree.colors[vertex]-1], 1, 5);
			}
			staat.push([7, this.buttons.to_cleanse[to_clear].color, {
				'background':this.presentation_get_color(this.logic.tree.colors[vertex]),
				'color':'#FFFFFF'
			}]);
			this.modern_pass_color(this.buttons.to_cleanse[to_clear].overlay, 1, 104);
		}

		if (s[0] == 9){
			var vertex = this.logic.steps[s[1]][1];

			staat.push([0, this.buttons.results[vertex].description, 5]);
			this.modern_pass_color(this.buttons.results[vertex].overlay, 1, 8);
			this.modern_pass_color(this.buttons.global_colors[this.logic.res[vertex]], 14, 104);
			staat.push([7, this.buttons.results[vertex].color, {
				'background':this._presentation.color_mapping[this.logic.res[vertex]],
				'color':'#FFFFFF'
			}]);
		}
	}

	//0 - start, sons
	//1 - defining maxson
	//2 - Phase 1 IN - enter the vertex aiming at getting result in this vertex
	//3 - Phase 1 OUT heavy - get out of the vertex preserving the result
	//4 - Phase 1 OUT light - get out of the vertex discarding the result
	//5 - Clearing the global result
	//6 - Phase 2 IN - enter the vertex in order to pass the color for a result above
	//7 - Phase 2 OUT - exit the vertex in order to pass the color for a result above
	//8 - Phase 1 OUT I - Update globals with color within
	//9 - Phase 1 OUT II - Set the result for a vertex
	NextState(){
		var l=this.lees.length;
		var s=this.lees[l-1];
		var mapping_steps = {
			'P1 IN': 2,
			'P1 OUT HEAVY': 3,
			'P1 OUT LIGHT': 4,
			'P2 IN': 6,
			'P2 OUT': 7,
			'P1 OUT': 8,
		};

		if (s[0]==0) return [1];
		if (s[0]==1) return [2, 0];
		if (s[0]==2 || s[0]==3 || s[0]==6 || s[0]==7 || (s[0]==5 && this.logic.to_cleanse[s[2]].length <= s[3]+1) || s[0]==9){
			if (this.logic.steps.length <= s[1]+1) return [101]; //s[1]+2 dla innego efektu (hehe)
			else {
				var step = this.logic.steps[s[1]+1];
				if (step[0] != 'P1 OUT LIGHT') return [mapping_steps[step[0]], s[1]+1];
				else return [mapping_steps[step[0]], s[1]+1, step[2]];
			}
		}
		if (s[0] == 4) return [5, s[1], s[2], 0];
		if (s[0] == 5) return [5, s[1], s[2], s[3]+1];
		if (s[0] == 8) return [9, s[1]];
	}

	StatementComprehension(){
		var s=this.lees[this.state_nr];

		if (s[0]==0) return `Whatever`;
	}
}
export default Stl_decomposition;
