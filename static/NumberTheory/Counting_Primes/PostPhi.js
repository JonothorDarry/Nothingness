import Algorithm from '../../Base/Algorithm.js';
import ArrayUtils from '../../Base/ArrayUtils.js';
import Modern_representation from '../../Base/Modern_representation.js';
import Representation_utils from '../../Base/Representation_utils.js';
import Graph_utils from '../../Base/Graph_utils.js';

class PostPhi extends Algorithm{
	_logical_construct_sieve(x){
		var i, j;
		var sieve=ArrayUtils.steady(x+1, 1);
		sieve[0]=sieve[1]=0;

		for (i=2; i*i<=x; i+=1){
			if (sieve[i]==0) continue;
			for (j=i*i; j<=x; j+=i){
				sieve[j]=0;
			}
		}
		return sieve;
	}

	_logical_sievify_sequence(sieve){
		var seq=[], i;
		for (i=2; i<sieve.length; i+=1){
			if (sieve[i]==1) seq.push(i);
		}
		return seq;
	}

	_logical_construct_phi(n, seq, a){
		function Phi(n, layer){
			return {'n':n, 'layer':layer, 'value':null, 'left':null, 'right':null};
		}
		var i, s, p1, p2, elem, h, layerros;

		layerros=ArrayUtils.steady(a+1, 0);
		layerros[a]=[Phi(n, a)];
		for (i=a; i>0; i-=1){
			s=layerros[i].length;
			p1=0, p2=0, h=0;
			layerros[i-1]=[];
			for (; p1<s || p2<s; ){
				if (h>0 && p2<s && (p1>=s || Math.floor(layerros[i][p2].n/seq[i-1]) == layerros[i-1][h-1].n)){
					layerros[i][p2].right=h-1;
					p2+=1;
					continue;
				}
				if (p2 >= s || (layerros[i][p1].n <= Math.floor(layerros[i][p2].n/seq[i-1]))) {
					elem=Phi(layerros[i][p1].n, i-1);
					layerros[i][p1].left=h;
					p1+=1;
				}
				else{
					elem=Phi(Math.floor(layerros[i][p2].n/seq[i-1]), i-1);
					layerros[i][p2].right=h;
					p2+=1;
				}
				layerros[i-1].push(elem);
				h+=1;
			}
		}
		return layerros;
	}

	_logical_go_above(layerros){
		var i, j, a=layerros.length, elem;
		
		for (j=0; j<layerros[0].length; j++){
			layerros[0][j].value=layerros[0][j].n;
		}

		for (i=1; i<a; i+=1){
			for (j=0; j<layerros[i].length; j++){
				elem=layerros[i][j];
				elem.value=layerros[i-1][elem.left].value-layerros[i-1][elem.right].value;
			}
		}
	}


	logical_box(){
		var sieve=this._logical_construct_sieve(this.logic.a*Math.log(this.logic.a)*5);
		this.logic.seq=this._logical_sievify_sequence(sieve);
		this.logic.layers_phis=this._logical_construct_phi(this.logic.n, this.logic.seq, this.logic.a);
		this._logical_go_above(this.logic.layers_phis);
	}

	button_creator(v, layer){
		var btns = Representation_utils.double_button_creator(this.stylistic, '?', Representation_utils.button_creator);
		btns={'div':btns[0], 'upper':btns[1], 'lower':btns[2]};
		btns.upper.style.borderTopLeftRadius='100%';
		btns.upper.style.borderTopRightRadius='100%';
		btns.upper.innerHTML=`&phi;(${v}, ${layer})`;

		btns.lower.style.borderBottomLeftRadius='100%';
		btns.lower.style.borderBottomRightRadius='100%';

		btns.div.style.position='absolute';
		btns.div.style.top=`calc(${this.present.positions.y[layer]*100}% - ${Math.floor(this.stylistic.bs_butt_height_h/2)}px)`; //Width - round
		btns.div.style.left=`calc(${this.present.positions.x[v]*100}% - ${Math.floor(this.stylistic.bs_butt_width_h/2)}px)`;
		btns.div.style.zIndex=1;

		return btns;
	}

	small_button_creator(params, padre, type){
		var btn=this.buttCreator(``);
		btn.style.position='absolute';
		btn.style.width=`${params.general.width}px`;
		btn.style.height=`${params.general.height}px`;
		btn.style.borderRadius=`100%`;

		btn.style.left = `calc(${padre.left*100}% + ${params[type].left}px`;
		btn.style.bottom = `calc(${100-padre.top*100}% + ${params[type].bottom}px)`;

		btn.style.backgroundColor = params.general.color;
		return btn;
	}

