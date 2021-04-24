class Iep extends Algorithm{
	//Logic
	//n after k
	calculate_postfac(n, k, mod){
		var res=1;
		if (n-k+1<0) return 0;
		for (var i=n-k+1; i<=n; i++) res=NTMath.mul(res, i, mod);
		return res;
	}

	//Number of digits needed to encode a binom in decimal system
	find_logarithm_binom(n, k){
		var logg=0, i;
		for (i=n-k+1; i<=n; i++) logg+=Math.log10(i);
		for (i=1; i<=k; i++) logg-=Math.log10(i);
		return Math.ceil(logg);
	}
	normalize_mod(x){
		var y=x%this.logic.mod;
		if (y<0) return y+this.logic.mod;
		return y;
	}

	//Calculate results
	calculate_results(pows){
		var bmasks=Bitmasks.calculate_standard_bmasks(pows), i, full_summa=0;

		this.logic.amount_of_bits=bmasks.bits;
		this.logic.leftmost_bit=bmasks.leftmost;
		this.logic.sgn=bmasks.sgn;
		this.logic.summa=[0];
		this.logic.partial_res=[0];
		this.logic.inversed=NTMath.inverse(this.calculate_postfac(this.logic.t-1, this.logic.t-1, this.logic.mod), this.logic.mod);

		for (i=0; i<pows; i++){
			if (i>0){
				this.logic.summa.push(this.logic.summa[i^(1<<this.logic.leftmost_bit[i])]+this.logic.a[this.logic.leftmost_bit[i]]);
				var part=NTMath.mul(this.calculate_postfac(this.logic.n+this.logic.t-1-this.logic.summa[i]-this.logic.amount_of_bits[i], this.logic.t-1, this.logic.mod), this.logic.inversed, this.logic.mod);
				this.logic.partial_res.push(part);
			}
			if (i>0) full_summa=(full_summa+this.logic.partial_res[i]*this.logic.sgn[i])%this.logic.mod;
		}

		var log=this.logic;
		this.logic.full_res=[];
		for (var i=0; i<pows; i++)
			log.full_res[i]=((i==0) ? 0 : ((log.full_res[i-1]+log.partial_res[i]*log.sgn[i])%log.mod));

		this.logic.base_ender=NTMath.mul(this.calculate_postfac(this.logic.n+this.logic.t-1, this.logic.t-1, this.logic.mod), this.logic.inversed, this.logic.mod);

		return full_summa;
	}


	//Add button at the start to a system within div_nr row
	add_button_to_reality(div_nr){
		var btn=this.buttCreator();
		this.zdivs[div_nr].buttons.append(btn);
		this.btn_list[div_nr].push(btn);
	}
	//button defined by row & column - change of iHTML and color
	reform_button_in_reality(row, column, iHTML, color){
		this.Painter(this.btn_list[row][column], color);
		this.btn_list[row][column].innerHTML=iHTML;
	}

	//From 0 to n-1 - m elements
	create_grid(n, m){
		var i, j;
		for (i=0; i<n; i++){
			for (j=0; j<m; j++){
				this.add_button_to_reality(i);
			}
		}
	}

	//Column: name, place, list
	fill_column(column, offset){
		this.reform_button_in_reality(0, column[1], column[0], 5);

		var i;
		for (i=0; i<column[2].length; i++){
			this.reform_button_in_reality(i+offset, column[1], column[2][i], 4);
		}
	}


	//Operations identical in constructor and BeginningExecutor
	palingnesia(){
		this.btn_list=[];
		this.offset=3;
		var i=0, j, pows=1<<this.logic.t, ln=pows+this.offset+1, btn;
		this.divsCreator(1, ln);

		for(i=0; i<ln; i++) this.btn_list.push([]);
		var full_summa=this.calculate_results(pows);

		this.pl_amount=this.logic.t+2;
		this.pl_sgn=this.pl_amount+1;
		this.pl_leftmost=this.pl_sgn+2;
		this.pl_sum=this.pl_leftmost+1;
		this.pl_set_size=this.pl_sum+2;
		this.create_grid(pows+this.offset+1, this.pl_set_size+2);
		var col_n=this.logic.t+1;

		var _tmp_sgn=this.logic.sgn;
		var results=this.logic.partial_res.map(function(e, i){
			return e*_tmp_sgn[i];
		});

		var ints=[];
		for (i=0; i<pows; i++) ints.push(i);
		var order_of_destiny=[[`x`, 0, ints],
			[`n`, col_n, []],
			[`bits`, this.pl_amount, this.logic.amount_of_bits],
			[`sgn`, this.pl_sgn, this.logic.sgn],
			[`left`, this.pl_leftmost, this.logic.leftmost_bit],
			[`sum`, this.pl_sum, this.logic.summa],
			[`|X|`, this.pl_set_size, results]];
		var all_bitmasks=Bitmasks.list_all_bitmasks(this.logic.t);
		
		var ln=all_bitmasks[0].length-1;
		for (i=ln; i>=0; i--){
			var all_those_bits=all_bitmasks.map(e => e[i]);
			this.reform_button_in_reality(1, 1+ln-i, this.logic.a[i], 0);
			order_of_destiny.push([`a<sub>${i}</sub>`, 1+ln-i, all_those_bits])
		}

		for (var order of order_of_destiny){
			this.fill_column(order, this.offset);
		}
		this.reform_button_in_reality(1, col_n, this.logic.n, 8);

		this.reform_button_in_reality(pows+this.offset, this.pl_set_size, 0, 8);
		this.reform_button_in_reality(pows+this.offset, this.pl_set_size+1, this.normalize_mod(this.logic.base_ender-full_summa), 4);
		this.last_in_line=pows+this.offset;
	}

	constructor(block, t, n, a){
		super(block);
		this.logic.t=t;
		this.logic.n=n;
		this.logic.a=a;
		this.logic.mod=1000000007;
		this.palingnesia();
	}

	read_data(){
		var fas=this.input.value;
		var c=this.dissolve_input(fas);
		this.logic.t=c.get_next();
		this.logic.n=c.get_next();
		this.logic.a=[];
		for (var i=0; i<this.logic.t; i++){
			this.logic.a.push(c.get_next());
		}
	}

	caress_style(){
		this.place.style.width=`max-content`;
		this.stylistic.bs_butt_width_h=Math.max(40, 10*Math.max(Math.min(10, this.find_logarithm_binom(this.logic.n+this.logic.t-1, this.logic.t-1)), Math.ceil(Math.log10(this.logic.n)) ));
		this.stylistic.bs_butt_width=`${this.stylistic.bs_butt_width_h}px`;
	}

	BeginningExecutor(){
		this.read_data();
		this.caress_style();
		this.palingnesia();
		this.lees.push([0]);
	}

	StateMaker(){
		var l=this.lees.length;
		var s=this.lees[l-1], i;
		var staat=this.ephemeral.staat, passer=this.ephemeral.passer;

		if (s[0]==0){
			staat.push([0, this.btn_list[0+this.offset][0], 4, 5]);
			for (i=1; i<=this.logic.t; i++){
				staat.push([0, this.btn_list[0+this.offset][i], 4, 1]);
			}
			staat.push([0, this.btn_list[0+this.offset][this.pl_amount], 4, 1]);
			staat.push([0, this.btn_list[0+this.offset][this.pl_leftmost], 4, 1]);
			staat.push([0, this.btn_list[0+this.offset][this.pl_sum], 4, 1]);
		}

		if (s[0]==1){
			if (s[1]>1){
				staat.push([0, this.btn_list[s[1]+this.offset-1][this.pl_set_size], 1, 0]);
				staat.push([0, this.btn_list[this.last_in_line][this.pl_set_size], 1, 8]);
			}
			else{
				for (i=1; i<=this.logic.t; i++){
					staat.push([0, this.btn_list[0+this.offset][i], 1, 0]);
				}
				staat.push([0, this.btn_list[0+this.offset][this.pl_amount], 1, 0]);
				staat.push([0, this.btn_list[0+this.offset][this.pl_leftmost], 1, 0]);
				staat.push([0, this.btn_list[0+this.offset][this.pl_sum], 1, 0]);
			}
			staat.push([0, this.btn_list[s[1]+this.offset][0], 4, 5]);
			for (i=1; i<=this.logic.t; i++){
				staat.push([0, this.btn_list[s[1]+this.offset][i], 4, 1]);
			}
		}

		if (s[0]==2){
			for (i=1; i<=this.logic.t; i++){
				staat.push([0, this.btn_list[s[1]+this.offset][i], 1, 0]);
			}
			staat.push([0, this.btn_list[s[1]+this.offset][this.pl_amount], 4, 1]);
			staat.push([0, this.btn_list[s[1]+this.offset][this.pl_sgn], 4, 1]);

			staat.push([0, this.btn_list[(s[1]>>1)+this.offset][this.pl_amount], 0, 14]);
		}

		if (s[0]==3){
			staat.push([0, this.btn_list[s[1]+this.offset][this.pl_amount], 1, 0]);
			staat.push([0, this.btn_list[s[1]+this.offset][this.pl_sgn], 1, 0]);

			staat.push([0, this.btn_list[(s[1]>>1)+this.offset][this.pl_leftmost], 0, 14]);
			staat.push([0, this.btn_list[(s[1]^(1<<this.logic.leftmost_bit[s[1]]))+this.offset][this.pl_sum], 0, 13]);
			staat.push([0, this.btn_list[1][this.logic.t-this.logic.leftmost_bit[s[1]]], 0, 13]);
			staat.push([0, this.btn_list[(s[1]>>1)+this.offset][this.pl_amount], 14, 0]);

			staat.push([0, this.btn_list[s[1]+this.offset][this.pl_leftmost], 4, 1]);
			staat.push([0, this.btn_list[s[1]+this.offset][this.pl_sum], 4, 1]);
		}

		if (s[0]==4){
			var summary=this.btn_list[this.last_in_line][this.pl_set_size];
			//Czystka
			staat.push([0, this.btn_list[s[1]+this.offset][this.pl_leftmost], 1, 0]);
			staat.push([0, this.btn_list[s[1]+this.offset][this.pl_sum], 1, 0]);
			staat.push([0, this.btn_list[(s[1]>>1)+this.offset][this.pl_leftmost], 14, 0]);
			staat.push([0, this.btn_list[(s[1]^(1<<this.logic.leftmost_bit[s[1]]))+this.offset][this.pl_sum], 13, 0]);
			staat.push([0, this.btn_list[1][this.logic.t-this.logic.leftmost_bit[s[1]]], 13, 0]);
			//Odrodzenie
			staat.push([0, this.btn_list[s[1]+this.offset][this.pl_set_size], 4, 1]);
			staat.push([1, summary, this.logic.full_res[s[1]-1], this.logic.full_res[s[1]]]);
			staat.push([0, summary, 8, 1]);
		}

		if (s[0]==100){
			staat.push([0, this.btn_list[this.last_in_line-1][this.pl_set_size], 1, 0]);
			staat.push([0, this.btn_list[this.last_in_line][this.pl_set_size], 1, 0]);
			staat.push([0, this.btn_list[this.last_in_line][this.pl_set_size+1], 4, 8]);
		}
	}

	StatementComprehension(){
		var l=this.lees.length;
		var s=this.lees[l-1], x=s[1], eq=`&equiv;`;
		var intersect=function(x, t, sep=',', start='{', end='}'){
			var str_res=start, exist=0, i;
			for (i=0; i<t; i++){
				if ((x&(1<<i))>0) {
					if (exist==1) str_res+=sep;
					exist=1;
					str_res+=`A<sub>${i}</sub>`;
				}
			}
			str_res+=end;
			return str_res;
		}

		if (s[0]==0) return `In the beginning of the mechanism, starting values for x=0 are constructed (leftmost bit, amount of bits and sum of a<sub>i</sub>s marked by bit representation), the values for empty set are not used in formula, so they are not used in calculations (though it could be used, if one knows what he wants to do).`;
		if (s[0]==1) return `Next intersection of sets is chosen. It's represented by number x=${x}, its bit representation is shown next to it. As one can see, it represents intersection of sets ${intersect(x, this.logic.t)} (or set of all multisets, which have more than a<sub>i</sub> elements from all those types)`;
		if (s[0]==2) return `Amount of sets A<sub>i</sub> in this intersection is bits(x)=bits(x/2)+x%2, in this case, bits(${x})=bits(${x>>1})+${x%2}=${this.logic.amount_of_bits[x>>1]}+${x%2}=${this.logic.amount_of_bits[x]}, thus sign, with which the resulting size of intersection will be added to the resulting sum is (-1)<sup>${this.logic.amount_of_bits[s[1]]+1}</sup>=${this.logic.sgn[s[1]]}`;
		if (s[0]==3) return `The leftmost bit allows to calculate sum of sizes of sets in this set intersection in O(1), leftmost bit can be calculated as left(x)=left(x/2)+1, in this case, left(${x})=left(${x>>1})+1=${this.logic.leftmost_bit[x>>1]}+1=${this.logic.leftmost_bit[x]+1}, and sum by formula sum(x)=sum(x^2<sup>leftmost_bit(x)</sup>)+a<sub>leftmost_bit(x)</sub> (where ^ represents xor), so sum(${x})=sum(${x}^${1<<this.logic.leftmost_bit[x]})+${this.logic.a[this.logic.leftmost_bit[x]]}=sum(${s[1]^(1<<this.logic.leftmost_bit[x])})+${this.logic.a[this.logic.leftmost_bit[x]]}=${this.logic.summa[x]}</sub>`;
		if (s[0]==4) return `The size of this subset - number of multisets, which belong to ${intersect(x, this.logic.t, `&cap;`, '', '')} - is calculated as Cn(n+t-1-sum(x)-bits(x), t-1)=Cn(${this.logic.n}+${this.logic.t}-1-${this.logic.summa[x]}-${this.logic.amount_of_bits[x]}, ${this.logic.t}-1)=Cn(${this.logic.n+this.logic.t-1-this.logic.summa[x]-this.logic.amount_of_bits[x]}, ${this.logic.t-1})${eq}${Math.abs(this.logic.partial_res[x])} (mod 10<sup9</sup>+7). This result is immediately multiplied by sgn(${s[1]})=${this.logic.sgn[s[1]]} and added to penultimate result in that form.`
		if (s[0]==100){
			var last_full_res=this.logic.full_res[this.logic.full_res.length-1];
			return `In the end, resulting number of multisets, which don't belong to any A<sub>i</sub> is obtained by substracting obtained |A<sub>0</sub> &cup; A<sub>1</sub> &cup; ... &cup; A<sub>t-1</sub>| equivalent to ${last_full_res} from number of multisets of size ${this.logic.n} of ${this.logic.t} types: Cn(${this.logic.n}+${this.logic.t}-1, ${this.logic.t}-1)=Cn(${this.logic.n+this.logic.t-1},${this.logic.t-1})${eq}${this.logic.base_ender} (mod 10<sup>9</sup>+7), resulting in ${this.logic.base_ender}-${last_full_res}${eq}${this.normalize_mod(this.logic.base_ender-last_full_res)} (mod 10<sup>9</sup>+7)`;
		}
	}

	NextState(){
		var l=this.lees.length;
		var s=this.lees[l-1];

		if (s[0]==0) this.lees.push([1, 1]);
		if (s[0]==1) this.lees.push([2, s[1]]);
		if (s[0]==2) this.lees.push([3, s[1]]);
		if (s[0]==3) this.lees.push([4, s[1]]);
		if (s[0]==4 && s[1] < (1<<this.logic.t)-1) this.lees.push([1, s[1]+1]);
		else if (s[0]==4) this.lees.push([100]);
	}
}


