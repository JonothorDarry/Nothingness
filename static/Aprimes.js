class Muller extends Partial{
	constructor(block){
		super(block);
		this.ShowReality();
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

	_logical_summary(){
		var i, olden, index, x, roots_count=ArrayUtils.steady(this.logic.m, 0);
		this.logic.roots=[];
		this.logic.expos_count={};
		for (x of this.logic.expos)
			this.logic.expos_count[x]=0;

		this.logic.summary={
			'non_coprime': [],
			'fermat_witnesses': {},
			'non_witnesses_1': [],
			'non_witnesses_minus1': [],
			'mr_witnesses':{},
		}
		this.logic.summaric_amount={'non_coprime':0, 'fermat_witnesses':0, 'mr_witnesses':0, 'non_witnesses':0};
		for (x in this.logic.summary){
			this.logic.summaric_amount[x]=0;
		}

		for (x of this.logic.expos) this.logic.summary.mr_witnesses[x]={};

		for (i=1; i<this.logic.m; i+=1){
			if (NTMath.gcd(i, this.logic.m) > 1) {
				this.logic.summary.non_coprime.push(i);
				this.logic.summaric_amount.non_coprime+=1;
				continue;
			}

			if (!(this.logic.power[i][0] in this.logic.summary.fermat_witnesses))
				this.logic.summary.fermat_witnesses[this.logic.power[i][0]]=0;
			this.logic.summary.fermat_witnesses[this.logic.power[i][0]] += 1;

			if (this.logic.power[i][0]!=1) {
				this.logic.summaric_amount.fermat_witnesses+=1;
				continue;
			}

			else if (this.logic.power[i][this.logic.power[i].length-1]==1) this.logic.summary.non_witnesses_1.push(i);
			else {
				if (this.logic.power[i][this.logic.power[i].length-1]==this.logic.m-1) this.logic.summary.non_witnesses_minus1.push(i);
				else 
					this.logic.summaric_amount.mr_witnesses+=1;
				this.logic.expos_count[this.logic.expos[this.logic.power[i].length-1]] += 1;

				index=this.logic.power[i].length-1;
				olden = this.logic.summary.mr_witnesses[this.logic.expos[index]];
				if (!(this.logic.power[i][index] in olden))
					olden[this.logic.power[i][index]]=0;

				olden[this.logic.power[i][index]] += 1;

				roots_count[this.logic.power[i][index]] +=1;
			}
		}

		for (i=1; i<this.logic.m; i+=1){
			if (roots_count[i]>0) this.logic.roots.push(i);
		}
		this.logic.summaric_amount.non_witnesses=this.logic.summary.non_witnesses_1.length + this.logic.summary.non_witnesses_minus1.length;
		this.logic.roots_count=roots_count;
	}

	logical_box(){
		this._logical_find_all_expos();
		this._logical_find_all_power();

		this._logical_summary();
	}

	_btn_appender(place, name=null, color=-1){
		var btn;
		if (name==null) btn=this.buttCreator();
		else btn=this.buttCreator(name);
		if (color!=-1) this.Painter(btn, color);
		
		place.appendChild(btn);
	}

	_presentation_basis(){
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
			else if (this.logic.power[i][0]!=1) this._btn_appender(divs.zdivs[i].buttons, i, this.present.colors.fermat_witness);
			else if (last!=1 && last!=this.logic.m-1) this._btn_appender(divs.zdivs[i].buttons, i, this.present.colors.mr_witness);

			else this._btn_appender(divs.zdivs[i].buttons, i, this.present.colors.non_witness);
			this._btn_appender(divs.zdivs[i].buttons);

			for (j=0; j<this.logic.power[i].length; j++){
				this._btn_appender(divs.zdivs[i].buttons, this.logic.power[i][j]);
			}
		}
	}

	_presentation_summary_mr(){
		var i, j, btn;
		var len_1=this.logic.expos.length-1;
		var len_2=this.logic.roots.length;
		
		var left_margin=2, top_margin=1;
		//this.place - will change; 2?
		var summary=Representation_utils.proto_divsCreator(1, len_2+3+top_margin, [], null, this.place, this.stylistic);
		var grid = new Grid(len_2+3, len_1+3, this.stylistic, {'place':summary.zdivs, 'top_margin':top_margin, 'left_margin':left_margin});

		var x, y, used_expos=this.logic.expos.slice(1);

		var _tmp=this.logic.expos_count;
		grid.filler([0, [1, used_expos.length]], used_expos, {'color':5})
		grid.filler([len_2+2, [1, used_expos.length]], used_expos.map(e => _tmp[e]), {'color':this.present.colors.summary})

		_tmp=this.logic.roots_count;
		grid.filler([[1, this.logic.roots.length], 0], this.logic.roots, {'color':5})
		grid.filler([[1, this.logic.roots.length], len_1+2], this.logic.roots.map(e => _tmp[e]), {'color':this.present.colors.summary})


		i=0, j=0;
		for (x of used_expos){
			for (y of this.logic.roots){
				btn = grid.grid[j+top_margin+1][i+left_margin+1];
				if (!(y in this.logic.summary.mr_witnesses[x]))
					btn.innerHTML=0;
				else
					btn.innerHTML=this.logic.summary.mr_witnesses[x][y];
				if (y!=this.logic.m-1) this.Painter(btn, this.present.colors.mr_witness);
				else this.Painter(btn, this.present.colors.non_witness);

				j+=1;
			}
			j=0, i+=1;
		}
	}

	_presentation_summary_fermat(){
		var t_expo=[], t_count=[];
		for (var x in this.logic.summary.fermat_witnesses){
			t_expo.push(x);
			t_count.push(this.logic.summary.fermat_witnesses[x]);
		}

		var summer=(acc, starter) => acc+starter;
		var summa=t_count.reduce(summer, 0);

		var len_1=t_expo.length;
		var top_margin=2, left_margin=1;

		var summary=Representation_utils.proto_divsCreator(1, 2+top_margin, [], null, this.place, this.stylistic);
		var grid = new Grid(2, len_1+3+left_margin, this.stylistic, {'place':summary.zdivs, 'top_margin':top_margin, 'left_margin':left_margin});

		grid.filler([0, [1, t_expo.length]], t_expo, {'color':5})
		grid.filler([1, [1, t_count.length]], t_count, {'color':this.present.colors.fermat_witness});

		grid.single_filler([1, t_expo.length+2], summa, {'color':this.present.colors.summary});
	}

	_presentation_summary_summary(){
		var top_margin=2, left_margin=2;
		var summary=Representation_utils.gridlike_divs_creator(5+top_margin, this.place, this.stylistic);
		var grid = new Grid(5, 6, this.stylistic, {'place':summary.zdivs, 'top_margin':top_margin, 'left_margin':left_margin});
		var titles=['Non-Coprime', 'Fermat Witnesses', 'Miller-Rabin Witnesses', 'Non-witnesses'];
		var btns=grid.filler([[0, titles.length-1], 0], titles, {
			'stylistic':{
				'px':{'width':200, 'fontSize':16},
			},
			'color':5,
		});

		Modern_representation.button_modifier(btns[1], {'stylistic':
			{
				'general':{'color':'#FF33FF', 'fontFamily':'cursive'}, //Fermat-specific
				'px':{'fontSize':20},
			}
		});


		grid.filler([[0, 2], 3], ArrayUtils.steady(3, this.logic.summaric_amount.non_coprime), {'color':this.present.colors.non_coprime});
		grid.filler([[1, 2], 2], ArrayUtils.steady(2, this.logic.summaric_amount.fermat_witnesses), {'color':this.present.colors.fermat_witness});
		grid.filler([[2, 2], 1], ArrayUtils.steady(1, this.logic.summaric_amount.mr_witnesses), {'color':this.present.colors.mr_witness});
		grid.filler([[3, 3], 4], ArrayUtils.steady(1, this.logic.summaric_amount.non_witnesses), {'color':this.present.colors.non_witness});

		var tls=this.logic.summaric_amount;
		var witnessy=[tls.non_coprime, 
			tls.non_coprime + tls.fermat_witnesses, 
			tls.non_coprime + tls.fermat_witnesses + tls.mr_witnesses, 
			tls.non_witnesses
		];
		var m=this.logic.m-1;
		var finale_witnessy=witnessy.map(e => `${e}/${m} &approx; ${Number.parseFloat(e/m).toFixed(3)}`)
		grid.filler([[0, 3], 5], finale_witnessy, {'color':this.present.colors.summary, 
			'stylistic':{'px':{'width':160}}
		});
	}

	_presentation_colors_set(){
		//original: 7, 33, 32, 0, 101, 5
		this.present.colors={
			'non_coprime':7,
			'fermat_witness':33,
			'mr_witness':32,
			'non_witness':0,
			'summary':101,
			'border':5,
		}
	}

	presentation(){
		this.present={};
		this._presentation_colors_set();
		this._presentation_basis();
		this.place.style.width='max-content';
		this._presentation_summary_mr();
		this._presentation_summary_fermat();
		this._presentation_summary_summary();
	}

	ShowReality(){
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
		this.logic.poly_str=this.prepare_poly();
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

	prepare_poly(){
		var poly_strs=this.logic.poly.map((e,i) => `${(e==1)?``:e}x<sup>${i}</sup>`);
		poly_strs=poly_strs.filter((e,i) => this.logic.poly[i]!=0);
		poly_strs=poly_strs.reverse();
		function concat(str1, str2) {return str1+"+"+str2;}
		return poly_strs.reduce(concat, "").substr(1);
	}

	StatementComprehension(){
		var l=this.lees.length;
		var s=this.lees[l-1], x=s[1];

		var poly_str=this.logic.poly_str;

		if (s[0]==0) return `Next values w<sub>k</sub>=w<sub>${s[1]}</sub>=f(w<sub>${s[1]-1}</sub>)=f(${this.logic.w[s[1]-1]}) and w<sub>2k</sub>=w<sub>${2*s[1]}</sub>=f(f(w<sub>${2*s[1]-2}</sub>))=f(f(${this.logic.w[2*s[1]-2]})) are found; for f(x)=${poly_str}, they're equal to ${this.logic.w[s[1]]} and ${this.logic.w[2*s[1]]}`;
		if (s[0]==1) return `Difference w<sub>k</sub>-w<sub>2k</sub> (taken as absolute value - it doesn't actually matter, because it will be used only for gcd finding, but looks better) is equal to |w<sub>k</sub>-w<sub>2k</sub>|=|${this.logic.w[s[1]]}-${this.logic.w[2*s[1]]}|=${this.logic.diff[s[1]]}`;
		if (s[0]==2) return `Gcd between difference of w<sub>k</sub> and w<sub>2k</sub> and m is equal to gcd(${this.logic.diff[s[1]]}, ${this.logic.m})=${this.logic.gcds[s[1]]}.`;
		if (s[0]==100) return `A factor of ${this.logic.m} was found - namely, ${this.logic.gcds[this.logic.gcds.length-1]}, algorithm ends.`;
	}
}

var feral1=Partial.ObjectParser(document.getElementById('Algo1'));
var sk1=new Muller(feral1, 15);

var feral2=Algorithm.ObjectParser(document.getElementById('Algo2'));
var sk2=new PollardRho(feral2, 18209);
