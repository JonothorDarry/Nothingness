function g_grid_constructor(obj, all_rows, width){
	var i=0, j=0, tmp_lst, bt;

	obj.reality_list=[]
	obj.divsCreator(1, all_rows);
	obj.all_rows=all_rows;
	for (i=0; i<all_rows; i++){
		tmp_lst=[];
		obj.reality_list.push(tmp_lst);
		for (j=0; j<width; j++){
			bt=obj.buttCreator();
			bt.innerHTML='';
			obj.zdivs[i].buttons.appendChild(bt);
			tmp_lst.push(bt);
		}
	}
}

function g_hide(div){div.style.display='none';}
function g_unhide(div){div.style.display='';}

function g_purge(obj, staat, row){
	var i, j, start=Math.min(row, obj.all_rows), end=Math.max(row, obj.all_rows);
	var f_next=((row<obj.all_rows)?g_hide:g_unhide), f_prev=((row<obj.all_rows)?g_unhide:g_hide);

	for (i=start; i<end; i++){
		staat.push([5, f_next, f_prev, [obj.divs[i]]]);
	}

	staat.push([3, 'all_rows', obj.all_rows, row]);
}

class Choice extends Algorithm{
	grid_constructor(){
		var i, btn_width=40;

		this.full_width=Math.floor(this.place.offsetWidth/btn_width);
		var cols_size=Math.floor((this.full_width+1)/(this.n+1));
		var one_liner=this.n*cols_size;
		var fac=1;
		for (i=1; i<=this.n; i++) fac*=i;
		var k=Math.ceil(fac/one_liner);
		var all_rows=k*(this.n+2)-1;

		g_grid_constructor(this, all_rows, this.full_width);
	}

	reformulate_reality(to_show, staat=null, clear=0, alive=1){
		var row=0, col=0, i, j, ij, color=((clear==0)?0:4), subcolor, precolor=((clear==0)?4:0), subprecolor;

		for (i=0; i<to_show.length; i++){
			if (to_show[i][0].length+1+col>this.full_width){
				col=0;
				if (alive==1) row+=to_show[i][0].length+3;
				else row++;
			}

			for (j=0; j<to_show[i].length; j++){
				for (ij=0; ij<to_show[i][j].length; ij++){
					if (j>0 && to_show[i][j][ij]==to_show[i][j].length){
						if (clear==0) subcolor=1, subprecolor=precolor;
						else subprecolor=1, subcolor=color;
					}
					else subcolor=color, subprecolor=precolor;

					if (staat!=null) staat.push([0, this.reality_list[row+j][col+ij], subprecolor, subcolor]);
					else this.Painter(this.reality_list[row+j][col+ij], subcolor);

					if (clear==0) {
						if (staat!=null) staat.push([1, this.reality_list[row+j][col+ij], this.reality_list[row+j][col+ij].innerHTML, to_show[i][j][ij]]);
						else this.reality_list[row+j][col+ij].innerHTML=to_show[i][j][ij];
					}
				}
			}
			col+=to_show[i][0].length+1+alive;
		}
	}

	make_presentation(permutations, botched=0){
		var presentation=[];
		var j, ij, tmp_lst, temp_pres, ln=permutations[0].length+1;
		for (j=0; j<permutations.length; j++){
			tmp_lst=[permutations[j]];
			if (botched==0){
				for (ij=0; ij<=permutations[j].length; ij++){
					temp_pres=permutations[j].slice();
					temp_pres.splice(ij, 0, ln);
					tmp_lst.push(temp_pres);
				}
			}
			presentation.push(tmp_lst);
		}
		return presentation
	}

	make_permutations(presentation){
		var j, ij, permutations=[];
		for (j=0; j<presentation.length; j++){
			for (ij=1; ij<presentation[j].length; ij++){
				permutations.push(presentation[j][ij]);
			}
		}
		return permutations;
	}

	constructor(block, n){
		super(block);
		this.n=n;
		this.grid_constructor();
		var temp_pres, tmp_lst, i=0, j=0, ij=0;
		this.presentation=[];
		this.permutations=[[]];

		for (i=1; i<=n; i++){
			this.presentation=this.make_presentation(this.permutations);
			this.permutations=this.make_permutations(this.presentation);
		}
		this.reformulate_reality(this.presentation);
	}