//Universal methods for all solutions
class Lord_of_the_combinatorics_trilogy extends Algorithm{
	calculate_counts(){
		this.logic.counts=[];
		var i=0;
		for (i=0; i<=this.logic.L; i++) this.logic.counts.push(0);
		for (i=0; i<this.logic.a.length; i++){
			if (this.logic.L>=this.logic.a[i])
				this.logic.counts[this.logic.a[i]]++;
		}
	}

	recalculate_trivialities(bmask){
		this.logic.sgn=bmask.sgn;
		this.logic.leftmost_bit=bmask.leftmost;
		this.logic.bits=bmask.bits;
	}

	constructor(block, n, L, a){
		super(block);
		this.version=3;
		this.logic.n=n;
		this.logic.L=L
		this.logic.a=a;
		this.palingnesia();
	}

	read_data(){
		var fas=this.input.value;
		var c=this.dissolve_input(fas);
		this.logic.n=c.get_next();
		this.logic.L=c.get_next();
		this.logic.a=[];
		for (var i=0; i<this.logic.n; i++){
			this.logic.a.push(c.get_next());
		}
	}

	BeginningExecutor(){
		this.read_data();
		this.palingnesia();
		this.lees.push([0]);
	}

	scompreh_strings={
		'count':`First, count array informing, how many there are elements a<sub>i</sub> with value x for each x is created, and all elements of array a added to it.`
	}
}

