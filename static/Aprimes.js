class Muller extends Partial{
	constructor(block, x){
		super(block);
		this.ShowReality(x);
	}

	read_data(){
		this.logic.m=this.input.value;
	}

	_logical_find_all_expos(){
		this.logic.neo_toth=this.logic.m-1;
		this.logic.expos=[];

		for (var x=this.logic.neo_toth; true; x=Math.floor(x/2)){
			this.logic.expos.push(x);
			if (x%2!=0) break;
		}
	}
	_logical_find_all_power(){
		var i, j;

		this.logic.power=[[]];
		for (i=1; i<=this.logic.m; i++){
			this.logic.power.push([]);
			for (j=0; j<this.logic.expos.length; j++){
				this.logic.power[i].push(NTMath.pow(i, this.logic.expos[j], this.logic.m));
				if ((i==0 && this.logic.power[i][j]!=1) || (i>0 && this.logic.power[i][j]!=1)) break;
			}
		}
	}

	logical_box(){
		this._logical_find_all_expos();
		this._logical_find_all_power();
	}

	_btn_appender(place, name=null, color=-1){
		var btn;
		if (name==null) btn=this.buttCreator();
		else btn=this.buttCreator(name);
		if (color!=-1) this.Painter(btn, color);
		
		place.appendChild(btn);
	}

	presentation(){
		var divs=this.modern_divsCreator(1, this.logic.m, []);
		var i=0, j, btn;
		
		this._btn_appender(divs.zdivs[0].buttons, "g", 5);
		this._btn_appender(divs.zdivs[0].buttons, "g<sup>x</sup>; x=", 5);
		for (j=0; j<this.logic.expos.length; j++){
			this._btn_appender(divs.zdivs[0].buttons, this.logic.expos[j], 5);
		}

		//Meat
		for (i=1; i<this.logic.m; i++){

			var last=this.logic.power[i][this.logic.power[i].length-1];
			if (NTMath.gcd(i, this.logic.m)>1){
				divs.divs[i].style.display="none";
				this._btn_appender(divs.zdivs[i].buttons, i, 2);
			}
			else if (this.logic.power[i].length==1) this._btn_appender(divs.zdivs[i].buttons, i, 5);
			else if (last!=1 && last!=this.logic.m-1) this._btn_appender(divs.zdivs[i].buttons, i, 8);

			else this._btn_appender(divs.zdivs[i].buttons, i);
			this._btn_appender(divs.zdivs[i].buttons);

			for (j=0; j<this.logic.power[i].length; j++){
				this._btn_appender(divs.zdivs[i].buttons, this.logic.power[i][j]);
			}
		}
	}

	ShowReality(x=-1){
		this.starter();
		this.read_data();
		this.logical_box();

		this.presentation();
	}
}

class PollardRho extends Algorithm{
	_logic_calculate_poly(x){
		var value=0, i;
		for (i=this.logic.poly_deg; i>=0; i--)
			value=(value*x+this.logic.poly[i])%this.logic.m;
		return value;
	}

	fill_floyd(){
		var cur_k, cur_2k, gcd, k, diff;
		this.logic.w=[this.logic.starter];
		this.logic.gcds=[null];
		this.logic.diff=[null];

		var cur_k=this.logic.starter, cur_2k=this.logic.starter;
		for (k=0; true; k+=1){
			cur_k=this._logic_calculate_poly(cur_k);

			cur_2k=this._logic_calculate_poly(cur_2k);
			this.logic.w.push(cur_2k);
			cur_2k=this._logic_calculate_poly(cur_2k);
			this.logic.w.push(cur_2k);

			diff=Math.abs(cur_2k-cur_k);
			gcd=NTMath.gcd(Math.abs(cur_2k-cur_k), this.logic.m);

			this.logic.gcds.push(gcd);
			this.logic.diff.push(diff);

			if (gcd!=1) break;
		}
		this.logic.last_k=k+1;
	}

	logical_box(){
		if (this.logic.poly_deg == null){
			this.logic.poly_deg = 2;
			this.logic.poly = [1, 0, 1];
		}
		if (this.logic.starter == null)
			this.logic.starter = 3;

		this.fill_floyd();
	}

