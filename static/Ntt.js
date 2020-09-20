class Ntt extends Algorithm{
	constructor(block, a=17, b=43, m=107){
		super(block);
		this.btlist=[];
		this.utilbts=[];

		this.place.innerHTML='';
		for (var i=0;i<3;i++) this.btlist.push([]);
	}

	BeginningExecutor(){
		this.btnlist=[];
		this.utilbts=[];
		this.to_clear=[];

		this.lees=[];
		this.place.innerHTML='';
		var fas=this.input.value;
		this.a=[];
		this.b=[];

		this.a_merger=[];
		this.b_merger=[];
		var x, i=0, j=0, c, m, j, btn, mx_all, g;
		
		for (i=0;i<3;i++) this.btlist.push([]);
		c=this.dissolve_input(fas);

		this.o=c.get_next();
		for (i=0;i<=this.o;i++) this.a.push(BigInt(c.get_next()));
		this.m=c.get_next();
		for (i=0;i<=this.m;i++) this.b.push(BigInt(c.get_next()));
		this.q=c.get_next();
		this.Bq=BigInt(this.q);


		for (i=1,j=0;i<=this.o+this.m;i*=2,j++) ;
		this.n=i;
		this.lv=j;

		for (j=this.o+1;j<i;j++) this.a.push(0n);
		for (j=this.m+1;j<i;j++) this.b.push(0n);
		for (j=0;j<=this.lv;j++){
			this.a_merger.push([]);
			this.b_merger.push([]);
			for (i=0;i<this.n;i++){
				this.a_merger[j].push(0);
				this.b_merger[j].push(0);
			}
		}


		mx_all=Math.max(4, 4)*10;
		this.bs_butt_width=`${Math.max(40, mx_all)}px`;
		this.bs_butt_width_h=Math.max(40, mx_all);
		this.divsCreator();
		this.lees.push([0]);
		this.butterfly=[];

		for (i=0;i<3;i++){
			this.btnlist.push([]);
			for (j=0;j<this.n;j++){
				btn=super.buttCreator();
				this.btnlist[i].push(btn);
				this.zdivs[i][2].appendChild(btn);
			}
		}
		//Primitive root
		this.btnlist.push([]);
		btn=super.buttCreator();
		this.btnlist[3].push(btn);
		this.zdivs[3][1].appendChild(btn);

		for (i=4;i<15;i++){
			this.btnlist.push([]);
			if (i==5) continue;
			for (j=0;j<this.n;j++){
				btn=super.buttCreator();
				if (i>=7 && i<=7+this.lv && ((j%(1<<(i-7+1)))<(1<<(i-7))))
					btn.base_color=12;


				this.btnlist[i].push(btn);
				this.zdivs[i-1][2].appendChild(btn);
			}
		}
	}

	clear(){
		var i;
		for (i=0;i<this.to_clear.length;i++){
			if ('base_color' in this.to_clear[i])
				this.Painter(this.to_clear[i], this.to_clear[i].base_color);
			else this.Painter(this.to_clear[i], 0);
		}
	}

	StateMaker(){
		var l=this.lees.length;
		var s=this.lees[l-1], j, btn, value, i=0, n=this.n;
		this.clear();

		if (s[0]==0){
			for (i=0;i<3;i++){
				for (j=0;j<this.n;j++){
					value=(i==0?j:(i==1?this.a[j]:this.b[j]));
					this.btnlist[i][j].innerHTML=value;
					this.Painter(this.btnlist[i][j], 0);
				}
			}
		}

		if (s[0]==1){
			this.Painter(this.btnlist[3][0], 1);
			this.qoot=NTMath.find_proot(this.q);
			this.btnlist[3][0].innerHTML=this.qoot;
		}

		if (s[0]==2){
			var beg=NTMath.pow(this.qoot, Math.floor((this.q-1)/this.n), this.q);
			this.w=beg;
			this.Painter(this.btnlist[4][0], 1);
			this.Painter(this.btnlist[4][1], 1);
			this.Painter(this.btnlist[3][0], 0);
			this.btnlist[4][1].innerHTML=beg;
			this.btnlist[4][0].innerHTML=1;
		}

		if (s[0]==3){
			this.roots=[1n, this.w];
			var starter=this.w, i=0, BIpr=BigInt(this.q);
			this.Painter(this.btnlist[4][0], 0);
			this.Painter(this.btnlist[4][1], 0);

			for (i=2;i<this.n;i++){
				starter=(starter*this.w)%BIpr;
				this.roots.push(starter);
				this.btnlist[4][i].innerHTML=starter;
				this.Painter(this.btnlist[4][i], 1);
			}
		}

		if (s[0]==4){
			var x=s[1], btn;
			var cnst=Math.floor(n/x), halfx=Math.floor(x/2);
			if (x==1) {
				for(i=2;i<n;i++) this.Painter(this.btnlist[4][i], 0);
				this.butterfly.push(0);
				this.btnlist[6][0].innerHTML=0;
				this.Painter(this.btnlist[6][0], 1);
			}
			else{
				for (i=halfx; i<x; i++){
					this.butterfly.push(this.butterfly[i-halfx]+cnst);
					this.btnlist[6][i].innerHTML=this.butterfly[i];
					this.Painter(this.btnlist[6][i], 1);
				}
			}
			for (i=Math.floor(halfx/2); i<halfx; i++) this.Painter(this.btnlist[6][i], 0);
		}

		if (s[0]==5){
			for (i=0;i<n;i++) {
				this.btnlist[7][i].innerHTML=this.a[this.butterfly[i]];
				this.a_merger[0][i]=this.a[this.butterfly[i]];
				this.Painter(this.btnlist[7][i], 1);
				this.Painter(this.btnlist[1][i], 1);
			}
			for (i=Math.floor(n/2);i<n;i++) this.Painter(this.btnlist[6][i], 0);
		}

		if (s[0]==6 || s[0]==7){
			console.log(this.roots);
			if (s[0]==6 && s[1]==0 && s[2]==1 && s[3]==0 && s[4]==0){
				for (i=0;i<n;i++) {
					this.Painter(this.btnlist[7][i], 0);
					this.Painter(this.btnlist[1][i], 0);
				}
			}

			var pnt=s[1], level=s[2], poly=s[3], place=s[4], part=(1<<(level-1)), whole=(1<<level)*poly+place;
			var cur_btn=this.btnlist[level+7][whole+((s[0]==7)?part:0)];
			var diff=(1<<(this.lv-level))*place+((s[0]==7)?(1<<(this.lv-1)):0);
			var pol_0=this.btnlist[level+6][whole];
			var pol_1=this.btnlist[level+6][whole+part];
			var w=this.btnlist[4][diff];
			var value=(this.a_merger[level-1][whole]+this.roots[diff]*this.a_merger[level-1][whole+part])%this.Bq;
			
			this.a_merger[level][whole+((s[0]==7)?part:0)]=value;
			this.Painter(cur_btn, 1);
			if (s[0]==6){
				this.Painter(pol_0, 5);
				this.Painter(pol_1, 8);
			}
			this.Painter(w, 8);

			if (s[0]==7) this.to_clear=[cur_btn, pol_0, pol_1, w];
			else this.to_clear=[cur_btn, w];
			cur_btn.innerHTML=value;
		}
	}

	StateUnmaker(){
		var l=this.lees.length;
		var s=this.lees[l-1];

		if (s[0]==1){
			this.Painter(this.btnlist[3][0], 4);
		}

		if (s[0]==2){
			this.Painter(this.btnlist[4][0], 4);
			this.Painter(this.btnlist[4][1], 4);
			this.Painter(this.btnlist[3][0], 1);
		}

		if (s[0]==3){
			this.roots=[1, this.w];
			var i=0;
			this.Painter(this.btnlist[4][0], 1);
			this.Painter(this.btnlist[4][1], 1);

			for (i=2;i<this.n;i++){
				this.roots.pop();
				this.Painter(this.btnlist[4][i], 4);
			}
		}

		if (l>1) this.lees.pop();
	}



	StatementComprehension(){
		var wfun=function(x){return `w<sub>n</sub><sup>${x}</sup>`;}
		var l=this.lees.length, w1=wfun(1), wn=wfun('n'), w0=wfun(0), wi=wfun('i'), wi_1=wfun('i-1');
		var s=this.lees[l-1];
		var strr=``;
		if (s[0]==0) strr=`At the start of the algorithm, the polynominals A(x), B(x) are padded with 0's, so that it will be possible to find their values in not less than o+m+1=${this.o+this.m+1} &le; ${this.n} places`
		if (s[0]==1) strr=`Primitive root modulo q=${this.q} is found, it is equal to ${this.qoot} (to attain this root probabilistic algorithm was used).`;
		if (s[0]==2) strr=`As root was found, new aim is to find such value g, that ord<sub>${this.q}</sub>(g)=${this.n} - this value is proot<sup>&#x3d5;(q)/n</sup> mod q=${this.qoot}<sup>${this.q-1}/${this.n}</sup> mod ${this.q}=${this.w}. Besides, I also fill value of ${wn}=${w0}=1`;
		if (s[0]==3) strr=`I find further subsequent values of ${wi} using fact, that ${w1}${wi_1} mod q=${wi} (so I just multiply previous value by ${w1}=${this.w} modulo ${this.q}). Notice that I didn't added ${wn}, as ${wn}=${w0}`
		return strr;
	}

	NextState(){
		var l=this.lees.length;
		var s=this.lees[l-1], col, lv=this.lv;
		var i=0;

		if (s[0]>=100) return;
		if (s[0]==0) this.lees.push([1]);
		if (s[0]==1) this.lees.push([2]);
		if (s[0]==2) this.lees.push([3]);
		if (s[0]==3) this.lees.push([4, 1]);
		if (s[0]==4 && s[1]<this.n) this.lees.push([4, s[1]*2]);
		if (s[0]==4 && s[1]==this.n) this.lees.push([5, 0]);
		if (s[0]==5) this.lees.push([6, 0, 1, 0, 0]);
		if (s[0]==6) this.lees.push([7, s[1], s[2], s[3], s[4]]);

		     if (s[0]==7 && s[4]==(1<<(s[2]-1))-1 && s[3]==(1<<(lv-s[2]))-1 && s[2]==lv) this.lees.push([8]);
		else if (s[0]==7 && s[4]==(1<<(s[2]-1))-1 && s[3]==(1<<(lv-s[2]))-1) this.lees.push([6, s[1], s[2]+1, 0, 0]);
		else if (s[0]==7 && s[4]==(1<<(s[2]-1))-1) this.lees.push([6, s[1], s[2], s[3]+1, 0]);
		else if (s[0]==7) this.lees.push([6, s[1], s[2], s[3], s[4]+1]);
	}

	//Adding belt for write-ups and buttons 
	divsCreator(){
		var divs=[], zdivs=[], i, j;
		var title_list=["i", "a<sub>i</sub>", "b<sub>i</sub>", "primitive root and w<sub>n</sub><sup>i</sup>", "", "i", "a<sub>i</sub>"];

		for (i=0;i<15;i++) divs.push(document.createElement("DIV")), zdivs.push([]);
		for (i=0;i<15;i++){
			divs[i].style.width="100%";
			divs[i].style.height="40px";
			//zdivs - inside div: 0 is write-up, 1 is button
			for (j=0;j<3;j++) {
				zdivs[i].push(document.createElement("DIV"));
				zdivs[i][j].style.margin="0";
				zdivs[i][j].style.padding="0";
				zdivs[i][j].style.display="inline-block";
				divs[i].appendChild(zdivs[i][j]);
			}
			zdivs[i][0].innerHTML=title_list[i];
			zdivs[i][0].style.width="200px";
			zdivs[i][1].style.width="60px";
			zdivs[i][2].style.position="relative";

			this.place.appendChild(divs[i]);
		}
		this.divs=divs;
		this.zdivs=zdivs;
	}
}



var feral=Algorithm.ObjectParser(document.getElementById('Algo1'));
var eg1=new Ntt(feral, 6, [2, 7, 3, 12, 43, 25, 19], 7, [4, 6, 7, 1, 2, 3, 4, 132]);
