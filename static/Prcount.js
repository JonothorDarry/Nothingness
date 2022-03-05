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

		this.Painter(btn, 5);
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
				this.Painter(btn.div, 4);
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
		this.Painter(this.buttons.vertex[this.logic.a][0], 0);
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

	StateMaker(){
		var l=this.lees.length;
		var s=this.lees[l-1], i, p1, p2, layer=s[1], v, h, btn;
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
		var l=this.lees.length;
		var s=this.lees[l-1], x=s[1], layer, p1, p2, h, p;
		console.log(s);

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

class Segtree_Counter extends Algorithm{
	_logical_construct_tree(){
		var maximus = this.logic.queries.reduce((previousValue, currentValue) => Math.max(previousValue, currentValue.interval), 0);
		var logg = Math.ceil(Math.log(maximus)/Math.log(2));
		this.logic.Cv = 1<<logg;

		this.logic.seg_tree = [];
		for (var i=0; i<this.logic.Cv*2; i++) this.logic.seg_tree.push([]);
		this.logic.seg_tree[this.logic.Cv] = [0]; //0 and 1 handling
		for (var i=this.logic.Cv+1; i<this.logic.Cv*2; i++) this.logic.seg_tree[i] = [1];
		for (var i=this.logic.Cv-1; i>0; i--) this.logic.seg_tree[i][0] = this.logic.seg_tree[i*2][0] + this.logic.seg_tree[i*2+1][0];
	}

	_logical_sort_out_queries(){
		var comparer_sort = function(a,b) {return (a.prime_nr <= b.prime_nr ? -1 : 1)};
		this.logic.beg_queries = this.logic.queries.slice();
		this.logic.queries.sort(comparer_sort);
	}

	_logical_insert_tree(iterator){
		this.logic.seg_tree[this.logic.Cv + iterator].push(0);
		for (var i = (this.logic.Cv + iterator)>>1; i>0; i=(i>>1)){
			this.logic.seg_tree[i].push(ArrayUtils.get_elem(this.logic.seg_tree[i*2], -1) + ArrayUtils.get_elem(this.logic.seg_tree[i*2+1], -1));
		}
	}

	_logical_query_tree(interval){
		var cur=0, _tmp, full_changes = [];
		var l=this.logic.Cv, r=this.logic.Cv+interval;
		
		_tmp = ArrayUtils.get_elem(this.logic.seg_tree[l], -1); 
		cur += _tmp;
		if (r != l){
			_tmp = ArrayUtils.get_elem(this.logic.seg_tree[r], -1); 
			cur += _tmp;
		}
		full_changes.push(cur);

		for (; l>=1; l>>=1, r>>=1){
			if (l%2 == 0 && r-l>1){
				_tmp = ArrayUtils.get_elem(this.logic.seg_tree[l+1], -1); 
				cur += _tmp;
				full_changes.push(cur);
			}
			if (r%2 == 1 && r-l>1){
				_tmp = ArrayUtils.get_elem(this.logic.seg_tree[r-1], -1); 
				cur += _tmp;
				full_changes.push(cur);
			}
		}
		return full_changes;
	}

	_logical_execute_queries(prime_nr){
		var i;
		for (i=this.logic.current_query; i<this.logic.queries.length; i++){
			if (this.logic.queries[i].prime_nr == prime_nr){
				this.logic.queries[i].answer = this._logical_query_tree(this.logic.queries[i].interval);
			}
			else break;
		}
		this.logic.current_query = i;
	}

	_logical_finish_tree(){
		this.logic.current_query = 0;
		this.logic.lpf = ArrayUtils.steady(this.logic.Cv+1, -1);
		var limit = this.logic.Cv;
		var found_primes=0;

		this._logical_execute_queries(found_primes);
		for (var i=2; i<limit; i++){
			if (this.logic.lpf[i] != -1) continue;
			for (var j=i; j<limit; j+=i){
				if (this.logic.lpf[j] != -1) continue;
				this.logic.lpf[j] = i;
				this._logical_insert_tree(j);
			}
			found_primes+=1;
			this._logical_execute_queries(found_primes);
		}

		for (i=0; i<this.logic.queries.length; i+=1){
			if (this.logic.queries[i].answer == -1) this.logic.queries[i].answer = [(this.logic.queries[i].interval == 0 ? 0 : 1)];
		}

		var filtered = this.logic.lpf.filter((x, i) => x == i);
		this.logic.prime_nr = ArrayUtils.steady(this.logic.Cv, 0);
		for (var i=0; i<filtered.length; i++){
			this.logic.prime_nr[filtered[i]] = i+1;
		}
	}

	logical_box(){
		this._logical_sort_out_queries();
		this._logical_construct_tree();
		this._logical_finish_tree();
	}


	_presentation_build_tree(place){
		var seg_tree_edges = [];
		
		for (var i=1; i<this.logic.Cv; i++){
			seg_tree_edges.push([i, i*2]);						
			seg_tree_edges.push([i, i*2+1]);
		}
		var seg_tree = new Modern_tree(seg_tree_edges, 1);

		var single_width = 40;
		var width = this.logic.Cv*single_width;
		var height = 500;
		var post_div = Modern_representation.div_creator('', {'px':{'width':width, 'height':height}});

		var tree_presentation = new Modern_tree_presenter(seg_tree, {'div':post_div, 'width':width, 'height':height}, {
			'vertex':{'width':single_width, 'height':single_width, 'radius':100, 'label':'none'},
			'edge':{'height':2},
			'nonsense':this.stylistic
			}, 'non-standard'
		);

		this.buttons.vertexes = tree_presentation.buttons.vertexes;
		for (var i=1; i<2*this.logic.Cv; i++){
			var platz = tree_presentation.get_place_for_companion_button(i, -1, 1);
			var btn = Modern_representation.button_creator(i, {'general':{'position':'absolute', 'color':'#FFFFFF', 'backgroundColor':'#000000'}, 'px':{'width':20, 'height':20}});
			btn.style.left = platz.left;
			btn.style.top = platz.top;
			post_div.appendChild(btn);
		}
		this.buttons.edges = tree_presentation.buttons.edges;

		for (var i=1; i<2*this.logic.Cv; i+=1){
			this.buttons.vertexes[i].data = {'iterator':0, 'values':this.logic.seg_tree[i]};
			this.buttons.vertexes[i].innerHTML = this.buttons.vertexes[i].data.values[0];
		}
		place.appendChild(post_div);
	}

	_presentation_build_sieve(place){
		var sieve = Modern_representation.div_creator('', {'general':{'display':'block'}});
		for (var i=0; i<this.logic.Cv; i++){
			var btn = this.buttCreator(i);
			this.Painter(btn, 0);
			this.buttons.low_sieve.push(btn);
			sieve.appendChild(btn);
		}
		this.Painter(this.buttons.low_sieve[0], 2);
		place.appendChild(sieve);
	}

	_presentation_build_querier(){
		var querier=Representation_utils.proto_divsCreator(1, this.logic.queries.length+4, [], null, this.present.place, this.stylistic);
		querier.full_div.style.display='inline-block';
		var grid = new Grid(this.logic.queries.length+3, 3, this.stylistic, {'place':querier.zdivs, 'top_margin':1, 'left_margin':1});

		var style = {'px':{'width':80}};
		grid.single_filler([1, 0], 'n', {'color':5, 'stylistic':style});
		grid.single_filler([1, 1], 'a', {'color':5, 'stylistic':style});
		grid.single_filler([1, 2], '&phi;(n,a)', {'color':5, 'stylistic':style});

		this.buttons.q_intervals = grid.filler([[2, this.logic.queries.length+1], 0], this.logic.beg_queries.map(x => x.interval), {'color':0, 'stylistic':style});
		this.buttons.q_prime_nrs = grid.filler([[2, this.logic.queries.length+1], 1], this.logic.beg_queries.map(x => x.prime_nr), {'color':0, 'stylistic':style});
		this.buttons.q_answers = grid.filler([[2, this.logic.queries.length+1], 2], this.logic.queries.map(x => x.answer[0]), {'color':4, 'stylistic':style});

		for (var i=0; i<this.buttons.q_intervals.length; i++) this.buttons.q_intervals[i].data = {'iterator':0, 'values':[this.logic.beg_queries[i].interval, this.logic.queries[i].interval]};
		for (var i=0; i<this.buttons.q_prime_nrs.length; i++) this.buttons.q_prime_nrs[i].data = {'iterator':0, 'values':[this.logic.beg_queries[i].prime_nr, this.logic.queries[i].prime_nr]};
		for (var i=0; i<this.buttons.q_prime_nrs.length; i++) this.buttons.q_answers[i].data = {'iterator':0, 'values':this.logic.queries[i].answer};

		this.place.appendChild(querier.full_div);

		grid.single_filler([-1, 0], 'prime nr: ', {'color':5, 'stylistic':style});
		this.buttons.prime_nr = grid.single_filler([-1, 1], '0', {'color':30, 'stylistic':style});
		this.buttons.prime_nr.data = {'values':ArrayUtils.range(0, this.logic.lpf.filter((x, i) => x == i).length), 'iterator':0};
	}

	presentation(){
		var btn, i, j;
		this.buttons={'vertexes':[], 'edges':[], 'companions':[], 'low_sieve':[], 'queries':[]};
		var res_side = Modern_representation.div_creator('', {'general':{'display':'inline-block'}});
		this.place.appendChild(res_side);
		this.present={};

		this.place.style.width='max-content';
		this._presentation_build_tree(res_side);
		this._presentation_build_sieve(res_side);
		this._presentation_build_querier();
	}

	palingnesia(){
		this.logical_box();
		this.presentation();
	}

	read_data(){
		var fas=this.input.value;
		var c=this.dissolve_input(fas);
		this.logic.q=c.get_next();
		this.logic.queries=[];
		for (var i=0; i<this.logic.q; i++){
			this.logic.queries.push({'interval':c.get_next(), 'prime_nr':c.get_next(), 'answer':-1});
		}
	}

	BeginningExecutor(){
		this.read_data();
		this.palingnesia();

		this.lees.push([1]);
	}

	constructor(block, q, queries){
		super(block);
		this.version = 4;
		this.logic.q = q;
		this.logic.queries = queries;
		this.palingnesia();
	}

	StateMaker(){
		var l=this.lees.length;
		var s=this.lees[l-1], btn;
		var staat=this.ephemeral.staat, passer=this.ephemeral.passer;

		//1 - starter, query sort
		if (s[0]==1){
			for (i=0; i<this.buttons.q_intervals.length; i++){
				this.pass_color(this.buttons.q_intervals[i], 0, 1, 0);
				this.pass_color(this.buttons.q_prime_nrs[i], 0, 1, 0);
				staat.push([6, this.buttons.q_intervals[i]]);
				staat.push([6, this.buttons.q_prime_nrs[i]]);
			}
		}

		//21 - query compare
		if (s[0] == 20){
			this.pass_color(this.buttons.q_prime_nrs[s[1]], 0, 14, 0);
			this.pass_color(this.buttons.prime_nr, 30, 14, 30);
		}

		//21 - move upwards during query
		if (s[0] == 21){
			if (s[3] == -1){
				this.pass_color(this.buttons.q_answers[s[4]], 4, 1, 0);
				this.pass_color(this.buttons.q_intervals[s[4]], 0, 13, 0);
				this.pass_color(this.buttons.vertexes[s[1]], 0, 13, 0);
				this.pass_color(this.buttons.vertexes[s[2]], 0, 13, 0);
			}
			else{
				this.pass_color(this.buttons.vertexes[s[1]], 0, 15, 0);
				this.pass_color(this.buttons.vertexes[s[2]], 0, 15, 0);
			}

			if (s[3]==1){
				if (s[1]%2 == 0 && s[2]-s[1] > 1){
					this.pass_color(this.buttons.vertexes[s[1]+1], 0, 13, 0);
					this.pass_color(this.buttons.q_answers[s[4]], 0, 1, 0);
					staat.push([6, this.buttons.q_answers[s[4]]]);
				}
			}

			if (s[3]==2){
				if (s[2]%2 == 1 && s[2]-s[1] > 1){
					this.pass_color(this.buttons.vertexes[s[2]-1], 0, 13, 0);
					this.pass_color(this.buttons.q_answers[s[4]], 0, 1, 0);
					staat.push([6, this.buttons.q_answers[s[4]]]);
				}
			}
			if (s[1] == 1 && s[3] == 2){
				staat.push([0, this.buttons.q_answers[s[4]], 0, 8]);
			}
		}

		//25 - +1 for prime nr
		if (s[0] == 25){
			staat.push([6, this.buttons.prime_nr]);
		}

		//Moving in sieve
		if (s[0] == 30){
			if (this.logic.lpf[s[2]] == s[2]) this.pass_color(this.buttons.low_sieve[s[2]], 0, 15, 2);
			else this.pass_color(this.buttons.low_sieve[s[2]], 2, 15, 2);
		}

		//Stopping sieve in a point
		if (s[0] == 32){
			this.pass_color(this.buttons.low_sieve[s[2]], 2, 15, 2);
			if (s[2] != s[3]) this.pass_color(this.buttons.low_sieve[s[3]], 0, 101, 2);
		}

		//Move upwards in insertion
		if (s[0] == 31){
			this.pass_color(this.buttons.vertexes[s[1]], 0, 1, 0);
			this.pass_color(this.buttons.low_sieve[s[3]], 2, 15, 2);
			if (s[4] != s[3]) this.pass_color(this.buttons.low_sieve[s[4]], 2, 101, 2);
			staat.push([6, this.buttons.vertexes[s[1]]]);
		}

		//40 - queries post exit - sieve ended, queries still standing
		if (s[0] == 40){
			staat.push([0, this.buttons.q_answers[s[1]], 4, 8]);
		}
	}

	NextState(){
		var l=this.lees.length;
		var s=this.lees[l-1];
		var staat=this.ephemeral.staat, passer=this.ephemeral.passer;

		if (s[0] == 1) return [20, 0, 1];
		if (s[0] == 20 && this.logic.queries[s[1]].prime_nr == this.logic.prime_nr[s[2]]) return [21, this.logic.Cv, this.logic.Cv+this.logic.queries[s[1]].interval, -1, s[1], s[2]];
		if (s[0] == 20 && s[2] == this.logic.Cv-1) return [40, s[1], s[2]];
		if (s[0] == 20) return [30, s[1], s[2]+1];

		if (s[0] == 20) return [21, this.logic.Cv, this.logic.Cv+this.logic.queries[s[1]].interval, 0, s[1], s[2]];
		if (s[0] == 21 && s[3] < 2) return [21, s[1], s[2], s[3]+1, s[4], s[5]];
		if (s[0] == 21 && s[1] > 1) return [21, s[1]>>1, s[2]>>1, 0, s[4], s[5]];
		if (s[0] == 21 && s[4]+1 == this.logic.queries.length) return [100];
		if (s[0] == 21) return [20, s[4]+1, s[5]];

		if (s[0] == 25) return [20, s[1], s[2]];

		if (s[0] == 30 && this.logic.lpf[s[2]] != s[2] && s[2] == this.logic.Cv-1) return [40, s[1], s[2]];
		if (s[0] == 30 && this.logic.lpf[s[2]] != s[2]) return [30, s[1], s[2]+1];
		if (s[0] == 30) return [32, s[1], s[2], s[2]];

		if (s[0] == 32 && this.logic.lpf[s[3]] == s[2]) return [31, this.logic.Cv+s[3], s[1], s[2], s[3]];
		if (s[0] == 32 && s[3]+s[2] < this.logic.Cv) return [32, s[1], s[2], s[3]+s[2]];
		if (s[0] == 32) return [25, s[1], s[2]];

		if (s[0] == 31 && s[1] > 1) return [31, s[1]>>1, s[2], s[3], s[4]];
		if (s[0] == 31 && s[3]+s[4] >= this.logic.Cv) return [25, s[2], s[3]];
		if (s[0] == 31) return [32, s[2], s[3], s[4]+s[3]];

		if (s[0] == 40 && s[1] == this.logic.queries.length-1) return [100];
		if (s[0] == 40) return [40, s[1]+1, s[2]];
	}

	//Horror: teraz czytanie z danych buttonów
	StatementComprehension(){
		var l=this.lees.length;
		var s=this.lees[l-1], x=s[1], layer, p1, p2, h;

		if (s[0] == 1) return `Queries are sorted in order of subsequent prime numbers, which are used in sieving &phi;(n,a). Besides, note, that segment tree was started: values in its nodes are equal to sum of its children, each leaf gives information, whether partiular number was marked as divisible by first prime_nr primes. Note, that 0 is marked as divisible from the very start of this algorithm.`;
		if (s[0] == 20){
			var nr = this.logic.prime_nr[s[2]-1];
			return `A check occurs - as always at the start of algorithm or after marking all numbers divisible by a certain prime: is the next query possible to evaluate after marking ${nr}. prime? ${(this.logic.queries[s[1]].prime_nr == nr)?`Yes, and so, querying segment tree begins!`:`No, we have to move the sieve further.`}`;
		}
		if (s[0] == 21){
			var n = this.logic.queries[s[4]].interval;
			var query = {'place':this.logic.queries[s[4]], 'cur_ans':this.buttons.q_answers[s[4]].data};

			if (s[3] == -1){
				var b1 = this.buttons.vertexes[s[1]].data;
				var b2 = this.buttons.vertexes[s[2]].data;
				return `Now, we have to answer query &phi;(n, a) = &phi;(${n}, ${query.place.prime_nr}). How will we do it? By querying sum of segment tree on range from 0 to n - that is, <0;${n}>. First, where do we start querying the segment tree? On leafs indexed as 0 and n - as leaf node have indexes starting from 2<sup>lg</sup>, where lg is a constant great enough to answer all queries, then our starting nodes are 0+${this.logic.Cv}=${this.logic.Cv} and ${n}+${this.logic.Cv}=${n+this.logic.Cv}. We also add values in those indexes to the result of this query: thus, current answer is  previous_answer + segment_tree_left + segment_tree_right = ${b1.values[b1.iterator]} + ${b2.values[b2.iterator]} = ${query.cur_ans.values[query.cur_ans.iterator]}.`;
			}
			if (s[3] == 0){
				return `Now, as we are in this layer of segment tree, we have to find out, whether we have to cover left and right side of nodes our iterators are pointing at. Note, that to move upwards in the segment tree, one needs to divide indexes by two.`;
			}
			if (s[3] == 1){
				if (s[2] - s[1] <= 1) return `Our left node is right next to right node ${s[2]} - ${s[1]} &le; 1 - no node can between them can be covered, we take no action.`;
				if (s[1]%2 == 1) return `Our left node is a right child of its parent - because its index - ${s[1]} - is not divisible by 2 - thus, we take no action.`;
				var btn = this.buttons.vertexes[s[1]+1].data;
				return `Now, we augment answer with node to the right of our left node: ${query.cur_ans.values[query.cur_ans.iterator-1]} + ${btn.values[btn.iterator]} = ${query.cur_ans.values[query.cur_ans.iterator]}`;
			}
			if (s[3] == 2){
				if (s[2] - s[1] <= 1){
					var str = `Our right node is right next to left node ${s[2]} - ${s[1]} &le; 1 - no node can between them can be covered, we take no action.`;
					if (s[1] == 1) str += `Also, our query was answered, the answer is ${query.cur_ans.values[query.cur_ans.iterator]}`;
					return str;
				}
				if (s[2]%2 == 0) return `Our right node is a left child of its parent - because its index - ${s[2]} - is divisible by 2 - thus, we take no action.`;
				var btn = this.buttons.vertexes[s[2]-1].data;
				return `Now, we augment answer with node to the left of our right node: ${query.cur_ans.values[query.cur_ans.iterator-1]} + ${btn.values[btn.iterator]} = ${query.cur_ans.values[query.cur_ans.iterator]}`;
			}
		}

		if (s[0] == 25){
			var btn = this.buttons.prime_nr.data;
			return `A prime was sieved - number of sieved primes is thus increased to ${btn.values[btn.iterator]}`;
		}

		if (s[0] == 30) return `The next number under sieve, ${s[2]}, is checked - is it prime? ${(this.logic.lpf[s[2]] == s[2]) ? `Yes - and so, the segment tree will be updated.` : `No, so we have to move further.`}`;

		if (s[0] == 32){
			if (this.logic.lpf[s[3]] == s[2]) return `A number ${s[3]} is divisible by the last prime (${s[2]}) and still unsieved - thus, it is removed from the pool of unsieved numbers, and the segment tree will be updated.`;
			else return `A number ${s[3]} was sieved previously - no action will be taken.`;
		}

		if (s[0] == 31){
			return `Segment tree is updated - from each node associated with currently sieved number - that is, ${s[4]} - 1 is subtracted. Moving upwards is done by dividing index of a node by two.`
		}
		

		if (s[0] == 40) return `The sieve has ended, leaving all numbers - except one - marked as divisible by one of primes - and so, all remaining queries can be answered - their answer is equal to 1 or 0 (in case of &phi;(0, x))`
		if (s[0] == 100) return `All queries were answered, so the process can end.`;
		return '';
	}
}

var feral1=Algorithm.ObjectParser(document.getElementById('Algo1'));
var sk1=new PostPhi(feral1, 121, 7);

var feral2=Algorithm.ObjectParser(document.getElementById('Algo2'));
var sk2=new Segtree_Counter(feral2, 5, [{'interval':7, 'prime_nr':2}, {'interval':15, 'prime_nr':3}, {'interval':11, 'prime_nr':0}, {'interval':14, 'prime_nr':4}, {'interval':12, 'prime_nr':3}]);
