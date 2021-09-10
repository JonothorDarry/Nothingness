class Ntt extends Algorithm{
	_pusher(arr, x, ntt){
		if (ntt==true) arr.push(BigInt(x));
		else arr.push(new Complex(x));
	}

	_logical_inversion(){
		if (this.logic.is_ntt) this.logic.inv_n=BigInt(NTMath.inverse(this.logic.n, this.logic.q));
		else this.logic.inv_n=1/this.logic.n;
	}
	_logical_proot(){
		if (this.logic.is_ntt) this.logic.proot=NTMath.find_proot(this.logic.q, false);
		else this.logic.proot=new Complex(Math.cos(2*Math.PI/this.logic.n), Math.sin(2*Math.PI/this.logic.n));
	}
	_logical_single_unity_root(){
		if (this.logic.is_ntt) this.logic.w=NTMath.pow(this.logic.proot, Math.floor((this.logic.toth)/this.logic.n), this.logic.q);
		else this.logic.w=this.logic.proot;
	}
	_logical_butterfly(){
		var cnst, halfx, x, i;

		this.logic.butterfly=Array.apply(null, Array(this.logic.n)).map(e => 0);
		for (x=1; x<=this.logic.n; x*=2){
			cnst=Math.floor(this.logic.n/x), halfx=Math.floor(x/2);
			if (x!=1){
				for (i=halfx; i<x; i++){
					this.logic.butterfly[i]=this.logic.butterfly[i-halfx]+cnst;
				}
			}
		}
	}

	_logical_all_unity_roots(){
		this.logic.roots=Array.apply(null, Array(this.logic.n)).map(e => 0);

		var starter, i=0;
		if (this.logic.is_ntt){
			this.logic.roots[0]=1n;
			this.logic.roots[1]=this.logic.w;
			starter=this.logic.w;
		}
		else{
			this.logic.roots[0]=new Complex(1, 0);
			this.logic.roots[1]=this.logic.w;
			starter=new Complex(this.logic.w.real, this.logic.w.img);
		}

		for (i=2; i<this.logic.n; i++){
			if (this.logic.is_ntt){
				starter=(starter*this.logic.w)%this.logic.Bq;
				this.logic.roots[i]=starter;
			}
			else{
				starter=starter.mul(this.logic.w);
				this.logic.roots[i]=new Complex(starter.real, starter.img);
			}
		}
	}

	_logical_inverse_unity_roots(){
		this.logic.inv_roots=this.logic.roots.map((e,i,a) => (i==0)?a[0]:a[this.logic.n-i]);
	}

	_logical_transform(starting_values, name, roots=1){
		var i, j, level, polys, poly, part, whole, used_roots, diff, elems, place, post_place, movement, value;
		this.logic[name]=ArrayUtils.create_2d(this.logic.lv+1, this.logic.n);

		for (i=0; i<this.logic.n; i++) this.logic[name][0][i]=starting_values[this.logic.butterfly[i]];
		used_roots=((roots!=1)?this.logic.inv_roots:this.logic.roots);

		for (level=1; level<=this.logic.lv; level++){
			polys = 1<<(this.logic.lv-level);
			elems = 1<<level;
			for (poly=0; poly<polys; poly++){
				for (post_place=0; post_place<elems; post_place++){
					movement=(post_place>=(elems>>1));
					place=post_place-movement*(elems>>1);

					part=(1<<(level-1)), whole=(1<<level)*poly+place;
					diff=(1<<(this.logic.lv-level))*place+(movement?(1<<(this.logic.lv-1)):0);

					if (this.logic.is_ntt) value=(this.logic[name][level-1][whole]+used_roots[diff]*this.logic[name][level-1][whole+part])%this.logic.Bq;
					else value=this.logic[name][level-1][whole].add(used_roots[diff].mul(this.logic[name][level-1][whole+part]));
					this.logic[name][level][whole+(movement?part:0)]=value;
				}
			}
		}
	}

	_logical_multiply(){
		var i;
		this.logic.y=Array.apply(null, Array(this.logic.n)).map(e => 0n);
		for (i=0; i<this.logic.n; i++){
			if (this.logic.is_ntt) this.logic.y[i]=(this.logic.a_merger[this.logic.lv][i]*this.logic.b_merger[this.logic.lv][i])%this.logic.Bq;
			else this.logic.y[i]=this.logic.a_merger[this.logic.lv][i].mul(this.logic.b_merger[this.logic.lv][i]);
		}
	}
	_logical_generate_result(){
		var i;
		this.logic.res=Array.apply(null, Array(this.logic.n)).map(e => 0);
		for (i=0; i<this.logic.n; i++){
			if (this.logic.is_ntt) this.logic.res[i]=(this.logic.y_merger[this.logic.lv][i]*this.logic.inv_n)%this.logic.Bq;
			else this.logic.res[i]=this.logic.y_merger[this.logic.lv][i].mul(new Complex(this.logic.inv_n));
		}
	}


	logical_box(){
		var i, j;
		var o=this.logic.o, m=this.logic.m;
		for (i=1,j=0; i<=o+m; i*=2,j++) ;
		this.logic.n=i;
		this.logic.lv=j;

		var nullos_lv=Array.apply(null, Array(this.logic.lv+1));

		for (j=o+1;j<i;j++) this._pusher(this.logic.a, 0, this.logic.is_ntt);
		for (j=m+1;j<i;j++) this._pusher(this.logic.b, 0, this.logic.is_ntt);
		this._logical_butterfly();

		//Totient and implausibility of further actions
		if (this.logic.is_ntt){
			this.logic.toth=NTMath.find_totient(this.logic.q);
			if (this.logic.q%2==0) return;
			else if (this.logic.toth%this.logic.n!=0) return;
		}
		this._logical_proot();
		this._logical_single_unity_root();
		this._logical_inversion();
		this._logical_all_unity_roots();
		this._logical_inverse_unity_roots();

		this._logical_transform(this.logic.a, 'a_merger');
		this._logical_transform(this.logic.b, 'b_merger');

		this._logical_multiply();
		this._logical_transform(this.logic.y, 'y_merger', -1);
		this._logical_generate_result();
	}

	read_data(){
		var i, j, c;
		this.logic.is_ntt=this.ntt.checked;
		this.logic.is_fft=this.fft.checked;
		var fas=this.input.value;

		this.logic.a=[];
		this.logic.b=[];
		c=this.dissolve_input(fas);

		this.logic.o=c.get_next();
		for (i=0;i<=this.logic.o;i++) this._pusher(this.logic.a, c.get_next(), this.logic.is_ntt);
		this.logic.m=c.get_next();
		for (i=0;i<=this.logic.m;i++) this._pusher(this.logic.b, c.get_next(), this.logic.is_ntt);
		if (this.logic.is_ntt) {
			this.logic.q=c.get_next();
			this.logic.Bq=BigInt(this.logic.q);
		}
	}

	palingnesia(){
		this.logical_box();
		//Currently unused
		this.buttons={'inv_n':null, 'proot':null, 'k':[], 'a':[], 'b':[], 'w':[], 'A':[], 'B':[], 'w2':[], 'A2':[], 'B2':[], 'y':[], 'Y':[], 'res':[]};
		var mx_all, i;

		//System-specific feats: either read q or not, then find inverse n and minsize of button (perhaps too large for fft)
		if (this.logic.is_ntt) mx_all=Math.max(4, this.logic.q.toString().length)*10;
		else{
			var mxa=0, sumb=0;
			for (i=0;i<this.logic.n;i++) {
				if (mxa<Math.max(this.logic.a[i].real, mxa)) mxa=this.logic.a[i].real;
			}
			for (i=0;i<this.logic.n;i++) sumb+=this.logic.b[i].real;
			mx_all=mx_all=Math.max(4, 7+Math.ceil(Math.log(sumb*mxa)))*10;
		}
		this.stylistic.bs_butt_width=`${mx_all}px`;
		this.stylistic.bs_butt_width_h=mx_all;


		this.place_mul=7+2*this.logic.lv+4;
		this.endet=this.place_mul+8+this.logic.lv+2;
		var x=this.divsCreator();
		this.zdivs=x.zdivs;
	}

	constructor(block, o, a, m, b, q){
		super(block);
		this.ntt=block.radio_n;
		this.fft=block.radio_f;
		this.logic.o=o;
		this.logic.a=a.map(e => BigInt(e));
		this.logic.m=m;
		this.logic.b=b.map(e => BigInt(e));
		this.logic.q=q;
		this.logic.Bq=BigInt(this.logic.q);

		this.logic.is_ntt=true;
		this.logic.is_fft=false;

		this.palingnesia();

		var i, j, btn;
		this.btnlist=[];
		this.utilbts=[];

		for (i=0;i<3;i++){
			this.btnlist.push([]);
			for (j=0;j<this.logic.n;j++){
				btn=super.buttCreator();
				this.btnlist[i].push(btn);
				this.zdivs[i].buttons.appendChild(btn);

				this.btnlist[i][j].innerHTML=(i==0?j:(i==1?this.logic.a[j]:this.logic.b[j]));
				this.Painter(this.btnlist[i][j], 0);
			}
		}
	}

	BeginningExecutor(){
		this.btnlist=[];
		this.utilbts=[];
		var x, i=0, j=0, c, m, j, btn, mx_all, g;
		
		this.read_data();
		this.palingnesia();


		var ij, thrs=[7, 7+this.logic.lv+2, this.place_mul+8];
		this.mapp={0:[this.logic.a, this.logic.a_merger, thrs[0], 1], 1:[this.logic.b, this.logic.b_merger, thrs[1], 2], 2:[this.logic.y, this.logic.y_merger, thrs[2], this.place_mul+3]};

		//Checking conditions for ntt, adding state
		if (this.logic.is_ntt){
			if (this.logic.q%2==0)
				this.lees.push([103]);
			else if (this.logic.toth%this.logic.n!=0)
				this.lees.push([104]);
			else
				this.lees.push([0]);
		}
		else this.lees.push([0]);


		//Filling divs with buttons - indexes 3 and endet-1 are special
		var ite=0;
		for (i=0;i<this.endet+1;i++){
			this.btnlist.push([]);
			//3 - proot, endet-1 - inv.
			if (i==3 || i==this.endet-1){
				btn=super.buttCreator();
				this.btnlist[i].push(btn);
				this.zdivs[i-ite].midian.appendChild(btn);
				ite++;
				continue;
			}
			for (j=0;j<this.logic.n;j++){
				btn=super.buttCreator();
				for (ij=0; ij<thrs.length; ij++){
					if (i>=thrs[ij] && i<=thrs[ij]+this.logic.lv){
						if (this.logic.is_fft) btn=super.doubleButtCreator(null, super.buttCreator.bind(this))[0];
						if ((j%(1<<(i-thrs[ij]+1)))<(1<<(i-thrs[ij])))
							btn.base_color=12;
					}
					if (this.logic.is_fft && (i==4 || i==this.place_mul+6 || (i>=this.place_mul && i<this.place_mul+4)))
						btn=super.doubleButtCreator(null, super.buttCreator.bind(this))[0];
				}
				this.btnlist[i].push(btn);
				this.zdivs[i-ite].buttons.appendChild(btn);
			}
		}
	}

	//Show values of ntt, fft, change innerHTML
	show_number(btn, value){
		if (this.logic.is_ntt)
			btn.innerHTML=value;
		else{
			var con=100000, vreal=value.real.toFixed(5), vimg=value.img.toFixed(5);
			if (Math.round(value.real)*con==Math.round(value.real*con)) vreal=Math.round(value.real);
			if (Math.round(value.img)*con==Math.round(value.img*con)) vimg=Math.round(value.img);
			btn.upper.innerHTML=vreal;
			btn.lower.innerHTML=`${vimg}i`;
		}
	}

	StateMaker(){
		var l=this.lees.length;
		var s=this.lees[l-1], j, btn, value, i=0, n=this.logic.n;
		var staat=this.ephemeral.staat, passer=this.ephemeral.passer;

		if (s[0]==0){
			for (i=0;i<3;i++){
				for (j=0; j<this.logic.n; j++){
					value=(i==0?j:(i==1?this.logic.a[j]:this.logic.b[j]));
					if (this.logic.is_ntt)
						this.btnlist[i][j].innerHTML=value;
					else 
						this.btnlist[i][j].innerHTML=Math.round(value);
					this.Painter(this.btnlist[i][j], 0);
				}
			}
		}

		if (s[0]==1){
			if (this.logic.proot){
				this.pass_color(this.btnlist[3][0]);
				this.btnlist[3][0].innerHTML=this.logic.proot;
			}
		}

		if (s[0]==2){
			var beg;
			if (this.logic.is_ntt) this.show_number(this.btnlist[4][0], 1);
			else this.show_number(this.btnlist[4][0], new Complex(1));

			this.pass_color(this.btnlist[4][0]);
			this.pass_color(this.btnlist[4][1]);

			this.show_number(this.btnlist[4][1], this.logic.w);
		}

		if (s[0]==3){
			var starter, i=0, BIpr;

			for (i=2;i<this.logic.n;i++){
				this.show_number(this.btnlist[4][i], this.logic.roots[i]);
				this.pass_color(this.btnlist[4][i]);
			}
		}

		if (s[0]==4){
			var x=s[1], btn;
			var cnst=Math.floor(n/x), halfx=Math.floor(x/2);
			if (x==1){
				this.btnlist[6][0].innerHTML=0;
				this.pass_color(this.btnlist[6][0]);
			}
			else{
				for (i=halfx; i<x; i++){
					this.btnlist[6][i].innerHTML=this.logic.butterfly[i];
					this.pass_color(this.btnlist[6][i]);
				}
			}
		}

		if (s[0]==5){
			var mapp=this.mapp[s[1]];
			var pos=mapp[2], seq_pos=mapp[3], real_seq=mapp[0], merger=mapp[1];
			for (i=0;i<n;i++) {
				this.show_number(this.btnlist[pos][i], real_seq[this.logic.butterfly[i]]);
				this.pass_color(this.btnlist[pos][i], 4, 1, 20);
				this.pass_color(this.btnlist[seq_pos][i], 0);
			}
		}

		if (s[0]==6 || s[0]==7){
			var mapp=this.mapp[s[1]];
			var pos=mapp[2], merger=mapp[1], seq_pos=mapp[3];
			var pnt=s[1], level=s[2], poly=s[3], place=s[4], part=(1<<(level-1)), whole=(1<<level)*poly+place;

			var cur_btn=this.btnlist[level+pos][whole+((s[0]==7)?part:0)];
			var diff=(1<<(this.logic.lv-level))*place+((s[0]==7)?(1<<(this.logic.lv-1)):0);

			/*Show merge*/
			var pol_0=this.btnlist[level+pos-1][whole];
			var pol_1=this.btnlist[level+pos-1][whole+part];
			var w=((s[1]==2)?this.btnlist[this.place_mul+6][diff]:this.btnlist[4][diff]);

			this.pass_color(cur_btn, 4, 1, 20);
			//These two change every two moves - 2d passer? previously if s[0]==6
			this.pass_color(pol_0, 20, 13, 20);
			this.pass_color(pol_1, 20, 14, 20);
			this.pass_color(w, 0, 14, 0);

			/*Show merge*/
			this.show_number(cur_btn, merger[level][whole+((s[0]==7)?part:0)]);
		}

		if (s[0]==8){
			var pm=this.place_mul, i, j;
			for (i=0;i<n;i++) this.show_number(this.btnlist[pm][i], this.logic.roots[i]);
			for (i=0;i<n;i++) this.show_number(this.btnlist[pm+1][i], this.logic.a_merger[this.logic.lv][i]);
			for (i=0;i<n;i++) this.show_number(this.btnlist[pm+2][i], this.logic.b_merger[this.logic.lv][i]);
			for (j=0;j<3;j++){
				for (i=0;i<n;i++) this.pass_color(this.btnlist[pm+j][i]);
			}
		}

		if (s[0]==9){
			var pm=this.place_mul, i, j;
			for (i=0;i<n;i++) this.pass_color(this.btnlist[pm+3][i]);
			for (i=0;i<n;i++) this.show_number(this.btnlist[pm+3][i], this.logic.y[i]);
		}

		if (s[0]==10){
			var pm=this.place_mul, i, j;
			for (j=0;j<2;j++){
				for (i=0;i<n;i++) this.pass_color(this.btnlist[pm+j+5][i]);
			}
			for (i=0;i<n;i++) this.btnlist[pm+5][i].innerHTML=-i;

			for (i=0;i<n;i++) this.show_number(this.btnlist[pm+6][i], this.logic.inv_roots[i]);
		}

		if (s[0]==11){
			for (i=0;i<this.logic.n;i++){
				if (this.logic.is_fft)
					this.btnlist[this.endet][i].innerHTML=Math.round(this.logic.res[i].real);
				else
					this.btnlist[this.endet][i].innerHTML=this.logic.res[i];
				staat.push([0, this.btnlist[this.endet][i], 4, 8]);
			}
			this.btnlist[this.endet-1][0].innerHTML=this.logic.inv_n;
			this.pass_color(this.btnlist[this.endet-1][0]);
		}
	}


	Painter(btn, color){
		if (color!=20) super.Painter(btn, color);
		else{
			if ('base_color' in btn)
				super.Painter(btn, btn.base_color);
			else super.Painter(btn, 0);
		}
	}

	StatementComprehension(){
		var wfun=function(x){return `w<sub>n</sub><sup>${x}</sup>`;}
		var l=this.lees.length, w1=wfun(1), wn=wfun('n'), w0=wfun(0), wi=wfun('i'), wi_1=wfun('i-1');
		var s=this.lees[l-1], equiv=this.logic.is_ntt?`&equiv;`:`=`;
		var strr=``;
		if (s[0]==0) strr=`At the start of the algorithm, the polynominals A(x), B(x) are padded with 0's, so that it will be possible to find their values in not less than o+m+1=${this.logic.o+this.logic.m+1} &le; ${this.logic.n} places`
		if (s[0]==1 && (this.logic.proot || this.logic.is_fft)) strr=`${this.logic.is_ntt?`Primitive root modulo q=${this.logic.q} is found`:`${this.logic.n}-th root of unity is found`}, it is equal to ${this.logic.proot} ${this.logic.is_ntt?`(to attain this root deterministic algorithm was used).`:``}`;
		else if (s[0]==1) strr=`Primitive root modulo q=${this.logic.q} cannot be found, as it doesn't exist - calculations are not performed`;

		if (s[0]==2 && this.logic.is_ntt) strr=`As root was found, new aim is to find such value g, that ord<sub>${this.logic.q}</sub>(g)=${this.logic.n} - this value is proot<sup>&#x3d5;(q)/n</sup> mod q=${this.logic.proot}<sup>${this.logic.toth}/${this.logic.n}</sup> mod ${this.logic.q}=${this.logic.w}. Besides, I also fill value of ${wn}=${w0}=1`;
		else if (s[0]==2) strr=`Values of ${w0}=${wn}=1 and ${w1}=${this.logic.proot} are written to the array.`;

		if (s[0]==3) strr=`I find further subsequent values of ${wi} using fact, that ${w1}${wi_1} ${this.logic.is_ntt?`mod q`:``}=${wi} (so I just multiply previous value by ${w1}=${this.logic.w} ${this.logic.is_ntt?`modulo ${this.logic.q}`:``}). Notice that I didn't add ${wn}, as ${wn}=${w0}`;
		
		if (s[0]==4 && s[2]==0) strr=`I start finding order of indexes - so called butterfly - using which I will be abe to construct NTT without recursion. I start from 0`;
		else if (s[0]==4) strr=`I find next series of indexes in butterfly sequence - I use the pattern: for 2<sup>${s[2]-1}</sup>=${Math.floor(s[1]/2)} &le; x &lt; 2<sup>${s[2]}</sup>=${s[1]}: S(x)=S(x-${Math.floor(s[1]/2)})+n/${s[1]}=S(x-${Math.floor(s[1]/2)})+${Math.floor(this.logic.n/s[1])}`;

		if (s[0]==5){
			var poly=(s[1]==2?'Y':(s[1]==0?'A':'B'));
			strr=`I show ${(s[1]==0 || s[1]==1)?`Sequence of coefficients of polynominal ${poly}(x)`:`Sequence of values of polynominal ${poly}(x) in points w<sub>n</sub><sup>i</sup>`} according to the indexes in butterfly sequence; those are values of polynominals ${poly}<sub>0,p</sub>(x) in one point: w<sub>n</sub><sup>0</sup>=1 - these are ${this.logic.n} polynominals, and later different polynominals on the same level will have colors alternating.`;
		}

		if (s[0]==6 || s[0]==7){
			var pnt=s[1], level=s[2], poly=s[3], place=s[4], part=(1<<(level-1)), whole=(1<<level)*poly+place;
			var diff=(1<<(this.logic.lv-level))*place+((s[0]==7)?(1<<(this.logic.lv-1)):0);
			var a_diff=(pnt==2?-diff:diff);
			var sgn=(pnt==2?-1:1);
			var pl=(pnt==2?'Y':(pnt==0?'A':'B'));
			var merger=this.mapp[s[1]][1];
			var used_roots=(pnt==2?this.logic.inv_roots:this.logic.roots);
			var modulus=this.logic.is_ntt?`(mod ${this.logic.q})`:``, brace_l=this.logic.is_ntt?``:`(`, brace_r=this.logic.is_ntt?``:`)`;

			strr=`I find value of a polynominal ${pl}<sub>${level},${poly}</sub>(${wfun(a_diff)}) ${equiv} ${pl}<sub>${level}-1,2*${poly}</sub>(${wfun(`${a_diff}*2`)})+${wfun(a_diff)}${pl}<sub>${level}-1,2*${poly}+1</sub>(${wfun(`${a_diff}*2`)}) ${equiv} ${pl}<sub>${level-1},${2*poly}</sub>(${wfun(a_diff*2)})+${wfun(a_diff)}${pl}<sub>${level-1},${2*poly+1}</sub>(${wfun(2*a_diff)}) ${(2*diff>=this.logic.n)?` ${equiv}${pl}<sub>${level-1},${2*poly}</sub>(${wfun(a_diff*2-sgn*this.logic.n)})+${wfun(a_diff)}${pl}<sub>${level-1},${2*poly+1}</sub>(${wfun(2*a_diff-sgn*this.logic.n)})`:``}  ${equiv}${merger[level-1][whole]}+${brace_l}${used_roots[diff]}${brace_r}*${brace_l}${merger[level-1][whole+part]}${brace_r} ${equiv} ${merger[level][whole+((s[0]==7)?part:0)]} ${modulus}. `;
			if (s[0]==7) strr+=` It's worth noting, that one could calculate ${wfun(sgn*diff)} ${equiv} ${wfun(sgn*Math.floor(this.logic.n/2))}${wfun(sgn*(diff-Math.floor(this.logic.n/2)))} ${equiv} -${wfun(sgn*(diff-Math.floor(this.logic.n/2)))} ${modulus}.`;
		}


		if (s[0]==8) strr=`Now, it is time to find values C(x) ${equiv} A(x)B(x) ${this.logic.is_ntt?`mod ${this.logic.q}`:``} in ${this.logic.n} points, where A(x) and B(x) are known.`;
		if (s[0]==9) strr=`Values of C(${wfun("k")}) ${equiv} A(${wfun("k")})B(${wfun("k")}) ${this.logic.is_ntt?`mod ${this.logic.q}`:``} are found`;
		if (s[0]==10) strr=`As in the last part of algorithm - interpolation - roots in form of ${wfun("-j")} are needed, I proceed to calculate them, using fact, that ${wfun("-i")}${wfun("i")}=${wfun("n-i")}${wfun("i")}=1, and so ${wfun("-i")}=${wfun("n-i")} - also ${wfun("n")}=${wfun(0)}, so except for the first element the sequence of roots will be inversed.`;
		if (s[0]==11) strr=`At the end of algorithm, all values nc<sub>i</sub>=${this.logic.n}c<sub>i</sub> are multiplied by n<sup>-1</sup>=${this.logic.inv_n} - modular inverse of n modulo ${this.logic.q} (which can be found using extended Euclid algorithm, for example), so that I attain all coefficients c<sub>i</sub>`;
		if (s[0]==101) strr=`And so, NTT ends, coefficients of a polynominal C(x)=A(x)B(x) are, starting from c<sub>0</sub>: ${this.logic.res}`;
		if (s[0]==102) strr=`A number ${this.logic.q} modulo which calculations had to be obtained has no primitive root!`;
		if (s[0]==103) strr=`gcd(${this.logic.n},${this.logic.q})>1 - and so, it is impossible to find inverse of ${this.logic.n} modulo ${this.logic.q} - algorithm cannot go further!`;
		if (s[0]==104) strr=`&#632;(${this.logic.q})=${this.logic.toth}, and ${this.logic.toth}%${this.logic.n} &#8800; 0 - and so, there are not enough viable roots of unity to solve this problem.`;

		return strr;
	}

	NextState(){
		var l=this.lees.length;
		var s=this.lees[l-1], col, lv=this.logic.lv;
		var i=0;

		if (s[0]>=100) return;
		if (s[0]==0) this.lees.push([1]);
		if (s[0]==1 && this.logic.proot) this.lees.push([2]);
		else if (s[0]==1) this.lees.push([102]);

		if (s[0]==2) this.lees.push([3]);
		if (s[0]==3) this.lees.push([4, 1, 0]);
		if (s[0]==4 && s[1]<this.logic.n) this.lees.push([4, s[1]*2, s[2]+1]);
		if (s[0]==4 && s[1]==this.logic.n) this.lees.push([5, 0]);
		if (s[0]==5) this.lees.push([6, s[1], 1, 0, 0]);
		if (s[0]==6) this.lees.push([7, s[1], s[2], s[3], s[4]]);

		     if (s[0]==7 && s[1]==2 && s[4]==(1<<(s[2]-1))-1 && s[3]==(1<<(lv-s[2]))-1 && s[2]==lv) this.lees.push([11]);
		else if (s[0]==7 && s[1]==1 && s[4]==(1<<(s[2]-1))-1 && s[3]==(1<<(lv-s[2]))-1 && s[2]==lv) this.lees.push([8]);
		else if (s[0]==7 && s[1]==0 && s[4]==(1<<(s[2]-1))-1 && s[3]==(1<<(lv-s[2]))-1 && s[2]==lv) this.lees.push([5, s[1]+1]);
		else if (s[0]==7 && s[4]==(1<<(s[2]-1))-1 && s[3]==(1<<(lv-s[2]))-1) this.lees.push([6, s[1], s[2]+1, 0, 0]);
		else if (s[0]==7 && s[4]==(1<<(s[2]-1))-1) this.lees.push([6, s[1], s[2], s[3]+1, 0]);
		else if (s[0]==7) this.lees.push([6, s[1], s[2], s[3], s[4]+1]);

		if (s[0]==8) this.lees.push([9]);
		if (s[0]==9) this.lees.push([10]);
		if (s[0]==10) this.lees.push([5, 2]);
		if (s[0]==11) this.lees.push([101]);
	}

	//Adding belt for write-ups and buttons 
	divsCreator(){
		var i;
		var wnk="w<sub>n</sub><sup>k</sup>";
		var title_list=["k", "a<sub>k</sub>", "b<sub>k</sub>", `primitive root and ${wnk}`, "", "i", "a<sub>i</sub>=A<sub>0</sub>"];
		for (i=1;i<=this.logic.lv;i++) title_list.push(`A<sub>${i}</sub>`);
		title_list.push("");

		title_list.push("b<sub>i</sub>=B<sub>0</sub>");
		for (i=1;i<=this.logic.lv;i++) title_list.push(`B<sub>${i}</sub>`);
		var mini_list=["", wnk, `A(${wnk})`, `B(${wnk})`, `C(${wnk}) &equiv; A(${wnk})B(${wnk})`, ``, "j", "w<sub>n</sub><sup>j</sup>", ""];

		title_list=title_list.concat(mini_list);
		title_list.push("y<sub>i</sub>=Y<sub>0</sub>");
		for (i=1;i<=this.logic.lv;i++) title_list.push(`Y<sub>${i}</sub>`);
		title_list.push("inverse n and values c<sub>k</sub>")

		this.place.style.width=`max-content`;
		this.wisdom.style.minWidth=`${(this.logic.n+1)*this.stylistic.bs_butt_width_h+210}px`;
		var divs=this.modern_divsCreator(7, this.endet-1, title_list, `${this.stylistic.bs_butt_width_h+10}px`);
		return divs;
	}
}

