class Choice extends Algorithm{

	grid_constructor(){
		var i=0, j=0, btn_width=40, bt, tmp_lst;
		this.com_div=document.createElement("DIV");
		this.com_div.style.position="relative";
		this.com_div.style.width="100%";
		this.com_div.style.display="inline-block";
		this.place.appendChild(this.com_div);
		this.reality_list=[]

		this.full_width=Math.floor(this.com_div.offsetWidth/btn_width);
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
				this.com_div.appendChild(bt);
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
			this.reformulate_reality(this.presentation);
			this.permutations=this.make_permutations(this.presentation);

			if (i<n) this.reformulate_reality(this.presentation, null, 1);
			this.presentation=[];
		}
	}

	BeginningExecutor(){
		this.lees=[];
		this.state_transformation=[];
		this.place.innerHTML='';
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

		this.state_transformation.push(staat);
		var x;
		for (i=0;i<staat.length;i++){
			x=staat[i];
			if (x[0]==0) this.Painter(x[1], x[3]);
			if (x[0]==1) x[1].innerHTML=x[3];
			if (x[0]==2) x[1].push(x[2]);
			if (x[0]==3) this[x[1]]=x[3];
		}
	}
}


var feral=Algorithm.ObjectParser(document.getElementById('Algo1'));
var eg1=new Choice(feral, 5);
