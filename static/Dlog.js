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

		var lst1=this.modern_divsCreator(1, 4);
		var construction_site_basic=lst1.zdivs;

		var lst2=this.modern_divsCreator(5, 3, ['large table', 'small table', 'pursued element']);
		var construction_site_post=lst2.zdivs;

		var system1=[['a', 0, 0], ['m', 1, 0], ['b', 2, 0], ['s', 3, 4]];

		for (var x of system1){
			var _=Representation_utils.fill_with_buttons_horizontal(this.stylistic, construction_site_basic[x[1]].buttons, x[0], 5, 1)[0];
			buttons[x[0]]=Representation_utils.fill_with_buttons_horizontal(this.stylistic, construction_site_basic[x[1]].buttons, this.logic[x[0]], x[2], 1)[0];
		}

		var post_logic=function(x){return {'base':x[1], 'expo':x[0]}};
		var huge_numbs = this.logic.anx.map(post_logic);
		var small_numbs = this.logic.ax.map(post_logic);
		buttons['large_table']=Representation_utils.fill_with_buttons_horizontal(this.stylistic, construction_site_post[0].buttons, huge_numbs, 4, -1, Representation_utils.expo_inner_style_button_creator);
		buttons['small_table']=Representation_utils.fill_with_buttons_horizontal(this.stylistic, construction_site_post[1].buttons, small_numbs, 4, -1, Representation_utils.expo_inner_style_button_creator);
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
		}

		if (s[0]==1){
			var x=s[1];
			this.pass_color(this.buttons.large_table[x]['_base']);
			this.pass_color(this.buttons.large_table[x]['_expo'], 4, 1, 101);
		}
		if (s[0]==2){
			for (i=3; i<this.logic.anx.length; i++){
				this.pass_color(this.buttons.large_table[i]['_base']);
				this.pass_color(this.buttons.large_table[i]['_expo'], 4, 1, 101);
			}
		}

		if (s[0]==3){
			var x=s[1];
			this.pass_color(this.buttons.small_table[x]['_base']);
			this.pass_color(this.buttons.small_table[x]['_expo'], 4, 1, 101);
		}
		if (s[0]==4){
			for (i=3; i<this.logic.ax.length; i++){
				this.pass_color(this.buttons.small_table[i]['_base']);
				this.pass_color(this.buttons.small_table[i]['_expo'], 4, 1, 101);
			}
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
		}

		if (s[0]==7){
			staat.push([0, this.buttons.pursued, 1, 14]);
			if (this.logic.march_of_the_binars[s[1]]<this.logic.ax.length) this.pass_color(this.buttons.small_table[this.logic.march_of_the_binars[s[1]]]['_base'], 0, 15, 0);
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

		if (s[0]==0) return `Whatever`;
	}
}

var feral=Algorithm.ObjectParser(document.getElementById('Algo1'));
var eg=new Dlog(feral, 6, 17, 23);
