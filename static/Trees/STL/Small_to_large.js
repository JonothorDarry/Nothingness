import Algorithm from '../../Base/Algorithm.js';
import Modern_representation from '../../Base/Modern_representation.js';
import Modern_tree from '../../Base/Modern_tree.js';
import Modern_tree_presenter from '../../Base/Modern_tree_presenter.js';
import ArrayUtils from '../../Base/ArrayUtils.js';
import Grid from '../../Base/Grid.js';

class Small_to_large extends Algorithm{
	logical_box(){
		this.logic.subsequent_results = [this.logic.tree.n];
		this.logic.tree.subtree_colors = [null];
		this.logic.operation_per_vertex = {};

		for (var i=1; i<=this.logic.tree.n; i++){
			this.logic.tree.subtree_colors.push([new Set([this.logic.tree.colors[i]])]);
		}

		for (var i=this.logic.tree.n; i>=2; i--){
			var set_v = new Set(ArrayUtils.get_elem(this.logic.tree.subtree_colors[i], -1));
			var set_par = new Set(ArrayUtils.get_elem(this.logic.tree.subtree_colors[this.logic.tree.par[i]], -1));
			var new_result = ArrayUtils.back(this.logic.subsequent_results) - set_par.size - set_v.size;

			var moved_above = new Set();
			this.logic.operation_per_vertex[i] = [new Set(set_v), new Set(set_par), set_v.size>set_par.size, moved_above];

			if (set_v.size > set_par.size){
				var tmp = set_v;
				set_v = set_par;
				set_par = tmp;
			}

			for (var color of set_v){
				if (!set_par.has(color)) moved_above.add(color);
				set_par.add(color);
			}
			this.logic.tree.subtree_colors[this.logic.tree.par[i]].push(set_par);
			new_result += set_par.size;
			this.logic.subsequent_results.push(new_result);
		}
	}

	presentation_get_color(color){
		return this._presentation.color_mapping[color%7];
	}