	BeginningExecutor(){
		var fas=this.input.value;
		var c=this.dissolve_input(fas);
		this.n=c.get_next();
		this.permutations=[[1]];
		this.presentation=[];

		//Create reality
		this.grid_constructor();
		this.lees.push([1, 1]);
	}

	NextState(){
		var l=this.lees.length;
		var s=this.lees[l-1];

		if (s[0]>=100) return;
		if (s[0]==0 && s[1]<this.n) this.lees.push([1, s[1]]);
		else if (s[0]==0) this.lees.push([100]);
		if (s[0]==1) this.lees.push([0, s[1]+1]);
	}
	StatementComprehension(){
		var l=this.lees.length;
		var s=this.lees[l-1];

		if (s[0]==1) return `All possible permutations of size ${s[1]} (there are ${s[1]}!=${this.permutations.length} such permutations) are grouped.`;
		if (s[0]==0) return `All possible permutations of size ${s[1]} are generated from permutations of size ${s[1]-1} by inserting one element in one of ${s[1]} indexes of those permutations, resulting in ${s[1]-1}!*${s[1]}=${this.presentation.length}*${s[1]}=${this.presentation.length*s[1]} permutations of size ${s[1]}`;
		if (s[0]==100) return `Here, all permutations of size ${this.n} are shown.`
	}

	StateMaker(){
		var l=this.lees.length;
		var s=this.lees[l-1];
		var i, presentation, permutations;
		var staat=this.ephemeral.staat, passer=this.ephemeral.passer;

		if (s[0]==0){
			this.reformulate_reality(this.presentation, staat, 1);
			presentation=this.make_presentation(this.permutations);
			this.reformulate_reality(presentation, staat);
			permutations=this.make_permutations(presentation);
			staat.push([3, 'permutations', this.permutations, permutations]);
		}

		if (s[0]==1){
			this.reformulate_reality(this.presentation, staat, 1);
			presentation=this.make_presentation(this.permutations, 1);
			this.reformulate_reality(presentation, staat);
		}

		if (s[0]==100){
			this.reformulate_reality(this.presentation, staat, 1);
			presentation=this.make_presentation(this.permutations, 1);
			this.reformulate_reality(presentation, staat, 0, 0);
		}
		staat.push([3, 'presentation', this.presentation, presentation]);
	}
}

class Perm_rep extends Algorithm{
	Painter(btn, col=1, only_bg=0){
		if (col<=12) super.Painter(btn, col, only_bg);
		if (col==13) btn.style.backgroundColor="#86085B";
		if (col==14) btn.style.backgroundColor="#030E87";
		if (col==15) btn.style.backgroundColor="#895504";
		if (col==16) btn.style.backgroundColor="#036788";
		if (col==17) btn.style.backgroundColor="#6F0606";
		if (col==18) btn.style.backgroundColor="#0F7902";
		if (col==19) btn.style.backgroundColor="#B34000";
	}

	grid_constructor(){
		var i=0, j=0, btn_width=40, bt, tmp_lst, com_div;

		this.full_width=Math.floor(this.place.offsetWidth/btn_width);
		var cols_size=Math.floor((this.full_width+1)/(this.n+1));
		var one_liner=this.fac[this.a[0]]*cols_size;
		var fac=this.fac[this.n];
		var k=Math.ceil(fac/one_liner);
		var all_rows=k*(this.fac[this.a[0]]+1)-1;

		g_grid_constructor(this, all_rows, this.full_width);
	}