class Generalized_iep extends Lord_of_the_combinatorics_trilogy{
	create_partial_system(left_list, right_list){
		var i=0, basis=0, limit=1, x;
		for (i=0; i<left_list.length; i++) basis|=left_list[i];
		var res_list=[basis];

		for (x of right_list){
			for (i=0; i<limit; i++){
				res_list.push(res_list[i]|x);
			}
			limit*=2;
		}
		return res_list;
	}

	//Magical (1+sqrt(2))^m
	calculate_cut_iep(){
		var i=0, j, pows=[];
		this.logic.partial_pows=[];

		this.logic.botched_count=[];
		this.logic.botched_res=[];

		for (i=1; i<=this.logic.L; i*=2) pows.push(i);
		for (i=0; i<=this.logic.L; i++){
			this.logic.partial_pows.push([]);
			for (j=0; j<pows.length; j++){
				if ((pows[j]|i)==i){
					this.logic.partial_pows[i].push(pows[j]);
				}
			}
			var ln=this.logic.partial_pows[i].length;
			var ln2=ln>>1;
			var part1=this.logic.partial_pows[i].slice(0, ln2), part2=this.logic.partial_pows[i].slice(ln2, ln);

			this.logic.botched_count.push(this.create_partial_system(part1, part2));
			this.logic.botched_res.push(this.create_partial_system(part2, part1));
			this.logic.botched_res[i].pop();
		}
	}

	recalculate_trivialities(bmask){
		this.logic.sgn=bmask.sgn;
		this.logic.leftmost_bit=bmask.leftmost;
		this.logic.bits=bmask.bits;
	}

	formulate_answers(){
		var i, j, tmp_res=0, x;
		this.logic.res=[];
		this.logic.subsequent_answers=[];

		for (i=0; i<=this.logic.L; i++){
			this.logic.subsequent_answers.push([]);
			tmp_res=0;
			for (x of this.logic.botched_count[i]){
				tmp_res+=this.logic.counts[x];
				this.logic.subsequent_answers[i].push(tmp_res);
			}
			for (x of this.logic.botched_res[i]){
				tmp_res+=this.logic.res[x]*this.logic.sgn[i^x];
				this.logic.subsequent_answers[i].push(tmp_res);
			}
			this.logic.res.push(tmp_res);
		}
	}

	logical_box(){
		this.calculate_counts();
		var bmasks=Bitmasks.calculate_standard_bmasks(this.logic.L+1);
		this.calculate_cut_iep();
		this.recalculate_trivialities(bmasks);
		this.formulate_answers();
	}
	

	//From 0 to n-1 - m elements
	create_grid(n, m){
		var i, j;
		for (i=0; i<n; i++){
			for (j=0; j<m; j++){
				this.add_button_to_reality(i);
			}
		}
	}
	//Add button at the start to a system within div_nr row
	add_button_to_reality(div_nr){
		var btn=this.buttCreator();
		this.zdivs[div_nr].buttons.append(btn);
		this.btn_list[div_nr].push(btn);
	}
	//button defined by row & column - change of iHTML and color
	reform_button_in_reality(row, column, iHTML, color){
		this.Painter(this.btn_list[row][column], color);
		this.btn_list[row][column].innerHTML=iHTML;
	}
	//Column: name, place, list
	fill_column(column, offset){
		this.reform_button_in_reality(0, column[1], column[0], 5);

		var i;
		for (i=0; i<column[2].length; i++){
			this.reform_button_in_reality(i+offset, column[1], column[2][i], ((column.length<=3)?4:column[3]));
		}
	}