	lefty_button_creator(layer){
		var btn = Modern_representation.button_creator(`P<sub>${layer}</sub> = ${this.logic.seq[layer-1]}`, {'general':{'position':'absolute'}, 'px':{'width':60, 'height':40}});

		btn.style.left = `10px`;
		btn.style.top = `calc(${this.present.positions.y[layer]*100}% - 20px)`

		Representation_utils.Painter(btn, 5);
		return btn;
	}

	_presentation_calculate_pos(){
		var i, starter=this.logic.layers_phis[0];
		var positions={'x':{}, 'y':{}};
		for (i=0; i<starter.length; i++){
			positions.x[starter[i].n]=(starter.length-i)/(starter.length+2);
		}
		for (i=0; i<this.logic.layers_phis.length; i++){
			positions.y[i]=(this.logic.layers_phis.length-i)/(this.logic.layers_phis.length+2);
		}
		return positions;
	}

	_presentation_add_helpful_lefty(){
		for (var i=1; i<this.logic.layers_phis.length; i++){
			var btn = this.lefty_button_creator(i);
			this.place.appendChild(btn);
		}
	}

	presentation(){
		var btn, i, j, current, edge, width, height;
		this.buttons={'vertex':[], 'edge':[], 'companion':[]};
		this.present={};

		this.stylistic.bs_butt_width_h=120;
		this.stylistic.bs_butt_width='120px';

		width=this.logic.layers_phis[0].length*(this.stylistic.bs_butt_width_h+30)+200;
		this.place.style.width=`${width}px`;

		height=(this.logic.a+2)*120;
		this.place.style.height=`${height}px`;

		this.place.style.position='relative';
		this.present.positions=this._presentation_calculate_pos();
		//var system={'left':'#008800', 'right':'#880000'}, sys_x;
		var system={'left':'#FFFFFF', 'right':'#FFFFFF'}, sys_x;
		var pointers={'general':{'height':20, 'width':20, 'color':'#FFFFFF'}, 'left':{'left':Math.floor(this.stylistic.bs_butt_width_h/2), 'bottom':10}, 'right':{'left':Math.floor(this.stylistic.bs_butt_width_h/2)-10, 'bottom':20}}, pointers_x; //Hardcoded height

		for (i=0; i<=this.logic.a; i+=1){
			this.buttons.vertex.push([]);
			this.buttons.edge.push([]);
			this.buttons.companion.push([]);

			for (j=0; j<this.logic.layers_phis[i].length; j+=1){
				current=this.logic.layers_phis[i][j];
				btn=this.button_creator(current.n, i);
				Representation_utils.Painter(btn.div, 4);
				this.buttons.vertex[i].push(btn);
				this.buttons.edge[i].push({});
				this.buttons.companion[i].push({});

				this.place.appendChild(btn.div);

				if (i>0){
					for (sys_x in system){
						edge=Graph_utils.create_edge({'y':this.present.positions.y[i-1], 'x':this.present.positions.x[this.logic.layers_phis[i-1][current[sys_x]].n]}, {'y':this.present.positions.y[i], 'x':this.present.positions.x[current.n]}, {'height':3, 'color':system[sys_x]}, {'width':width, 'height':height});

						this.buttons.edge[i][j][sys_x]=edge;
						this.place.appendChild(edge);
					}
				}

				for (pointers_x in pointers){
					if ('general' == pointers_x) continue;
					btn=this.small_button_creator(pointers, {'top':this.present.positions.y[i], 'left':this.present.positions.x[current.n]}, pointers_x);

					this.buttons.companion[i][j][pointers_x]=btn;
					this.place.appendChild(btn);
				}
			}
		}
		this._presentation_add_helpful_lefty();

		//Starter
		Representation_utils.Painter(this.buttons.vertex[this.logic.a][0], 0);
	}

	palingnesia(){
		this.logical_box();
		this.presentation();
	}

	read_data(){
		var fas=this.input.value;
		var c=this.dissolve_input(fas);
		this.logic.n=c.get_next();
		this.logic.a=c.get_next();
	}

	constructor(block, n, a){
		super(block);
		this.logic.n=n;
		this.logic.a=a;
		this.version=4;
		this.palingnesia();
	}

	BeginningExecutor(){
		this.read_data();
		this.palingnesia();

		this.lees.push([1, this.logic.a, 0, 0, 0]);
	}