	//param: 0 - normal show, 1 - final v start
	reformulate_reality(to_show, staat=null, size=0, clear=0,  finale=0){
		var row=0, col=0, i, j, ij, color=((clear==0)?0:4), subcolor, precolor=((clear==0)?4:0), subprecolor, tmp_shower;

		for (i=0; i<to_show.length; i++){
			if (to_show[i][0].length+col>this.full_width){
				col=0;
				if (finale==0) row+=this.fac[size];
				row++;
			}

			for (j=0; j<to_show[i].length; j++){
				for (ij=0; ij<to_show[i][j].length; ij++){
					if (clear==1) subcolor=4, subprecolor=this.color_mapper[to_show[i][j][ij][0]];
					else subprecolor=4, subcolor=this.color_mapper[to_show[i][j][ij][0]];

					if (staat!=null) staat.push([0, this.reality_list[row+j][col+ij], subprecolor, subcolor]);
					else this.Painter(this.reality_list[row+j][col+ij], subcolor);

					if (clear==0) {
						tmp_shower=to_show[i][j][ij];
						if (tmp_shower.length==2) tmp_shower=tmp_shower[1];
						else tmp_shower="";
						if (staat!=null) staat.push([1, this.reality_list[row+j][col+ij], this.reality_list[row+j][col+ij].innerHTML, tmp_shower]);
						else this.reality_list[row+j][col+ij].innerHTML=tmp_shower;
					}
				}
			}
			col+=to_show[i][0].length+1;
		}
		if (staat!=null) g_purge(this, staat, row+this.fac[size]);
	}

	//param: 0 - one per list, t+1 - merge by type
	make_presentation(permutations, param=0){
		var presentation=[];
		var i, j, ij, jj, tmp_lst, temp_pres, ln=permutations[0].length, formula;
		var dp=[], used=[], endet=1, before=0, neo_summa=0;
		for (i=0; i<this.fac[this.n]; i++) dp.push(0);
		for (i=0; i<ln; i++) used.push(0);

		for (j=0; j<permutations.length; j++){
			if (param>0){
				for (ij=0; ij<permutations[j].length; ij++){
					before=0;

					formula=((param-1!=permutations[j][ij][0])?this.mapper[permutations[j][ij]]:this.mapper[[permutations[j][ij][0]]]);
					for (jj=0; jj<=formula; jj++) before+=used[jj];
					neo_summa+=this.fac[ln-ij-1]*(formula-before);
					used[formula]+=1;
				}

				if (dp[neo_summa]>0) presentation[dp[neo_summa]-1].push(permutations[j]);
				else{
					dp[neo_summa]=endet;
					endet++;
					presentation.push([permutations[j]])
				}
				neo_summa=0;
				for (i=0; i<ln; i++) used[i]=0;
			}

			else{
				tmp_lst=[permutations[j]];
				presentation.push(tmp_lst);
			}
		}
		return presentation;
	}

	make_permutations(presentation, type){
		var i, j, permutations=[], tmp_list=[];
		for (i=0; i<presentation.length; i++){
			tmp_list=[];
			for (j=0; j<presentation[i][0].length; j++){
				if (presentation[i][0][j][0]!=type) tmp_list.push(presentation[i][0][j]);
				else tmp_list.push([type]);
			}
			permutations.push(tmp_list);
		}
		return permutations;
	}

	start_permutations(){
		var old_permutations=[[]], tmp_permutations, tmp_list, ln=1, i, j, ij, jj;

		this.mapper={};
		var amount=0;
		for (i=0; i<this.t; i++){
			for (j=1; j<=this.a[i]; j++){
				this.mapper[[i, j]]=amount+j-1;

				tmp_permutations=[];
				ln=old_permutations[0].length;
				for (ij=0; ij<old_permutations.length; ij++){
					for (jj=0; jj<=ln; jj++){
						tmp_list=old_permutations[ij].slice();
						tmp_list.splice(jj, 0, [i, j]);
						tmp_permutations.push(tmp_list);
					}
				}
				old_permutations=tmp_permutations;
			}
			amount+=this.a[i];
			this.mapper[[i]]=amount-1;
		}
		return old_permutations;

	}

	constructor(block, t, a){
		super(block);
		var temp_pres, tmp_lst, i=0, j=0, ij=0, presentation;
		this.presentation=[];
		this.permutations=[[]];
		this.t=t;
		this.a=a;
		
		const summer = (accumulator, currentValue) => accumulator + currentValue;
		this.n=a.reduce(summer, 0);

		this.color_mapper={
			0:13,
			1:14,
			2:15,
			3:16,
			4:17,
			5:18,
			6:19
		}
		this.fac=[1];
		for (i=0; i<20; i++) this.fac.push(this.fac[i]*(i+1));

		/*
		for (i=1; i<=n; i++){
			this.presentation=this.make_presentation(this.permutations);
			this.permutations=this.make_permutations(this.presentation);
		}*/

		this.permutations=this.start_permutations();
		this.grid_constructor();
		presentation=this.make_presentation(this.permutations, 0);
		this.reformulate_reality(presentation, null, 0, 0, 1);
	}

