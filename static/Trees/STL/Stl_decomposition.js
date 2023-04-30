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

	_logical_partial_dfs(a){
		this.logic.steps.push(['P2 IN', a]);

		this.logic.globals[this.logic.tree.colors[a]].push(ArrayUtils.back(this.logic.globals[this.logic.tree.colors[a]])+1);
		ArrayUtils.back(this.logic.to_cleanse).push(this.logic.tree.colors[a]);
		if (ArrayUtils.back(this.logic.globals[this.logic.tree.colors[a]]) > ArrayUtils.back(this.logic.globals[ArrayUtils.back(this.logic.max_globals)])){
			this.logic.max_globals.push(this.logic.tree.colors[a]);
		}

		for (var x of this.logic.tree.kids[a]){
			this._logical_partial_dfs(x);
		}
		this.logic.steps.push(['P2 OUT', a]);
	}

	_logical_base_dfs(a){
		this.logic.steps.push(['P1 IN', a]);
		var next_elem = ArrayUtils.back(this.logic.globals[this.logic.tree.colors[a]]);

		for (var x of this.logic.tree.kids[a]){
			if (x != this.logic.tree.maxson[a]) this._logical_base_dfs(x);
		}
		if (this.logic.tree.maxson[a] != -1) this._logical_base_dfs(this.logic.tree.maxson[a]);

		for (var x of this.logic.tree.kids[a]){
			if (x != this.logic.tree.maxson[a]) this._logical_partial_dfs(x);
		}

		this.logic.globals[this.logic.tree.colors[a]].push(ArrayUtils.back(this.logic.globals[this.logic.tree.colors[a]])+1);
		ArrayUtils.back(this.logic.to_cleanse).push(this.logic.tree.colors[a]);
		if (ArrayUtils.back(this.logic.globals[this.logic.tree.colors[a]]) > ArrayUtils.back(this.logic.globals[ArrayUtils.back(this.logic.max_globals)])){
			this.logic.max_globals.push(this.logic.tree.colors[a]);
		}

		this.logic.res[a] = ArrayUtils.back(this.logic.max_globals);
		if (this.logic.tree.maxson[this.logic.tree.par[a]] != a){
			this.logic.steps.push(['P1 OUT LIGHT', a]);
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
			var platz = this.buttons.present_tree.get_place_for_companion_button(vertex, x, y);
			var btn = Modern_representation.button_creator(name, {'general':{'position':'absolute', 'left':platz.left, 'top':platz.top}, 'px':{'width':20, 'height':20, 'font-size':9}});
			Representation_utils.Painter(btn, color);

			this.buttons.div_tree.appendChild(btn);
			return btn;
	}

	presentation_add_color_base(){
		this.buttons.colors = [null];
		for (var i=1; i<=this.logic.tree.n; i++){
			this.presentation_append_companion(i, 1, -1, 'col');
			var colored = this.presentation_append_companion(i, 2, -1, '');
			Modern_representation.button_modifier(colored, {'inner_html':this.logic.tree.colors[i], 'stylistic':{'general':{'backgroundColor':this.presentation_get_color(this.logic.tree.colors[i])}, '%':{'borderRadius':100}}});
		}
	}

	presentation_add_son(){
		this.buttons.colors = [null];
		for (var i=1; i<=this.logic.tree.n; i++){
			this.presentation_append_companion(i, -2, -1, 'sons');
			this.presentation_append_companion(i, -1, -1, this.logic.tree.sons[i], 0);
		}
	}

	presentation_add_color_result(){
		this.buttons.colors = [null];
		for (var i=1; i<=this.logic.tree.n; i++){
			this.presentation_append_companion(i, 1, 1, 'res');
			var colored = this.presentation_append_companion(i, 2, 1, '');
			Modern_representation.button_modifier(colored, {'inner_html':this.logic.res[i], 'stylistic':{'general':{'backgroundColor':this.presentation_get_color(this.logic.res[i])}, '%':{'borderRadius':100}}});
			var overlay = this.presentation_append_companion(i, 2, 1, '');
			Modern_representation.button_modifier(overlay, {'stylistic':{'general':{'zIndex':-1}}});
			Representation_utils.Painter(overlay, 8);
		}
	}

	presentation_color_edge_to_maxson(){
		var edge_height = 10;
		for (var i=1; i<=this.logic.tree.n; i++){
			if (this.logic.tree.maxson[i] == -1) continue;
			Modern_representation.button_modifier(this.buttons.edges[this.logic.tree.maxson[i]], {'stylistic':{'px':{'height':edge_height}}});
			Representation_utils.Painter(this.buttons.edges[this.logic.tree.maxson[i]], 30);
			Graph_utils.change_edge_height(this.buttons.edges[this.logic.tree.maxson[i]], edge_height);
		}
	}

	_presentation_construct_globals(){
		var rows=5;
		var div_globalists = new Grid(rows, Math.max(this.logic.colors_mx+1, this.logic.tree.n+1));
		div_globalists.filler([0, [1, this.logic.colors_mx]], ArrayUtils.steady(this.logic.colors_mx, 'Max'), {'color':5});
		div_globalists.filler([2, [1, this.logic.colors_mx]], ArrayUtils.steady(this.logic.colors_mx, 0), {'color':0});

		for (var i=1; i<=this.logic.colors_mx; i++){
			var btn = div_globalists.get(1, i);
			Modern_representation.button_modifier(btn, {'inner_html':i, 'stylistic':{'%':{'borderRadius':100}, 'general':{'backgroundColor':this._presentation.color_mapping[i%7]}}});
		}
		div_globalists.single_filler([1, 0], 'Color', {'color':5});
		div_globalists.single_filler([2, 0], 'Occurences', {'color':5});
		div_globalists.single_filler([4, 0], 'To clear', {'color':5});
		for (var i=0; i<rows; i++){
			Modern_representation.button_modifier(div_globalists.get(i, 0), {'stylistic':{'px':{'width':100}}});
		}
		return div_globalists;
	}

	_presentation_construct_tree(){
		var width = 200*this.logic.tree.get_width(), height = 120*this.logic.tree.get_height();
		var div_tree = Modern_representation.div_creator('', {'px':{'width':width, 'height':height}});
		Modern_representation.button_modifier(div_tree, {'general':{'display':'inline-block'}});
		var present_tree = new Modern_tree_presenter(this.logic.tree, {'div':div_tree, 'width':width, 'height':height}, {
			'vertex':{'width':40, 'height':40, 'radius':100},
			'edge':{'height':2},
			'nonsense':this.stylistic
		});
		this.buttons.div_tree = div_tree;
		this.buttons.present_tree = present_tree;
		this.buttons.edges = present_tree.buttons.edges;
		this.buttons.vertexes = present_tree.buttons.vertexes;

		this.presentation_add_color_base();
		this.presentation_add_son();
		this.presentation_add_color_result();
		this.presentation_color_edge_to_maxson();

		return div_tree;
	}

	presentation(){
		this._presentation = {};
		this._presentation.color_mapping = {
			0:'#01798c',
			1:'#fc5f05',
			2:'#0a8c01',
			3:'#fc005c',
			4:'#001dfc',
			5:'#8c0101',
			6:'#8c8501',
		};

		this.buttons={};
		var div_tree = this._presentation_construct_tree();
		var div_globalists = this._presentation_construct_globals();

		this.place.appendChild(div_tree);
		this.place.appendChild(div_globalists.place.full_div);
	}

	palingenesia(){
		this.logical_box();
		this.presentation();
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
	}

	NextState(){
		var l=this.lees.length;
		var s=this.lees[l-1];

		if (s[0]==0) return [100];
	}

	StatementComprehension(){
		var s=this.lees[this.state_nr];

		if (s[0]==0) return `Whatever`;
	}
}
export default Stl_decomposition;
