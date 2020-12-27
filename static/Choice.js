class Choice extends Algorithm{
	grid_constructor(){
		var i=0, j=0, btn_width=40, bt, tmp_lst, com_div;
		com_div=document.createElement("DIV");
		com_div.style.position="relative";
		com_div.style.width="100%";
		com_div.style.display="inline-block";
		this.place.appendChild(com_div);
		this.reality_list=[]

		this.full_width=Math.floor(com_div.offsetWidth/btn_width);
		var cols_size=Math.floor((this.full_width+1)/(this.n+1));
		var one_liner=this.n*cols_size;
		var fac=1;
		for (i=1; i<=this.n; i++) fac*=i;
		var k=Math.ceil(fac/one_liner);
		var all_rows=k*(this.n+2)-1;

		for (i=0; i<all_rows; i++){
			tmp_lst=[];
			this.reality_list.push(tmp_lst);
			for (j=0; j<this.full_width; j++){
				bt=this.buttCreator();
				com_div.appendChild(bt);
				tmp_lst.push(bt);
			}
		}
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
		this.starter();
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
	StatementComprehension(){}

	StateMaker(){
		var l=this.lees.length;
		var s=this.lees[l-1];
		var staat=[], i, presentation, permutations;
		if (this.finito==true) return;

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
			staat.push([3, 'finito', false, true]);
			this.reformulate_reality(this.presentation, staat, 1);
			presentation=this.make_presentation(this.permutations, 1);
			this.reformulate_reality(presentation, staat, 0, 0);
		}
		staat.push([3, 'presentation', this.presentation, presentation]);
		this.transformator(staat);
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
		com_div=document.createElement("DIV");
		com_div.style.position="relative";
		com_div.style.width="100%";
		com_div.style.display="inline-block";
		this.place.appendChild(com_div);
		this.reality_list=[]

		this.full_width=Math.floor(com_div.offsetWidth/btn_width);
		var cols_size=Math.floor((this.full_width+1)/(this.n+1));
		console.log(cols_size);
		var one_liner=this.fac[this.a[0]]*cols_size;
		var fac=this.fac[this.n];
		var k=Math.ceil(fac/one_liner);
		var all_rows=k*(this.fac[this.a[0]]+1)-1;
		console.log(all_rows, this.full_width);

		for (i=0; i<all_rows; i++){
			tmp_lst=[];
			this.reality_list.push(tmp_lst);
			for (j=0; j<this.full_width; j++){
				bt=this.buttCreator();
				com_div.appendChild(bt);
				tmp_lst.push(bt);
			}
		}
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
		this.lees=[];
		this.state_transformation=[];
		this.place.innerHTML='';
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
	StatementComprehension(){}

	StateMaker(){
		var l=this.lees.length;
		var s=this.lees[l-1];
		var staat=[], i, presentation, permutations;
		if (this.finito==true) return;

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
			staat.push([3, 'finito', false, true]);
			this.finito=true;
			this.reformulate_reality(this.presentation, staat, this.a[this.t-1], 1);
			presentation=this.make_presentation(this.permutations, 0);
			this.reformulate_reality(presentation, staat, 0, 0, 1);
		}

		staat.push([3, 'presentation', this.presentation, presentation]);
		this.transformator(staat);
	}
}


class Pascal_triangle extends Algorithm{
	constructor(block, n){
		super(block);
		this.n=n;
		this.btnlist=[];
		this.divsCreator(1, this.n+2);
		this.pascal=[];
		this.construct_pascal();
		this.create_reality(0);
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
		this.starter();
		this.btnlist=[];
		var fas=this.input.value;
		var c=this.dissolve_input(fas);
		this.n=c.get_next();

		this.divsCreator(1, this.n+2);
		this.construct_pascal();
		this.create_reality(4);
		this.place.style.width=`${(this.n+1)*this.bs_butt_width_h+210}px`;
		this.lees.push([0, 0]);
	}

	StateMaker(){
		var l=this.lees.length;
		var s=this.lees[l-1], staat=[];

		if (this.finito==true) return;
		if (s[0]==0){
			staat.push([0, this.btnlist[s[1]][0], 4, 1]);
			if (s[1]>1){
				staat.push([0, this.btnlist[s[1]-1][s[1]-1], 1, 0]);
				staat.push([0, this.btnlist[s[1]-2][s[1]-2], 1, 0]);
				staat.push([0, this.btnlist[s[1]-1][0], 0, 1]);
			}
		}

		if (s[0]==1){
			staat.push([0, this.btnlist[s[1]][s[2]-1], 1, 0]);
			if (s[2]!=1) staat.push([0, this.btnlist[s[1]-1][s[2]-2], 1, 0]);

			staat.push([0, this.btnlist[s[1]][s[2]], 4, 1]);
			if (s[2]!=s[1]) staat.push([0, this.btnlist[s[1]-1][s[2]], 0, 1]);
		}
		if (s[0]==100) {
			staat.push([3, 'finito', false, true]);
			staat.push([0, this.btnlist[this.n][this.n], 1, 0]);
			if (this.n>0) staat.push([0, this.btnlist[this.n-1][this.n-1], 1, 0]);
			
		}
		this.transformator(staat);
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

	create_reality(color){
		var i, j, btn;
		this.bs_butt_width_h=Math.max(this.pascal[this.n][Math.floor(this.n/2)].toString().length*10, 40);
		this.bs_butt_width=`${this.bs_butt_width_h}px`;
		this.place.style.width=`${(this.n+2)*this.bs_butt_width_h+10}px`;

		btn=this.buttCreator("n\\k");
		this.Painter(btn, 8);
		this.zdivs[0][0].append(btn);

		for (i=0; i<=this.n; i++){
			btn=this.buttCreator(i); 
			this.Painter(btn, 5);
			this.zdivs[0][0].append(btn);
		}
		for (i=0; i<=this.n; i++){
			btn=this.buttCreator(i); 
			this.Painter(btn, 5);
			this.zdivs[i+1][0].append(btn);
			this.btnlist.push([]);

			for (j=0; j<=i; j++){
				btn=this.buttCreator(this.pascal[i][j]);
				this.Painter(btn, color);
				this.zdivs[i+1][0].append(btn);
				this.btnlist[i].push(btn);
			}
		}
	}
}




var feral=Algorithm.ObjectParser(document.getElementById('Algo1'));
var eg1=new Choice(feral, 5);

var feral2=Algorithm.ObjectParser(document.getElementById('Algo2'));
var eg2=new Perm_rep(feral2, 3, [3, 2, 1]);

var feral3=Algorithm.ObjectParser(document.getElementById('Algo3'));
var eg3=new Pascal_triangle(feral3, 5);
