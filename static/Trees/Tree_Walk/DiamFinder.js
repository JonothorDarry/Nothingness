import Algorithm from '../../Base/Algorithm.js';
import ArrayUtils from '../../Base/ArrayUtils.js';
import Modern_representation from '../../Base/Modern_representation.js';
import Representation_utils from '../../Base/Representation_utils.js';
import Grid from '../../Base/Grid.js';
import Modern_tree from '../../Base/Modern_tree.js';
import Modern_tree_presenter from '../../Base/Modern_tree_presenter.js';

class DiamFinder extends Algorithm{
	_logical_solution(){
		this.logic.solution_value=0;
		this.logic.solution_vertex=0;

		var summa=0;
		for (var i=1; i<=this.logic.tree.n; i++){
			summa = ArrayUtils.get_elem(this.logic.diameters[i], -1).reduce((acc, e) => acc+e, 0);
			if (summa > this.logic.solution_value){
				this.logic.solution_value = summa;
				this.logic.solution_vertex = i;
			}
		}
	}

	logical_box(){
		var stack = [1], operations = [1];
		var a, b, i, tr = this.logic.tree.tr, local_diam, outer_diam, n=this.logic.tree.n;
		var ij = ArrayUtils.steady(n+1, 0);
		var par = ArrayUtils.steady(n+1, 0);
		var stacked = ArrayUtils.steady(n+1, 0);
		var diameter_vertex = ArrayUtils.steady(n+1, 0).map(x => [0, 0]);
		var diameters = ArrayUtils.steady(n+1, 0).map(x => [[0,0]]);

		var opera;
		while (stack.length > 0){
			a = stack[stack.length-1];

			if (ij[a] >= tr[a].length){
				local_diam = ArrayUtils.get_elem(diameters[a], -1);
				if (par[a] != 0){
					outer_diam = ArrayUtils.get_elem(diameters[par[a]], -1);
					if (local_diam[0]+1 <= outer_diam[1]){
						opera = "<2" //Do nothing
					}
					else if (local_diam[0]+1 <= outer_diam[0]){
						diameters[par[a]].push([outer_diam[0], local_diam[0]+1]);
						diameter_vertex[par[a]][1] = a;

						opera = "<1"; //Push last
					}
					else{
						diameters[par[a]].push([local_diam[0]+1, outer_diam[0]]);
						diameter_vertex[par[a]][1] = diameter_vertex[par[a]][0];
						diameter_vertex[par[a]][0] = a;

						opera = "<0"; //Push first
					}
				}

				else{
					opera = "<"; //Move back
				}

				operations.push([opera, a]);
				stack.pop();
			}

			else if (tr[a][ij[a]] == par[a]){
				operations.push(["R", a]); //Move nothingness in vertex
				ij[a]+=1;
			}

			else{
				b = tr[a][ij[a]];
				operations.push(["P", b]); //Add stuff to stack
				stack.push(b);
				par[b] = a;
				ij[a]+=1;
			}
		}

		this.logic.diameters = diameters;
		this.logic.operations = operations;
		this.logic.diameter_vertex = diameter_vertex;
		this._logical_solution();
	}


	presentation_create_stack(){
		var table = Representation_utils.proto_divsCreator(1, this.logic.tree.n+3, [], null, this.place, this.stylistic);
		table.full_div.style.display='inline-block';
		this.buttons.edge_list = ArrayUtils.steady(this.logic.tree.n+1, 0).map(x => []);
		this.buttons.iterator_edge_list = ArrayUtils.steady(this.logic.tree.n+1, 0).map(x => []);

		var grid = new Grid(this.logic.tree.n+3, this.logic.tree.n+1, this.stylistic, {'place':table.zdivs, 'top_margin':0, 'left_margin':0});

		var i, j, ite_btn;
		grid.single_filler([0, 0], `Vertex`, {'color':5, 'stylistic':{'px':{'width':80}, 'general':{'borderBottom':'1px solid white'}}});
		grid.single_filler([0, 1], `Adjacent vertexes`, {'color':5, 'stylistic':{'general':{'borderLeft':'1px solid grey', 'borderBottom':'1px solid white'}, 'px':{'width':160}}});

		for (i=1; i<=this.logic.tree.n; i++){
			this.buttons.iterator_edge_list.push([]);
			grid.single_filler([i, 0], `Edges (${i}):`, {'color':5, 'stylistic':{'px':{'width':80}}});
			this.buttons.edge_list[i] = grid.filler([i, [1, this.logic.tree.tr[i].length]], this.logic.tree.tr[i], {'color':0});

			for (j=0; j<this.logic.tree.tr[i].length; j++){
				ite_btn = Modern_representation.button_creator('', {'%':{'borderRadius':100}, 'px':{'height':12, 'width':12}, 'general':{'position':'absolute'}});
				Representation_utils.Painter(ite_btn, 0); //TODO: Painter removal

				this.buttons.iterator_edge_list[i].push(ite_btn);
				this.buttons.edge_list[i][j].appendChild(ite_btn);
			}
		}
	}

