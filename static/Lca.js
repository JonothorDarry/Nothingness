class DiamFinder extends Algorithm{
	logical_box(){
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
		var degree = Math.ceil(Math.log(this.logic.tree.n)/Math.log(2));

		for (var v=1; v<=this.logic.tree.n; v++){
			for (var i=0; i<=degree; i++){
				this.presentation_append_companion(v, i+1, 2, `&#x2191;<sub>${1<<i}</sub>`);
				this.presentation_append_companion(v, i+1, 1, v, 0);
			}
		}
	}

	presentation_create_tree(){
		var width = 200*this.logic.tree.get_width(), height = 200*this.logic.tree.get_height();
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