	//It'z shiet - make it better
	correct_lower_divs(){
		var f1=this.logic.max_bits, f2=1<<((f1>>1)+(f1&1)), btn, i;
		this.buttons={'yi':[], 'sum_count':[], 'sum_res':[]};
		for (i=0; i<f1; i++) {
			btn=this.buttCreator();
			this.lower_div[0].buttons.appendChild(btn);
			this.buttons.yi.push(btn);
		}
		for (i=0; i<f2; i++){
			btn=this.buttCreator();
			this.lower_div[1].buttons.appendChild(btn);
			this.buttons.sum_count.push(btn);

			btn=this.buttCreator();
			this.lower_div[2].buttons.appendChild(btn);
			this.buttons.sum_res.push(btn);
		}
	}

	palingnesia(){
		this.logical_box();

		var i, all_those_bits;
		this.logic.max_bits=Math.ceil(Math.log(this.logic.L)/Math.log(2));
		var all_bitmasks=Bitmasks.list_all_bitmasks(this.logic.max_bits);
		this.offset=1;

		this.pl_leftmost=this.logic.max_bits+2;
		this.pl_sgn=this.pl_leftmost+1;
		this.pl_count=this.pl_sgn+2;
		this.pl_res=this.pl_count+1;

		var num_rows=this.logic.L+this.offset+2;
		this.divsCreator(1, num_rows);
		this.btn_list=[];
		for (i=0; i<num_rows; i++) this.btn_list.push([]);

		this.create_grid(num_rows, this.pl_res+1);

		var ints=[];
		for (i=0; i<=this.logic.L; i++) ints.push(i);
		var order_of_destiny=[[`x`, 0, ints, 5],
			[`sgn`, this.pl_sgn, this.logic.sgn],
			[`left`, this.pl_leftmost, this.logic.leftmost_bit],
			[`cnt`, this.pl_count, this.logic.counts],
			[`res`, this.pl_res, this.logic.sgn.map(e => 0), 8]];
		
		var ln=all_bitmasks[0].length-1;
		for (i=ln; i>=0; i--){
			all_those_bits=all_bitmasks.map(e => e[i]);
			order_of_destiny.push([`bit<sub>${i}</sub>`, 1+ln-i, all_those_bits.slice(0, this.logic.L+1), 0]);
		}

		for (var order of order_of_destiny){
			this.fill_column(order, this.offset);
		}
		this.divsCreator_part();
		this.correct_lower_divs();
	}

	divsCreator_part(){
		var titles=['y<sub>i</sub>: ', 'Sum with count:', 'Sum with res:'];
		this.divsCreator(5, 3, titles, null, ['nothing', 'lower_div']);
	}

	StateMaker(){
		var l=this.lees.length;
		var s=this.lees[l-1], staat=[], i, point=s[2];
		var staat=this.ephemeral.staat, passer=this.ephemeral.passer;

		if (s[0]==1 && s[1]>0){
			var last=s[1]-1;
			for (i=0; i<this.logic.partial_pows[last].length; i++)
				staat.push([0, this.buttons.yi[i], 0, 4]);
			for (i=0; i<this.logic.botched_count[last].length; i++)
				staat.push([0, this.buttons.sum_count[i], 0, 4]);
			for (i=0; i<this.logic.botched_res[last].length; i++)
				staat.push([0, this.buttons.sum_res[i], 0, 4]);
		}

		if (s[0]==0){
			for (i=0; i<=this.logic.L; i++){
				this.pass_color(this.btn_list[i+this.offset][this.pl_count]);
			}
		}
		if (s[0]==1) {
			this.pass_color(this.btn_list[s[1]+this.offset][this.pl_leftmost]);
			if (s[1]!=0)
				this.pass_color(this.btn_list[Math.floor(s[1]/2)+this.offset][this.pl_leftmost], 0);
		}
		if (s[0]==2){
			if (s[1]!=0)
				this.pass_color(this.btn_list[(s[1]^(1<<this.logic.leftmost_bit[s[1]]))+this.offset][this.pl_sgn], 0);
			this.pass_color(this.btn_list[s[1]+this.offset][this.pl_sgn]);
		}
		if (s[0]==3){
			var cor_column=this.logic.max_bits-s[2];
			this.pass_color(this.btn_list[s[1]+this.offset][cor_column], 0, 1, 0);

			if (((1<<s[2])&s[1])>0){
				point=s[3]+1;
				staat.push([1, this.buttons.yi[point], this.buttons.yi[point].innerHTML, this.logic.partial_pows[s[1]][point]]);
				this.pass_color(this.buttons.yi[point]);
			}
		}

		if (s[0]==4){
			for (i=0; i<(this.logic.partial_pows[s[1]].length>>1); i++){
				staat.push([0, this.buttons.yi[i], 0, 12]);
			}
		}
		if (s[0]==5 || s[0]==10){
			staat.push([1, this.buttons.sum_count[point], this.buttons.sum_count[point].innerHTML, this.logic.botched_count[s[1]][point]]);
			staat.push([0, this.buttons.sum_count[point], 4, 1]);
		}
		if (s[0]==5){
			var lft=this.logic.leftmost_bit[s[2]];
			this.pass_color(this.buttons.sum_count[s[2]-(1<<lft)], 0, 14, 0);
			this.pass_color(this.buttons.yi[(this.logic.partial_pows[s[1]].length>>1)+lft], 0, 13, 0);
		}

		if (s[0]==10){
			for (i=0; i<(this.logic.partial_pows[s[1]].length>>1); i++)
				this.pass_color(this.buttons.yi[i], 12, 1, 12);
		}

		if (s[0]==6){
			this.pass_color(this.btn_list[this.logic.botched_count[s[1]][point]+this.offset][this.pl_count], 0, 14);
			this.pass_color(this.btn_list[s[1]+this.offset][this.pl_res], 8, 1, 8);
			staat.push([1, this.btn_list[s[1]+this.offset][this.pl_res], this.btn_list[s[1]+this.offset][this.pl_res].innerHTML, this.logic.subsequent_answers[s[1]][s[2]]]);
			passer.push([0, this.buttons.sum_count[point], 1, 0]);
		}

		if (s[0]==7 || s[0]==11){
			staat.push([1, this.buttons.sum_res[point], this.buttons.sum_res[point].innerHTML, this.logic.botched_res[s[1]][point]]);
			staat.push([0, this.buttons.sum_res[point], 4, 1]);
		}
		if (s[0]==7){
			var lft=this.logic.leftmost_bit[s[2]];
			this.pass_color(this.buttons.sum_res[s[2]-(1<<lft)], 0, 14, 0);
			this.pass_color(this.buttons.yi[lft], 12, 13, 12);
		}
		if (s[0]==11){
			for (i=(this.logic.partial_pows[s[1]].length>>1); i<this.logic.partial_pows[s[1]].length; i++)
				this.pass_color(this.buttons.yi[i], 0, 1, 0);
		}

		if (s[0]==8){
			this.pass_color(this.btn_list[(s[1]^this.logic.botched_res[s[1]][point])+this.offset][this.pl_sgn], 0, 14);
			this.pass_color(this.btn_list[this.logic.botched_res[s[1]][point]+this.offset][this.pl_res], 8, 14, 8);
			this.pass_color(this.btn_list[s[1]+this.offset][this.pl_res], 8, 1, 8);
			staat.push([1, this.btn_list[s[1]+this.offset][this.pl_res], this.btn_list[s[1]+this.offset][this.pl_res].innerHTML, this.logic.subsequent_answers[s[1]][this.logic.botched_count[s[1]].length+s[2]]]);
			passer.push([0, this.buttons.sum_res[point], 1, 0]);
		}
	}

