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
		this.bs_butt_width_h=Math.max(40, 10*Math.max(Math.min(10, this.find_logarithm_binom(this.logic.n+this.logic.t-1, this.logic.t-1)), Math.ceil(Math.log10(this.logic.n)) ));
		this.bs_butt_width=`${this.bs_butt_width_h}px`;
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


class Generalized_Iep extends Algorithm{
	calculate_counts(){
		this.logic.counts=[];
		var i=0;
		for (i=0; i<=this.logic.L; i++) this.logic.counts.push(0);
		for (i=0; i<this.logic.a.length; i++){
			if (this.logic.L>=this.logic.a[i])
				this.logic.counts[this.logic.a[i]]++;
		}
	}

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

	constructor(block, n, L, a){
		super(block);
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
		if (s[0]==1) this.pass_color(this.btn_list[s[1]+this.offset][this.pl_leftmost]);
		if (s[0]==2) this.pass_color(this.btn_list[s[1]+this.offset][this.pl_sgn]);
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
}


var feral=Algorithm.ObjectParser(document.getElementById('Algo1'));
var eg1=new Iep(feral, 4, 12, [3, 2, 5, 7]);

var feral2=Algorithm.ObjectParser(document.getElementById('Algo2'));
var eg2=new Generalized_Iep(feral2, 6, 15, [4, 5, 2, 6, 7, 12]);
