class DiamFinder extends Algorithm{
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
		for (var v=1; v<=this.logic.tree.n; v++){
			this.presentation_append_companion(v, -2, -1, 'pre');
			this.presentation_append_companion(v, -1, -1, this.logic.tree.pre[v], 0);
		}
	}

	presentation_place_sons(){
		for (var v=1; v<=this.logic.tree.n; v++){
			this.presentation_append_companion(v, 2, -1, 'sons');
			this.presentation_append_companion(v, 1, -1, this.logic.tree.sons[v], 0);
		}
	}

	presentation_place_parents(){
		var degree = this.logic.depth_lca;
		this.buttons.lca_parents = ArrayUtils.create_2d(this.logic.tree.n+1, degree+1);

		for (var v=1; v<=this.logic.tree.n; v++){
			for (var i=0; i<=degree; i++){
				this.presentation_append_companion(v, i+1, 2, `&#x2191;<sub>${1<<i}</sub>`);
				this.buttons.lca_parents[v][i] = this.presentation_append_companion(v, i+1, 1, this.logic.lca_parents[v][i], 0);
				Modern_representation.button_modifier(this.buttons.lca_parents[v][i], {'stylistic':{'general':{'borderRadius':'100%'}}});
			}
		}
	}

	presentation_place_arc(){
		var tr = this.buttons.present_tree;
		var a=5, b=1;
		var div = Graph_utils.create_edge(tr.parameters.vertexes[a], tr.parameters.vertexes[b], {'height':2, 'backgroundColor':'#FFFFFF'}, {'width':tr.width, 'height':tr.height});
		Modern_representation.button_modifier(div, {'stylistic':{'general':{'border':'2px dashed #440000', 'zIndex':-3, 'borderRadius':'0 0 100% 100%', 'borderColor': '#FFFFFF #440000 #440000 #440000'}}});
		div.style.height = div.style.width;

		tr.place.appendChild(div);
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
		this.presentation_place_arc();

		return div_tree;
	}

	presentation(){
		this.buttons = {};
		var div_tree = this.presentation_create_tree();
		div_tree.style.display='inline-block';

		this.place.appendChild(div_tree);
		this.place.style.width = 'max-content';
	}

	statial(){
		/*
		this._statial_binding('diameter_1', this.logic.diameters.map(v => v.map(x => x[0])),
			this.buttons.diameter.map(x => (x!=null)?x[0]:null)
		);
		*/
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

	StateMaker(){
		var l=this.lees.length;
		var s=this.lees[l-1], staat=[], i;
		var staat=this.ephemeral.staat, passer=this.ephemeral.passer;
	}

	NextState(){
		var l=this.lees.length;
		var s=this.lees[l-1], op=s[1];

		return [0];
	}

	StatementComprehension(){
		var l=this.lees.length;
		var s=this.lees[l-1], x=s[1];

		return ``;
	}
}

var feral2=Algorithm.ObjectParser(document.getElementById('Algo2'));
var eg2=new DiamFinder(feral2, [[1, 2], [2, 3], [3, 4], [4, 5], [2, 6], [6, 7]], [1, 4, 7]);