	NextState(){
		var l=this.lees.length;
		var s=this.lees[l-1];

		if (s[0]==0) this.lees.push([1, 0]);
		if (s[0]==1) this.lees.push([2, s[1]]);
		if (s[0]==2) this.lees.push([3, s[1], 0, -1]);

		if (s[0]==3 && s[2]+1<this.logic.max_bits) this.lees.push([3, s[1], s[2]+1, s[3]+((((1<<s[2])&s[1])>0)?1:0)]);
		else if (s[0]==3) this.lees.push([4, s[1]]);

		if (s[0]==4) this.lees.push([10, s[1], 0]);

		if (s[0]==5 || s[0]==10) this.lees.push([6, s[1], s[2]]);
		if  (s[0]==6 && s[2]+1<this.logic.botched_count[s[1]].length) this.lees.push([5, s[1], s[2]+1]);
		else if (s[0]==6 && this.logic.botched_res[s[1]].length>0) this.lees.push([11, s[1], 0]);
		else if (s[0]==6) this.lees.push([1, s[1]+1]);

		if (s[0]==7 || s[0]==11) this.lees.push([8, s[1], s[2]]);
		if  (s[0]==8 && s[2]+1<this.logic.botched_res[s[1]].length) this.lees.push([7, s[1], s[2]+1]);
		else if (s[0]==8 && s[1]<this.logic.L) this.lees.push([1, s[1]+1])

		else if (s[0]==8) this.lees.push([100, 0]);
	}

	StatementComprehension(){
		var l=this.lees.length;
		var s=this.lees[l-1], x=s[1];
		function sub(x){return `<sub>${x}</sub>`}

		if (s[0]==0) return this.scompreh_strings.count;
		if (s[0]==1 && s[1]==0) return `Value of leftmost<sub>${s[1]}</sub>=-1 is calculated to simplify further calculations. Notice that as 0 doesn't have any bits set, this is convenient value for its leftmost bit.`;
		if (s[0]==1) return `Notice, that res${sub(s[1]-1)} was not added to res${sub(s[1]-1)} - because it was not present in the formula, and because it would lead to meaningless equation. Value of leftmost<sub>${s[1]}</sub>=leftmost<sub>${s[1]}/2</sub>+1=leftmost<sub>${s[1]>>1}</sub>+1=${this.logic.leftmost_bit[s[1]]} is calculated to simplify further calculations. Notice that this formula works, because multiplying number by 2 leads to obtaining same number shifted by one bit to the left.`;
		if (s[0]==2 && s[1]==0) return `sgn<sub>x</sub> denotes, whether number of bits of x is odd; for 0, this is not the case, so sgn<sub>0</sub>=-1`;
		if (s[0]==2) return `Value of sgn<sub>${s[1]}</sub>=-sgn<sub>${s[1]}^2<sup>leftmost${sub(s[1])}</sup></sub>=-sgn${sub(s[1]^(1<<this.logic.leftmost_bit[s[1]]))}=${this.logic.sgn[s[1]]} is calculated to simplify further calculations. sgn<sub>x</sub> denotes, whether number of bits of a number is odd or even; and number of bits of same number without one bit has different parity.`;

		if (s[0]==3) return `To calculate res${sub(s[1])}, subsequent set bits of ${s[1]} shall be found; now, the aim is to check, whether ${s[1]} has bit ${s[2]} set. In order to find an answer, one may check, whether ${s[1]}&(1<<${s[2]})=${s[1]&(1<<s[2])}>0; ${((1<<s[2])&s[1])>0?`${s[2]} is thus one of the bits of ${s[1]}, and so, 2<sup>${s[2]}</sup>=${1<<s[2]} is added to list y${sub(s[1])} representing subsequent masks of single bits of ${s[1]}`:`${s[2]} is thus not set in ${s[1]}`}.`;

		if (s[0]==4){
			var allez=this.logic.partial_pows[s[1]].length;
			return `Set of y${sub('i')} is divided into two parts of size differing at most by one in order to calculate res${sub(s[1])} as sum of some res${sub('x')} and some count${sub('z')} - most importantly, amount of used previous values is limited by O(2<sup>bits${sub(s[1])}/2</sup>). As there are ${allez} bits set in ${s[1]}, subsequent sets get ${allez>>1} and ${(allez>>1)+(allez&1)} elements.`;
		}

		if (s[0]==5){
			var lft=this.logic.leftmost_bit[s[2]], pos_y=(this.logic.partial_pows[s[1]].length>>1)+lft, is_continued=((1<<lft)!=s[2]);
			return `In order to calculate still not present value count${sub('x')} in current sequence, one can calculate logical or (or just addition) of ${is_continued?`last used`:`new`} y${sub('i')} - ${this.logic.partial_pows[s[1]][pos_y]} and ${is_continued?`still not added to this value next element existing in sequence`:`first element of existing sequence`} - ${this.logic.botched_count[s[1]][s[2]-(1<<lft)]} resulting in ${this.logic.botched_count[s[1]][s[2]]}`;
		}
		if (s[0]==6) return `Value of count${sub(this.logic.botched_count[s[1]][s[2]])}=${this.logic.counts[this.logic.botched_count[s[1]][s[2]]]} is added to res${sub(s[1])}.`;

		if (s[0]==7){
			var lft=this.logic.leftmost_bit[s[2]], pos_y=lft, is_continued=((1<<lft)!=s[2]);
			return `In order to calculate still not present value res${sub('x')} in current sequence, one can calculate logical or (or just addition) of ${is_continued?`last used`:`new`} y${sub('i')} - ${this.logic.partial_pows[s[1]][pos_y]} and ${is_continued?`still not added to this value next element existing in sequence`:`first element of existing sequence`} - ${this.logic.botched_res[s[1]][s[2]-(1<<lft)]} resulting in ${this.logic.botched_res[s[1]][s[2]]}`;
		}

		if (s[0]==8){
			var bres=this.logic.botched_res[s[1]][s[2]], sgn_cor=bres^s[1];
			return `Value of res${sub(bres)}=${this.logic.res[bres]} multiplied by sgn<sub>${s[1]}^${bres}</sub>=sgn${sub(sgn_cor)}=${this.logic.sgn[sgn_cor]} is added to res${sub(s[1])}. Notice, that ${s[1]}^${bres} has exactly those bits set, that are set in ${s[1]}, but not in ${bres}`;
		}

		if (s[0]==10){
			var all_y=this.logic.partial_pows[s[1]].length, pos_y=(this.logic.partial_pows[s[1]].length>>1), execution_1=``, execution_2=``, finale=``;
			for (i=0; i<pos_y; i++){
				execution_1+=`y${sub(i)}`;
				execution_2+=`${this.logic.partial_pows[s[1]][i]}`;
				if (i<pos_y-1) execution_1+='|', execution_2+='|';
			}
			if (execution_1.length>0) finale=`${execution_1}=${execution_2}=${this.logic.botched_count[s[1]][0]}`;
			else finale=`0`;

			return `Each count${sub('x')} has subset of bits always set; it can be represented as ${finale}. Also, it's one of the numbers, for which count${sub('x')} has to be added to res${sub(s[1])}.`;
		}

		if (s[0]==11){
			var all_y=this.logic.partial_pows[s[1]].length, pos_y=(this.logic.partial_pows[s[1]].length>>1), execution_1=``, execution_2=``, finale=``;
			for (i=pos_y; i<all_y; i++){
				execution_1+=`y${sub(i)}`;
				execution_2+=`${this.logic.partial_pows[s[1]][i]}`;
				if (i<all_y-1) execution_1+='|', execution_2+='|';
			}
			if (execution_1.length>0) finale=`${execution_1}=${execution_2}=${this.logic.botched_res[s[1]][0]}`;
			else finale=`0`;

			return `Each res${sub('x')} has subset of bits always set; it can be represented as ${finale}. Also, it's one of the numbers, for which res${sub('x')} has to be added with sign to res${sub(s[1])}.`;
		}

		if (s[0]==100) return `All values res${sub('x')} were calculated, in the end, resulting table is ${this.logic.res}`;
	}
}