class SumNtt extends Algorithm{
	//Stwórz widok wielomianu
	create_reality(n, s){
		this.logic.n=n;
		this.s=s;

		this.reducts=[]; //Polynominal buttons
		this.poly=[];
		var poly=this.poly;

		this.stylistic.bs_butt_width="45px";
		this.stylistic.bs_butt_height="45px";

		this.layers=Math.ceil(Math.log2(this.logic.n))+1;
		var i, j, ij, double_butt, add_butt;

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
					double_butt=super.doubleButtCreator(null, super.buttCreator.bind(this));
					if (ij==0){
						super.Painter(double_butt[1], 101);
						super.Painter(double_butt[2], 0);
					}
					else{
						super.Painter(double_butt[1], 4);
						super.Painter(double_butt[2], 4);
					}
					double_butt[0].style.height="45px";
					double_butt[0].style.width="45px";

					double_butt[2].style.height="45px";
					double_butt[2].style.width="45px";
					double_butt[2].style.paddingTop="10px";
					double_butt[2].style.verticalAlign="bottom";

					double_butt[1].style.width="20px";
					double_butt[1].style.right="0";
					double_butt[1].style.zIndex="2";

					double_butt[2].innerHTML=poly[ij][i][j];
					double_butt[1].innerHTML=j;

					this.reducts[ij][i].push([double_butt[1], double_butt[2]]);
					this.zdivs[ij].buttons.appendChild(double_butt[0]);
				}

