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
		return div;
	}

	logical_box(){

	}

	presentation(){
		var elems=this.modern_divsCreator(1, this.logic.n+1, []);
		var siege_place=elems.zdivs, dh=600, border_div=3, i, j, ij;
		var div_width=dh-2*border_div;
		this.buttons={'isomorphic_numbers':ArrayUtils.create_2d(this.logic.n+1, this.logic.n+1), 'trees':ArrayUtils.create_2d(this.logic.n+1, this.logic.n+1)};
		var number_width=20, tree_width=200, tree_height=200; //Change adequately later

		for (i=0; i<=this.logic.n; i++){
			elems.divs[i].style.height=`${dh}px`;
			elems.divs[i].style.position='relative';

			for (j=0; j<=i; j++){
				//Tutaj nie dociera drzewo
				var bad_place=-1;
				var div=this.div_creator({'bs_div_width':`${div_width}px`, 'bs_div_height':`${div_width}px`, 'bs_div_borderSize':`${border_div}px`});
				var btn=this.buttCreator(12);

				//sanitize
				btn.style.position='absolute';
				btn.style.top='0px';
				btn.style.right='0px';
				btn.style.width=`${number_width}px`;
				btn.style.height='20px';

				div.appendChild(btn);
				siege_place[i].buttons.appendChild(div);
				this.buttons.isomorphic_numbers[i][j]=btn; //blotka

				var all_alocated_trees=3;

				if (Math.floor(div_width/tree_width) <= all_alocated_trees) {
					bad_place=Math.floor(div_width/tree_width)-1;
					all_alocated_trees+=1;
				}

				this.buttons.trees[i][j]=[];
				for (ij=0; ij<all_alocated_trees; ij++){
					var post_div=this.div_creator({'bs_div_width':`${tree_width}px`, 'bs_div_height':`${tree_height}px`, 'bs_div_borderSize':'0px'});
					post_div.style.verticalAlign='top';
					//post_div.style.backgroundColor='blue';
					div.appendChild(post_div);

					if (ij!=bad_place)
						this.buttons.trees[i][j].push(post_div);
					else
						post_div.style.visibility='hidden';



					var tree=new Modern_tree([[], [2,3,4],[1],[1],[1]]);
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
var eg1=new Isomorphic_rooted(feral, 5);
