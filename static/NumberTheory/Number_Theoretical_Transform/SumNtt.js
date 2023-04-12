import Algorithm from '../../Base/Algorithm.js';
import Modern_representation from '../../Base/Modern_representation.js';
import NTMath from '../../Base/NTMath.js';

class SumNtt extends Algorithm{
	//Stwórz widok wielomianu
	create_reality(n, s){
		this.logic.n=n;
		this.s=s;

		this.reducts=[]; //Polynominal buttons
		this.poly=[];
		var poly=this.poly;

		var square_size = 45;
		this.stylistic.bs_butt_width=`${square_size}px`;
		this.stylistic.bs_butt_height=`${square_size}px`;

		this.layers=Math.ceil(Math.log2(this.logic.n))+1;
		var i, j, ij;

		//Creating subsequent polynominals
		for (i=0; i<this.layers; i++){
			this.poly.push([]);
			if (i==0){
				for (j=0; j<this.logic.n; j++){
					poly[i].push([]);
					for (ij=0; ij<=this.s[j]; ij++) poly[i][j].push(0);
					poly[i][j][0]=poly[i][j][this.s[j]]=1;
				}
				continue;
			}

			for (j=0; j<poly[i-1].length; j+=2){
				if (j==poly[i-1].length-1)
					poly[i].push(poly[i-1][j]);
				else
					poly[i].push(NTMath.multiply_polynominals(poly[i-1][j], poly[i-1][j+1]));
			}
		}

		this.divsCreator();

		//Creating content within layers: layer, polynominal, coeff
		for (ij=0; ij<this.layers; ij++){
			this.reducts.push([]);
			for (i=0; i<this.poly[ij].length; i++){
				this.reducts[ij].push([]);
				for (j=0; j<this.poly[ij][i].length; j++){
					var double_butt=super.doubleButtCreator(null, super.buttCreator.bind(this));
					if (ij==0){
						super.Painter(double_butt[1], 101);
						super.Painter(double_butt[2], 0);
					}
					else{
						super.Painter(double_butt[1], 4);
						super.Painter(double_butt[2], 4);
					}
					double_butt[0].style.height=`${square_size}px`;
					double_butt[0].style.width=`${square_size}px`;

					Modern_representation.button_modifier(double_butt[2], {'stylistic': {'px':{'height':square_size, 'width':square_size, 'lineHeight':square_size+10}, 'general':{'verticalAlign':'bottom'}}});
					Modern_representation.button_modifier(double_butt[1], {'stylistic':{'px':{'width':20, 'right':0}, 'general':{'zIndex':2}}});

					double_butt[2].innerHTML=poly[ij][i][j];
					double_butt[1].innerHTML=j;

					this.reducts[ij][i].push([double_butt[1], double_butt[2]]);
					this.zdivs[ij].buttons.appendChild(double_butt[0]);
				}

				for (j=0; j<(1<<(ij+1))-1; j++){
					var add_butt = Modern_representation.button_creator('', {'px':{'width':square_size, 'height':square_size}});//super.buttCreator();
					this.zdivs[ij].buttons.appendChild(add_butt);
				}
			}
		}
		this.place.style.width=`max-content`;
	}

	constructor(block, n, lst){
		super(block);
		this.create_reality(n, lst);
	}

	BeginningExecutor(){
		var n, s=[];
		this.pass_to_next_state=[];

		//read input
		var fas=this.input.value, c;
		c=this.dissolve_input(fas);
		n=c.get_next();
		for (i=0;i<n;i++) s.push(c.get_next());

		this.create_reality(n, s);
		this.lees.push([0]);
	}