	BeginningExecutor(){
		var fas=this.input.value;
		var c=this.dissolve_input(fas);

		var i=0, j, jj, ij;
		this.a=[]
		this.t=c.get_next();
		this.n=0;

		for (i=0; i<this.t; i++){
			this.a.push(c.get_next());
			this.n+=this.a[i];
		}
		this.permutations=[[]];
		this.presentation=[];
		this.permutations=this.start_permutations();

		//Create reality
		this.grid_constructor();
		this.lees.push([0]);
	}

	NextState(){
		var l=this.lees.length;
		var s=this.lees[l-1];

		if (s[0]>=100) return;
		if (s[0]==0) this.lees.push([1, 0]);
		if (s[0]==1) this.lees.push([2, s[1]]);
		if (s[0]==2 && s[1]<this.t-1) this.lees.push([1, s[1]+1]);
		else if (s[0]==2) this.lees.push([100]);
	}
	StatementComprehension(){
		var l=this.lees.length;
		var s=this.lees[l-1];


		if (s[0]==0) return `All ${this.n}!=${this.fac[this.n]} representations of solutions are shown.`;
		if (s[0]==1) return `All representations that describe same object with respect to type ${s[1]} are grouped. In each group, there are a<sub>${s[1]}</sub>!=${this.a[s[1]]}!=${this.fac[this.a[s[1]]]} representations of a single sequence.`;
		if (s[0]==2) return `All representation except one referring to one object with respect to type ${s[1]} are removed, and so, now one can assume that elements of type ${s[1]} are not enumerated within representations. The number of representations is reduced to ${this.permutations.length*this.fac[this.a[s[1]]]}/${this.fac[this.a[s[1]]]}=${this.permutations.length}`;
		if (s[0]==100) return `All ${this.permutations.length} solutions are shown.`;
	}

	StateMaker(){
		var l=this.lees.length;
		var s=this.lees[l-1];
		var i, presentation, permutations;
		var staat=this.ephemeral.staat, passer=this.ephemeral.passer;

		if (s[0]==0){
			presentation=this.make_presentation(this.permutations, 0);
			this.reformulate_reality(presentation, staat, 0, 0, 1);
		}

		if (s[0]==1){
			this.reformulate_reality(this.presentation, staat, ((this.lees[l-2][0]==0)?0:this.a[s[1]-1]), 1, ((this.lees[l-2][0]==0)?1:0));
			presentation=this.make_presentation(this.permutations, s[1]+1);
			this.reformulate_reality(presentation, staat, this.a[s[1]]);
		}

		if (s[0]==2){
			this.reformulate_reality(this.presentation, staat, this.a[s[1]], 1);
			permutations=this.make_permutations(this.presentation, s[1]);
			presentation=this.make_presentation(permutations, 0);
			this.reformulate_reality(presentation, staat, this.a[s[1]]);
			staat.push([3, 'permutations', this.permutations, permutations]);
		}

		if (s[0]==100){
			this.reformulate_reality(this.presentation, staat, this.a[this.t-1], 1);
			presentation=this.make_presentation(this.permutations, 0);
			this.reformulate_reality(presentation, staat, 0, 0, 1);
		}

		staat.push([3, 'presentation', this.presentation, presentation]);
	}
}

class Pascal_base extends Algorithm{
	constructor(block, n){
		super(block);
		this.n=n;
		this.btnlist=[];
		this.divsCreator(1, this.n+2);
		this.pascal=[];
		this.construct_pascal();
		//this.create_reality(0);
	}

