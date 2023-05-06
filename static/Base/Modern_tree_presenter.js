import ArrayUtils from './ArrayUtils.js';
import Graph_utils from './Graph_utils.js';

class Modern_tree_presenter{
	//Gives position to a tree - banal shit boring, besides tree is bad
	_calculate_position_vertexes(){
		var i, j, n=this.tree.n, ln, x;
		if (this.tree.system_depth==null)
			this.tree.add_on_listed_depths();

		var parameters=ArrayUtils.steady(n+1, 0);
		var max_depth=Math.max(...this.tree.depth), min_depth=1;

		for (i=0; i<n; i++){
			ln=this.tree.system_depth[i].length
			for (j=0; j<ln; j++){
				x=this.tree.system_depth[i][j];
				parameters[x]={
					'y':(this.tree.depth[x])/(max_depth+1),
					'x':(j+1)/(ln+1)
				};
			}
		}
		this.parameters={'vertexes':parameters};
	}

	//Proper binar penetrator
	_segtree_calculate_position_vertexes(h_full, h_btn){
		var i, j, n=this.tree.n, ln, x;
		if (this.tree.system_depth==null)
			this.tree.add_on_listed_depths();

		var parameters=ArrayUtils.steady(n+1, 0);
		var max_depth=Math.max(...this.tree.depth), min_depth=1;

		for (i=0; i<n; i++){
			ln=this.tree.system_depth[i].length
			for (j=0; j<ln; j++){
				x=this.tree.system_depth[i][j];
				parameters[x]={
					'y':(this.tree.depth[x]+1)/(max_depth+1)-h_btn/(2*h_full),
					'x':(2*j+1)*(1/(1<<(i+1)))
				};
			}
		}
		this.parameters={'vertexes':parameters};
	}

	//Ponoć to Reingold-Tilford Algorithm (Chuj wie, kto to byli)
	//lc, rc - left/right contour
	calculate_position_vertexes(){
		var i, j, ij, n=this.tree.n, ln, x, a, b, prev;

		var position=ArrayUtils.steady(n+1, 0);
		var parameters=ArrayUtils.steady(n+1, 0);
		var mod=ArrayUtils.steady(n+1, 0);
		var lc=ArrayUtils.create_2d(n+1, 0); //Left contour
		var rc=ArrayUtils.create_2d(n+1, 0); //Right contour

		var max_depth=Math.max(...this.tree.depth), min_depth=1;
		var max_diff=0;

		for (i=n; i>0; i--){
			a=this.tree.apre[i];
			position[a]=0;

			var tmp_rc = [];
			for (j=0; j<this.tree.kids[a].length; j++){
				b=this.tree.kids[a][j];
				if (j>0){
					prev=this.tree.kids[a][j-1];

					for (ij=0; ij<Math.min(tmp_rc.length, lc[b].length); ij++){
						mod[b]=Math.max(mod[b], tmp_rc[ij]-lc[b][ij]+1); //1 - dystans między parą punktów
					}
				}

				for (ij=0; ij<Math.min(tmp_rc.length, rc[b].length); ij++) tmp_rc[ij] = rc[b][ij]+mod[prev];
				for (ij=tmp_rc.length; ij<rc[b].length; ij++) tmp_rc.push(rc[b][ij]+mod[b]);
			}

			for (j=1; j<this.tree.kids[a].length; j++){
				b=this.tree.kids[a][j];
				prev=this.tree.kids[a][j-1];
				max_diff=Math.max(max_diff, mod[b]+position[b]-position[prev]-mod[prev]);
			}

			for (j=1; j<this.tree.kids[a].length; j++){
				b=this.tree.kids[a][j];
				prev=this.tree.kids[a][j-1];

				mod[b]=position[prev]+mod[prev]-position[b]+max_diff;
			}

			var v, v1, v2;
			if (this.tree.kids[a].length%2==1){
				v=this.tree.kids[a][(this.tree.kids[a].length>>1)];
				position[a]=position[v]+mod[v];
			}
			else if (this.tree.kids[a].length>0){
				v1=this.tree.kids[a][(this.tree.kids[a].length>>1) - 1];
				v2=this.tree.kids[a][(this.tree.kids[a].length>>1)];

				position[a] = (position[v1] + mod[v1] + position[v2] + mod[v2])/2;
			}
		

			if (this.tree.kids[a].length>0){
				var v=this.tree.kids[a][this.tree.kids[a].length-1];
				rc[a]=[mod[v]+position[v]];
				lc[a]=[mod[this.tree.kids[a][0]] + position[this.tree.kids[a][0]]];
			}
			else{
				lc[a]=[0];
				rc[a]=[0];
			}


			for (j=0; j<this.tree.kids[a].length; j++){
				b=this.tree.kids[a][j];
				for (ij=lc[a].length; ij<=lc[b].length; ij++){
					lc[a].push(lc[b][ij-1]+mod[b]);
				}
			}

			for (j=this.tree.kids[a].length-1; j>=0; j--){
				b=this.tree.kids[a][j];
				for (ij=rc[a].length; ij<=rc[b].length; ij++){
					rc[a].push(rc[b][ij-1]+mod[b]);
				}
			}
		}

		for (i=1; i<=n; i++){
			a=this.tree.apre[i];
			mod[a]+=mod[this.tree.par[a]];
			position[a]=mod[a]+position[a];
		}

		var mx=Math.max(...position);
		for (i=1; i<=n; i++){
			parameters[i]={
				'x':(position[i]+1)/(mx+2),
				'y':(this.tree.depth[i]+0.5)/(max_depth+1),
			};
		}
		this.parameters={'vertexes':parameters};
	}

