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
				this.Painter(ite_btn, 0); //TODO: Painter removal

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

class DoubleWalk extends Algorithm{ //Non-working example
	_logical_solution(){
	}

	_logical_marker(){
		this.logic.is_marked = ArrayUtils.steady(this.logic.tree.n+1, 0);
		for (var x of this.logic.marked) this.logic.is_marked[x] = 1;
	}

	logical_box(){
		var stack = [1], operations = [1];
		this.logic.Inf = -1000000000;
		var a, b, i, tr = this.logic.tree.tr, n=this.logic.tree.n, Inf=this.logic.Inf
		var ij = ArrayUtils.steady(n+1, 0);
		var par = ArrayUtils.steady(n+1, 0);
		var stacked = ArrayUtils.steady(n+1, 0);
		var longest_distances = ArrayUtils.steady(n+1, 0).map(x => [[Inf, Inf]]);
		var furthest_vertex = ArrayUtils.steady(n+1, 0).map(x => [['', '']]);
		this._logical_marker();

		this.logic.apre=[1];
		for (var x of this.logic.marked){
			longest_distances[x] = [[0, Inf]];
			furthest_vertex[x] = [[x, ``]];
		}

		//basic pass
		var opera, local_longer, outer_longer;
		while (stack.length > 0){
			a = stack[stack.length-1];

			if (ij[a] >= tr[a].length){
				local_longer = ArrayUtils.get_elem(longest_distances[a], -1);
				var past_vertex = ArrayUtils.get_elem(furthest_vertex[par[a]], -1)[0];

				if (par[a] != 0){
					outer_longer = ArrayUtils.get_elem(longest_distances[par[a]], -1);
					if (local_longer[0] == Inf){
						opera = "<<" //Do nothing
					}
					else if (local_longer[0]+1 <= outer_longer[1]){
						opera = "<2" //Do nothing
					}

					else if (local_longer[0]+1 <= outer_longer[0]){
						longest_distances[par[a]].push([outer_longer[0], local_longer[0]+1]);
						furthest_vertex[par[a]].push([past_vertex, a]);

						opera = "<1"; //Push last
					}

					else{
						longest_distances[par[a]].push([local_longer[0]+1, outer_longer[0]]);
						furthest_vertex[par[a]].push([a, past_vertex]);

						opera = "<0"; //Push first
					}
				}

				else opera = "<"; //Move back

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
				this.logic.apre.push(b);
				par[b] = a;
				ij[a]+=1;
			}
		}

		//Inverse preorder pass
		var to_pass, op2, past_vertex;
		for (a of this.logic.apre){
			if (a==1) continue;

			local_longer = ArrayUtils.get_elem(longest_distances[par[a]], -1);
			outer_longer = ArrayUtils.get_elem(longest_distances[a], -1);
			var last = ArrayUtils.get_elem(furthest_vertex[par[a]], -1)[0];
			past_vertex = ArrayUtils.get_elem(furthest_vertex[a], -1)[0];

			if (last == a) to_pass = local_longer[1], op2=1;
			else to_pass = local_longer[0], op2=0;

			if (to_pass == Inf) opera = ">>" //Do nothing
			else if (to_pass+1 <= outer_longer[1]) opera = ">2" //Other do nothing

			else if (to_pass+1 <= outer_longer[0]){
				longest_distances[a].push([outer_longer[0], to_pass+1]);
				furthest_vertex[a].push([past_vertex, par[a]]);
				opera = ">1"; //Push last
			}

			else{
				longest_distances[a].push([to_pass+1, outer_longer[0]]);
				furthest_vertex[a].push([par[a], past_vertex]);

				opera = ">0"; //Push first
			}

			operations.push([`${opera}${op2}`, a]);
		}

		this.logic.longest_distances = longest_distances;
		this.logic.operations = operations;
		this.logic.furthest_vertex = furthest_vertex;

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
				this.Painter(ite_btn, 0); //TODO: Painter removal

				this.buttons.iterator_edge_list[i].push(ite_btn);
				this.buttons.edge_list[i][j].appendChild(ite_btn);
			}
		}
	}

	_presentation_mark_marked(){
		for (var i=1; i <= this.logic.tree.n; i++){
			if (this.logic.is_marked[i] == 0) continue;
			Modern_representation.button_modifier(this.buttons.vertexes[i], {'stylistic':{'general':{'borderWidth':'10px', 'borderStyle':'solid', 'borderColor':'#804000'}}});
		}
	}

	presentation_create_tree(){
		var width = 200*this.logic.tree.get_width(), height = 160*this.logic.tree.get_height();
		var div_tree = Modern_representation.div_creator('', {'px':{'width':width, 'height':height}});
		Modern_representation.button_modifier(div_tree, {'general':{'display':'inline-block'}});
		var present_tree = new Modern_tree_presenter(this.logic.tree, {'div':div_tree, 'width':width, 'height':height}, {
			'vertex':{'width':40, 'height':40, 'radius':100},
			'edge':{'height':2},
			'nonsense':this.stylistic
		});
		this.buttons.vertexes = present_tree.buttons.vertexes;
		this.buttons.edges = present_tree.buttons.edges;
		this.buttons.longest_distances = ArrayUtils.steady(this.logic.tree.n+1, 0).map(x => [null, null]);
		this.buttons.furthest_vertex = ArrayUtils.steady(this.logic.tree.n+1, null);

		var platz, btn_far, btn_dist, i, j;
		for (i=1; i<=this.logic.tree.n; i++){
			for (j=1; j<=2; j++){
				platz = present_tree.get_place_for_companion_button(i, j, 1);
				btn_dist = Modern_representation.button_creator(0, {'general':{'position':'absolute', 'left':platz.left, 'top':platz.top}, 'px':{'width':20, 'height':20}});
				Representation_utils.Painter(btn_dist, 0);
				div_tree.appendChild(btn_dist);
				this.buttons.longest_distances[i][j-1] = btn_dist;
			}

			platz = present_tree.get_place_for_companion_button(i, 1, 2);
			btn_far = Modern_representation.button_creator(0, {'general':{'position':'absolute', 'left':platz.left, 'top':platz.top}, 'px':{'width':20, 'height':20}, '%':{'borderRadius':100}});
			Representation_utils.Painter(btn_far, 0);
			div_tree.appendChild(btn_far);
			this.buttons.furthest_vertex[i] = btn_far;
		}
		this._presentation_mark_marked();

		return div_tree;
	}

	presentation(){
		var div = Modern_representation.div_creator('', {'general':{'position':'relative', 'display':'block'}, 'px':{'width':1, 'height':20}}); //Serve as margin
		this.place.appendChild(div);

		this.buttons = {};
		var div_tree = this.presentation_create_tree();
		div_tree.style.display='inline-block';

		this.place.appendChild(div_tree);
		this.presentation_create_stack();

		this.place.style.width = 'max-content';
	}

	statial(){
		this._statial_binding('longest_distance_1', this.logic.longest_distances.map(v => v.map(x => ((x[0] == this.logic.Inf) ? '-&infin;' : x[0]))),
			this.buttons.longest_distances.map(x => (x!=null) ? x[0] : null)
		);

		this._statial_binding('longest_distance_2', this.logic.longest_distances.map(v => v.map(x => ((x[1] == this.logic.Inf) ? '-&infin;' : x[1]))),
			this.buttons.longest_distances.map(x => x[1])
		);
		this._statial_binding('furthest_vertex_1', this.logic.furthest_vertex.map(v => v.map(x => x[0])), this.buttons.furthest_vertex);
		this._statial_binding('furthest_vertex_2', this.logic.furthest_vertex.map(v => v.map(x => x[1])), ArrayUtils.steady(this.logic.tree.n, null));
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

		var k=c.get_next();
		this.logic.marked = [];
		for (i=0; i<k; i++) this.logic.marked.push(c.get_next());

		this.logic.tree = new Modern_tree(edges);
	}

	constructor(block, edges, marked){
		super(block);
		this.logic.tree = new Modern_tree(edges);
		this.logic.marked = marked;

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
			for (var x=1; x<=this.logic.tree.n; x++){
				staat.push([0, this.buttons.longest_distances[x][0], 8]);
			}
			return;
		}

		var op=s[1], a = this.logic.operations[op][1];
		var para = this.logic.tree.par[a], b;

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
			var type = this.logic.operations[op];
			if (a==1){
				staat.push([0, this.buttons.vertexes[a], ((this.logic.is_marked[1]) ? 2 : 7)]);
				return;
			}

			staat.push([0, this.buttons.vertexes[this.logic.tree.par[a]], 15]);
			if (type[0][1] != '0') staat.push([0, this.buttons.vertexes[a], 6]);
			if (type[0][1] == '0'){
				this.pass_color(this.buttons.longest_distances[para][0], 0, [13, 14], 0);
				this.pass_color(this.buttons.furthest_vertex[para], 0, 12, 0);
				this.pass_color(this.buttons.vertexes[a], 15, 12, 6);
			}
			if (type[0][1] == '1') this.pass_color(this.buttons.longest_distances[para][1], 0, [13, 14], 0);

			this.pass_color(this.buttons.longest_distances[a][0], 0, 14, 0);

			if (this.state.longest_distance_1[a].current() >= 0){
				var b = this.state.furthest_vertex_1[a].current();
				while (true){
					this.pass_color(this.buttons.edges[b], 5, 14, 5);
					if (b == this.state.furthest_vertex_1[b].current()) break;
					b = this.state.furthest_vertex_1[b].current();
				}
			}

			if (type[0][1] != '<') this.pass_color(this.buttons.edges[a], 5, 13, 5);
			if (type[0][1] == '0' || type[0][1] == '1'){
				staat.push([6, this.state.longest_distance_1[para]]);
				staat.push([6, this.state.longest_distance_2[para]]);

				staat.push([6, this.state.furthest_vertex_1[para]]);
				staat.push([6, this.state.furthest_vertex_2[para]]);
			}
		}

		if (s[0]==3){
			var ite = this.state.tree_iterators[a].iterator;
			if (ite+1 < this.state.tree_iterators[a].values.length) staat.push([0, this.buttons.iterator_edge_list[a][ite+1], 15]);
			staat.push([0, this.buttons.iterator_edge_list[a][ite], 4]);
			staat.push([0, this.buttons.edge_list[a][ite], 2]); //Possibly unnecessary

			staat.push([6, this.state.tree_iterators[a]]);
		}

		if (s[0] == 4){
			if (this.logic.is_marked[a]) this.pass_color(this.buttons.vertexes[a], 6, 15, 2);
			else this.pass_color(this.buttons.vertexes[a], 6, 15, 7);
			if (a==1) return;

			var type = this.logic.operations[op];

			var starting_vertex;
			if (type[0][2] == '0'){
				this.pass_color(this.buttons.longest_distances[para][0], 0, 14, 0);
				starting_vertex = this.state.furthest_vertex_1[para];
			}

			else{
				this.pass_color(this.buttons.longest_distances[para][1], 0, 14, 0);
				starting_vertex = this.state.furthest_vertex_2[para];
			}
			

			this.pass_color(this.buttons.furthest_vertex[para], 0, 14, 0);

			if (type[0][1] == '0'){
				this.pass_color(this.buttons.longest_distances[a][0], 0, [13, 14], 0);
				this.pass_color(this.buttons.vertexes[para], (this.logic.is_marked[para]?2:7), 12, (this.logic.is_marked[para]?2:7));
				this.pass_color(this.buttons.furthest_vertex[a], 0, 12, 0);
				staat.push([6, this.state.furthest_vertex_1[a]]);
				staat.push([6, this.state.furthest_vertex_2[a]]);
			}

			else if (type[0][1] == '1') this.pass_color(this.buttons.longest_distances[a][1], 0, [13, 14], 0);

			var prev;
			if (starting_vertex.current()){
				b = this.logic.tree.par[a];
				this.pass_color(this.buttons.edges[a], 5, 13, 5);

				prev = a;
				var next_full;
				while (true){
					next_full = this.state.furthest_vertex_1[b].current();
					if (next_full == prev) next_full = this.state.furthest_vertex_2[b].current();

					if (this.logic.tree.par[b] != next_full) break;
					this.pass_color(this.buttons.edges[b], 5, 14, 5);

					prev = b;
					b = next_full;
				}
				prev = b;
				b = next_full;

				while (b != prev){
					next_full = this.state.furthest_vertex_1[b].current();
					if (next_full == prev) next_full = this.state.furthest_vertex_2[b].current();

					this.pass_color(this.buttons.edges[b], 5, 14, 5);
					prev = b;
					b = next_full;
				}
			}

			if (type[0][1] == '0' || type[0][1] == '1'){
				staat.push([6, this.state.longest_distance_1[a]]);
				staat.push([6, this.state.longest_distance_2[a]]);
			}

		}
	}

	NextState(){
		var l=this.lees.length;
		var s=this.lees[l-1], op=s[1];

		if (s[0]>=100 || op+1 >= this.logic.operations.length) return [100];
		if (this.logic.operations[op+1][0] == 'R') return [3, op+1];
		if (this.logic.operations[op+1][0][0] == '<') return [2, op+1];
		if (this.logic.operations[op+1][0][0] == '>') return [4, op+1];
		return [1, op+1];
	}

	StatementComprehension(){
		var s=this.lees[this.state_nr], x=s[1];

		var op = this.logic.operations[s[1]];
		if (s[0] == 0) return `As the algorithm starts, we shall start a tree penetration from an arbitrary vertex - that is, vertex number 1.`;
		if (s[0] == 1) return `As in any standard depth first search, we move downwards, adding the next vertex (${op[1]}) to the stack, and move further the pointer of its parent: ${this.logic.tree.par[op[1]]}.`
		if (s[0] == 3) return `Now, our pointer for last element on stack points towards its father, previous element on stack - thus, we increment pointer.`
		if (s[0] == 2){
			var a = op[1];
			if (a == 1) return `The first part of the algortihm is done - now, what remains is top-down penetration.`
			var par = this.logic.tree.par[op[1]];
			var str = `Now, all descendants of this vertex - ${a} - were processed, and so, it has to be removed from the stack. Now - should we update its parent's longest distances to marked vertices?`;
			var str_endet=``;
			if (op[0][1] == '<') str_endet = `No - the vertex ${a} does not have any marked vertex in its subtree.`

			else if (op[0][1] == '2') str_endet = `No - the length of longest path from ${a} to a marked vertex with 1 added (path to parent) to a marked vertex is smaller than the current second longest path coming down from its parent (${par}) - length of a path coming down through ${a} is equal to ${this.state.longest_distance_1[a].current()}, while the length of the second longest path coming down from ${par} is equal to ${this.state.longest_distance_2[par].current()}.`;
			else if (op[0][1] == '1') str_endet = `Yes - the length of longest path from ${a} to a marked vertex with 1 added (path to parent) is greater than the current second longest path coming down from its parent (${par}) and lower than the longest path coming down from its parent - length of a path coming down through ${a} is equal to ${this.state.longest_distance_1[a].current()+1}, while the length of the second longest path coming down from ${par} is equal to ${this.state.longest_distance_2[par].current()}. Thus, we update length of a second longest path coming down from ${par} to ${this.state.longest_distance_1[a].current()}+1 = ${this.state.longest_distance_1[a].current()+1}.`;
			else if (op[0][1] == '0') str_endet = `Yes - the length of longest path from ${a} with 1 added (path to parent) to a marked vertex is greater than the current longest path coming down from its parent (${par}) - length of a path coming down through ${a} is equal to ${this.state.longest_distance_1[a].current()+1}, while the length of the longest path coming down from ${par} is equal to ${this.state.longest_distance_1[par].current()}. Thus, we swap first and second longest paths coming down from ${par}, and then we update length of the longest path coming down from ${par} to ${this.state.longest_distance_1[a].current()}+1 = ${this.state.longest_distance_1[a].current()+1}. Also, we change the indice of a vertex on a longest path from ${par} to ${a}.`;
			return str + ' ' + str_endet;
		}

		if (s[0] == 4){
			var a = op[1];
			var par = this.logic.tree.par[op[1]];
			var str_1 = `As for now, we want to find longest path to a marked vertex from ${a} going upwards. Now, there are three questions: first, which vertex shall be used? one can either do a second dfs-run, or one can use the same order of visiting as in first dfs, choice is up to you.`;

			var str_2 = str_1 + ` The second question: to find out, whether we can use vertex leading to greatest distance from parent or not.`;
			var value=-1;
			if (op[0][1] == '>') {
				return str_2 + ' No marked vertex exists in this tree, however - everything we do is devoid of meaning. Time to solve some other problem, perhaps?';
			}
			else if (op[0][2] == '0'){
				str_2 = str_2 + ` The answer is yes - ${a} is different than ${this.state.furthest_vertex_1[par].current()}, so we can use a distance equal to ${this.state.longest_distance_1[par].current()}.`
				value = this.state.longest_distance_1[par].current();
			}
			else{
				str_2 = str_2 + ` The answer is no - ${a} is equal to than ${this.state.furthest_vertex_1[par].current()}, so we have to use a distance equal to ${this.state.longest_distance_2[par].current()}.`
				value = this.state.longest_distance_2[par].current();

			}

			var str_3 = str_2 + ` The last question: should we update anythin'?`
			if (op[0][1] == '2') str_3 = str_3 + ` No: ${value+1} < ${this.state.longest_distance_2[a].current()}.`;
			if (op[0][1] == '1') str_3 = str_3 + ` Yes: ${value+1} &ge; ${this.state.longest_distance_2[a].previous()}, so we can update the second longest distance.`;
			if (op[0][1] == '0') str_3 = str_3 + ` Yes: ${value+1} &ge; ${this.state.longest_distance_1[a].previous()}, so we can update the longest distance, and, along with it, path to furthest vertex, swapping longest and second longest distances beforehand.`;

			return str_3;
		}
		if (s[0] == 100) return `And so, all the longest paths to marked vertices in the tree were found, the algorithm ends.`;
	}
}

var feral=Algorithm.ObjectParser(document.getElementById('Algo1'));
var eg1=new DiamFinder(feral, [[1, 2], [1, 3], [3, 4], [4, 5], [3, 6], [3, 7], [7, 8]]);

 var feral2=Algorithm.ObjectParser(document.getElementById('Algo2'));
 var eg2=new DoubleWalk(feral2, [[1, 2], [2, 3], [3, 4], [4, 5], [2, 6], [6, 7]], [1, 4, 7]);