	construct_pascal(){
		var i=0, j=0;
		for (i=0; i<=this.n; i++){
			this.pascal.push([1]);
			for (j=1; j<i; j++){
				this.pascal[i].push(this.pascal[i-1][j]+this.pascal[i-1][j-1]);
			}
			this.pascal[i].push(1);
		}
	}

	BeginningExecutor(){
		this.btnlist=[];
		this.read_data();

		this.divsCreator(1, this.n+2);
		this.construct_pascal();
		this.place.style.width=`${(this.n+1)*this.stylistic.bs_butt_width_h+210}px`;
		//this.create_reality(4);
		//this.lees.push([0, 0]);
	}

	create_reality(color){
		var i, j, btn;
		this.stylistic.bs_butt_width_h=Math.max(this.pascal[this.n][Math.floor(this.n/2)].toString().length*10, 40);
		this.stylistic.bs_butt_width=`${this.stylistic.bs_butt_width_h}px`;
		this.place.style.width=`${(this.n+2)*this.stylistic.bs_butt_width_h+10}px`;

		btn=this.buttCreator("n\\k");
		this.Painter(btn, 8);
		this.zdivs[0].buttons.append(btn);

		for (i=0; i<=this.n; i++){
			btn=this.buttCreator(i); 
			this.Painter(btn, 5);
			this.zdivs[0].buttons.append(btn);
		}
		for (i=0; i<=this.n; i++){
			btn=this.buttCreator(i); 
			this.Painter(btn, 5);
			this.zdivs[i+1].buttons.append(btn);
			this.btnlist.push([]);

			for (j=0; j<=i; j++){
				btn=this.buttCreator(this.pascal[i][j]);
				this.Painter(btn, color);
				this.zdivs[i+1].buttons.append(btn);
				this.btnlist[i].push(btn);
			}
		}
	}
}

class Pascal_triangle extends Pascal_base{
	constructor(block, n){
		super(block, n);
		this.create_reality(0);
	}

	read_data(){
		var fas=this.input.value;
		var c=this.dissolve_input(fas);
		this.n=c.get_next();
	}

	BeginningExecutor(){
		super.BeginningExecutor();
		this.create_reality(4);
		this.lees.push([0, 0]);
	}

	StateMaker(){
		var l=this.lees.length;
		var s=this.lees[l-1];
		var staat=this.ephemeral.staat, passer=this.ephemeral.passer;

		if (s[0]==0){
			this.pass_color(this.btnlist[s[1]][0]);
			if (s[1]>1){
				this.pass_color(this.btnlist[s[1]-1][0], 0, 14);
			}
		}

		if (s[0]==1){
			this.pass_color(this.btnlist[s[1]][s[2]]);
			this.pass_color(this.btnlist[s[1]-1][s[2]-1], 0, 14);
			if (s[2]!=s[1]) this.pass_color(this.btnlist[s[1]-1][s[2]], 0, 14);
		}
	}

	NextState(){
		var l=this.lees.length;
		var s=this.lees[l-1];

		if (s[0]>=100) return;
		if (s[0]==0){
			if (this.n!=0 && s[1]!=0) this.lees.push([1, s[1], 1]);
			else if (this.n!=0) this.lees.push([0, s[1]+1]);
			else this.lees.push([100]);
		}
		if (s[0]==1){
			if (this.n==s[2]) this.lees.push([100]);
			else if (s[1]==s[2]) this.lees.push([0, s[1]+1]);
			else this.lees.push([1, s[1], s[2]+1]);
		}
	}
	StatementComprehension(){
		var l=this.lees.length;
		var s=this.lees[l-1];
		var lambda=function(x){return (x>1)?'s':''};

		if (s[0]==0 && s[1]==0) return `One can choose 0 elements out of 0 elements in exactly one way - by not choosing any elements, so Cn(0,0)=1`;
		if (s[0]==0) return `One can choose 0 elements out of ${s[1]} elements in exactly one way (or Cn(${s[1]-1},0) ways) - by not choosing any elements, so Cn(${s[1]},0)=1`;
		if (s[0]==1) return `One can choose ${s[2]} element${lambda(s[2])} out of ${s[1]} element${lambda(s[1])} in ${this.pascal[s[1]][s[2]]} way${lambda(this.pascal[s[1]][s[2]])}, as Cn(${s[1]},${s[2]})=Cn(${s[1]-1},${s[2]-1})+Cn(${s[1]-1},${s[2]})=${this.pascal[s[1]-1][s[2]-1]}+${s[1]!=s[2]?this.pascal[s[1]-1][s[2]]:0}=${this.pascal[s[1]][s[2]]} - this equation comes from Pascal\'s identity, as ${s[2]} elements out of ${s[1]} element${lambda(s[1])} can be chosen either from first ${s[1]-1} element${lambda(s[1]-1)}, thus - Cn(${s[1]-1},${s[2]}); or ${s[2]-1} element${lambda(s[2]-1)} can be chosen from first ${s[1]-1} element${lambda(s[1]-1)}, then last element will be chosen - thus Cn(${s[1]-1},${s[2]-1})`;
		if (s[0]==100) return `And so, Pascal's triangle of size ${this.n} was constructed.`;
	}
}

