class Isomorphic_rooted extends Algorithm{
	div_creator(style){
		var div=document.createElement("DIV");
		div.style.width=style.bs_div_width;
		div.style.height=style.bs_div_height;
		div.style.border=`${style.bs_div_borderSize} solid`;
		div.style.borderColor='red';
		div.style.padding='0px';
		div.style.margin='0';
		div.style.display="inline-block";
		div.style.position='relative';
		div.style.verticalAlign='top';
		return div;
	}

	incorporate_trees(base, subs){
		var i=0, j;
		var counter=base.edge_list.length+1;
		var current_state=[...base.edge_list];

		for (i=0; i<subs.length; i++){
			for (j=0; j<subs[i].edge_list.length; j++){
				current_state.push([subs[i].edge_list[j][0]+counter, subs[i].edge_list[j][1]+counter]);
			}
			current_state.push([1, 1+counter]);
			counter+=subs[i].edge_list.length+1;
		}
		return new Modern_tree(current_state);
	}

	logical_box(){
		var i, j, k, s;
		var next_trees, base_tree, combinato, combinatos, proper_combinato, ij;

		this.logic.trees=ArrayUtils.create_2d(this.logic.n+1, this.logic.n+1);
		this.logic.csc=ArrayUtils.create_2d(this.logic.n+1, this.logic.n+1);

		for (i=0; i<=this.logic.n; i++){
			for (j=0; j<=this.logic.n; j++){
				this.logic.trees[i][j]=[];
			}
		}

		this.logic.trees[1][0]=[new Modern_tree([])];

		for (i=1; i<=this.logic.n; i++){
			if (i>1){
				for (k=1; k<=i; k++){
					for (s=1; s*k<i; s++){
						//For subsequent combinatos...
						combinatos=Combinatorisation.make_system_combinations_repetitions(s+this.logic.csc[k][k-1].length-1, s);
						for (combinato of combinatos){
							proper_combinato=Combinatorisation.combination_repetitions_to_list(combinato);

							for (j=0; j<this.logic.csc[i-k*s][k-1].length; j++){
								base_tree=this.logic.csc[i-k*s][k-1][j];
								next_trees=[];
								for (ij=0; ij<s; ij++){
									next_trees.push(this.logic.csc[k][k-1][proper_combinato[ij]]);
								}
								this.logic.trees[i][k].push(this.incorporate_trees(base_tree, next_trees));
							}
						}
					}
				}
			}

			this.logic.csc[i][0]=[...this.logic.trees[i][0]];
			for (j=1; j<=this.logic.n; j++){
				this.logic.csc[i][j]=[...this.logic.csc[i][j-1], ...this.logic.trees[i][j]];
			}
		}
	}

