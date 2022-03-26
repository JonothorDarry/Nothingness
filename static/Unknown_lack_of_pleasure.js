class Separat extends Partial{
	_presentation_create_arrow(div, sgn){
		var arrow = Modern_representation.button_creator('', {});
		for (var x of div.style) arrow.style[x] = div.style[x];
		var rotation = parseFloat(div.style.transform.slice(7, div.style.transform.length-5));
		arrow.style.transform = `rotate(${(sgn==1) ? rotation+Math.PI/4 : rotation-Math.PI/4}rad)`;
		arrow.style.width = `6px`;
		return arrow
	}

	_presentation_create_subedge(div, left){
		var e = Modern_representation.button_creator('', {});
		for (var x of div.style) e.style[x] = div.style[x];
		var dist = parseFloat(div.style.left.slice(0, div.style.left.length-1));
		var width = parseFloat(div.style.width.slice(0, div.style.width.length-2));

		e.style.left = `${dist+((left==1) ? (-10) : 10)}%`;
		e.style.width = `${width*7/8}px`;

		return e;
	}

	_presentation_generate_parallel(place, ideal, left, orientation=1){
		var e2;
		if (orientation==1) e2 = this.buttons.edges[ideal];
		else{
			var tr = this.tree_presentation;
			e2 = Graph_utils.create_edge(tr.parameters.vertexes[tr.tree.par[ideal]], tr.parameters.vertexes[ideal], {'height':2, 'backgroundColor':'#FFFFFF'}, {'width':tr.width, 'height':tr.height});
		}

		var e2_parallel = this._presentation_create_subedge(e2, left);
		place.appendChild(e2_parallel);

		var e2_arrow_1 = this._presentation_create_arrow(e2_parallel, 1);
		var e2_arrow_2 = this._presentation_create_arrow(e2_parallel, -1);
		place.appendChild(e2_arrow_1);
		place.appendChild(e2_arrow_2);
	}

	presentation(){
		this.buttons = {};
		this.place.style.width='max-content';
		this.place.style.backgroundColor='#000000';

		var width=180, height=180;
		Modern_representation.button_modifier(this.place, {'stylistic':{'general':{'position':'relative'}, 'px':{'width':width, 'height':height}}});
		
		var tree_show = new Modern_tree_presenter(this.logic.tree, {'div':this.place, 'width':width, 'height':height}, {
			'vertex':{'width':8, 'height':8, 'radius':100, 'label':'none'},
			'edge':{'height':2, 'backgroundColor':'#FFFFFF'},
			'nonsense':this.stylistic
		});

		this.tree_presentation = tree_show;
		this.buttons.vertexes = tree_show.buttons.vertexes;
		this.buttons.edges = tree_show.buttons.edges;
		for (var i=1; i<=this.logic.tree.n; i++) {
			this.Painter(this.buttons.vertexes[i], 4);
		}


		this._presentation_generate_parallel(this.place, 3, 1, -1);
		this._presentation_generate_parallel(this.place, 5, 1, -1);

		this._presentation_generate_parallel(this.place, 3, 0);
		this._presentation_generate_parallel(this.place, 4, 0);

		console.log(this.place.innerHTML);
		//var e3 = e2;
	}

	read_data(){
		this.logic.edges = [[1, 2], [1, 3], [3, 4], [3, 5]];
	}

	logical_box(){
		this.logic.tree = new Modern_tree(this.logic.edges);
	}

	ShowReality(){
		this.starter();
		this.read_data();
		this.logical_box();
		this.presentation();
	}

	constructor(block){
		super(block);
		this.logic.edges = [[1, 2], [1, 3], [3, 4], [3, 5]];
		this.logical_box();
		this.presentation();
	}
}

var feral3=Partial.ObjectParser(document.getElementById('Algo3'));
var sk3=new Separat(feral3);