	StateMaker(s){
		var i=0, n=this.logic.n, v1=s[1], v2=s[2], passer=[];
		var staat=this.ephemeral.staat, passer=this.ephemeral.passer;

		if (s[0]==1){
			for (i=0; i<this.poly[v1][v2].length; i++){
				staat.push([0, this.reducts[v1][v2][i][0], 4, 101]);

				staat.push([0, this.reducts[v1][v2][i][1], 4, 1]);
				if (v1!=this.layers-1) passer.push([0, this.reducts[v1][v2][i][1], 1, 0]); //Problem dependant - don't overwrite, if search is for all elements
			}
			this.colorful_polynominal(this.reducts[v1-1][v2*2], staat, passer, 0, 13, 0);
			if (v2!=this.poly[v1].length-1 || this.poly[v1-1].length%2==0) this.colorful_polynominal(this.reducts[v1-1][v2*2+1], staat, passer, 0, 13, 0);
		}


		if (s[0]==101){
			for (i=0; i<this.poly[this.layers-1][0].length; i++){
				staat.push([0, this.reducts[this.layers-1][0][i][1], 1, 8]);
			}
		}
	}

	NextState(){
		var l=this.lees.length;
		var s=this.lees[l-1];
		if (s[0]>=100) return;

		if (s[0]==0) this.lees.push([1, 1, 0]);
		if (s[0]==1){
			if (s[2]==this.poly[s[1]].length-1 && s[1]==this.poly.length-1) this.lees.push([101]);
			else if (s[2]==this.poly[s[1]].length-1) this.lees.push([1, s[1]+1, 0]);
			else this.lees.push([1, s[1], s[2]+1]);
		}
	}

	//color polynominal, then wash it all away
	colorful_polynominal(coeffs, staat, passer, start_color=4, mid_color=13, end_color=0){
		for (i=0; i<coeffs.length; i++){
			staat.push([0, coeffs[i][1], start_color, 13]);
			passer.push([0, coeffs[i][1], 13, end_color]);
		}
	}

	divsCreator(){
		var i, s=this.layers, titles=[];
		for (i=0; i<s; i++) titles.push(`pol<sub>${i}</sub>`);
		
		super.divsCreator(5, s, titles);
	}

	StatementComprehension(){
		var s=this.lees[this.state_nr], M=998244353;

		var polynominalize=function(coeffs){
			var poly=``;
			for (i=coeffs.length-1; i>0; i--){
				poly=poly+`${coeffs[i]}x<sup>${i}</sup>+`;
			}
			poly+=`${coeffs[0]}`;
			return poly;
		}
		var show_poly=function(level, x){return `pol<sub>${level},${x}</sub>`}

		
		if (s[0]==0) return `The input is represented as sequence of polynominals - each s<sub>i</sub> will be represented as x<sup>s<sub>i</sub></sup>+1. - and so, all coefficients except this by s<sub>i</sub> and 0 are equal to 0 for each s<sub>i</sub>.`;
		if (s[0]==1) {
			if (this.poly[s[1]-1].length%2==1 && this.poly[s[1]].length-1==s[2]){
				return `There is odd amount of polynominals in layer above, so the last polynominal: ${polynominalize(this.poly[s[1]][s[2]])}  is just rewritten.`
			}
			else{
				var p1=`${polynominalize(this.poly[s[1]-1][2*s[2]])}`;
				var p2=`${polynominalize(this.poly[s[1]-1][2*s[2]+1])}`;
				var pres=`${polynominalize(this.poly[s[1]][s[2]])}`;

				return `Now, polynominals representing two solutions to smaller subproblems (namely polynominals ${show_poly(s[1]-1, s[2]*2)} and ${show_poly(s[1]-1, s[2]*2+1)}) have to be multiplied in order to solve larger subproblem (represented by polynominal ${show_poly(s[1], s[2])}) of finding set sums: <b>(${p1})(${p2}) &#8801; ${pres} (mod ${M})</b>. Note that complexity of shown algorithm depends on choice of algorithm for polynominal multiplication: for classical dp approach, it will be O(nm), while for multiplication using NTT it will be O((n+m)log(n)log(m)).`;
			}
		}

		if (s[0]==101){
			var coeffs=this.poly[this.layers-1][0];
			var poly=polynominalize(coeffs);
			var completely_random_number=Math.ceil(this.logic.n/2);

			return `Finally, the solution for given problem can be represented as ${poly}, where exponent means set sum, and coefficient number of possible sets with given set sum; for example, coefficient ${coeffs[completely_random_number]} by x<sup>${completely_random_number}</sup> means, that there are exactly ${coeffs[completely_random_number]} sets with set sum equal to ${completely_random_number}.`;
		}
	}
}
export default SumNtt;