	presentation(){
		this.bs_butt_width_h=100;
		this.bs_butt_width=`${this.bs_butt_width_h}px`;
		Representation_utils.change_button_width(this.stylistic, this.logic.m, this.bs_butt_width_h);

		this.buttons={};
		var ln=this.logic.w.length;

		//buttons name, span - data, title place, title, array, color
		var margin_top=2, margin_left=1;
		var dvs=this.modern_divsCreator(1, margin_top+ln+1, []);

		var grid=Representation_utils.gridify_div(dvs.zdivs, margin_top+ln+1, margin_left+4, this.stylistic);
		var order_of_destiny=[
			['k', [[1, ln+1], 0], [0, 0], 'k', ArrayUtils.range(0, ln), 4],
			['w_k', [[1, ln+1], 1], [0, 1], 'w<sub>k</sub>', this.logic.w, 4],
			['diff', [[1, ((ln+1)>>1)+1], 2], [0, 2], '|w<sub>2k</sub>-w<sub>k</sub>|', this.logic.diff, 4],
			['gcd', [[1, ((ln+1)>>1)+1], 3], [0, 3], 'gcd(w<sub>2k</sub>-w<sub>k</sub>, m)', this.logic.gcds, 4],
		];

		var x, y, titular;
		for (x of order_of_destiny){
			var btns=ArrayUtils.subsetting(grid, [margin_top+x[1][0][0], margin_top+x[1][0][1]], margin_left+x[1][1]);
			this.buttons[x[0]]=btns;

			btns.forEach((e,i) => {
				this.Painter(e, x[5]);
				e.innerHTML=x[4][i];
			});
			titular=grid[margin_top+x[2][0]][margin_left+x[2][1]];
			this.Painter(titular, 5);
			titular.innerHTML=x[3];
		}
		this.Painter(this.buttons.k[0], 5);
		this.Painter(this.buttons.w_k[0], 0);

		//m
		this.buttons.m=grid[0][2];
		this.Painter(this.buttons.m, 0);
		this.buttons.m.innerHTML=this.logic.m;

		//Title of m
		this.buttons.m_title=grid[0][1];
		this.Painter(this.buttons.m_title, 8);
		this.buttons.m_title.innerHTML='m';
	}

	palingnesia(){
		this.logical_box();
		this.presentation();
	}

	read_part(c){
		var v=c.get_next(), i;

		if (v=='X'){
			this.logic.poly_deg=c.get_next();
			this.logic.poly = ArrayUtils.steady(this.logic.poly_deg+1, 0);

			for (i=this.logic.poly_deg; i>=0; i--){
				this.logic.poly[i] = c.get_next();								
			}
		}

		else if (v=='Y'){
			this.logic.starter = c.get_next();
		}
	}

	read_data(){
		var fas=this.input.value;
		var c=this.dissolve_input(fas);

		this.logic.m=c.get_next();
		this.read_part(c);
		this.read_part(c);
	}

	constructor(block, m){
		super(block);
		this.logic.m=m;
		this.version=4;
		this.palingnesia();
	}

	BeginningExecutor(){
		this.read_data();
		this.palingnesia();
		this.lees.push([0, 1]);
	}

	StateMaker(){
		var l=this.lees.length;
		var s=this.lees[l-1], staat=[], i;
		var staat=this.ephemeral.staat, passer=this.ephemeral.passer;

		if (s[0]==0){
			if (s[1]!=1)
				this.pass_color(this.buttons.w_k[s[1]], 0, 1, 0);
			this.pass_color(this.buttons.w_k[2*s[1]-1]);
			this.pass_color(this.buttons.w_k[2*s[1]]);

			staat.push([0, this.buttons.k[2*s[1]-1], 4, 5]);
			staat.push([0, this.buttons.k[2*s[1]], 4, 5]);
		}
		if (s[0]==1){
			this.pass_color(this.buttons.diff[s[1]]);
			this.pass_color(this.buttons.w_k[2*s[1]], 0, 13);
			this.pass_color(this.buttons.w_k[s[1]], 0, 13);
		}
		if (s[0]==2){
			this.pass_color(this.buttons.gcd[s[1]]);
			this.pass_color(this.buttons.m, 0, 13);
			this.pass_color(this.buttons.diff[s[1]], 0, 13);
		}
		if (s[0]==100){
			staat.push([0, this.buttons.gcd[this.logic.last_k], 0, 8]);
		}
	}

	NextState(){
		var l=this.lees.length;
		var s=this.lees[l-1];

		if (s[0]==0) return [1, s[1]];
		if (s[0]==1) return [2, s[1]];
		if (s[0]==2 && s[1]<this.logic.last_k) return [0, s[1]+1];
		else return [100];
	}

	StatementComprehension(){
		var l=this.lees.length;
		var s=this.lees[l-1], x=s[1];

		if (s[0]==0) return `Whatever`;
	}
}

var feral1=Partial.ObjectParser(document.getElementById('Algo1'));
var sk1=new Muller(feral1, 15);

var feral2=Algorithm.ObjectParser(document.getElementById('Algo2'));
var sk2=new PollardRho(feral2, 18209);
