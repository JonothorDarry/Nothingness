class Iep extends Algorithm{

	add_button_to_reality=function(div_nr, name, color){
		var btn=this.buttCreator(name);
		this.Painter(btn, color);
		this.zdivs[div_nr][0].append(btn);
		this.btn_list[div_nr].push(btn);
	}

	calculate_postfac(n, k, mod){
		var res=1;
		if (n-k+1<0) return 0;
		for (var i=n-k+1; i<=n; i++) res=NTMath.mul(res, i, mod);
		return res;
	}

	find_logarithm_binom(n, k){
		var logg=0, i;
		for (i=n-k+1; i<=n; i++) logg+=Math.log10(i);
		for (i=1; i<=k; i++) logg-=Math.log10(i);
		return Math.ceil(logg);
	}
	shapeshift(x){
		var y=x%this.mod;
		if (y<0) return y+this.mod;
		return y;
	}

	palingnesia(){
		this.btn_list=[];
		var i=0, j, pows=1<<this.t, ln=pows+4, btn, full_summa=0;
		this.divsCreator(1, ln);

		for(i=0; i<ln; i++) this.btn_list.push([]);
		this.inversed=NTMath.inverse(this.calculate_postfac(this.t-1, this.t-1, this.mod), this.mod);

		this.amount_of_bits=[0];
		this.leftmost_bit=[-1];
		this.sgn=[];
		this.summa=[0];

		this.partial_res=[0];
		this.full_res=0;

		this.add_button_to_reality(0, `x`, 5);
		this.add_button_to_reality(1, ``, 4);
		for (i=this.t-1; i>=0; i--){
			this.add_button_to_reality(0, `a<sub>${i}</sub>`, 5);
			this.add_button_to_reality(1, `${this.a[i]}`, 0);
		}
		this.add_button_to_reality(0, `n`, 5);
		this.add_button_to_reality(1, `${this.n}`, 8);

		var order_of_destiny=[`bits`, `sgn`, ``, `left`, `sum`, ``, `|X|`];
		for (i=0; i<order_of_destiny.length; i++){
			this.add_button_to_reality(0, order_of_destiny[i], order_of_destiny[i]==``?4:5);
		}

		this.pl_amount=this.t+2;
		this.pl_leftmost=this.pl_amount+3;
		this.pl_sum=this.pl_leftmost+3;

		for (i=0; i<pows; i++){
			//Numbers
			this.add_button_to_reality(i+3, i, 4);
			for (j=this.t-1; j>=0; j--){
				if ((i&(1<<j))>0) 
					this.add_button_to_reality(i+3, 1, 4);
				else 
					this.add_button_to_reality(i+3, 0, 4);
			}
			this.add_button_to_reality(i+3, '', 4);
			if (i>0){
				this.amount_of_bits.push(this.amount_of_bits[Math.floor(i/2)]+i%2);
				this.leftmost_bit.push(this.leftmost_bit[Math.floor(i/2)]+1);
				this.summa.push(this.summa[i^(1<<this.leftmost_bit[i])]+this.a[this.leftmost_bit[i]]);
				this.partial_res.push(NTMath.mul(this.calculate_postfac(this.n+this.t-1-this.summa[i]-this.amount_of_bits[i], this.t-1, this.mod), this.inversed, this.mod));
			}
			this.sgn.push(this.amount_of_bits[i]%2==0?-1:1);
			if (i>0) full_summa=full_summa+this.partial_res[i]*this.sgn[i];

			this.add_button_to_reality(i+3, this.amount_of_bits[i], 4);
			this.add_button_to_reality(i+3, this.sgn[i], 4);

			this.add_button_to_reality(i+3, '', 4);

			this.add_button_to_reality(i+3, this.leftmost_bit[i], 4);
			this.add_button_to_reality(i+3, this.summa[i], 4);

			this.add_button_to_reality(i+3, '', 4);
			this.add_button_to_reality(i+3, this.sgn[i]*this.partial_res[i], 4);
		}
		for (i=0; i<this.pl_sum; i++) this.add_button_to_reality(pows+3, '', 4);
		
		this.add_button_to_reality(pows+3, 0, 8);
		this.base_ender=NTMath.mul(this.calculate_postfac(this.n+this.t-1, this.t-1, this.mod), this.inversed, this.mod);
		this.add_button_to_reality(pows+3, this.shapeshift(this.base_ender-full_summa), 4);
		this.last_in_line=pows+3;
	}

	constructor(block, t, n, a){
		super(block);
		this.t=t;
		this.n=n;
		this.a=a;
		this.mod=1000000007;
		this.palingnesia();
	}

	BeginningExecutor(){
		this.starter();
		var fas=this.input.value;
		var c=this.dissolve_input(fas);
		this.t=c.get_next();
		this.n=c.get_next();
		this.a=[];
		for (var i=0; i<this.t; i++){
			this.a.push(c.get_next());
		}

		this.bs_butt_width_h=Math.max(40, 10*Math.max(Math.min(10, this.find_logarithm_binom(this.n+this.t-1, this.t-1)), Math.ceil(Math.log10(this.n)) ));
		this.bs_butt_width=`${this.bs_butt_width_h}px`;

		this.palingnesia();
		this.place.style.width=`${(this.pl_sum+1)*this.bs_butt_width_h+210}px`;
		this.lees.push([0]);
	}

	StateMaker(){
		var l=this.lees.length;
		var s=this.lees[l-1], staat=[], i;

		if (s[0]==0){
			staat.push([0, this.btn_list[0+3][0], 4, 5]);
			for (i=1; i<=this.t; i++){
				staat.push([0, this.btn_list[0+3][i], 4, 1]);
			}
			staat.push([0, this.btn_list[0+3][this.pl_amount], 4, 1]);
			staat.push([0, this.btn_list[0+3][this.pl_leftmost], 4, 1]);
			staat.push([0, this.btn_list[0+3][this.pl_leftmost+1], 4, 1]);
		}

		if (s[0]==1){
			if (s[1]>1){
				staat.push([0, this.btn_list[s[1]+2][this.pl_sum], 1, 0]);
				staat.push([0, this.btn_list[this.last_in_line][this.pl_sum], 1, 8]);
			}
			else{
				for (i=1; i<=this.t; i++){
					staat.push([0, this.btn_list[0+3][i], 1, 0]);
				}
				staat.push([0, this.btn_list[0+3][this.pl_amount], 1, 0]);
				staat.push([0, this.btn_list[0+3][this.pl_leftmost], 1, 0]);
				staat.push([0, this.btn_list[0+3][this.pl_leftmost+1], 1, 0]);
			}
			staat.push([0, this.btn_list[s[1]+3][0], 4, 5]);
			for (i=1; i<=this.t; i++){
				staat.push([0, this.btn_list[s[1]+3][i], 4, 1]);
			}
		}

		if (s[0]==2){
			for (i=1; i<=this.t; i++){
				staat.push([0, this.btn_list[s[1]+3][i], 1, 0]);
			}
			staat.push([0, this.btn_list[s[1]+3][this.pl_amount], 4, 1]);
			staat.push([0, this.btn_list[s[1]+3][this.pl_amount+1], 4, 1]);

			staat.push([0, this.btn_list[(s[1]>>1)+3][this.pl_amount], 0, 14]);
		}

		if (s[0]==3){
			staat.push([0, this.btn_list[s[1]+3][this.pl_amount], 1, 0]);
			staat.push([0, this.btn_list[s[1]+3][this.pl_amount+1], 1, 0]);

			staat.push([0, this.btn_list[(s[1]>>1)+3][this.pl_leftmost], 0, 14]);
			staat.push([0, this.btn_list[(s[1]^(1<<this.leftmost_bit[s[1]]))+3][this.pl_leftmost+1], 0, 13]);
			staat.push([0, this.btn_list[1][this.t-this.leftmost_bit[s[1]]], 0, 13]);
			staat.push([0, this.btn_list[(s[1]>>1)+3][this.pl_amount], 14, 0]);

			staat.push([0, this.btn_list[s[1]+3][this.pl_leftmost], 4, 1]);
			staat.push([0, this.btn_list[s[1]+3][this.pl_leftmost+1], 4, 1]);
		}

		if (s[0]==4){
			var summary=this.btn_list[this.last_in_line][this.pl_sum];
			//Czystka
			staat.push([0, this.btn_list[s[1]+3][this.pl_leftmost], 1, 0]);
			staat.push([0, this.btn_list[s[1]+3][this.pl_leftmost+1], 1, 0]);
			staat.push([0, this.btn_list[(s[1]>>1)+3][this.pl_leftmost], 14, 0]);
			staat.push([0, this.btn_list[(s[1]^(1<<this.leftmost_bit[s[1]]))+3][this.pl_leftmost+1], 13, 0]);
			staat.push([0, this.btn_list[1][this.t-this.leftmost_bit[s[1]]], 13, 0]);
			//Odrodzenie
			staat.push([0, this.btn_list[s[1]+3][this.pl_sum], 4, 1]);
			staat.push([1, summary, this.full_res, (this.full_res+this.partial_res[s[1]]*this.sgn[s[1]])%this.mod]);
			staat.push([3, 'full_res', this.full_res, (this.full_res+this.partial_res[s[1]]*this.sgn[s[1]])%this.mod]);
			staat.push([0, summary, 0, 1]);
		}

		if (s[0]==100){
			staat.push([0, this.btn_list[this.last_in_line-1][this.pl_sum], 1, 0]);
			staat.push([0, this.btn_list[this.last_in_line][this.pl_sum], 1, 0]);
			staat.push([0, this.btn_list[this.last_in_line][this.pl_sum+1], 4, 8]);
		}

		this.transformator(staat);
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
		if (s[0]==1) return `Next intersection of sets is chosen. It's represented by number x=${x}, its bit representation is shown next to it. As one can see, it represents intersection of sets ${intersect(x, this.t)} (or set of all multisets, which have more than a<sub>i</sub> elements from all those types)`;
		if (s[0]==2) return `Amount of sets A<sub>i</sub> in this intersection is bits(x)=bits(x/2)+x%2, in this case, bits(${x})=bits(${x>>1})+${x%2}=${this.amount_of_bits[x>>1]}+${x%2}=${this.amount_of_bits[x]}, thus sign, with which the resulting size of intersection will be added to the resulting sum is (-1)<sup>${this.amount_of_bits[s[1]]+1}</sup>=${this.sgn[s[1]]}`;
		if (s[0]==3) return `The leftmost bit allows to calculate sum of sizes of sets this intersection in O(1), leftmost bit can be calculated as left(x)=left(x/2)+1, in this case, left(${x})=left(${x>>1})+1=${this.leftmost_bit[x>>1]}+1=${this.leftmost_bit[x]+1}, and sum by formula sum(x)=sum(x^2<sup>leftmost_bit(x)</sup>)+a<sub>leftmost_bit(x)</sub> (where ^ represents xor), so sum(${x})=sum(${x}^${1<<this.leftmost_bit[x]})+${this.a[this.leftmost_bit[x]]}=sum(${s[1]^(1<<this.leftmost_bit[x])})+${this.a[this.leftmost_bit[x]]}=${this.summa[x]}</sub>`;
		if (s[0]==4) return `The size of this subset - number of multisets, which belong to ${intersect(x, this.t, `&cap;`, '', '')} - is calculated as Cn(n+t-1-sum(x)-bits(x), t-1)=Cn(${this.n}+${this.t}-1-${this.summa[x]}-${this.amount_of_bits[x]}, ${this.t}-1)=Cn(${this.n+this.t-1-this.summa[x]-this.amount_of_bits[x]}, ${this.t-1})${eq}${Math.abs(this.partial_res[x])} (mod 10<sup9</sup>+7). This result is immediately multiplied by sgn(${s[1]})=${this.sgn[s[1]]} and added to penultimate result in that form.`
		if (s[0]==100) return `In the end, resulting number of multisets, which don't belong to any A<sub>i</sub> is obtained by substracting obtained |A<sub>0</sub> &cup; A<sub>1</sub> &cup; ... &cup; A<sub>t-1</sub>| equivalent to ${this.full_res} from number of multisets of size ${this.n} of ${this.t} types: Cn(${this.n}+${this.t}-1, ${this.t}-1)=Cn(${this.n+this.t-1},${this.t-1})${eq}${this.base_ender} (mod 10<sup>9</sup>+7), resulting in ${this.base_ender}-${this.full_res}${eq}${this.shapeshift(this.base_ender-this.full_res)} (mod 10<sup>9</sup>+7)`;
	}

	NextState(){
		var l=this.lees.length;
		var s=this.lees[l-1];

		if (s[0]==0) this.lees.push([1, 1]);
		if (s[0]==1) this.lees.push([2, s[1]]);
		if (s[0]==2) this.lees.push([3, s[1]]);
		if (s[0]==3) this.lees.push([4, s[1]]);
		if (s[0]==4 && s[1] < (1<<this.t)-1) this.lees.push([1, s[1]+1]);
		else if (s[0]==4) this.lees.push([100]);
	}
}

var feral=Algorithm.ObjectParser(document.getElementById('Algo1'));
var eg1=new Iep(feral, 4, 12, [3, 2, 5, 7]);