	create_edge(a, stylistic){
		var verts=this.parameters.vertexes;
		return Graph_utils.create_edge(verts[a], verts[this.tree.par[a]], stylistic.edge, {'width':this.width, 'height':this.height});
	}

	//x, y - position, like, (1,1) - above, right
	//Assumption - homogeneous buttons
	get_place_for_companion_button(vertex, x_axis, y_axis, button_properties={'width':20, 'height':20}){
		var place={};
		var full_radius=this.style.vertex.width;
		var half_radius=Math.floor(full_radius/2);

		if (x_axis>0) place.left=`calc(${this.parameters.vertexes[vertex].x*100}% + ${half_radius/Math.sqrt(2)+button_properties.width*(x_axis-1)}px)`;
		else place.left=`calc(${this.parameters.vertexes[vertex].x*100}% + ${-half_radius/Math.sqrt(2)-button_properties.width*(-x_axis)}px)`;

		if (y_axis>0) place.top=`calc(${this.parameters.vertexes[vertex].y*100}% + ${-half_radius/Math.sqrt(2)-button_properties.height*(y_axis)}px)`;
		else place.top=`calc(${this.parameters.vertexes[vertex].y*100}% + ${half_radius/Math.sqrt(2)+button_properties.height*(-y_axis-1)}px)`;
		return place;
	}

	//Creates buttons
	buttCreator(stylistic, numb=null, col=0){
		return Graph_utils.button_creator(stylistic, numb, col);
	}

	//places the tree
	//Currently nonsensical distinction width-height
	place_tree(place, style, used_fun){
		var i, a, j;

		if (used_fun == 'standard') this.calculate_position_vertexes();
		else this._segtree_calculate_position_vertexes(place.height, 40);

		this.style = style; //DANGER: does not include changes made during runtime (so better not to make changes - overlays, underlays, relays, closing-to-the-edges, ...)
		this.height=place.height;
		this.width=place.width;
		this.place=place.div;
		this.buttons={'vertexes':ArrayUtils.steady(this.tree.n, 0), 'edges':ArrayUtils.steady(this.tree.n, 0)};

		var vertex_pos=this.parameters.vertexes;
		for (i=1; i<=this.tree.n; i++){
			a=i;
			var bt=this.buttCreator(style, a);
			this.buttons.vertexes[a]=bt;

			if (a!=this.tree.root){
				var dv=this.create_edge(a, style);
				this.buttons.edges[a]=dv;
				this.place.appendChild(dv);
			}

			//Normalized vertex positions
			bt.style.position='absolute';
			bt.style.top=`calc(${100*this.parameters.vertexes[a].y}% - ${style.vertex.height/2}px)`;
			bt.style.left=`calc(${100*this.parameters.vertexes[a].x}% - ${style.vertex.width/2}px)`;
			this.place.appendChild(bt);
		}
	}

	constructor(tree, place, style, used_fun='standard'){
		this.tree=tree;
		this.place_tree(place, style, used_fun);
	}
}
export default Modern_tree_presenter
