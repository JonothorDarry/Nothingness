import Algorithm from '../../Base/Algorithm.js';
import ArrayUtils from '../../Base/ArrayUtils.js';
import Modern_representation from '../../Base/Modern_representation.js';
import Representation_utils from '../../Base/Representation_utils.js';
import Grid from '../../Base/Grid.js';
import Modern_tree from '../../Base/Modern_tree.js';
import Modern_tree_presenter from '../../Base/Modern_tree_presenter.js';

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

	_statial_binding(name, values, btn_list){
		if (!ArrayUtils.is_iterable(btn_list)){
			this.state[name] = {
				'iterator':0,
				'button':btn_list,
				'values':values,
				'current':function(){return this.values[this.iterator];},
				'previous':function(){return this.values[this.iterator-1];}
			};
			return;
		}

		this.state[name] = [];
		for (var i=0; i<values.length; i++){
			this.state[name].push({
				'button':btn_list[i],
				'values':values[i],
				'iterator':0,
				'current':function(){return this.values[this.iterator];},
				'previous':function(){return this.values[this.iterator-1];}
			});
			if (values[i].length > 0) btn_list[i].innerHTML = values[i][0];
		}
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
			var platz = tree_presentation.get_place_for_companion_button(i, 1, 1);
			var btn = Modern_representation.button_creator(i, {'general':{'position':'absolute', 'color':'#FFFFFF', 'backgroundColor':'#000000'}, 'px':{'width':20, 'height':20}});
			btn.style.left = platz.left;
			btn.style.top = platz.top;
			post_div.appendChild(btn);
		}
		this.buttons.edges = tree_presentation.buttons.edges;

		this._statial_binding('vertexes', this.logic.seg_tree, this.buttons.vertexes);

		place.appendChild(post_div);
	}

	_presentation_build_sieve(place){
		var sieve = Modern_representation.div_creator('', {'general':{'display':'block'}});
		for (var i=0; i<this.logic.Cv; i++){
			var btn = this.buttCreator(i);
			Representation_utils.Painter(btn, 0);
			this.buttons.low_sieve.push(btn);
			sieve.appendChild(btn);
		}
		Representation_utils.Painter(this.buttons.low_sieve[0], 2);
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



		this._statial_binding('q_intervals', ArrayUtils.zip(this.logic.beg_queries.map(e => e.interval), this.logic.queries.map(e => e.interval)), this.buttons.q_intervals);
		this._statial_binding('q_prime_nrs', ArrayUtils.zip(this.logic.beg_queries.map(e => e.prime_nr), this.logic.queries.map(e => e.prime_nr)), this.buttons.q_prime_nrs);
		this._statial_binding('q_answers', this.logic.queries.map(e => e.answer), this.buttons.q_answers);

		this.place.appendChild(querier.full_div);
		grid.single_filler([-1, 0], 'prime nr: ', {'color':5, 'stylistic':style});
		this.buttons.prime_nr = grid.single_filler([-1, 1], '0', {'color':30, 'stylistic':style});

		this._statial_binding('prime_nr', ArrayUtils.range(0, this.logic.lpf.filter((x, i) => x == i).length), this.buttons.prime_nr);
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
		this.state = {};
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

	StateMaker(s){
		var btn;
		var staat=this.ephemeral.staat, passer=this.ephemeral.passer;

		//1 - starter, query sort
		if (s[0]==1){
			for (var i=0; i<this.buttons.q_intervals.length; i++){
				this.pass_color(this.buttons.q_intervals[i], 0, 1, 0);
				this.pass_color(this.buttons.q_prime_nrs[i], 0, 1, 0);
				staat.push([6, this.state.q_intervals[i]]);
				staat.push([6, this.state.q_prime_nrs[i]]);
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
					staat.push([6, this.state.q_answers[s[4]]]);
				}
			}

			if (s[3]==2){
				if (s[2]%2 == 1 && s[2]-s[1] > 1){
					this.pass_color(this.buttons.vertexes[s[2]-1], 0, 13, 0);
					this.pass_color(this.buttons.q_answers[s[4]], 0, 1, 0);
					staat.push([6, this.state.q_answers[s[4]]]);
				}
			}
			if (s[1] == 1 && s[3] == 2){
				staat.push([0, this.buttons.q_answers[s[4]], 0, 8]);
			}
		}

		//25 - +1 for prime nr
		if (s[0] == 25){
			staat.push([6, this.state.prime_nr]);
		}

		//Moving in sieve
		if (s[0] == 30){
			if (this.logic.lpf[s[2]] == s[2]) this.pass_color(this.buttons.low_sieve[s[2]], 0, 15, 2);
			else this.pass_color(this.buttons.low_sieve[s[2]], 2, 15, 2);
		}

		//Stopping sieve in a point
		if (s[0] == 32){
			this.pass_color(this.buttons.low_sieve[s[2]], 2, 15, 2);
			if (s[2] != s[3]){
				if (this.logic.lpf[s[3]] == s[2]) this.pass_color(this.buttons.low_sieve[s[3]], 0, 101, 2);
				else this.pass_color(this.buttons.low_sieve[s[3]], 2, 101, 2);
			}
		}

		//Move upwards in insertion
		if (s[0] == 31){
			this.pass_color(this.buttons.vertexes[s[1]], 0, 1, 0);
			this.pass_color(this.buttons.low_sieve[s[3]], 2, 15, 2);
			if (s[4] != s[3]) this.pass_color(this.buttons.low_sieve[s[4]], 2, 101, 2);
			staat.push([6, this.state.vertexes[s[1]]]);
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
		var s=this.lees[this.state_nr], x=s[1], layer, p1, p2, h;

		if (s[0] == 1) return `Queries are sorted in order of subsequent prime numbers, which are used in sieving &phi;(n,a). Besides, note, that segment tree was started: values in its nodes are equal to sum of its children, each leaf gives information, whether partiular number was marked as divisible by first prime_nr primes. Note, that 0 is marked as divisible from the very start of this algorithm.`;
		if (s[0] == 20){
			var nr = this.logic.prime_nr[s[2]-1];
			return `A check occurs - as always at the start of algorithm or after marking all numbers divisible by a certain prime: is the next query possible to evaluate after marking ${nr}. prime? ${(this.logic.queries[s[1]].prime_nr == nr)?`Yes, and so, querying segment tree begins!`:`No, we have to move the sieve further.`}`;
		}
		if (s[0] == 21){
			var n = this.logic.queries[s[4]].interval;
			var query = {'place':this.logic.queries[s[4]], 'cur_ans':this.state.q_answers[s[4]]};

			if (s[3] == -1){
				var b1 = this.state.vertexes[s[1]];
				var b2 = this.state.vertexes[s[2]];
				return `Now, we have to answer query &phi;(n, a) = &phi;(${n}, ${query.place.prime_nr}). How will we do it? By querying sum of segment tree on range from 0 to n - that is, <0;${n}>. First, where do we start querying the segment tree? On leafs indexed as 0 and n - as leaf node have indexes starting from 2<sup>lg</sup>, where lg is a constant great enough to answer all queries, then our starting nodes are 0+${this.logic.Cv}=${this.logic.Cv} and ${n}+${this.logic.Cv}=${n+this.logic.Cv}. We also add values in those indexes to the result of this query: thus, current answer is  previous_answer + segment_tree_left + segment_tree_right = ${b1.current()} + ${b2.current()} = ${query.cur_ans.current()}.`;
			}
			if (s[3] == 0){
				return `Now, as we are in this layer of segment tree, we have to find out, whether we have to cover left and right side of nodes our iterators are pointing at. Note, that to move upwards in the segment tree, one needs to divide indexes by two.`;
			}
			if (s[3] == 1){
				if (s[2] - s[1] <= 1) return `Our left node is right next to right node ${s[2]} - ${s[1]} &le; 1 - no node can between them can be covered, we take no action.`;
				if (s[1]%2 == 1) return `Our left node is a right child of its parent - because its index - ${s[1]} - is not divisible by 2 - thus, we take no action.`;
				var btn = this.state.vertexes[s[1]+1];
				return `Now, we augment answer with node to the right of our left node: ${query.cur_ans.values[query.cur_ans.iterator-1]} + ${btn.current()} = ${query.cur_ans.current()}`;
			}
			if (s[3] == 2){
				if (s[2] - s[1] <= 1){
					var str = `Our right node is right next to left node ${s[2]} - ${s[1]} &le; 1 - no node can between them can be covered, we take no action.`;
					if (s[1] == 1) str += `Also, our query was answered, the answer is ${query.cur_ans.values[query.cur_ans.iterator]}`;
					return str;
				}
				if (s[2]%2 == 0) return `Our right node is a left child of its parent - because its index - ${s[2]} - is divisible by 2 - thus, we take no action.`;
				var btn = this.state.vertexes[s[2]-1];
				return `Now, we augment answer with node to the left of our right node: ${query.cur_ans.previous} + ${btn.current()} = ${query.cur_ans.current()}`;
			}
		}

		if (s[0] == 25){
			var btn = this.state.prime_nr;
			return `A prime was sieved - number of sieved primes is thus increased to ${btn.current()}`;
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
export default Segtree_Counter;