class Dp_iep extends Lord_of_the_combinatorics_trilogy{
	construct_dp(){
		var i=0, j=0, v, value;
		var dp_end=[];

		for (i=0; i<=this.logic.L; i++){
			dp_end.push([]);

			for (v=i, j=0; v>0; v=v^(1<<this.logic.leftmost_bit[v]), j++){
				value=dp_end[i^(1<<this.logic.leftmost_bit[v])][j];
				dp_end[i].push(value);
			}
			dp_end[i].push(this.logic.counts[i]);
			j-=1;

			for (; j>=0; j--){
				dp_end[i][j]=dp_end[i][j]+dp_end[i][j+1];
			}
		}

		this.logic.dp=dp_end;
	}

	logical_box(){
		this.calculate_counts();
		var bmasks=Bitmasks.calculate_standard_bmasks(this.logic.L+1);

		this.logic.max_bits=Math.ceil(Math.log(this.logic.L)/Math.log(2));
		this.logic.all_bitmasks=Bitmasks.list_all_bitmasks(this.logic.max_bits);
		this.logic.all_bits=Bitmasks.list_all_bits(this.logic.all_bitmasks);

		this.logic.max_bits=Math.ceil(Math.log(this.logic.L)/Math.log(2));
		this.recalculate_trivialities(bmasks);
		this.construct_dp();
	}
	
	//From 0 to n-1 - m elements
	create_grid(n, m){
		var i, j, list_of_btns=[];
		for (i=0; i<n; i++){
			list_of_btns.push([]);
			for (j=0; j<m; j++){
				this.add_button_to_reality(i, list_of_btns[i]);
			}
		}
		return list_of_btns;
	}

	//Add button at the start to a system within div_nr row
	add_button_to_reality(div_nr, list_of_btns){
		var btn=this.buttCreator();
		this.zdivs[div_nr].buttons.append(btn);
		list_of_btns.push(btn);
	}
	
	//button defined by row & column - change of iHTML and color
	reform_button_in_reality(btn, iHTML, color){
		this.Painter(btn, color);
		btn.innerHTML=iHTML;
	}

	//System: name, list of values, (opt: color)
	fill_system(system, buttons, starter){
		if (starter!=null){
			this.reform_button_in_reality(starter, system[0], 5);
		}
		var i;

		for (i=0; i<buttons.length; i++){
			this.reform_button_in_reality(buttons[i], system[1][i], ((system.length<=2)?4:system[2]));
		}
	}


	grid_to_buttons(name, rows, cols, grid, index=false){
		var my_buttons=[];
		if (index==false) this.buttons[name]=my_buttons;
		else this.buttons[name].push(my_buttons);

		var ln=0;
		if (ArrayUtils.is_iterable(rows)) ln=rows.length;
		if (ArrayUtils.is_iterable(cols)) ln=cols.length;

		for (var i=0; i<ln; i++){
			my_buttons.push(grid[ArrayUtils.get_elem(rows, i)][ArrayUtils.get_elem(cols, i)]);
		}
	}

	constructor(block, n, L, a){
		super(block, n, L, a);
		this.version=4;
	}

	palingnesia(){
		this.logical_box();
		var i;
		this.offset=1;
		this.buttons={};

		var pl_amount=this.logic.max_bits+2;
		var pl_count=pl_amount+1;
		var pl_dp=pl_count+2;

		var num_rows=this.logic.L+this.offset+2;
		this.divsCreator(1, num_rows);
		var ints=ArrayUtils.range(0, this.logic.L);
		var grid=this.create_grid(num_rows, pl_dp+this.logic.max_bits+1);
		var _range_all_cols=ArrayUtils.range(1, this.logic.L+1);

		var order_of_destiny=[
			[[`x`, ints, 5], 0, 'x'],
			[[`bits`, this.logic.bits, 4], pl_amount, 'amount_of_bits'],
			[[`cnt`, this.logic.counts, 4], pl_count, 'counts']
		];
		
		for (var order of order_of_destiny){
			this.grid_to_buttons(order[2], _range_all_cols, order[1], grid);
			this.fill_system(order[0], this.buttons[order[2]], grid[0][order[1]]);
		}

		//Chujowo - powtarza się całość - na razie zostaw
		var _range_bits=ArrayUtils.range(this.logic.max_bits, 1, -1);
		var _range_dp=ArrayUtils.range(pl_dp, pl_dp+this.logic.max_bits);

		this.buttons['bits']=[];
		this.buttons['dp']=[];
		for (i=0; i<=this.logic.L; i++){
			this.grid_to_buttons('bits', i+this.offset, _range_bits, grid, true);
			this.fill_system(['', this.logic.all_bitmasks[i], 0], this.buttons.bits[i]);
		}
		for (i=0; i<=this.logic.L+1; i++) 
			this.grid_to_buttons('dp', i+this.offset, _range_dp, grid, true);

		for (i=0; i<this.logic.max_bits; i++)
			this.reform_button_in_reality(grid[0][1+i], `bit<sub>${this.logic.max_bits-i-1}</sub>`, 5);

		for (i=0; i<=this.logic.max_bits; i++)
			this.reform_button_in_reality(grid[0][pl_dp+i], `dp<sub>x,${i}</sub>`, 5);
	}


