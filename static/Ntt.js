class Ntt extends Algorithm{
	constructor(block, o, a, m, b){
		super(block);
		this.ntt=block.radio_n;
		this.fft=block.radio_f;
		var i, j, btn;
		this.btnlist=[];
		this.utilbts=[];

		for (i=1,j=0;i<=o+m;i*=2,j++) ;
		this.n=i;
		this.lv=j;
		this.place_mul=7+2*this.lv+4;
		this.endet=this.place_mul+8+this.lv+2;
		for (j=o+1;j<i;j++) a.push(0);
		for (j=m+1;j<i;j++) b.push(0);

		this.divsCreator();
		for (i=0;i<3;i++){
			this.btnlist.push([]);
			for (j=0;j<this.n;j++){
				btn=super.buttCreator();
				this.btnlist[i].push(btn);
				this.zdivs[i].buttons.appendChild(btn);

				this.btnlist[i][j].innerHTML=(i==0?j:(i==1?a[j]:b[j]));
				this.Painter(this.btnlist[i][j], 0);
			}
		}
	}

	BeginningExecutor(){
		this.btnlist=[];
		this.utilbts=[];
		this.is_ntt=this.ntt.checked;
		this.is_fft=this.fft.checked;

		var fas=this.input.value;
		this.a=[];
		this.b=[];
		this.y=[];

		this.a_merger=[];
		this.b_merger=[];
		this.y_merger=[];

		this.roots=[];
		this.inv_roots=[];
		this.res=[];
		var x, i=0, j=0, c, m, j, btn, mx_all, g;
		
		c=this.dissolve_input(fas);
		var pusher=function(arr, x, ntt){
			if (ntt==true) arr.push(BigInt(x));
			else arr.push(new Complex(x));
		}

		this.o=c.get_next();
		for (i=0;i<=this.o;i++) pusher(this.a, c.get_next(), this.is_ntt);
		this.m=c.get_next();
		for (i=0;i<=this.m;i++) pusher(this.b, c.get_next(), this.is_ntt);

		for (i=1,j=0;i<=this.o+this.m;i*=2,j++) ;
		this.n=i;
		this.lv=j;

		for (j=this.o+1;j<this.n;j++) pusher(this.a, 0, this.is_ntt);
		for (j=this.m+1;j<this.n;j++) pusher(this.b, 0, this.is_ntt);
		for (j=0;j<this.n;j++) this.y.push(0n);
		for (j=0;j<this.n;j++){
			this.roots.push(0);
			this.inv_roots.push(0);
			this.res.push(0);
		}



		//System-specific feats: either read q or not, then find inverse n and minsize of button (perhaps too large for fft)
		if (this.is_ntt){
			this.q=c.get_next();
			this.Bq=BigInt(this.q);
			this.inv_n=BigInt(NTMath.inverse(this.n, this.q));
			mx_all=Math.max(4, this.q.toString().length)*10;
		}
		else{
			var mxa=0, sumb=0;
			for (i=0;i<this.n;i++) {
				if (mxa<Math.max(this.a[i].real, mxa)) mxa=this.a[i].real;
			}
			for (i=0;i<this.n;i++) sumb+=this.b[i].real;
			
			this.inv_n=1/this.n;
			mx_all=Math.max(4, 7+Math.ceil(Math.log(sumb*mxa)))*10;
		}

		for (j=0;j<=this.lv;j++){
			this.a_merger.push([]);
			this.b_merger.push([]);
			this.y_merger.push([]);
			for (i=0;i<this.n;i++){
				this.a_merger[j].push(0);
				this.b_merger[j].push(0);
				this.y_merger[j].push(0);
			}
		}


		this.bs_butt_width=`${mx_all}px`;
		this.bs_butt_width_h=mx_all;

		this.place_mul=7+2*this.lv+4;
		this.endet=this.place_mul+8+this.lv+2;
		var ij, thrs=[7, 7+this.lv+2, this.place_mul+8];
		this.mapp={0:[this.a, this.a_merger, thrs[0], 1], 1:[this.b, this.b_merger, thrs[1], 2], 2:[this.y, this.y_merger, thrs[2], this.place_mul+3]};

		this.divsCreator();
		//Checking conditions for ntt, adding state
		if (this.is_ntt){
			this.toth=NTMath.find_totient(this.q);
			if (this.q%2==0)
				this.lees.push([103]);
			else if (this.toth%this.n!=0)
				this.lees.push([104]);
			else
				this.lees.push([0]);
		}
		else
			this.lees.push([0]);

		//Filling butterfly - so that not push/pop occurs later
		this.butterfly=[];
		for (i=0;i<this.n;i++) this.butterfly.push(0);

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
			for (j=0;j<this.n;j++){
				btn=super.buttCreator();
				for (ij=0; ij<thrs.length; ij++){
					if (i>=thrs[ij] && i<=thrs[ij]+this.lv){
						if (this.is_fft) btn=super.doubleButtCreator(null, super.buttCreator.bind(this))[0];
						if ((j%(1<<(i-thrs[ij]+1)))<(1<<(i-thrs[ij])))
							btn.base_color=12;
					}
					if (this.is_fft && (i==4 || i==this.place_mul+6 || (i>=this.place_mul && i<this.place_mul+4)))
						btn=super.doubleButtCreator(null, super.buttCreator.bind(this))[0];
				}
				this.btnlist[i].push(btn);
				this.zdivs[i-ite].buttons.appendChild(btn);
			}
		}
	}

	//Show values of ntt, fft, change innerHTML
	show_number(btn, value){
		if (this.is_ntt)
			btn.innerHTML=value;
		else{
			var con=100000, vreal=value.real.toFixed(5), vimg=value.img.toFixed(5);
			if (Math.round(value.real)*con==Math.round(value.real*con)) vreal=Math.round(value.real);
			if (Math.round(value.img)*con==Math.round(value.img*con)) vimg=Math.round(value.img);

			btn.upper.innerHTML=vreal;
			btn.lower.innerHTML=`${vimg}i`;
		}
	}

	no_more_colors(s, staat){
		var mapp=this.mapp[s[1]];
		var pos=mapp[2], merger=mapp[1], seq_pos=mapp[3];

		var pnt=s[1], level=s[2], poly=s[3], place=s[4], part=(1<<(level-1)), whole=(1<<level)*poly+place;
		var cur_btn=this.btnlist[level+pos][whole+((s[0]==7)?part:0)];
		var diff=(1<<(this.lv-level))*place+((s[0]==7)?(1<<(this.lv-1)):0);
		var pol_0=this.btnlist[level+pos-1][whole];
		var pol_1=this.btnlist[level+pos-1][whole+part];
		var w=((s[1]==2)?this.btnlist[this.place_mul+6][diff]:this.btnlist[4][diff]);

		staat.push([0, cur_btn, 1, 20]);
		if (s[0]==7){
			staat.push([0, pol_0, 5, 20]);
			staat.push([0, pol_1, 8, 20]);
		}
		staat.push([0, w, 8, 0]);
	}

	StateMaker(){
		var l=this.lees.length;
		var s=this.lees[l-1], j, btn, value, i=0, n=this.n;
		var staat=this.ephemeral.staat, passer=this.ephemeral.passer;
		if (l>1 && (this.lees[l-2][0]==7 || this.lees[l-2][0]==6)) this.no_more_colors(this.lees[l-2], staat);

		if (s[0]==0){
			for (i=0;i<3;i++){
				for (j=0;j<this.n;j++){
					value=(i==0?j:(i==1?this.a[j]:this.b[j]));
					if (this.is_ntt)
						this.btnlist[i][j].innerHTML=value;
					else 
						this.btnlist[i][j].innerHTML=Math.round(value);
					this.Painter(this.btnlist[i][j], 0);
				}
			}
		}

		if (s[0]==1){
			if (this.is_ntt){
				this.proot=NTMath.find_proot(this.q);
				if (this.proot){
					staat.push([0, this.btnlist[3][0], 4, 1]);
					this.btnlist[3][0].innerHTML=this.proot;
				}
			}
			else {
				this.proot=new Complex(Math.cos(2*Math.PI/this.n), Math.sin(2*Math.PI/this.n));
				staat.push([0, this.btnlist[3][0], 4, 1]);
				this.btnlist[3][0].innerHTML=this.proot;
			}
		}

		if (s[0]==2){
			var beg;
			if (this.is_ntt){
				beg=NTMath.pow(this.proot, Math.floor((this.toth)/this.n), this.q);
				this.show_number(this.btnlist[4][0], 1);
			}
			else{
				beg=this.proot;
				this.show_number(this.btnlist[4][0], new Complex(1));
			}

			this.w=beg;
			staat.push([0, this.btnlist[4][0], 4, 1]);
			staat.push([0, this.btnlist[4][1], 4, 1]);
			staat.push([0, this.btnlist[3][0], 1, 0]);

			this.show_number(this.btnlist[4][1], beg);
		}

		if (s[0]==3){
			var starter, i=0, BIpr;
			if (this.is_ntt){
				this.roots[0]=1n;
				this.roots[1]=this.w;
				starter=this.w;
				BIpr=this.Bq;
			}
			else{
				this.roots[0]=new Complex(1, 0);
				this.roots[1]=this.w;
				starter=new Complex(this.w.real, this.w.img);
			}
			staat.push([0, this.btnlist[4][0], 1, 0]);
			staat.push([0, this.btnlist[4][1], 1, 0]);

			for (i=2;i<this.n;i++){
				if (this.is_ntt){
					starter=(starter*this.w)%BIpr;
					this.roots[i]=starter;
				}
				else{
					starter=starter.mul(this.w);
					this.roots[i]=new Complex(starter.real, starter.img);
				}

				this.show_number(this.btnlist[4][i], starter);
				staat.push([0, this.btnlist[4][i], 4, 1])
			}
		}

		if (s[0]==4){
			var x=s[1], btn;
			var cnst=Math.floor(n/x), halfx=Math.floor(x/2);
			if (x==1) {
				for(i=2;i<n;i++) staat.push([0, this.btnlist[4][i], 1, 0]);
				this.btnlist[6][0].innerHTML=0;
				staat.push([0, this.btnlist[6][0], 4, 1]);
			}
			else{
				for (i=halfx; i<x; i++){
					this.butterfly[i]=this.butterfly[i-halfx]+cnst;
					this.btnlist[6][i].innerHTML=this.butterfly[i];
					staat.push([0, this.btnlist[6][i], 4, 1]);
				}
			}
			for (i=Math.floor(halfx/2); i<halfx; i++) staat.push([0, this.btnlist[6][i], 1, 0]);
		}

		if (s[0]==5){
			var mapp=this.mapp[s[1]];
			var pos=mapp[2], seq_pos=mapp[3], real_seq=mapp[0], merger=mapp[1];
			for (i=0;i<n;i++) {
				this.show_number(this.btnlist[pos][i], real_seq[this.butterfly[i]]);

				merger[0][i]=real_seq[this.butterfly[i]];
				staat.push([0, this.btnlist[pos][i], 4, 1]);
				staat.push([0, this.btnlist[seq_pos][i], 0, 1]);
			}
			if (s[1]==0){
				for (i=Math.floor(n/2);i<n;i++) staat.push([0, this.btnlist[6][i], 1, 0]);
			}

			if (s[1]==2){
				var pm=this.place_mul, j;
				for (j=0;j<2;j++){
					for (i=0;i<n;i++) staat.push([0, this.btnlist[pm+j+5][i], 1, 0]);
				}
			}

		}

		if (s[0]==6 || s[0]==7){
			var mapp=this.mapp[s[1]];
			var pos=mapp[2], merger=mapp[1], seq_pos=mapp[3];
			var pnt=s[1], level=s[2], poly=s[3], place=s[4], part=(1<<(level-1)), whole=(1<<level)*poly+place;

			var used_roots=((s[1]==2)?this.inv_roots:this.roots);

			var cur_btn=this.btnlist[level+pos][whole+((s[0]==7)?part:0)];
			var diff=(1<<(this.lv-level))*place+((s[0]==7)?(1<<(this.lv-1)):0);
			var value;

			if (s[0]==6 && level==1 && poly==0 && place==0){
				for (i=0;i<n;i++) {
					staat.push([0, this.btnlist[seq_pos][i], 1, 0]);
					staat.push([0, this.btnlist[level+pos-1][i], 1, 20]);
				}
			}

			if (this.is_ntt)
				value=(merger[level-1][whole]+used_roots[diff]*merger[level-1][whole+part])%this.Bq;
			else
				value=merger[level-1][whole].add(used_roots[diff].mul(merger[level-1][whole+part]));
			
			merger[level][whole+((s[0]==7)?part:0)]=value;

			/*Show merge*/
			var pol_0=this.btnlist[level+pos-1][whole];
			var pol_1=this.btnlist[level+pos-1][whole+part];
			var w=((s[1]==2)?this.btnlist[this.place_mul+6][diff]:this.btnlist[4][diff]);

			staat.push([0, cur_btn, 4, 1]);
			if (s[0]==6){
				staat.push([0, pol_0, 20, 5]);
				staat.push([0, pol_1, 20, 8]);
			}
			staat.push([0, w, 0, 8]);
			/*Show merge*/

			this.show_number(cur_btn, value);
		}

		if (s[0]==8){
			var pm=this.place_mul, i, j;
			for (i=0;i<n;i++) this.show_number(this.btnlist[pm][i], this.roots[i]);
			for (i=0;i<n;i++) this.show_number(this.btnlist[pm+1][i], this.a_merger[this.lv][i]);
			for (i=0;i<n;i++) this.show_number(this.btnlist[pm+2][i], this.b_merger[this.lv][i]);
			for (j=0;j<3;j++){
				for (i=0;i<n;i++) staat.push([0, this.btnlist[pm+j][i], 4, 1]);
			}
		}

		if (s[0]==9){
			var pm=this.place_mul, i, j;
			for (j=0;j<3;j++){
				for (i=0;i<n;i++) staat.push([0, this.btnlist[pm+j][i], 1, 0]);
			}
			for (i=0;i<n;i++) staat.push([0, this.btnlist[pm+3][i], 4, 1]);
			for (i=0;i<n;i++){
				if (this.is_ntt) this.y[i]=(this.a_merger[this.lv][i]*this.b_merger[this.lv][i])%this.Bq;
				else this.y[i]=this.a_merger[this.lv][i].mul(this.b_merger[this.lv][i]);
			}
			for (i=0;i<n;i++) this.show_number(this.btnlist[pm+3][i], this.y[i]);
		}

		if (s[0]==10){
			var pm=this.place_mul, i, j;
			for (i=0;i<n;i++) staat.push([0, this.btnlist[pm+3][i], 1, 0]);
			for (j=0;j<2;j++){
				for (i=0;i<n;i++) staat.push([0, this.btnlist[pm+j+5][i], 4, 1]);
			}
			for (i=0;i<n;i++) this.btnlist[pm+5][i].innerHTML=-i;

			this.inv_roots[0]=this.roots[0];
			for (i=1;i<n;i++) this.inv_roots[i]=this.roots[n-i];
			for (i=0;i<n;i++) this.show_number(this.btnlist[pm+6][i], this.inv_roots[i]);
		}

		if (s[0]==11){
			for (i=0;i<this.n;i++){
				if (this.is_ntt) this.res[i]=(this.y_merger[this.lv][i]*this.inv_n)%this.Bq;
				else this.res[i]=this.y_merger[this.lv][i].mul(new Complex(this.inv_n));
				if (this.is_fft)
					this.btnlist[this.endet][i].innerHTML=Math.round(this.res[i].real);
				else
					this.btnlist[this.endet][i].innerHTML=this.res[i];
				staat.push([0, this.btnlist[this.endet][i], 4, 8]);
			}
			this.btnlist[this.endet-1][0].innerHTML=this.inv_n;
			staat.push([0, this.btnlist[this.endet-1][0], 4, 1])
		}

		if (s[0]==101){
			staat.push([0, this.btnlist[this.endet-1][0], 1, 0]);
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
		var s=this.lees[l-1], equiv=this.is_ntt?`&equiv;`:`=`;
		var strr=``;
		if (s[0]==0) strr=`At the start of the algorithm, the polynominals A(x), B(x) are padded with 0's, so that it will be possible to find their values in not less than o+m+1=${this.o+this.m+1} &le; ${this.n} places`
		if (s[0]==1 && (this.proot || this.is_fft)) strr=`${this.is_ntt?`Primitive root modulo q=${this.q} is found`:`${this.n}-th root of unity is found`}, it is equal to ${this.proot} ${this.is_ntt?`(to attain this root probabilistic algorithm was used).`:``}`;
		else if (s[0]==1) strr=`Primitive root modulo q=${this.q} cannot be found, as it doesn't exist - calculations are not performed`;

		if (s[0]==2 && this.is_ntt) strr=`As root was found, new aim is to find such value g, that ord<sub>${this.q}</sub>(g)=${this.n} - this value is proot<sup>&#x3d5;(q)/n</sup> mod q=${this.proot}<sup>${this.toth}/${this.n}</sup> mod ${this.q}=${this.w}. Besides, I also fill value of ${wn}=${w0}=1`;
		else if (s[0]==2) strr=`Values of ${w0}=${wn}=1 and ${w1}=${this.proot} are written to the array.`;

		if (s[0]==3) strr=`I find further subsequent values of ${wi} using fact, that ${w1}${wi_1} ${this.is_ntt?`mod q`:``}=${wi} (so I just multiply previous value by ${w1}=${this.w} ${this.is_ntt?`modulo ${this.q}`:``}). Notice that I didn't add ${wn}, as ${wn}=${w0}`;
		
		if (s[0]==4 && s[2]==0) strr=`I start finding order of indexes - so called butterfly - using which I will be abe to construct NTT without recursion. I start from 0`;
		else if (s[0]==4) strr=`I find next series of indexes in butterfly sequence - I use the pattern: for 2<sup>${s[2]-1}</sup>=${Math.floor(s[1]/2)} &le; x &lt; 2<sup>${s[2]}</sup>=${s[1]}: S(x)=S(x-${Math.floor(s[1]/2)})+n/${s[1]}=S(x-${Math.floor(s[1]/2)})+${Math.floor(this.n/s[1])}`;

		if (s[0]==5){
			var poly=(s[1]==2?'Y':(s[1]==0?'A':'B'));
			strr=`I show ${(s[1]==0 || s[1]==1)?`Sequence of coefficients of polynominal ${poly}(x)`:`Sequence of values of polynominal ${poly}(x) in points w<sub>n</sub><sup>i</sup>`} according to the indexes in butterfly sequence; those are values of polynominals ${poly}<sub>0,p</sub>(x) in one point: w<sub>n</sub><sup>0</sup>=1 - these are ${this.n} polynominals, and later different polynominals on the same level will have colors aternating.`;
		}

		if (s[0]==6 || s[0]==7){
			var pnt=s[1], level=s[2], poly=s[3], place=s[4], part=(1<<(level-1)), whole=(1<<level)*poly+place;
			var diff=(1<<(this.lv-level))*place+((s[0]==7)?(1<<(this.lv-1)):0);
			var a_diff=(pnt==2?-diff:diff);
			var sgn=(pnt==2?-1:1);
			var pl=(pnt==2?'Y':(pnt==0?'A':'B'));
			var merger=this.mapp[s[1]][1];
			var used_roots=(pnt==2?this.inv_roots:this.roots);
			var modulus=this.is_ntt?`(mod ${this.q})`:``, brace_l=this.is_ntt?``:`(`, brace_r=this.is_ntt?``:`)`;

			strr=`I find value of a polynominal ${pl}<sub>${level},${poly}</sub>(${wfun(a_diff)}) ${equiv} ${pl}<sub>${level}-1,2*${poly}</sub>(${wfun(`${a_diff}*2`)})+${wfun(a_diff)}${pl}<sub>${level}-1,2*${poly}+1</sub>(${wfun(`${a_diff}*2`)}) ${equiv} ${pl}<sub>${level-1},${2*poly}</sub>(${wfun(a_diff*2)})+${wfun(a_diff)}${pl}<sub>${level-1},${2*poly+1}</sub>(${wfun(2*a_diff)}) ${(2*diff>=this.n)?` ${equiv}${pl}<sub>${level-1},${2*poly}</sub>(${wfun(a_diff*2-sgn*this.n)})+${wfun(a_diff)}${pl}<sub>${level-1},${2*poly+1}</sub>(${wfun(2*a_diff-sgn*this.n)})`:``}  ${equiv}${merger[level-1][whole]}+${brace_l}${used_roots[diff]}${brace_r}*${brace_l}${merger[level-1][whole+part]}${brace_r} ${equiv} ${merger[level][whole+((s[0]==7)?part:0)]} ${modulus}. `;
			if (s[0]==7) strr+=` It's worth noting, that one could calculate ${wfun(sgn*diff)} ${equiv} ${wfun(sgn*Math.floor(this.n/2))}${wfun(sgn*(diff-Math.floor(this.n/2)))} ${equiv} -${wfun(sgn*(diff-Math.floor(this.n/2)))} ${modulus}.`;
		}


		if (s[0]==8) strr=`Now, it is time to find values C(x) ${equiv} A(x)B(x) ${this.is_ntt?`mod ${this.q}`:``} in ${this.n} points, where A(x) and B(x) are known.`;
		if (s[0]==9) strr=`Values of C(${wfun("k")}) ${equiv} A(${wfun("k")})B(${wfun("k")}) ${this.is_ntt?`mod ${this.q}`:``} are found`;
		if (s[0]==10) strr=`As in the last part of algorithm - interpolation - roots in form of ${wfun("-j")} are needed, I proceed to calculate them, using fact, that ${wfun("-i")}${wfun("i")}=${wfun("n-i")}${wfun("i")}=1, and so ${wfun("-i")}=${wfun("n-i")} - also ${wfun("n")}=${wfun(0)}, so except for the first element the sequence of roots will be inversed.`;
		if (s[0]==11) strr=`At the end of algorithm, all values nc<sub>i</sub>=${this.n}c<sub>i</sub> are multiplied by n<sup>-1</sup>=${this.inv_n} - modular inverse of n modulo ${this.q} (which can be found using extended Euclid algorithm, for example), so that I attain all coefficients c<sub>i</sub>`;
		if (s[0]==101) strr=`And so, NTT ends, coefficients of a polynominal C(x)=A(x)B(x) are, starting from c<sub>0</sub>: ${this.res}`;
		if (s[0]==102) strr=`A number ${this.q} modulo which calculations had to be obtained has no primitive root!`;
		if (s[0]==103) strr=`gcd(${this.n},${this.q})>1 - and so, it is impossible to find inverse of ${this.n} modulo ${this.q} - algorithm cannot go further!`;
		if (s[0]==104) strr=`&#632;(${this.q})=${this.toth}, and ${this.toth}%${this.n} &#8800; 0 - and so, there are not enough viable roots of unity to solve this problem.`;

		return strr;
	}

	NextState(){
		var l=this.lees.length;
		var s=this.lees[l-1], col, lv=this.lv;
		var i=0;

		if (s[0]>=100) return;
		if (s[0]==0) this.lees.push([1]);
		if (s[0]==1 && this.proot) this.lees.push([2]);
		else if (s[0]==1) this.lees.push([102]);

		if (s[0]==2) this.lees.push([3]);
		if (s[0]==3) this.lees.push([4, 1, 0]);
		if (s[0]==4 && s[1]<this.n) this.lees.push([4, s[1]*2, s[2]+1]);
		if (s[0]==4 && s[1]==this.n) this.lees.push([5, 0]);
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
		for (i=1;i<=this.lv;i++) title_list.push(`A<sub>${i}</sub>`);
		title_list.push("");

		title_list.push("b<sub>i</sub>=B<sub>0</sub>");
		for (i=1;i<=this.lv;i++) title_list.push(`B<sub>${i}</sub>`);
		var mini_list=["", wnk, `A(${wnk})`, `B(${wnk})`, `C(${wnk}) &equiv; A(${wnk})B(${wnk})`, ``, "j", "w<sub>n</sub><sup>j</sup>", ""];

		title_list=title_list.concat(mini_list);
		title_list.push("y<sub>i</sub>=Y<sub>0</sub>");
		for (i=1;i<=this.lv;i++) title_list.push(`Y<sub>${i}</sub>`);
		title_list.push("inverse n and values c<sub>k</sub>")

		super.divsCreator(7, this.endet-1, title_list, `${this.bs_butt_width_h+10}px`);
		this.place.style.width=`max-content`;
		this.wisdom.style.minWidth=`${(this.n+1)*this.bs_butt_width_h+210}px`;
	}
}