				for (j=0; j<(1<<(ij+1))-1; j++){
					add_butt=super.buttCreator();
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

	StateMaker(){
		var l=this.lees.length;
		var s=this.lees[l-1], i=0, n=this.logic.n, v1=s[1], v2=s[2], passer=[];
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
		var l=this.lees.length;
		var s=this.lees[l-1], M=998244353;

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

				return `Now, polynominals representing two solutions to smaller subproblems (namely polynominals ${show_poly(s[1]-1, s[2]*2)} and ${show_poly(s[1]-1, s[2]*2+1)}) have to be multiplied in order to solve larger subproblem (represented by polynominal ${show_poly(s[1], s[2])}) of finding set sums: <b>(${p1})(${p2}) &#8801; ${pres} (mod ${M})</b>. Note that complexity of shown algorithm depends on choice of algorithm for polynominal multiplication: for classical dp approach, it will be O(nm), while for multiplication using NTT it will be O(nlog(n)log(m)).`;
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



var feral=Algorithm.ObjectParser(document.getElementById('Algo1'));
feral.radio_n=document.getElementById('NTT');
feral.radio_f=document.getElementById('DFT');
var eg1=new Ntt(feral, 6, [2, 7, 3, 12, 43, 25, 19], 7, [4, 6, 7, 1, 2, 3, 4, 132], 257);

var feral2=Algorithm.ObjectParser(document.getElementById('Algo2'));
var eg2=new SumNtt(feral2, 6, [2, 3, 5, 4, 2, 3]);
// 998244353
//8,40,68,117,19,208,60,143,188,128,70,179,35,195,0,0