class Hockey_stick extends Pascal_base{
	constructor(block, n, k){
		super(block, n);
		this.create_reality(0);
	}

	read_data(){
		var fas=this.input.value;
		var c=this.dissolve_input(fas);
		this.n=c.get_next();
		this.k=c.get_next();
	}

	BeginningExecutor(){
		super.BeginningExecutor();
		this.create_reality(0);
		this.Painter(this.btnlist[this.n][this.k], 8);
		this.str_cn='';
		this.str_num='';
		this.lees.push([0, this.n-1]);
	}

	StateMaker(){
		var l=this.lees.length;
		var s=this.lees[l-1];
		var staat=this.ephemeral.staat, passer=this.ephemeral.passer;

		if (s[0]==0){
			staat.push([3, 'str_cn', this.str_cn, this.str_cn+`${this.str_num.length==0?'':'+'}`+`Cn(${s[1]},${this.k-1})`]);
			staat.push([3, 'str_num', this.str_num, this.str_num+`${this.str_num.length==0?'':'+'}`+`${this.pascal[s[1]][this.k-1]}`]);

			staat.push([0, this.btnlist[s[1]][this.k], 0, 1]);
			staat.push([0, this.btnlist[s[1]][this.k-1], 0, 1]);
			if (s[1]+1<this.n) staat.push([0, this.btnlist[s[1]+1][this.k], 1, 0]);
		}
		if (s[0]==100) {
			staat.push([3, 'str_cn', this.str_cn, this.str_cn+`${this.str_num.length==0?'':'+'}`+`Cn(${this.k-1},${this.k-1})`]);
			staat.push([3, 'str_num', this.str_num, this.str_num+`${this.str_num.length==0?'':'+'}`+`1`]);

			staat.push([0, this.btnlist[this.k-1][this.k-1], 0, 1]);
			if (this.k<this.n) staat.push([0, this.btnlist[this.k][this.k], 1, 0]);
		}
	}

	NextState(){
		var l=this.lees.length;
		var s=this.lees[l-1];

		if (s[0]>=100) return;
		if (s[0]==0){
			if (s[1]>this.k) this.lees.push([0, s[1]-1]);
			else this.lees.push([100]);
		}
	}
	StatementComprehension(){
		var l=this.lees.length;
		var s=this.lees[l-1];
		var lambda=function(x){return (x>1)?'s':''};

		if (s[0]==0) return `Equality Cn(${s[1]+1},${this.k})=Cn(${s[1]},${this.k})+Cn(${s[1]},${this.k-1}) (stemming from Pascal's identity) is used to show Cn(${this.n},${this.k})=${this.str_cn}+Cn(${s[1]},${this.k})=${this.str_num}+${this.pascal[s[1]][this.k]}=${this.pascal[this.n][this.k]}`;
		if (s[0]==100) return `Equality Cn(${this.k},${this.k})=Cn(${this.k-1},${this.k})+Cn(${this.k-1},${this.k-1}) (stemming from Pascal's identity) is used - and as Cn(${this.k-1},${this.k})=0, this is the last step in this mechanism showing identity - to show, that Cn(${this.n},${this.k})=${this.str_cn}=${this.str_num}=${this.pascal[this.n][this.k]}`;
	}
}