	presentation_create_tree(){
		var width = 200*this.logic.tree.get_width(), height = 120*this.logic.tree.get_height();
		var div_tree = Modern_representation.div_creator('', {'px':{'width':width, 'height':height}});
		Modern_representation.button_modifier(div_tree, {'general':{'display':'inline-block'}});
		var present_tree = new Modern_tree_presenter(this.logic.tree, {'div':div_tree, 'width':width, 'height':height}, {
			'vertex':{'width':40, 'height':40, 'radius':100},
			'edge':{'height':2},
			'nonsense':this.stylistic
		});
		this.buttons.vertexes = present_tree.buttons.vertexes;
		this.buttons.edges = present_tree.buttons.edges;
		this.buttons.diameter = ArrayUtils.steady(this.logic.tree.n+1, 0).map(x => [null, null]);

		var platz, btn_diam, i, j;
		for (i=1; i<=this.logic.tree.n; i++){
			for (j=1; j<=2; j++){
				platz = present_tree.get_place_for_companion_button(i, j, 1);
				btn_diam = Modern_representation.button_creator(0, {'general':{'position':'absolute', 'left':platz.left, 'top':platz.top}, 'px':{'width':20, 'height':20}});
				Representation_utils.Painter(btn_diam, 0);
				div_tree.appendChild(btn_diam);
				this.buttons.diameter[i][j-1] = btn_diam;
			}
		}

		return div_tree;
	}

	presentation(){
		this.buttons = {};
		var div_tree = this.presentation_create_tree();
		div_tree.style.display='inline-block';

		this.place.appendChild(div_tree);
		this.presentation_create_stack();

		this.place.style.width = 'max-content';
	}

	statial(){
		this._statial_binding('diameter_1', this.logic.diameters.map(v => v.map(x => x[0])),
			this.buttons.diameter.map(x => (x!=null)?x[0]:null)
		);
		this._statial_binding('diameter_2', this.logic.diameters.map(v => v.map(x => x[1])),
			this.buttons.diameter.map(x => x[1])
		);

		this._statial_binding('tree_iterators', this.logic.tree.tr, ArrayUtils.steady(this.logic.tree.n, null));
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

		this.version=4;
		this.palingenesia();
	}

	BeginningExecutor(){
		this.starter();
		this.read_data();
		this.palingenesia();
		this.lees.push([0, 0]);
	}

	StateMaker(s){
		var staat=[], i;
		var staat=this.ephemeral.staat, passer=this.ephemeral.passer;

		if (s[0] == 100){
			a = this.logic.solution_vertex;
			staat.push([0, this.buttons.diameter[a][0], 8]);
			staat.push([0, this.buttons.diameter[a][1], 8]);

			var b = this.logic.diameter_vertex[a][0];
			while (b != 0){
				staat.push([0, this.buttons.edges[b], 8]);
				b = this.logic.diameter_vertex[b][0];
			}

			var b = this.logic.diameter_vertex[a][1];
			while (b != 0){
				staat.push([0, this.buttons.edges[b], 8]);
				b = this.logic.diameter_vertex[b][0];
			}
			return;
		}

		var op=s[1], a = this.logic.operations[op][1];
		var para = this.logic.tree.par[a];



		if (s[0]==0){
			staat.push([0, this.buttons.vertexes[1], 15]);
			staat.push([0, this.buttons.iterator_edge_list[1][0], 15]);
		}

		if (s[0]==1){
			staat.push([0, this.buttons.vertexes[a], 15]);
			staat.push([0, this.buttons.vertexes[para], 5]);

			var ite = this.state.tree_iterators[para].iterator;
			if (ite+1 < this.state.tree_iterators[para].values.length) staat.push([0, this.buttons.iterator_edge_list[para][ite+1], 15]);
			staat.push([0, this.buttons.iterator_edge_list[para][ite], 4]);
			staat.push([0, this.buttons.iterator_edge_list[a][0], 15]);
			staat.push([0, this.buttons.edge_list[para][ite], 2]); //Possibly unnecessary

			staat.push([6, this.state.tree_iterators[para]]);
		}

		if (s[0]==2){
			staat.push([0, this.buttons.vertexes[a], 7]);
			if (a==1) return;

			staat.push([0, this.buttons.vertexes[this.logic.tree.par[a]], 15]);
			var type = this.logic.operations[op];
			if (type[0][1] == '0') this.pass_color(this.buttons.diameter[para][0], 0, [13, 14], 0);
			if (type[0][1] == '1') this.pass_color(this.buttons.diameter[para][1], 0, [13, 14], 0);

			this.pass_color(this.buttons.diameter[a][0], 0, 14, 0);
			this.pass_color(this.buttons.edges[a], 5, 13, 5);

			var b = this.logic.diameter_vertex[a][0];
			while (b != 0){
				this.pass_color(this.buttons.edges[b], 5, 14, 5);
				b = this.logic.diameter_vertex[b][0];
			}

			if (type[0][1] != '2'){
				staat.push([6, this.state.diameter_1[para]]);
				staat.push([6, this.state.diameter_2[para]]);
			}
		}

		if (s[0]==3){
			var ite = this.state.tree_iterators[a].iterator;
			if (ite+1 < this.state.tree_iterators[a].values.length) staat.push([0, this.buttons.iterator_edge_list[a][ite+1], 15]);
			staat.push([0, this.buttons.iterator_edge_list[a][ite], 4]);
			staat.push([0, this.buttons.edge_list[a][ite], 2]); //Possibly unnecessary

			staat.push([6, this.state.tree_iterators[a]]);
		}
	}