class SumNtt extends Algorithm{
	//Stwórz widok wielomianu
	create_reality(n, s){
		this.n=n;
		this.s=s;

		this.reducts=[]; //Polynominal buttons
		this.poly=[];
		var poly=this.poly;

		this.bs_butt_width="45px";
		this.bs_butt_height="45px";

		this.layers=Math.ceil(Math.log2(this.n))+1;
		var i, j, ij, double_butt, add_butt;

		//Creating subsequent polynominals
		for (i=0; i<this.layers; i++){
			this.poly.push([]);
			if (i==0){
				for (j=0; j<this.n; j++){
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
		var s=this.lees[l-1], i=0, n=this.n, v1=s[1], v2=s[2], passer=[];
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
			var completely_random_number=Math.ceil(this.n/2);

			return `Finally, the solution for given problem can be represented as ${poly}, where exponent means set sum, and coefficient number of possible sets with given set sum; for example, coefficient ${coeffs[completely_random_number]} by x<sup>${completely_random_number}</sup> means, that there are exactly ${coeffs[completely_random_number]} sets with set sum equal to ${completely_random_number}.`;
		}
	}
}



var feral=Algorithm.ObjectParser(document.getElementById('Algo1'));
feral.radio_n=document.getElementById('NTT');
feral.radio_f=document.getElementById('DFT');
var eg1=new Ntt(feral, 6, [2, 7, 3, 12, 43, 25, 19], 7, [4, 6, 7, 1, 2, 3, 4, 132]);

var feral2=Algorithm.ObjectParser(document.getElementById('Algo2'));
var eg2=new SumNtt(feral2, 6, [2, 3, 5, 4, 2, 3]);
// 998244353
//8,40,68,117,19,208,60,143,188,128,70,179,35,195,0,0