class Com_rep extends Partial{
	constructor(block, n, k){
		super(block);
		this.n=k-1+n;
		this.k=k-1;
		this.make_system(this.n, this.k);
		this.grid_constructor();
		this.reformulate_reality(this.all_combinats);
	}

	ShowReality(){
		this.place.innerHTML='';
		var fas=this.input.value;
		var c=this.dissolve_input(fas);
		var seq_ln=c.get_next();
		this.k=c.get_next()-1;
		this.n=this.k+seq_ln;

		this.make_system(this.n, this.k);
		this.grid_constructor();
		this.reformulate_reality(this.all_combinats);
	}

	Painter(btn, col=1, only_bg=0){
		if (col<=12) super.Painter(btn, col, only_bg);
		if (col==13) btn.style.backgroundColor="#E60073";
		if (col==14) btn.style.backgroundColor="#B3FFFF";
		if (col==15) btn.style.backgroundColor="#80FF80";
		if (col==16) btn.style.backgroundColor="#CC6600";
		if (col==17) btn.style.backgroundColor="#660011";
		if (col==18) btn.style.backgroundColor="#7F0099";
		if (col==19) btn.style.backgroundColor="#004D40";
	}

	make_system(n, k){
		this.all_combinats=[];
		var i, j, cur_perm=[], new_perm, zeros;
		for (i=0; i<n-k; i++) cur_perm.push(0);
		for (i=0; i<k; i++) cur_perm.push(1);
		this.all_combinats.push(cur_perm);

		while (true){
			new_perm=[], zeros=0;
			for (i=n-1; i>0; i--){
				if (cur_perm[i]==1 && cur_perm[i-1]==0) break;
			}
			if (i==0) break;
			for (j=0; j<i-1; j++) {
				new_perm.push(cur_perm[j]);
				if (cur_perm[j]==0) zeros++;
			}
			new_perm.push(1);
			for (j=0; j<n-k-zeros; j++) new_perm.push(0);
			for (j=j+i; j<n; j++) new_perm.push(1);
			this.all_combinats.push(new_perm);
			cur_perm=new_perm;
		}
	}

	grid_constructor(){
		var btn_width=40;
		var batch=(this.n-this.k)*40+this.k*20;
		var width_combinations=Math.floor((this.place.offsetWidth+btn_width)/(batch+btn_width));
		var all_rows=Math.ceil(this.all_combinats.length/width_combinations);
		var system=width_combinations*(this.n+1)-1;
		this.system_end=system+Math.floor((this.place.offsetWidth-((batch+btn_width)*(width_combinations-1)+batch))/40);

		g_grid_constructor(this, all_rows, this.system_end);
	}

	reformulate_reality(permutations){
		var row=0, col=0, i, j, ij, ones;

		for (i=0; i<permutations.length; i++){
			ones=0;
			if (permutations[i].length+col>this.system_end){
				col=0;
				row++;
			}

			for (j=0; j<permutations[i].length; j++){
				if (permutations[i][j]==0){
					this.Painter(this.reality_list[row][col+j], 13+ones);
					this.reality_list[row][col+j].style.borderRadius='100%';
				}
				if (permutations[i][j]==1){
					this.reality_list[row][col+j].style.width='15px';
					this.reality_list[row][col+j].style.margin='0 2.5px';
					this.Painter(this.reality_list[row][col+j], 5);
					ones++;
				}
			}
			col+=this.n+1;
		}
	}
}



var feral=Algorithm.ObjectParser(document.getElementById('Algo1'));
var eg1=new Choice(feral, 5);

var feral2=Algorithm.ObjectParser(document.getElementById('Algo2'));
var eg2=new Perm_rep(feral2, 2, [3, 2]);

var feral3=Algorithm.ObjectParser(document.getElementById('Algo3'));
var eg3=new Pascal_triangle(feral3, 5);

var feral4=Algorithm.ObjectParser(document.getElementById('Algo4'));
var eg4=new Hockey_stick(feral4, 7, 4);

var feral5=Partial.ObjectParser(document.getElementById('Algo5'));
var eg5=new Com_rep(feral5, 5, 3);
