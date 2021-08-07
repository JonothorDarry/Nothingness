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
		var siege_place=elems.zdivs, dh=600, border_div=3, i, j, ij;
		var div_width=dh-2*border_div;
		this.buttons={'isomorphic_numbers':ArrayUtils.create_2d(this.logic.n+1, this.logic.n+1), 'trees':ArrayUtils.create_2d(this.logic.n+1, this.logic.n+1)};
		var number_width=20, tree_width=200, tree_height=200; //Change adequately later

		for (i=1; i<=this.logic.n; i++){
			elems.divs[i].style.height=`${dh}px`;
			elems.divs[i].style.position='relative';

			for (j=0; j<i; j++){
				//Tutaj nie dociera drzewo
				var bad_place=-1;
				var div=this.div_creator({'bs_div_width':`${div_width}px`, 'bs_div_height':`${div_width}px`, 'bs_div_borderSize':`${border_div}px`});
				var btn=this.buttCreator(12); //blotka

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

				if (Math.floor(div_width/tree_width) <= all_alocated_trees) {
					bad_place=Math.floor(div_width/tree_width)-1;
					all_alocated_trees+=1;
				}

				this.buttons.trees[i][j]=[];
				for (ij=0; ij<all_alocated_trees; ij++){
					var post_div=this.div_creator({'bs_div_width':`${tree_width}px`, 'bs_div_height':`${tree_height}px`, 'bs_div_borderSize':'0px'});
					//post_div.style.backgroundColor='blue';
					div.appendChild(post_div);

					if (ij!=bad_place)
						this.buttons.trees[i][j].push(post_div);
					else
						post_div.style.visibility='hidden';
				}

				for (ij=0; ij<this.logic.trees[i][j].length; ij++){
					var post_div = this.buttons.trees[i][j][ij]
					var tree = this.logic.trees[i][j][ij];
					//var tree=new Modern_tree([[1,2],[2,3],[2,4]]);

					var lambda = new Modern_tree_presenter(tree, 
						{'div':post_div, 'width':tree_width, 'height':tree_width}, 

						{
							'vertex':{'width':20, 'height':20, 'radius':100, 'label':'none'},
							'edge':{'height':2},
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
		this.palingnesia();
		this.lees.push([0]);
	}

	
	StateMaker(){
		var l=this.lees.length;
		var s=this.lees[l-1], staat=[], i;
		var staat=this.ephemeral.staat, passer=this.ephemeral.passer;

		/*
		if (s[0]==0){
			for (i=0; i<=this.logic.L; i++){
				this.pass_color(this.buttons.counts[i], 0, 1);
			}
		}
		*/
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

var feral=Algorithm.ObjectParser(document.getElementById('Algo1'));
var eg1=new Isomorphic_rooted(feral, 3);
