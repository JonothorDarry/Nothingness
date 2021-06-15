class Dlog extends Algorithm{
	logical_box(){
		this.logic.success=false;

		this.logic.s=Math.ceil(Math.sqrt(this.logic.m));
		var single_an=Number(NTMath.pow(this.logic.a, this.logic.s, this.logic.m));
		var inverse_an=NTMath.inverse(single_an, this.logic.m);
		var comparer_sort= (a,b) => a[1]<=b[1];
		var comparer_binaria= (a,b) => a[1]<b[1];
		var iters=Math.floor(this.logic.m/this.logic.s);

		var i;
		this.logic.anx=[[0, 1]];
		this.logic.inverse_anx=[[0, 1]];
		for (i=1; i<=iters; i++) this.logic.anx.push([this.logic.s*i, (this.logic.anx[i-1][1]*single_an)%this.logic.m]);
		for (i=1; i<=iters; i++) this.logic.inverse_anx.push([this.logic.s*i, (this.logic.inverse_anx[i-1][1]*inverse_an)%this.logic.m]);

		var _b=this.logic.b;
		var _m=this.logic.m;
		this.logic.b_anx=this.logic.inverse_anx.map(function(e){return [e[0], (_b*e[1])%_m];});

		this.logic.ax=[[0, 1]];
		for (i=1; i<this.logic.s; i++) this.logic.ax.push([i, (this.logic.ax[i-1][1]*this.logic.a)%this.logic.m]);
		this.logic.sorted_ax=[...this.logic.ax];
		this.logic.sorted_ax.sort(comparer_sort).reverse();
		this.logic.march_of_the_binars=[];

		var x;
		for (i=0; i<=iters; i++){
			x=ArrayUtils.binaria_lower(this.logic.sorted_ax, this.logic.b_anx[i], comparer_binaria);
			this.logic.march_of_the_binars.push(x);
			if (x<this.logic.sorted_ax.length && this.logic.sorted_ax[x][1]==this.logic.b_anx[i][1]){
				this.logic.success=true;
				this.logic.dlog=this.logic.anx[i][0]+this.logic.sorted_ax[x][0];
				this.logic.solution_part_anx=i;
				this.logic.solution_part_ax=x;
				break;
			}
		}
	}

	palingnesia(){
		this.logical_box();
		var buttons={'a':null, 'n':null, 'm':null, 's':null, 'large_table':[], 'small_table':[], 'pursued':null};
		var value=Math.max(20, Math.floor(3*(this.logic.m.toString().length*10)/4))
		this.stylistic.bs_small_butt_width=`${value}px`
		this.stylistic.bs_butt_width=`${Math.max(value*2, 50)}px`


		this.place.style.width=`max-content`;
		var lst1=this.modern_divsCreator(1, 4);
		var construction_site_basic=lst1.zdivs;
		lst1.full_div.style.display="inline-block";
		lst1.full_div.style.marginRight="100px";

		var lst2=this.modern_divsCreator(5, 3, ['large table', 'small table', 'pursued element']);
		lst2.full_div.style.display="inline-block";
		lst2.full_div.style.display="inline-block";
		lst2.full_div.style.top="0";
		var construction_site_post=lst2.zdivs;

		for (var x of lst2.zdivs){
			x.title.style.verticalAlign="top";
		}

		var system1=[['a', 0, 0], ['m', 2, 0], ['b', 1, 0], ['s', 3, 4]];

		for (var x of system1){
			var _=Representation_utils.fill_with_buttons_horizontal(this.stylistic, construction_site_basic[x[1]].buttons, x[0], 5, 1)[0];
			buttons[x[0]]=Representation_utils.fill_with_buttons_horizontal(this.stylistic, construction_site_basic[x[1]].buttons, this.logic[x[0]], x[2], 1)[0];
		}

		var post_logic=function(x){return {'base':x[1], 'expo':x[0]}};
		var huge_numbs = this.logic.anx.map(post_logic);
		var small_numbs = this.logic.ax.map(post_logic);
		buttons['large_table']=Representation_utils.fill_with_buttons_horizontal(this.stylistic, construction_site_post[0].buttons, huge_numbs, 4, -1, Representation_utils.expo_inner_style_button_creator);
		buttons['small_table']=Representation_utils.fill_with_buttons_horizontal(this.stylistic, construction_site_post[1].buttons, small_numbs.concat({'base':'', 'expo':''}), 4, -1, Representation_utils.expo_inner_style_button_creator);
		buttons['pursued']=Representation_utils.fill_with_buttons_horizontal(this.stylistic, construction_site_post[2].buttons, 0, 4, 1)[0];
		this.buttons=buttons;
	}

	read_data(){
		var fas=this.input.value;
		var c=this.dissolve_input(fas);
		this.logic.a=c.get_next();
		this.logic.b=c.get_next();
		this.logic.m=c.get_next();
	}

	constructor(block, a, b, m){
		super(block);
		this.logic.a=a;
		this.logic.b=b;
		this.logic.m=m;
		this.version=4;
		this.stylistic.bs_butt_height="45px";
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

		if (s[0]==0){
			this.pass_color(this.buttons.s, 4, 1);
			this.pass_color(this.buttons.m, 0, 14);
		}

		if (s[0]==1){
			var x=s[1];
			this.pass_color(this.buttons.large_table[x]['_base']);
			this.pass_color(this.buttons.large_table[x]['_expo'], 4, 1, 101);
			if (s[1]>1) this.pass_color(this.buttons.large_table[x-1]['_base'], 0, 14);
		}
		if (s[0]==2){
			for (i=3; i<this.logic.anx.length; i++){
				this.pass_color(this.buttons.large_table[i]['_base']);
				this.pass_color(this.buttons.large_table[i]['_expo'], 4, 1, 101);
			}
			this.pass_color(this.buttons.large_table[2]['_base'], 0, 14);
			this.pass_color(this.buttons.large_table[1]['_base'], 0, 14);
		}

		if (s[0]==3){
			var x=s[1];
			if (s[1]>0) this.pass_color(this.buttons.a, 0, 14);
			this.pass_color(this.buttons.small_table[x]['_base']);
			this.pass_color(this.buttons.small_table[x]['_expo'], 4, 1, 101);
			if (s[1]>1) this.pass_color(this.buttons.small_table[x-1]['_base'], 0, 14);
		}
		if (s[0]==4){
			for (i=3; i<this.logic.ax.length; i++){
				this.pass_color(this.buttons.small_table[i]['_base']);
				this.pass_color(this.buttons.small_table[i]['_expo'], 4, 1, 101);
			}
			this.pass_color(this.buttons.small_table[2]['_base'], 0, 14);
			this.pass_color(this.buttons.a, 0, 14);
		}

		if (s[0]==5){
			for (i=0; i<this.logic.ax.length; i++){
				staat.push([1, this.buttons.small_table[i]['_base'], this.buttons.small_table[i]['_base'].innerHTML, this.logic.sorted_ax[i][1]]);
				staat.push([1, this.buttons.small_table[i]['_expo'], this.buttons.small_table[i]['_expo'].innerHTML, this.logic.sorted_ax[i][0]]);
				this.pass_color(this.buttons.small_table[i]['_base'], 0, 1);
				this.pass_color(this.buttons.small_table[i]['_expo'], 101, 1, 101);
			}
		}

		if (s[0]==6){
			staat.push([0, this.buttons.large_table[s[1]]['_base'], 0, 15]);
			if (s[1]>0) staat.push([0, this.buttons.large_table[s[1]-1]['_base'], 15, 0]);
			//Jak usuniesz arga ze staata - to do lamusa
			if (s[1]==0) staat.push([0, this.buttons.pursued, 4, 1]);
			else staat.push([0, this.buttons.pursued, 14, 1]);
			staat.push([1, this.buttons.pursued, this.buttons.pursued.innerHTML, this.logic.b_anx[s[1]][1]]);
			this.pass_color(this.buttons.b, 0, 14, 0);
		}

		if (s[0]==7){
			staat.push([0, this.buttons.pursued, 1, 14]);
			if (this.logic.solution_part_anx==s[1]){
				this.pass_color(this.buttons.small_table[this.logic.march_of_the_binars[s[1]]]['_base'], 0, 8, 0);
				this.pass_color(this.buttons.large_table[s[1]]['_base'], 15, 8, 0);
			}
			else if (this.logic.march_of_the_binars[s[1]]<this.logic.ax.length) this.pass_color(this.buttons.small_table[this.logic.march_of_the_binars[s[1]]]['_base'], 0, 15, 0);
			else this.pass_color(this.buttons.small_table[this.logic.march_of_the_binars[s[1]]]['_base'], 4, 15, 4);
		}

		if (s[0]==100){
			staat.push([0, this.buttons.small_table[this.logic.solution_part_ax]['_expo'], 101, 8]);
			staat.push([0, this.buttons.large_table[this.logic.solution_part_anx]['_expo'], 101, 8]);
			staat.push([0, this.buttons.pursued, 14, 0]);
		}

		if (s[0]==101){
			staat.push([0, this.buttons.large_table[this.logic.anx.length-1]['_base'], 15, 0]);
			staat.push([0, this.buttons.pursued, 14, 0]);
		}
	}

	NextState(){
		var l=this.lees.length;
		var s=this.lees[l-1];

		if (s[0]==0) return [1, 0];
		if (s[0]==1 && s[1]<=1 && s[1]<=this.logic.anx.length) return [1, s[1]+1];
		else if (s[0]==1 && s[1]<=this.logic.anx.length) return [2];
		else if (s[0]==1) return [3, 0];
		if (s[0]==2) return [3, 0];

		if (s[0]==3 && s[1]<=1 && s[1]<=this.logic.ax.length) return [3, s[1]+1];
		else if (s[0]==3 && s[1]<=this.logic.ax.length) return [4];
		else if (s[0]==3) return [5];

		if (s[0]==4) return [5];
		if (s[0]==5) return [6, 0];
		if (s[0]==6) return [7, s[1]];
		if (s[0]==7 && (!this.logic.success || this.logic.solution_part_anx!=s[1]) && s[1]+1<this.logic.anx.length) return [6, s[1]+1];
		else if (s[0]==7 && this.logic.success && this.logic.solution_part_anx==s[1]) return [100];
		else if (s[0]==7) return [101];
	}

	StatementComprehension(){
		var l=this.lees.length;
		var s=this.lees[l-1], x=s[1];

		if (s[0]==0) return `Our aim is to find discrete logarithm - number x solving equation <strong>a<sup>x</sup> &equiv; b (mod m)</strong> - in this case, x solving ${this.logic.a}<sup>x</sup> &equiv; ${this.logic.b} (mod ${this.logic.m}). First, notice, that if there exist any solution, then there exist solution x &in; &lt;0 ; m-1 &gt; - because values of a<sup>x</sup> have to enter a cycle for subsequent values of x, because any value (mod m) is equivalent to one of m numbers in range &lt;0 ; m-1 &gt;. Then: a<sup>x</sup> &equiv; a<sup>s*p+q</sup> &equiv; b (mod m)</sup> for some constant s and q &lt; s. What can be done with this forbidden knowledge? Notice, that a<sup>q</sup> &equiv; b*a<sup>-s*p</sup>. If s is approximately square root of m, then one can, for each a<sup>s*p</sup> find its inverse, multiply by b, then check, if there exists such q in range &lt; 0; s-1 &gt;, that a<sup>q</sup> &equiv; b*a<sup>-s*p</sup> (mod m) and have quite better algorithm than standard br&uuml;te f&ouml;rce. So, what is s in our case? Ceiling (could be floor, round, it doesn't matter as long, as number is close to square root) of square root of ${this.logic.m} is equal to ${this.logic.s} - this value will be used further.`
		if (s[0]==1 && s[1]==0) return `By large table we mean table with values a<sup>s*p</sup>. For p=0, value of a<sup>s*0</sup> is certainly equal to 1: thus, ${this.logic.a}<sup>${this.logic.s}*0</sup> &equiv; 1 (mod ${this.logic.m}).`;
		if (s[0]==1 && s[1]==1) return `For p=1, value a<sup>s*p</sup> &equiv; a<sup>s</sup> (mod m) - this value can be calculated for example using binary exponentation. In this case, ${this.logic.a}<sup>${this.logic.s}</sup> &equiv; ${this.logic.anx[1][1]} (mod ${this.logic.m})`;
		if (s[0]==1 && s[1]==2) return `a<sup>p*s</sup> &equiv; a<sup>(p-1)*s</sup>a<sup>s</sup> (mod m) - thus, this (and all further values of a<sup>p*s</sup>) can be calculated from previous values. Here, ${this.logic.a}<sup>2*${this.logic.s}</sup> &equiv; ${this.logic.a}<sup>${this.logic.s}</sup> * ${this.logic.a}<sup>${this.logic.s}</sup> &equiv; ${this.logic.anx[1][1]}*${this.logic.anx[1][1]} &equiv; ${this.logic.anx[2][1]} (mod ${this.logic.m})`;
		if (s[0]==2) return `Using formula a<sup>p*s</sup> &equiv; a<sup>(p-1)*s</sup>a<sup>s</sup> (mod m) all further values of a<sup>p*s</sup> (mod m) can be calculated. Calculating values a<sup>p*s</sup> up to such value p', such that (p'+1)*s &ge; m always yields discrete logarithm, if one exists.`;

		if (s[0]==3 && s[1]==0) return `By large table we mean table with values a<sup>q</sup>. For q=0, value of a<sup>0</sup> is certainly equal to 1: thus, ${this.logic.a}<sup>0</sup> &equiv; 1 (mod ${this.logic.m}).`;
		if (s[0]==3 && s[1]==1) return `For q=1, value a<sup>q</sup> &equiv; a (mod m) - in this case, a<sup>1</sup> &equiv; ${this.logic.a} (mod m).`;
		if (s[0]==3 && s[1]==2) return `a<sup>q</sup> &equiv; a<sup>(q-1)</sup>*a (mod m) - thus, this (and all further values of a<sup>q</sup>) can be calculated from previous values. Here, ${this.logic.a}<sup>2</sup> &equiv; ${this.logic.a} * ${this.logic.a} &equiv; ${this.logic.ax[1][1]}*${this.logic.ax[1][1]} &equiv; ${this.logic.ax[2][1]} (mod ${this.logic.m})`;
		if (s[0]==4) return `Using formula a<sup>q</sup> &equiv; a<sup>(q-1)</sup>a (mod m) all further values of a<sup>q</sup> (mod m) can be calculated. Values a<sup>q</sup> have to be calculated in a way enabling to construct all possible values of exponent in for p*s+q - thus, q &lt; s = ${this.logic.s} will always yield discrete logarithm, if one exists.`;
		if (s[0]==5) return `Values of a<sup>q</sup> are sorted in order to be able to find specific value within this array (and exponent associated with this value). Stable sort is preferable, as it allows to find lowest value of exponent being discrete logarithm for given (a, b, m).`;
		if (s[0]==6) return `Next value of a<sup>p*s</sup> &equiv; ${this.logic.a}<sup>${this.logic.anx[s[1]][0]}</sup> &equiv; ${this.logic.anx[s[1]][1]} (mod ${this.logic.m}) is checked in order to determine, whether there exists discrete logarithm in form ${this.logic.a}<sup>${this.logic.anx[s[1]][0]}+q</sup>. In order to check it, one has to solve a<sup>p*s+q</sup> &equiv; b (mod m) for q - or rather a<sup>-s*p</sup>*b &equiv; a<sup>q</sup> (mod m). Inverse in the left part can be calculated with extended euclidead algorithm. The left part is equal to ${this.logic.inverse_anx[s[1]][1]}*${this.logic.b} &equiv; ${this.logic.b_anx[s[1]][1]} (mod ${this.logic.m}).`;
		if (s[0]==7){
			var ending_seq=``;
			if (this.logic.march_of_the_binars[s[1]]==this.logic.ax.length) ending_seq=`thus, there is not even a greater equal value to ${this.logic.b_anx[s[1]][1]} in the small table.`
			else if (this.logic.solution_part_anx==s[1]) ending_seq=`thus, a discrete logarithm has been found! a<sup>x</sup> &equiv; ${this.logic.a} <sup> ${this.logic.anx[this.logic.solution_part_anx][0]}+${this.logic.sorted_ax[this.logic.solution_part_ax][0]}</sup> &equiv; ${this.logic.b} &equiv; b (mod ${this.logic.m}}`
			else {
				ending_seq=`thus, there is no discrete logarithm for this value of p.`;
			}
			return `Lower bound binary search is executed in order to find, whether there is value a<sup>q</sup> &equiv; ${this.logic.b_anx[s[1]][1]} (mod m). It could also be upper bound, but lower bound gives information about smallest discrete logarithm, if such exists. The index found is equal to ${this.logic.march_of_the_binars[s[1]]} - ${ending_seq}`;
		}

		if (s[0]==101) return `Apparently, there is no proper solution to this problem - no x solving ${this.logic.a}<sup>x</sup> &equiv; ${this.logic.b} (mod ${this.logic.m})`;
		if (s[0]==100) return `Solution was found, it is equal to ${this.logic.dlog}: ${this.logic.a}<sup>${this.logic.dlog}</sup> &equiv; ${this.logic.b} (mod ${this.logic.m}).`;
	}
}

var feral=Algorithm.ObjectParser(document.getElementById('Algo1'));
var eg=new Dlog(feral, 6, 17, 23);
