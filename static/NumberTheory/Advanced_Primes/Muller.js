class Muller extends Partial{
	constructor(block, m){
		super(block);
		this.only_summary=block.check;
		//this.logic.m=m;
		this.ShowReality();
	}

	read_data(){
		var c=this.dissolve_input(this.input.value);
		this.logic.m=c.get_next();
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

	_logical_non_coprime_setter(){
		var coprimes=ArrayUtils.steady(this.logic.m+1, 1).map((e,i) => (NTMath.gcd(i, this.logic.m)>1) ? 0 : 1);
		return coprimes;
	}

	_logical_atomic_update_mr_witnesses(summary, expo, value){
		var olden = summary[expo];
		if (!(value in olden))
			olden[value]=0;
		olden[value] += 1;
		this.logic.expos_count[expo] += 1;
		this.logic.roots_count[value] +=1;
	}
	_logical_update_mr_witnesses(summary, expo, value){
		this._logical_atomic_update_mr_witnesses(summary, expo, value);
		for (expo*=2; expo < this.logic.m-1; expo*=2){
			this._logical_atomic_update_mr_witnesses(summary, expo, 1);
		}
	}

	_logical_summary(){
		this.logic.coprimes=this._logical_non_coprime_setter();
		//var roots_count=this._logical_get_roots_count();
		this.logic.roots_count=ArrayUtils.steady(this.logic.m, 0);

		var i, olden, index, x;
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
			if (this.logic.coprimes[i] == 0) {
				this.logic.summary.non_coprime.push(i);
				this.logic.summaric_amount.non_coprime+=1;
				continue;
			}
			index=this.logic.power[i].length-1;

			if (!(this.logic.power[i][0] in this.logic.summary.fermat_witnesses))
				this.logic.summary.fermat_witnesses[this.logic.power[i][0]]=0;
			this.logic.summary.fermat_witnesses[this.logic.power[i][0]] += 1;

			if (this.logic.power[i][0]!=1) {
				this.logic.summaric_amount.fermat_witnesses+=1;
				continue;
			}


			this._logical_update_mr_witnesses(this.logic.summary.mr_witnesses, this.logic.expos[index], this.logic.power[i][index]);
			if (this.logic.power[i][index]==1)
				this.logic.summary.non_witnesses_1.push(i);
			else {
				if (this.logic.power[i][index]==this.logic.m-1) this.logic.summary.non_witnesses_minus1.push(i);
				else this.logic.summaric_amount.mr_witnesses+=1;
			}
		}

		this.logic.roots=[];
		for (i=1; i<this.logic.m; i+=1){
			if (this.logic.roots_count[i]>0) this.logic.roots.push(i);
		}
		this.logic.summaric_amount.non_witnesses=this.logic.summary.non_witnesses_1.length + this.logic.summary.non_witnesses_minus1.length;
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
		if (color!=-1) Representation_utils.Painter(btn, color);
		
		place.appendChild(btn);
	}

	_presentation_basis(){
		var divs=this.modern_divsCreator(1, this.logic.m, []);
		// divs.full_div.style.display='inline-block';
		divs.full_div.style.verticalAlign='top';
		var i=0, j, btn;
		
		this._btn_appender(divs.zdivs[0].buttons, "g", 5);
		this._btn_appender(divs.zdivs[0].buttons, "g<sup>x</sup>; x=", 5);
		for (j=0; j<this.logic.expos.length; j++){
			this._btn_appender(divs.zdivs[0].buttons, this.logic.expos[j], 5);
		}

		//Meat
		for (i=1; i<this.logic.m; i++){

			var last=this.logic.power[i][this.logic.power[i].length-1];
			if (this.logic.coprimes[i] == 0){
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
		var i, j, btn, x;
		var len_2=this.logic.roots.length;
		var used_expos=this.logic.expos.slice(1);
		var len_1=used_expos.length;
		
		var left_margin=2, top_margin=2;
		//this.place - will change; 2?
		var summary=Representation_utils.proto_divsCreator(1, len_2+3+top_margin, [], null, this.present.summarized_funeral, this.stylistic);

		var grid = new Grid(len_2+3, len_1+3, this.stylistic, {'place':summary.zdivs, 'top_margin':top_margin, 'left_margin':left_margin});
		var diverging_border=1; //Currently different setting will result in disaster

		var y, hw_diff=10;

		var _tmp=this.logic.expos_count;
		grid.filler([0, [1, used_expos.length]], used_expos, {'color':5});
		grid.filler([len_2+diverging_border+1, [1, used_expos.length]], used_expos.map(e => _tmp[e]), {'color':this.present.colors.summary});

		grid.filler([len_2+1, [1, used_expos.length+2]], ArrayUtils.steady(used_expos.length+2, ''), {'color':4, 
			'stylistic':{
				'general':{'vertical-align':'top'},
				'px':{'height':hw_diff}
			}
		}); //Margin at bottom
		summary.divs[top_margin+len_2+1].style.height=`${hw_diff}px`;
		summary.zdivs[top_margin+len_2+1].buttons.style.height=`${hw_diff}px`; //Also bottom margin

		_tmp=this.logic.roots_count;
		grid.filler([[1, this.logic.roots.length], 0], this.logic.roots, {'color':5});
		grid.filler([[1, this.logic.roots.length+2], len_1+1], ArrayUtils.steady(this.logic.roots.length+2, ''), {'color':4,
			'stylistic':{'px':{'width':hw_diff}}
		}); //Margin at right
		grid.filler([[1, this.logic.roots.length], len_1+diverging_border+1], this.logic.roots.map(e => _tmp[e]), {'color':this.present.colors.summary});

		i=0, j=0;
		for (x of used_expos){
			for (y of this.logic.roots){
				btn = grid.grid[j+top_margin+1][i+left_margin+1];
				if (!(y in this.logic.summary.mr_witnesses[x]))
					btn.innerHTML=0;
				else
					btn.innerHTML=this.logic.summary.mr_witnesses[x][y];
				if (y!=this.logic.m-1 && y!=1) Representation_utils.Painter(btn, this.present.colors.mr_witness);
				else if (y==1 && x!=used_expos[used_expos.length-1])
					btn.style.background=this.present.background_intertwined;
				else Representation_utils.Painter(btn, this.present.colors.non_witness);

				j+=1;
			}
			j=0, i+=1;
		}

		grid.single_filler([0, 0], `b<sup>x</sup>\\x`, {'color':this.present.colors.info});
		grid.single_filler([-1, 0], `Miller-Rabin test: |{b: b<sup>2x</sup> &equiv; 1 (mod m)}|`, {'color':this.present.colors.info, 'stylistic':{'px':{'width':280}} });
	}

	_presentation_summary_fermat(){
		var t_expo=[], t_count=[];
		for (var x in this.logic.summary.fermat_witnesses){
			t_expo.push(x);
			t_count.push(this.logic.summary.fermat_witnesses[x]);
		}

		var summa=ArrayUtils.sum(t_count);

		var len_1=t_expo.length;
		var top_margin=2, left_margin=2;

		var summary=Representation_utils.proto_divsCreator(1, 2+top_margin, [], null, this.present.summarized_funeral, this.stylistic);
		var grid = new Grid(2, len_1+3+left_margin, this.stylistic, {'place':summary.zdivs, 'top_margin':top_margin, 'left_margin':left_margin});

		grid.filler([0, [1, t_expo.length]], t_expo, {'color':5});
		grid.filler([1, [1, t_count.length]], t_count, {'color':this.present.colors.fermat_witness});
		//To change
		Modern_representation.button_modifier(grid.get(1, 1), {'stylistic':{'general':{'background':this.present.background_intertwined}}});

		grid.single_filler([1, t_expo.length+1], '', {'color':4,
			'stylistic':{'px':{'width':10}}
		});
		grid.single_filler([1, t_expo.length+2], summa, {'color':this.present.colors.summary});

		//Titles
		var description_width=180;
		grid.single_filler([-1, 0], `Fermat test`, {'color':this.present.colors.info, 'stylistic':{'px':{'width':description_width}} } );
		grid.single_filler([0, 0], `x`, {'color':this.present.colors.info, 'stylistic':{'px':{'width':description_width}} } );
		grid.single_filler([1, 0], `|{b:b<sup>m-1</sup> &equiv; x (mod m)}|`, {'color':this.present.colors.info, 'stylistic':{'px':{'width':description_width}} } );
	}

	_presentation_summary_summary(){
		var top_margin=2, left_margin=2;
		var summary=Representation_utils.gridlike_divs_creator(5+top_margin, this.present.summarized_funeral, this.stylistic);
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

			'border':4,
			'info':6,
		}
	}

	_presentation_construct_fundamentals(){
		this.present={};
		this._presentation_colors_set();
		this.present.background_intertwined = `linear-gradient(to right bottom, ${Modern_representation.colors[this.present.colors.non_witness]} 50%, ${Modern_representation.colors[this.present.colors.mr_witness]} 50%)`;

		Representation_utils.change_button_width(this.stylistic, this.logic.m);
	}

	_presentation_construct_coffin(){
		var x=document.createElement("DIV");
		this.present.summarized_funeral=x;
		this.present.summarized_funeral.style.verticalAlign='top';
		this.place.appendChild(x);
	}

	presentation(){
		this.place.style.width='max-content';
		this._presentation_construct_fundamentals();

		if (!this.only_summary.checked) this._presentation_basis();

		this._presentation_construct_coffin(); //coffin - all summaries
		if (this.logic.m%2 == 1) this._presentation_summary_mr();
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
export default Muller