	StateMaker(){
		var l=this.lees.length;
		var s=this.lees[l-1], staat=[], i;
		var staat=this.ephemeral.staat, passer=this.ephemeral.passer;

		if (s[0]==0){
			for (i=0; i<=this.logic.L; i++){
				this.pass_color(this.buttons.counts[i], 0, 1);
			}
		}

		if (s[0]==1) {
			this.pass_color(this.buttons.amount_of_bits[s[1]]);
			if (s[1]!=0){
				this.pass_color(this.buttons.amount_of_bits[Math.floor(s[1]/2)], 0, 14);
				this.pass_color(this.buttons.bits[s[1]][0], 0, 14);
			}
		}

		if (s[0]==4){
			var last_bit=this.logic.bits[s[1]];
			this.pass_color(this.buttons.dp[s[1]][last_bit]);
			staat.push([1, this.buttons.dp[s[1]][last_bit], 0, this.logic.dp[s[1]][last_bit]]);
			this.pass_color(this.buttons.counts[s[1]], 0, 14);
		}

		if (s[0]==5){
			var old_col=(s[2]==0?8:0);
			var used=this.logic.all_bits[s[1]][this.logic.bits[s[1]]-s[2]-1];
			var eld=s[1]^(1<<used);

			//All below is highly controversial
			this.pass_color(this.buttons.bits[s[1]][used], 0, 13, 0);
			this.pass_color(this.buttons.bits[eld][used], 0, 13, 0);
			for (i=0; i<this.logic.max_bits; i++){
				if (i==used) continue;
				this.pass_color(this.buttons.bits[s[1]][i], 0, 15, 0);
				this.pass_color(this.buttons.bits[eld][i], 0, 15, 0);
			}
			//*************************

			this.pass_color(this.buttons.dp[eld][s[2]], old_col, 13, old_col);
			this.pass_color(this.buttons.dp[s[1]][s[2]]);
			staat.push([1, this.buttons.dp[s[1]][s[2]], 0, this.logic.dp[s[1]][s[2]]]);
			this.pass_color(this.buttons.dp[s[1]][s[2]+1], 0, 14);
		}

		//Na końcu - nadpisze poprzednie zmiany; kolor na złoty iff result
		if ((s[0]==4 && s[1]==0) || (s[0]==5 && s[2]==0)){
			passer.push([0, this.buttons.dp[s[1]][0], 0, 8]);
		}
	}

	NextState(){
		var l=this.lees.length;
		var s=this.lees[l-1];

		if (s[0]==0) return [1, 0];

		//if (s[0]==1 && s[1]!=0) return [2, s[1], 0];
		if (s[0]==1) return [4, s[1]];

		if (s[0]==4 && s[1]!=0) return [5, s[1], this.logic.bits[s[1]]-1];
		if (s[0]==4 && this.logic.L>0) return [1, s[1]+1];
		if (s[0]==4) return [100];

		if (s[0]==5 && s[2]>0) return [5, s[1], s[2]-1];
		if (s[0]==5 && s[1]==this.logic.L) return [100];
		if (s[0]==5) return [1, s[1]+1];
	}

	StatementComprehension(){
		var l=this.lees.length;
		var s=this.lees[l-1], x=s[1];

		if (s[0]==0) return this.scompreh_strings.count;
		if (s[0]==1 && s[1]==0) return `Number of bits of 0 is equal to 0.`;
		if (s[0]==1) return `Number of bits of ${s[1]} - denoted by bits<sub>${s[1]}</sub> - is calculated using fact, that number of bits of a number is equal to sum of number of bits of this number except its last bit - this number can be obtained as ${s[1]}>>1=${s[1]>>1} - and 1, if its last bit is set (one may check whether last bit is set by checking whether ${s[1]}&1 is equal to one). In this case, bits<sub>${s[1]}</sub> = bits<sub>${s[1]>>1}</sub>+${s[1]}&1 = ${this.logic.bits[s[1]>>1]}+${s[1]&1} = ${this.logic.bits[s[1]]}`;

		if (s[0]==4) return `Now, the aim is to obtain dp<sub>${s[1]},b</sub>, where b denotes number of bits of ${s[1]}. As this number denotes sum of values of count<sub>&sigma;</sub> for &sigma; with all bits of ${s[1]} set (and only bits of ${s[1]} set - so only ${s[1]} satisfies this constraint), and as b=${this.logic.bits[s[1]]}, then dp<sub>${s[1]},${this.logic.bits[s[1]]}</sub>=count<sub>${s[1]}</sub>=${this.logic.counts[s[1]]}`;
		if (s[0]==5){
			var used=this.logic.all_bits[s[1]][this.logic.bits[s[1]]-s[2]-1];
			var bitty=this.logic.dp[s[1]][s[2]+1];
			var bitless=this.logic.dp[s[1]^(1<<used)][s[2]];
			var res=this.logic.dp[s[1]][s[2]];

			return `First of all, b<sub>${s[2]+1}</sub>=${used} for ${s[1]}. dp<sub>${s[1]},${s[2]}</sub> is defined as sum of counts of numbers with all previous bits (b<sub>f</sub> for f &le; ${s[2]}) set, and all further bits possibly set. b<sub>${s[2]+1}</sub> is either set or not set; in the first case, sum of all relevant count<sub>&sigma;</sub> is equal to dp<sub>${s[1]}^(1&lt;&lt;b<sub>${s[2]+1}</sub>),${s[2]}</sub> = dp<sub>${s[1]^(1<<used)},${s[2]}</sub>=${bitless}; in the second, sum of all relevant count<sub>&sigma;</sub> with bit b<sub>${s[2]+1}</sub> set is equal to dp<sub>${s[1]},${s[2]}+1</sub>=${bitty}. Overall, dp<sub>${s[1]},${s[2]}</sub> = dp<sub>${s[1]^(1<<used)},${s[2]}</sub> + dp<sub>${s[1]},${s[2]+1}</sub>=${bitty}+${bitless}=${res}`;
		}

		if (s[0]==100) return `All values dp<sub>x,0</sub> were calculated, in the end, resulting table is ${this.logic.dp.map(function(e){return e[0]})}`;
	}
}

class Submasks extends Algorithm{
	logical_box(){
		var x=this.logic.a, last=1, i, s;
		this.logic.submasks=[0];
		this.logic.y=[];
		this.logic.bits=[];
		this.logic.bit_no=[];
		this.logic.amount_bits=0;
		this.logic.amount_set_bits=0;

		while (x>0){
			this.logic.y.push(last);
			this.logic.bit_no.push(this.logic.amount_set_bits);
			if ((x%2)==0) this.logic.bits.push(0);
			else{
				this.logic.bits.push(1);
				s=this.logic.submasks.length;
				this.logic.amount_set_bits+=1;
				for (i=0; i<s; i++) this.logic.submasks.push(this.logic.submasks[i]+last);
			}
			x=Math.floor(x/2);
			last*=2;
			this.logic.amount_bits+=1;
		}
	}