	NextState(){
		var l=this.lees.length;
		var s=this.lees[l-1], op=s[1];

		if (s[0]>=100 || op+1 >= this.logic.operations.length) return [100];
		if (this.logic.operations[op+1][0] == 'R') return [3, op+1];
		if (this.logic.operations[op+1][0][0] == '<') return [2, op+1];
		return [1, op+1];
	}

	StatementComprehension(){
		var s=this.lees[this.state_nr], x=s[1];

		var op = this.logic.operations[s[1]];
		if (s[0] == 0) return `As the algorithm starts, we shall start a tree penetration from an arbitrary vertex - that is, vertex number 1.`;
		if (s[0] == 1) return `As we stumble upon the next unvisited vertex, we are moving towards it, putting it on stack: thus, we add ${op[1]} to the stack, and move further pointer of its parent: ${this.logic.tree.par[op[1]]} (either explicitly - iteratively or implicitly - recursively), as in any normal depth first search.`
		if (s[0] == 3) return `Now, our pointer for last element on stack points towards its father, previous element on stack - thus, we increment pointer.`
		if (s[0] == 2){
			var a = op[1];
			if (a == 1) return `Now, we don't have any continuation in a root - and so, the story ends here, all that has to be done is to find two numbers whose sum is highest among all pairs of paths.`
			var par = this.logic.tree.par[op[1]];
			var str = `Now, all descendants of this vertex - ${a} - were processed, and so, it has to be removed from the stack. Now - should we update its parent's diameter?`;
			var str_endet=``;

			if (op[0][1] == '2') str_endet = `No - the length of longest path from ${a} with 1 added (path to parent) is smaller than the current second longest path coming down from its parent (${par}) - length of a path coming down through ${a} is equal to ${this.state.diameter_1[a].current()}, while the length of the second longest path coming down from ${par} is equal to ${this.state.diameter_2[par].current()}.`;
			if (op[0][1] == '1') str_endet = `Yes - the length of longest path from ${a} with 1 added (path to parent) is greater than the current second longest path coming down from its parent (${par}) and lower than the longest path coming down from its parent - length of a path coming down through ${a} is equal to ${this.state.diameter_1[a].current()+1}, while the length of the second longest path coming down from ${par} is equal to ${this.state.diameter_2[par].current()}. Thus, we update length of a second longest path coming down from ${par} to ${this.state.diameter_1[a].current()}+1 = ${this.state.diameter_1[a].current()+1}.`;
			if (op[0][1] == '0') str_endet = `Yes - the length of longest path from ${a} with 1 added (path to parent) is greater than the current longest path coming down from its parent (${par}) - length of a path coming down through ${a} is equal to ${this.state.diameter_1[a].current()+1}, while the length of the longest path coming down from ${par} is equal to ${this.state.diameter_1[par].current()}. Thus, we swap first and second longest paths coming down from ${par}, and then we update length of the longest path coming down from ${par} to ${this.state.diameter_1[a].current()}+1 = ${this.state.diameter_1[a].current()+1}.`;
			return str + ' ' + str_endet;
		}
		if (s[0] == 100) return `And so, the longest path in a tree - its diameter - was found - its length is equal to ${this.logic.solution_value}, and its highest vertex is ${this.logic.solution_vertex}.`;
	}
}
export default DiamFinder;

