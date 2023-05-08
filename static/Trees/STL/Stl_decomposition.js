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

		for (var x of this.logic.tree.kids[a])
			this._logical_partial_dfs(x, ultraparent);
	}

	_logical_base_dfs(a){
		this.logic.steps.push(['P1 IN', a]);
		var next_elem = ArrayUtils.back(this.logic.globals[this.logic.tree.colors[a]]);

		for (var x of this.logic.tree.kids[a]){
			if (x != this.logic.tree.maxson[a]) this._logical_base_dfs(x);
		}
		if (this.logic.tree.maxson[a] != -1) this._logical_base_dfs(this.logic.tree.maxson[a]);

		for (var x of this.logic.tree.kids[a]){
			if (x != this.logic.tree.maxson[a]){
				this.logic.steps.push(['P2', x]);
				this._logical_partial_dfs(x, a);
			}
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

	presentation_add_pointers(){
		this.buttons.pointers = [null];
		for (var i=1; i<=this.logic.tree.n; i++){
			var colored = this.presentation_append_companion(i, -1, 1, '');
			Modern_representation.button_modifier(colored, {'stylistic':{'general':{'background':Modern_representation.colors[104]}, '%':{'borderRadius':100}}});

			this.buttons.pointers.push(colored);
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
		var rows=3;
		var div_globalists = new Grid(rows, Math.max(this.logic.colors_mx+1, this.logic.tree.n+1));
		this.buttons.maxes = div_globalists.filler([0, [1, this.logic.colors_mx]], ArrayUtils.steady(this.logic.colors_mx, 'Max'), {'color':104});
		Representation_utils.Painter(this.buttons.maxes[0], 101);

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
		for (var i=0; i<rows; i++){
			Modern_representation.button_modifier(div_globalists.get(i, 0), {'stylistic':{'px':{'width':100}}});
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
		this.presentation_add_pointers();

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
		this._statial_binding('maxes', this.logic.max_globals, null);
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

			for (var i=this.logic.tree.pre[vertex]; i<this.logic.tree.pre[vertex]+this.logic.tree.sons[vertex]; i++){
				var x = this.logic.tree.apre[i];
				this.modern_pass_color(this.buttons.colors[x], 14, 104);
				staat.push([6, this.state.globals[this.logic.tree.colors[x]]]);
				this.modern_pass_color(this.buttons.globals[this.logic.tree.colors[x]-1], 1, 0);
			}
		}

		if (s[0] == 6){
			var step = this.logic.steps[s[1]];
			var vertex = step[1];

			for (var i=this.logic.tree.pre[vertex]; i<this.logic.tree.pre[vertex]+this.logic.tree.sons[vertex]; i++){
				var x = this.logic.tree.apre[i];
				this.modern_pass_color(this.buttons.colors[x], 14, 104);
				this.modern_pass_color(this.buttons.vertexes[x], 14, 7);
				staat.push([6, this.state.globals[this.logic.tree.colors[x]]]);
				this.modern_pass_color(this.buttons.globals[this.logic.tree.colors[x]-1], 14, 0);
				this.modern_pass_color(this.buttons.pointers[vertex], 15, 104);
			}

		}

		if (s[0] == 8){
			var step = this.logic.steps[s[1]];
			var vertex = step[1];
			var change = step[2];

			staat.push([6, this.state.globals[this.logic.tree.colors[vertex]]]);
			this.modern_pass_color(this.buttons.globals[this.logic.tree.colors[vertex]-1], 1, 0);
			this.modern_pass_color(this.buttons.colors[vertex], 14, 104);
			if (change != null){
				staat.push([0, this.buttons.maxes[change-1], 104]);
				this.modern_pass_color(this.buttons.maxes[this.logic.tree.colors[vertex]-1], 1, 101);
				staat.push([6, this.state.maxes]);
			}
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
	//4 - Phase 1 OUT light - get out of the vertex discarding the result (includes clearing the globals).
	//6 - Phase 2 - Get all colors in a subtree
	//8 - Phase 1 OUT I - Update globals with color within
	//9 - Phase 1 OUT II - Set the result for a vertex
	NextState(){
		var l=this.lees.length;
		var s=this.lees[l-1];
		var mapping_steps = {
			'P1 IN': 2,
			'P1 OUT HEAVY': 3,
			'P1 OUT LIGHT': 4,
			'P2': 6,
			'P1 OUT': 8,
		};

		if (s[0]==0) return [1];
		if (s[0]==1) return [2, 0];
		if (s[0]==2 || s[0]==3 || s[0]==6 || s[0]==4 || s[0]==9){
			if (this.logic.steps.length <= s[1]+1) return [101]; //s[1]+2 dla innego efektu (hehe)
			else {
				var step = this.logic.steps[s[1]+1];
				if (step[0] != 'P1 OUT LIGHT') return [mapping_steps[step[0]], s[1]+1];
				else return [mapping_steps[step[0]], s[1]+1, step[2]];
			}
		}
		//if (s[0] == 4) return [5, s[1], s[2], 0];
		if (s[0] == 8) return [9, s[1]];
	}

	StatementComprehension(){
		var s=this.lees[this.state_nr];

		if (s[0]==0) return `At the begining of the algorithm, we find - for each vertex - the size of its subtree.`;
		if (s[0]==1) return `Also, for each vertex, we find its son with the greatest subtree size. Whenever we will move through the marked edge from the greatest son to a parent, we will retain the result; otherwise, we will discard the temporary result.`;
		if (s[0]==101) return `And so, the algorithm ends, the results for subsequent vertices are: ${this.logic.res.slice(1)}.`;
		var vertex = this.logic.steps[s[1]][1];
		if (s[0]==2){
			return `Now, we enter the vertex ${vertex} in order to find the most often occuring color in its subtree. Note, that all the occurences of colors in this step must be equal to 0 - because we cannot include any information other than from the ${vertex}'s subtree in the result. To keep this condition true in later operations, we won't update the occurence of the color of this vertex yet - we will do it while exiting the vertex.`;
		}
		if (s[0] == 3){
			return `Now, we exit the vertex - as the subtree of this vertex (${vertex}) is the largest among all sons of ${this.logic.tree.par[vertex]}, we will not discard the occurences - instead, we will retain those occurences to find the most common color in the subtree of ${this.logic.tree.par[vertex]}. Note that we can do that because we have already found all the other results in the subtree of ${this.logic.tree.par[vertex]}.`;
		}

		if (s[0] == 4){
			return `Now, we exit the vertex ${vertex} - as the parent has a larger subtree, we have to discard the obtained amounts of occurences - how to do that is up to you - you can do a next dfs rooted at ${vertex} omitting its parent - ${this.logic.tree.par[vertex]}, you can iterate in sequential manner over colors in this subtree using the inverse preorder, you can have some sequence to_clear where you store all the colors, whose amount of occurences is larger than one, the choice is up to you. The crucial thing is not to zero the entire array of occurences - as the amount of light edges in any tree can be estimated by O(n), this would lead to an unsatisfactory time complexity - O(n<sup>2</sup>)`;
		}

		if (s[0] == 6){
			return `Now, we want to add, for all children of ${this.logic.tree.par[vertex]} except the largest, the amount of occurences of all the colors in their subtree - in this case, in the subtree of ${vertex}. We can do it in several ways - either use dfs rooted at vertex ${vertex} omitting its parent (${this.logic.tree.par[vertex]}) or use inverse preorder to move through the subtree sequentially, the choice is up to you.`;
		}

		if (s[0] == 8){
			var change = this.logic.steps[s[1]][2];
			var start_res = `All the vertices below ${vertex} were already processed, their results found - so now, before evaluating the final result for the vertex and exiting, we can update the amount of occurences of the color of this vertex - color(${vertex}) = ${this.logic.tree.colors[vertex]}, so we add 1 to occurences(${this.logic.tree.colors[vertex]}). `;
			var second_part;
			if (change != null) second_part = `Now - the most common color right now is ${this.state.maxes.previous()}. It occured ${this.state.globals[this.state.maxes.previous()].current()} times - which is less than occurences(${this.logic.tree.colors[vertex]}) = ${this.state.globals[this.logic.tree.colors[vertex]].current()} - thus, we change the pointer to the most common color to ${this.logic.tree.colors[vertex]}.`;
			else second_part = `Now - the most common color right now is ${this.state.maxes.current()}. It occured ${this.state.globals[this.state.maxes.current()].current()} times - which is more or equal to occurences(${this.logic.tree.colors[vertex]}) = ${this.state.globals[this.logic.tree.colors[vertex]].current()} - thus, we don't change the pointer to the most common color.`;

			return start_res + second_part;
		}
		if (s[0] == 9){
			return `The most common color in the subtree of ${vertex} is ${this.logic.res[vertex]} - so we assign res(${vertex}) <- ${this.logic.res[vertex]}.`;
		}
	}
}
export default Stl_decomposition;