	StateMaker(s){
		var i, p1, p2, layer=s[1], v, h, btn;
		var staat=this.ephemeral.staat, passer=this.ephemeral.passer;

		//Temporary(?): Noe colored pointers
		if (s[0]==0 || s[0]==1 || s[0]==2){
			p1=s[2], p2=s[3];
			if (s[0]==0) v=p1;
			else v=p2;
			h=s[4];

			this.pass_color(this.buttons.vertex[layer][v].div, 0, 13);
			this.pass_color(this.buttons.vertex[layer-1][h].div);
			if (s[0]==0){
				staat.push([0, this.buttons.edge[layer][v].left, 4, 31]);
			}
			else{
				staat.push([0, this.buttons.edge[layer][v].right, 4, 30]);
			}

			if (p1 < this.buttons.vertex[layer].length){
				this.pass_color(this.buttons.companion[layer][p1].left, 4, 101, 4);
			}
			if (p2 < this.buttons.vertex[layer].length) this.pass_color(this.buttons.companion[layer][p2].right, 4, 15, 4);

		}

		if (s[0]==4){
			p1=s[2];
			btn=this.buttons.vertex[layer][p1];
			this.pass_color(btn.div, 0);

			if (layer>0){
				this.pass_color(this.buttons.vertex[layer-1][this.logic.layers_phis[layer][p1].left], 0, 31);
				this.pass_color(this.buttons.vertex[layer-1][this.logic.layers_phis[layer][p1].right], 0, 30);
			}
			staat.push([1, btn.lower, btn.lower.innerHTML, this.logic.layers_phis[layer][p1].value]);
		}

		if (s[0]==100){
			staat.push([0, this.buttons.vertex[this.logic.a][0].div, 0, 8]);
		}
	}

	NextState(){
		var l=this.lees.length;
		var s=this.lees[l-1];
		var cur_ln=this.logic.layers_phis[s[1]].length, p1, p2;
		var elem_l, elem_r, elem, h, layer=s[1];

		if (s[0]==0 || s[0]==1 || s[0]==2){
			p1=s[2], p2=s[3], h=s[4];
			elem_l=-1, elem_r=-1;
			if (s[0]==0) p1+=1;
			else p2+=1;

			if (s[1] == 1 && 2*cur_ln-p1-p2==0)
				return [4, s[1]-1, 0];
			if (2*cur_ln-p1-p2==0){
				if (this.logic.layers_phis[s[1]-1][0].n!=0) return [1, s[1]-1, 0, 0, 0];
				else return [0, s[1]-1, 0, 0, 0];
			}

			if (p1!=cur_ln)
				elem_l=this.logic.layers_phis[layer][p1].left;
			if (p2!=cur_ln)
				elem_r=this.logic.layers_phis[layer][p2].right;

			if (elem_r!=-1 && elem_r == h)
				return [2, s[1], p1, p2, h];
			if (elem_r==-1 || elem_l == h+1)
				return [0, s[1], p1, p2, h+1];
			return [1, s[1], p1, p2, h+1];
		}

		if (s[0]==4){
			p1=s[2];

			if (layer==this.logic.a) return [100];
			if (p1==cur_ln-1) return [4, layer+1, 0];
			return [4, layer, p1+1];
		}
	}

	StatementComprehension(){
		var s=this.lees[this.state_nr], x=s[1], layer, p1, p2, h, p;

		if (s[0]==0 || s[0]==1 || s[0]==2){
			layer=s[1], p1=s[2], p2=s[3], h=s[4];
			var phis = this.logic.layers_phis;
			var cur_1 = phis[layer][p1], cur_2 = phis[layer][p2];

			var str = `What do we want? Find next &phi;(w, ${layer-1}) for some w; furthermore, we want w to be least possible (so that we don't need to sort the results in the next layer). What do we do? We select some value b from the layer above (that is, layer ${layer}) and generate from it either v or v divided by current element of the sequence - namely ${this.logic.seq[layer-1]}. `

			if (cur_2) str += `So - we take two nodes we're pointing at with pointers in the same layer, chose the one, that is lower - either v1=${cur_1.n} or v2/${this.logic.seq[layer-1]} = ${cur_2.n}/${this.logic.seq[layer-1]} = ${Math.floor(cur_2.n/this.logic.seq[layer-1])}, and move the related pointer further.`;
			else str += `One pointer, however, points to nothing - it has been used for all elements in this layer. Thus, we use the second pointer and move it forward.`
			return str;
		}

		if (s[0] == 4){
			layer=s[1], p=s[2];
			var phis = this.logic.layers_phis;
			var cur = phis[layer][p];
			if (layer==0) return `By definition: &phi;(x, 0) = x; thus, &phi;(${cur.n}, 0) = ${cur.n}`;
			return `Now, we're able to calculate &phi;(${cur.n}, ${layer}) = &phi;(${cur.n}, ${layer-1}) - &phi;(${Math.floor(cur.n/this.logic.seq[layer-1])}, ${layer-1}) = ${phis[layer-1][cur.left].value} - ${phis[layer-1][cur.right].value} = ${cur.value}`;
		}

		if (s[0] == 100){
			var cur = this.logic.layers_phis[this.logic.layers_phis.length-1][0];
			return `And so, a result is obtained: turns out, that &phi;(${cur.n}, ${cur.layer}) = ${cur.value}`;
		}
	}
}
export default PostPhi;