	presentation_append_companion(vertex, x, y, name, color=5, width_height=30, set=false){
		var platz = this.buttons.present_tree.get_place_for_companion_button(vertex, x, y, {'width':width_height, 'height':width_height}, true);
		var modifier = 0;
		if (set){
			var c = (Math.sqrt(2)-1)*width_height/2;
			modifier = c/Math.sqrt(2); //From Pete Goras's theorem
		}
		var lefty = `${platz.left.slice(0, platz.left.length-1)} - ${modifier}px)`;
		var topy = `${platz.top.slice(0, platz.top.length-1)} + ${modifier}px)`;

		var btn = Modern_representation.button_creator(name, {'general':{'position':'absolute', 'left':lefty, 'top':topy}, 'px':{'width':width_height, 'height':width_height, 'font-size':11}});
		Modern_representation.Painter(btn, color);

		this.buttons.div_tree.appendChild(btn);
		return btn;
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

	presentation_add_set(){
		this.buttons.sets = [null];
		this.buttons.set_elements = [null];

		var max_color = Math.max(...this.logic.tree.colors);
		var left_margin = this.presentation.set_margin;
		var top_margin = this.presentation.set_margin;

		for (var i=1; i<=this.logic.tree.n; i++){
			var set = this.presentation_append_companion(i, 1, 1, '', 31, 2*this.presentation.set_radius, true);
			Modern_representation.style(set, {'borderRadius':'100%', 'backgroundColor':'rgba(179, 0, 0, 0.5)', 'zIndex':1});
			this.buttons.sets.push(set);
			this.buttons.set_elements.push([null]);

			for (var j=1; j<=max_color; j++){
				var left_pos = (j-1)%this.presentation.set_size;
				var top_pos = Math.floor((j-1)/this.presentation.set_size);

				var color = Modern_representation.button_creator(j, {'px':{'width':30, 'height':30, 'left':left_margin+left_pos*30, 'top':top_margin+top_pos*30}, '%':{'borderRadius':100}, 'general':{'position':'absolute'}});
				var overlay = Modern_representation.button_creator(j, {'px':{'width':30, 'height':30, 'left':left_margin+left_pos*30, 'top':top_margin+top_pos*30}, 'general':{'position':'absolute', 'zIndex':-1}});
				Modern_representation.Painter(color, 104);
				Modern_representation.Painter(overlay, 104);

				set.appendChild(color);
				set.appendChild(overlay);
				this.buttons.set_elements[i].push({'color':color, 'overlay':overlay});
			}
		}
	}

	_presentation_construct_globals(){
		var rows=this.logic.tree.n+1;
		var div_globalists = new Grid(rows, 2);

		div_globalists.single_filler([0, 0], 'k', {'color':5, 'stylistic':{'px':{'width':80}}});
		div_globalists.filler([[1, this.logic.tree.n], 0], ArrayUtils.range(this.logic.tree.n+1, 2, -1), {'color':5, 'stylistic':{'px':{'width':80}}});

		div_globalists.single_filler([0, 1], 'f(k)', {'color':5, 'stylistic':{'px':{'width':80}}});
		this.buttons.results = div_globalists.filler([[1, this.logic.tree.n], 1], this.logic.subsequent_results, {'color':104, 'stylistic':{'px':{'width':80}}});

		return div_globalists;
	}

	_presentation_construct_tree(){
		this._presentation.edge_height = 2;
		this._presentation.vertex_size = 50;

		this.presentation.set_size = Math.ceil(Math.sqrt(Math.max(...this.logic.tree.colors)));
		var side_length = (this.presentation.set_size/2)*30;
		this.presentation.set_radius = side_length*Math.sqrt(2);
		this.presentation.set_margin = side_length*(Math.sqrt(2)-1);

		var width = (400+2*this.presentation.set_radius-60)*this.logic.tree.get_width(), height = (240+2*this.presentation.set_radius-60)*this.logic.tree.get_height();
		var div_tree = Modern_representation.div_creator('', {'px':{'width':width, 'height':height}});
		var present_tree = new Modern_tree_presenter(this.logic.tree, {'div':div_tree, 'width':width, 'height':height}, {
			'vertex':{'width':this._presentation.vertex_size, 'height':this._presentation.vertex_size, 'radius':100},
			'edge':{'height':this._presentation.edge_height},
			'nonsense':this.stylistic
		});

		this.buttons.div_tree = div_tree;
		this.buttons.present_tree = present_tree;
		this.buttons.edges = present_tree.buttons.edges;
		this.buttons.vertexes = present_tree.buttons.vertexes;
		for (var edge of this.buttons.edges.slice(2)) Modern_representation.style(edge, {'background':'rgba(0, 0, 0, 0.15)'});

		this.presentation_add_color_base();
		this.presentation_add_set();
		Modern_representation.style(div_tree, {'position':'relative', 'top':`${this.presentation.set_radius-60}px`});

		//Maybe unnecessary, but eases conversions
		var tree_wrapper = Modern_representation.div_creator('', {'px':{'width':width, 'height':height+this.presentation.set_radius}});
		tree_wrapper.appendChild(div_tree);
		return tree_wrapper;
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
		this._presentation.colors_set = {
			'barren':'rgba(179, 0, 0, 0.5)',
			'change':'rgba(128, 255, 102, 0.5)',
			'pointed':'rgba(255, 179, 25, 0.5)',
			'dead':'rgba(255, 255, 255, 0)'
		}
		this._presentation.colors_edge = {
			'added':Modern_representation.colors[1],
			'barren':'#000000'
		}

		this.buttons={};
		var div_tree = this._presentation_construct_tree();
		var div_globalists = this._presentation_construct_globals();
		Modern_representation.style(div_globalists.place.full_div, {'display':'inline-block', 'verticalAlign':'top', 'position':'absolute'});

		this.place.appendChild(div_tree);
		this.place.appendChild(div_globalists.place.full_div);
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

		this.logic.n = c.get_next();
		for (var i=1; i<=this.logic.n; i++) colors.push(c.get_next());
		for (var i=2; i<=this.logic.n; i++) edges.push([c.get_next(), i]);
		this.logic.tree = new Modern_tree(edges);
		this.logic.tree.colors = colors;
	}

	constructor(block, parents, colors){
		super(block);
		this.version=5;
		var edges = parents.map((e, i) => [e, i+2]);
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

		if (s[0]==0){
			for (var i=1; i<=this.logic.tree.n; i++){
				staat.push([7, this.buttons.set_elements[i][this.logic.tree.colors[i]].color, {'background':this.presentation_get_color(this.logic.tree.colors[i]), 'color':'#FFFFFF'}]);
				staat.push([0, this.buttons.results[0], 1]);
			}
		}

		if (s[0]==1){
			var vertex = s[1];

			this.modern_pass_style(this.buttons.edges[vertex], {'background':this._presentation.colors_edge.added}, {'background':this._presentation.colors_edge.barren});
			staat.push([0, this.buttons.vertexes[vertex], 15]);
			//staat.push([0, this.buttons.edges[vertex], 1]);
			if (vertex < this.logic.tree.n){
				staat.push([0, this.buttons.vertexes[vertex+1], 0]);
				staat.push([7, this.buttons.sets[vertex+1], {'background':this._presentation.colors_set.dead, 'border':'1px dashed', 'borderColor':'#888888'}]);
				staat.push([7, this.buttons.sets[this.logic.tree.par[vertex+1]], {'background':this._presentation.colors_set.barren}]);
			}

			this.modern_pass_color(this.buttons.results[this.logic.tree.n-vertex], 14, 8);
			this.modern_pass_color(this.buttons.results[this.logic.tree.n-vertex+1], 1, 0);
		}

		if (s[0] == 2){
			var vertex = s[1];
			var parental = this.logic.tree.par[vertex];
			var operation = this.logic.operation_per_vertex[vertex];

			if (operation[2]){
				this.modern_pass_style(this.buttons.sets[vertex], {'background':this._presentation.colors_set.change}, {'background':this._presentation.colors_set.pointed});
				this.modern_pass_style(this.buttons.sets[parental], {'background':this._presentation.colors_set.change}, {'background':this._presentation.colors_set.pointed});

				for (var x of operation[0]) staat.push([7, this.buttons.set_elements[vertex][x].color, {'background':'rgba(255, 255, 255, 0)', 'color':'rgba(255, 255, 255, 0)'}]);
				for (var x of operation[1]) staat.push([7, this.buttons.set_elements[parental][x].color, {'background':'rgba(255, 255, 255, 0)', 'color':'rgba(255, 255, 255, 0)'}]);
				for (var x of operation[0]) staat.push([7, this.buttons.set_elements[parental][x].color, {'background':this.presentation_get_color(x), 'color':'#FFFFFF'}]);
				for (var x of operation[1]) staat.push([7, this.buttons.set_elements[vertex][x].color, {'background':this.presentation_get_color(x), 'color':'#FFFFFF'}]);
			}
			else {
				staat.push([7, this.buttons.sets[vertex], {'background':this._presentation.colors_set.pointed}]);
				staat.push([7, this.buttons.sets[parental], {'background':this._presentation.colors_set.pointed}]);
			}
		}

		if (s[0]==3){
			var index = s[2];
			var vertex = s[1];
			var operation = this.logic.operation_per_vertex[vertex];
			var next_element = [...operation[+operation[2]]][index];

			this.modern_pass_color(this.buttons.set_elements[vertex][next_element].overlay, 14, 104);
			staat.push([7, this.buttons.set_elements[this.logic.tree.par[vertex]][next_element].color, {'background':this.presentation_get_color(next_element), 'color':'#FFFFFF'}]);
			this.modern_pass_color(this.buttons.set_elements[this.logic.tree.par[vertex]][next_element].overlay, 1, 104);
		}

		if (s[0] == 4){
			var index = s[2];
			var vertex = s[1];
			var operation = this.logic.operation_per_vertex[vertex];
			var next_element = [...operation[+operation[2]]][index];

			this.modern_pass_color(this.buttons.set_elements[vertex][next_element].overlay, 14, 104);
			this.modern_pass_color(this.buttons.set_elements[this.logic.tree.par[vertex]][next_element].overlay, 14, 104);

			this.modern_pass_color(this.buttons.results[this.logic.tree.n-vertex+1], 1, 0);
			staat.push([6, this.state.results[this.logic.tree.n-vertex+1]]);
		}

		if (s[0] == 101){
			staat.push([0, this.buttons.vertexes[2], 0]);
			staat.push([7, this.buttons.sets[2], {'background':this._presentation.colors_set.dead, 'border':'1px dashed', 'borderColor':'#888888'}]);
			staat.push([7, this.buttons.sets[this.logic.tree.par[2]], {'background':this._presentation.colors_set.barren}]);
			staat.push([0, this.buttons.results[this.logic.tree.n-1], 8]);
		}
	}

	statial(){
		var subsequent_results = [];
		var last = this.logic.tree.n;
		for (var i=0; i<this.logic.subsequent_results.length; i++){
			subsequent_results.push(ArrayUtils.range(last, this.logic.subsequent_results[i], -1));
			last = this.logic.subsequent_results[i];
		}

		this._statial_binding('results', subsequent_results, this.buttons.results);
	}

	//0 - set initialization, result for n+1
	//1 - new vertex to process: mark an edge, next answer from the last
	//2 - swap sets if necessary
	//3 - element new to the set, add it to the set
	//4 - element already in the set, subtract stuff from the result
	//101 - Result is found
	NextState(){
		var l=this.lees.length;
		var s=this.lees[l-1];

		if (s[0]==0) return [1, this.logic.tree.n];
		if (s[0]==1) return [2, s[1]];
		if (s[0]==2 || s[0]==3 || s[0]==4){
			var next_index;
			if (s[0] == 2) next_index = 0;
			else next_index = s[2]+1;

			var operation = this.logic.operation_per_vertex[s[1]];
			var next_operation = [...operation[+operation[2]]];
			if (next_index >= next_operation.length){
				if (s[1] == 2) return [101];
				else return [1, s[1]-1];
			}

			if (operation[3].has(next_operation[next_index])) return [3, s[1], next_index];
			return [4, s[1], next_index];
		}
	}

	StatementComprehension(){
		var s=this.lees[this.state_nr];

		if (s[0]==0) return `At the beginning of this algorithm, I initialize all sets to hold a color of a vertex; the first result - f(n+1)=f(${this.logic.tree.n+1})=${this.logic.tree.n} - because there are ${this.logic.tree.n} connected components, each holding a single color`;
		if (s[0]==1){
			var vertex = s[1];

			return `Now, we merge connected components containing vertices ${vertex} and par(${vertex})=${this.logic.tree.par[vertex]}. Also, the result (for now) for f(${vertex}) is set to the previous result - f(${vertex}+1) = ${this.logic.subsequent_results[this.logic.n-vertex]} - the colors from already existing connected components are retained in the result, the question is, how many colors are present in both (just merged) connected components - this amount will be subtracted from the result.`;
		}
		if (s[0]==2){
			var vertex = s[1];
			var operation = this.logic.operation_per_vertex[vertex];
			var primary = `Now, we check, which set is bigger, and, if the parent is associated with a smaller set, we swap them. `;
			
			var secondary;
			if (operation[2]) secondary = `Guess what - the size of the set associated with a vertex ${vertex} (size equal to ${operation[0].size}) is bigger than the size of the set associated with its parent - par(${vertex}) = ${this.logic.tree.par[vertex]} (size equal to ${operation[1].size}). And so, we swap those sets. The crucial thing is to do it in O(1) - for example, swapping sets by reference.`;
			else secondary = `The size of the set associated with a vertex ${vertex} (size equal to ${operation[0].size}) is smaller or equal to the size of the set associated with its parent - par(${vertex}) = ${this.logic.tree.par[vertex]} (size equal to ${operation[1].size}). And so, we don't swap those sets.`;
			return primary + secondary;
		}
		
		if (s[0]==3 || s[0]==4){
			var vertex = s[1];
			var index = s[2];
			var operation = this.logic.operation_per_vertex[s[1]];
			var next_operation = [...operation[+operation[2]]];

			var start = `Next, it is checked, whether next element from the set associated with the vertex belongs to the set associated with its parent. `;
			var ending;
			if (s[0]==4) ending = `Clearly, ${next_operation[index]} does not belong to the set associated with the parent of this vertex. Thus, we add this element to the set associated with the parent of this vertex.`;
			if (s[0]==4) ending = `Clearly, ${next_operation[index]} already belong to the set associated with the parent of this vertex. Thus, we subtract one from the current result.`;
			return start+ending;
		}
		if (s[0] == 101) return `And so, all the sums of sizes of distinct sets after each merge of two connected components were found, and so the algorithm ends.`;
	}
}
export default Small_to_large;