	presentation(){
		var elems=this.modern_divsCreator(1, this.logic.n+1, []);
		var siege_place=elems.zdivs, border_div=3, i, j, ij;
		this.buttons={'isomorphic_numbers':ArrayUtils.create_2d(this.logic.n+1, this.logic.n+1), 'trees':ArrayUtils.create_2d(this.logic.n+1, this.logic.n+1)};

		var tree_vertex_twice_radius=10;
		var number_width=20, tree_width=30*this.logic.n, tree_height=30*this.logic.n; //Change adequately later

		var mx_list, full_mx=0;
		for (i=0; i<=this.logic.n; i++){
			mx_list=this.logic.trees[i].map(e => e.length);
			full_mx=Math.max(full_mx, ...mx_list);
		}
		var sqrt_width=Math.ceil(Math.sqrt(full_mx));

		var dh=tree_width*sqrt_width+number_width+2*border_div;
		var div_width=dh-2*border_div;

		for (i=1; i<=this.logic.n; i++){
			elems.divs[i].style.height=`${dh}px`;
			elems.divs[i].style.position='relative';

			for (j=0; j<i; j++){
				//Tutaj nie dociera drzewo
				var div=this.div_creator({'bs_div_width':`${div_width}px`, 'bs_div_height':`${div_width}px`, 'bs_div_borderSize':`${border_div}px`});
				var btn=this.buttCreator(this.logic.trees[i][j].length);

				//sanitize
				btn.style.position='absolute';
				btn.style.top='0px';
				btn.style.right='0px';
				btn.style.width=`${number_width}px`;
				btn.style.height='20px';

				div.appendChild(btn);
				siege_place[i].buttons.appendChild(div);
				this.buttons.isomorphic_numbers[i][j]=btn;

				var all_alocated_trees=this.logic.trees[i][j].length;

				this.buttons.trees[i][j]=[];
				for (ij=0; ij<this.logic.trees[i][j].length; ij++){
					var post_div=this.div_creator({'bs_div_width':`${tree_width}px`, 'bs_div_height':`${tree_height}px`, 'bs_div_borderSize':'0px'});
					//post_div.style.backgroundColor='blue';
					div.appendChild(post_div);

					this.buttons.trees[i][j].push(post_div);
				}

				for (ij=0; ij<this.logic.trees[i][j].length; ij++){
					var post_div = this.buttons.trees[i][j][ij]
					var tree = this.logic.trees[i][j][ij];
					//var tree=new Modern_tree([[1,2],[2,3],[2,4]]);

					var lambda = new Modern_tree_presenter(tree, 
						{'div':post_div, 'width':tree_width, 'height':tree_width}, 

						{
							'vertex':{'width':tree_vertex_twice_radius, 'height':tree_vertex_twice_radius, 'radius':100, 'label':'none'},
							'edge':{'height':1},
							'nonsense':this.stylistic
						}
					);
				}
			}
		}
	}

	palingnesia(){
		this.logical_box();
		this.presentation();
	}

	read_data(){
		var fas=this.input.value;
		var c=this.dissolve_input(fas);
		this.logic.n=c.get_next();
	}

	constructor(block, n){
		super(block);
		this.place.style.width=`max-content`;
		this.logic.n=n;
		this.version=4;
		this.palingnesia();
	}

	BeginningExecutor(){
		this.read_data();
		console.log(this.logic.n);
		this.palingnesia();
		this.lees.push([0]);
	}

	
	StateMaker(){
		var l=this.lees.length;
		var s=this.lees[l-1], staat=[], i;
		var staat=this.ephemeral.staat, passer=this.ephemeral.passer;
	}

	NextState(){
		var l=this.lees.length;
		var s=this.lees[l-1];

		if (s[0]==0) return [100];
	}

	StatementComprehension(){
		var l=this.lees.length;
		var s=this.lees[l-1], x=s[1];

		if (s[0]==0) return `Whatever`;
	}
}

class Encode_prufer extends Algorithm{
	logical_box(){
		this.logic.tree.encode_prufer();
	}

	presentation(){
		var buttons={'prufer':[], 'iterator':[]};

		var treeDiv=document.createElement("DIV");
		treeDiv.style.position="relative";
		treeDiv.style.width=`1300px`;
		treeDiv.style.display="inline-block";
		treeDiv.style.height=`1300px`;

		this.tree_presentation = new Modern_tree_presenter(this.logic.tree, 
			{'div':treeDiv, 'width':1300, 'height':1300}, 
			{
				'vertex':{'width':40, 'height':40, 'radius':100},
				'edge':{'height':2},
				'nonsense':this.stylistic
			}
		);
		this.place.appendChild(treeDiv);

		//var itera_div = Modern_representation.div_creator('', {'px':{'height':40}})
		var super_div = document.createElement("DIV");

		var system = [
			['Iterator: ', ArrayUtils.range(1, this.logic.tree.n), 'iterator'],
			['Current degree: ', this.logic.tree.tr.slice(1).map(e => e.length), 'degree'],
			['Prufer sequence: ', this.logic.tree.prufer_code, 'prufer'],
		];
		for (var x of system){
			var div = Modern_representation.div_creator('', {'general':{'display':null}});
			super_div.appendChild(div);
			var title = Modern_representation.button_creator(x[0], {'px':{'width':200}});
			Representation_utils.Painter(title, 5);
			div.appendChild(title);
			buttons[x[2]] = Modern_representation.fill_with_buttons_horizontal({'general':{'backgroundColor':'#440000'}}, div, x[1], 0);
		}

		this.place.appendChild(super_div);
		this.buttons=buttons;
	}