	palingnesia(){
		this.logical_box();
		this.buttons={'bits':[], 'repr':[], 'y':[], 'submasks':[], 'repr_10':null};
		var lst=this.modern_divsCreator(7, 5, ['Bit number', 'Representations of a', '2<sup>bit_no</sup>', '', 'Submasks'], '50px');
		this.construction_site=lst.zdivs;

		var i=0, btn, system=[['bits', 0, ArrayUtils.range(this.logic.amount_bits-1, 0, -1), 5, true], 
			['repr', 1, ArrayUtils.revert(this.logic.bits), 0, true], 
			['y', 2, ArrayUtils.revert(this.logic.y), 0, true], 
			['submasks', 4, this.logic.submasks, 4, false], 
		];

		var tmp_lst;
		for (var x of system){
			tmp_lst=Representation_utils.fill_with_buttons_horizontal(this.stylistic, this.construction_site[x[1]].buttons, x[2], x[3]);
			if (x[4]==true) this.buttons[x[0]]=ArrayUtils.revert(tmp_lst);
			else this.buttons[x[0]]=tmp_lst;
		}
		this.buttons.repr_10=Representation_utils.fill_with_buttons_horizontal(this.stylistic, this.construction_site[1].midian, this.logic.a, 5, 1)[0];
	}

	read_data(){
		var fas=this.input.value;
		var c=this.dissolve_input(fas);
		this.logic.a=c.get_next();
	}

	BeginningExecutor(){
		this.read_data();
		this.palingnesia();
		this.lees.push([0, 0]);
	}

	constructor(block, a){
		super(block);
		this.logic.a=a;
		this.version=4;
		this.palingnesia();
	}

	StateMaker(){
		var l=this.lees.length;
		var s=this.lees[l-1], staat=[], i;
		var staat=this.ephemeral.staat, passer=this.ephemeral.passer;

		if (s[0]==0){
			this.pass_color(this.buttons.submasks[0]);
		}

		if (s[0]==1){
			var x=s[1];
			this.pass_color(this.buttons.repr[x], 0, 1);
			this.pass_color(this.buttons.y[x], 0, 14);
			this.pass_color(this.buttons.repr_10, 5, 14, 5);
		}

		if (s[0]==2){
			staat.push([0, this.buttons.submasks[s[1]-1], 0, 15]);
			passer.push([0, this.buttons.y[s[3]], 0, 14]);
		}
		if (s[0]==3){
			this.pass_color(this.buttons.submasks[s[2]+s[1]]);

			if (s[2]+1==s[1]){
				passer.push([0, this.buttons.submasks[s[1]-1], 15, 0]);
				passer.push([0, this.buttons.y[s[3]], 14, 0]);
				this.pass_color(this.buttons.submasks[s[2]], 15, 14);
			}
			else this.pass_color(this.buttons.submasks[s[2]], 0, 14);
		}
		if (s[0]==100){
			for (var x of this.buttons.submasks){
				staat.push([0, x, 0, 8]);
			}
		}
	}

	NextState(){
		var l=this.lees.length;
		var s=this.lees[l-1];

		if (s[0]==0) return [1, 0];
		if (s[0]==1 && this.logic.bits[s[1]]==0) return [1, s[1]+1];
		if (s[0]==1) return [2, this.logic.y[this.logic.bit_no[s[1]]], -1, s[1]];

		if (s[0]==2 || (s[0]==3 && s[2]+1<s[1])) return [3, s[1], s[2]+1, s[3]];
		if (s[0]==3 && s[3]+1<this.logic.amount_bits) return [1, s[3]+1];
		if (s[0]==3) return [100];
	}

	StatementComprehension(){
		var l=this.lees.length;
		var s=this.lees[l-1], x=s[1];
		function get_bin_repr(x){
			return `(${Bitmasks.calculate_binary(x, this.logic.y).join('')})<sub>2</sub>`;
		}
		if (s[0]==0) return `Our aim is to find all submasks of ${this.logic.a}. Notice, that a submask can be created by taking smaller submask and adding some alien, previously unused bit to it; however, there has to be some initial submask, in order for this method to work; and 0 is quite perfect initial submask, because it is submask of any possible a, and it cannot be created by our method in any other way - because it relies on adding bit to an existing number, and 0 doesn't have any bit set.`;
		if (s[0]==1) return `Now, perhaps it's time to check, which bit can be added to all our previous submasks? How to check, whether bit no. h=${s[1]} is set in a=${this.logic.a}? One can do it, for example, by definition - check, whether a=a|2<sup>h</sup>, whether ${this.logic.y[s[1]]}</sup>|${this.logic.a}=${this.logic.a}. As bit no. ${s[1]} is ${(this.logic.bits[s[1]]==1)?`set, then we can create new submasks from all currently known submasks by enchancing them with our newly found bit`:`not set, then we can proceed further in our quest to find set bits of ${this.logic.a} - no submask can have this bit set`}.`;
		if (s[0]==2) return `Time to handle purely implementational nuissance: we store all submasks in one array. Some - say x elements are already stored, some new x elements will be stored as an effect of enchancing all previously existing elements with new bit. How to find out, whether we should enchance next numbers or rather end this part of the algorithm? For example, by storing index of last element of current list of submasks (there is a myriad of ways to solve this problem, this one looks elegant on visualization). By the way, index is equal to ${s[1]-1}.`;
		if (s[0]==3){
			var rep_1=get_bin_repr.call(this, this.logic.submasks[s[2]]);
			var rep_2=get_bin_repr.call(this, this.logic.y[s[3]]);
			var rep_last=get_bin_repr.call(this, this.logic.submasks[s[2]+s[1]]);

			return `Now, let's take ${s[2]==0?`first`:`next`} already created submask. It has binary representation ${rep_1}. Our new bit can be represented as submask ${rep_2}. Then, new submask results from enchancing - logical or - equal to ${rep_1}|${rep_2}=${rep_last}=${this.logic.submasks[s[2]+s[1]]}. Notice, that as both numbers don't have common bits, it is equivalent to their standard addition: ${this.logic.submasks[s[2]]}+${this.logic.y[s[3]]}=${this.logic.submasks[s[2]+s[1]]}.${s[2]+1==s[1]?` It was last submask, that can be created using previously obtained submasks.`:``}`;
		}
		if (s[0]==100) return `All submasks of ${this.logic.a} were already obtained, thus, there is nothing left to do. Submasks of ${this.logic.a} are: ${this.logic.submasks}`
	}
}


var feral=Algorithm.ObjectParser(document.getElementById('Algo1'));
var eg1=new Iep(feral, 4, 12, [3, 2, 5, 7]);

var feral2=Algorithm.ObjectParser(document.getElementById('Algo2'));
var eg2=new Generalized_iep(feral2, 6, 15, [4, 5, 2, 6, 7, 12]);

var feral3=Algorithm.ObjectParser(document.getElementById('Algo3'));
var eg3=new Dp_iep(feral3, 6, 15, [4, 5, 2, 6, 7, 12]);

var feral4=Algorithm.ObjectParser(document.getElementById('Algo4'));
var eg4=new Submasks(feral4, 86);