	palingenesia(){
		this.logical_box();
		this.presentation();
	}

	read_data(){
		var fas=this.input.value;
		var c=this.dissolve_input(fas);
		var edges = Modern_tree.tree_reader(c);
		this.logic.tree = new Modern_tree(edges, edges.length+1);
	}

	constructor(block, n, edges){
		super(block);
		this.logic.tree = new Modern_tree(edges, edges.length+1);

		this.version=4;
		this.palingenesia();
	}

	BeginningExecutor(){
		this.read_data();
		this.palingenesia();
		if (this.logic.tree.prufer_removed[0]!=1) this.lees.push([2, 1, 0]);
		else this.lees.push([1, 1, 0]);
	}

	StateMaker(){
		var l=this.lees.length;
		var s=this.lees[l-1], staat=[], i;
		var staat=this.ephemeral.staat, passer=this.ephemeral.passer;

		if (s[0]==1){
			this.pass_color(this.buttons.prufer[s[2]-1], 4, 1, 8);
			this.pass_color(this.buttons.iterator[s[1]-1], 0, 1, 2);
			this.pass_color(this.buttons.degree[s[1]-1], 0, 14, 2);
			passer.push([1, this.buttons.degree[s[1]-1], 1, 0]);

			var deg = this.buttons.degree[this.logic.tree.par[s[1]]-1].innerHTML;
			passer.push([1, this.buttons.degree[this.logic.tree.par[s[1]]-1], deg, deg-1]);
		}
		if (s[0]==2){
			this.pass_color(this.buttons.iterator[s[1]-1], 0, 15, 0);
			this.pass_color(this.buttons.degree[s[1]-1], 0, 14, 0);
		}

		if (s[0]==3){
			this.pass_color(this.buttons.iterator[s[3]-1], 0, 1, 2);
			this.pass_color(this.buttons.iterator[s[1]], 0, 15, 0);
			this.pass_color(this.buttons.prufer[s[2]-1], 4, 1, 8);
			this.pass_color(this.buttons.degree[s[3]-1], 0, 14, 2);

			passer.push([1, this.buttons.degree[s[3]-1], 1, 0]);
			var deg = this.buttons.degree[this.logic.tree.par[s[3]]-1].innerHTML;
			passer.push([1, this.buttons.degree[this.logic.tree.par[s[3]]-1], deg, deg-1]);
		}
	}

	NextState(){
		var l=this.lees.length;
		var s=this.lees[l-1];
		
		if (s[2] >= this.logic.tree.prufer_removed.length) return [100];
		if (s[1]+1 == this.logic.tree.prufer_removed[s[2]]) return [1, s[1]+1, s[2]+1];
		if (s[1] < this.logic.tree.prufer_removed[s[2]]) return [2, s[1]+1, s[2]];

		//3 - zejście do ojca
		if (s[0]==1) return [3, s[1], s[2]+1, this.logic.tree.par[s[1]]]
		else return [3, s[1], s[2]+1, this.logic.tree.par[s[3]]];
	}

	StatementComprehension(){
		var l=this.lees.length;
		var s=this.lees[l-1], x=s[1];

		if (s[0]==0) return `Whatever`;
	}
}

var feral=Algorithm.ObjectParser(document.getElementById('Algo1'));
var eg1=new Isomorphic_rooted(feral, 5);

var feral2=Algorithm.ObjectParser(document.getElementById('Algo2'));
var eg2=new Encode_prufer(feral2, 8, [[1, 2], [1, 3], [3, 4], [4, 5], [3, 6], [3, 7], [7, 8]]);
