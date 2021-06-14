class Order extends Partial{
	constructor(block, x){
		super(block);
		this.ShowReality(x);
	}
	ShowReality(x=-1){
		var i=0, toth;
		if (x==-1) x=this.input.value;
		toth=this.sieve_mark(x);
		this.place.innerHTML='';
		this.create_upper_div(x, toth);

		this.known=[];
		for (i=0;i<x;i++) this.known.push(0);
		for (i=1;i<x;i++){
			if (this.marked[i]==1) continue;
			this.create_standard_div(i, x, toth);
		}

		this.create_summary(x, toth);
	}

	sieve_mark(x){
		var i=0, j, lim=x, toth=x;
		this.marked=[];
		for (i=0; i<x; i++) this.marked.push(0);
		for (i=2; i*i<=x; i++) {
			if (x%i==0){
				toth=Math.floor(toth/i)*(i-1);
				for (j=i;j<lim;j+=i) this.marked[j]=1;
			}
			while (x%i==0) x=Math.floor(x/i);
		}

		if (x>1){
			toth=Math.floor(toth/x)*(x-1);
			for (j=x;j<lim;j+=x) this.marked[j]=1;
		}
		return toth;
	}

	create_standard_div(g, mod, toth){
		var i, a=g;
		var dv=document.createElement("DIV"), btn=[];
		this.place.position="relative";
		dv.style.position="relative";
		dv.style.width=`${(mod-1+5)*40}px`;
		dv.style.height="40px"
		var lst=['x', g, 'x', 0, 'x'];
		for (i=1;i<mod;i++){
			lst.push(a);
			if (a==1) break;
			a=(a*g)%mod;
		}
		lst[3]=i;
		this.known[i]+=1;

		for (i=0; i<lst.length; i++){
			btn.push(this.buttCreator(lst[i]));
			btn[i].style.position="relative";
			btn[i].style.display="inline-block";
			if (lst[i]=='x') this.Painter(btn[i], 3);
			dv.append(btn[i]);
		}
		//Tocjent
		if (lst[3]==toth) this.Painter(btn[1], 8);
		this.place.append(dv);
	}

	create_upper_div(x, toth){
		var i;
		var dv=document.createElement("DIV"), btn=[];
		this.place.position="relative";
		dv.style.position="relative";
		dv.style.width=`${(x-1+5)*40}px`;
		dv.style.height="40px"
		var lst=['x', 'g', `ord<sub>${x}</sub>(g)`, 'g<sup>i</sup>; i='];
		for (i=1;i<=toth;i++) lst.push(i);
		for (i=0; i<lst.length; i++){
			btn.push(this.buttCreator(lst[i]));
			btn[i].style.position="relative";
			btn[i].style.display="inline-block";
			if (lst[i]=='x') this.Painter(btn[i], 3);
			dv.append(btn[i]);
		}
		btn[2].style.width="80px";
		this.place.append(dv);
	}

	create_summary(x, toth){
		var i, btn, lefts, rights, proper;
		var dv_upper=document.createElement("DIV"), dv_lower=document.createElement("DIV");
		var dv_upper_r=document.createElement("DIV"), dv_lower_r=document.createElement("DIV"), dv_upper_l=document.createElement("DIV"), dv_lower_l=document.createElement("DIV");
		var titles=[`Order x=ord<sub>${x}</sub>(g) for some g`, `Number of occurences of x: |{g: ord<sub>${x}</sub>(g)=x}|`];
		lefts=[dv_upper_l, dv_lower_l];
		rights=[dv_upper_r, dv_lower_r];
		proper=[dv_upper, dv_lower];

		for (i=0;i<=toth;i++){
			if (this.known[i]>0){
				btn=this.buttCreator(i);
				if (i==toth) this.Painter(btn, 8);
				dv_upper_r.append(btn);
			}
		}
		for (i=0;i<=toth;i++){
			if (this.known[i]>0){
				btn=this.buttCreator(this.known[i]);
				dv_lower_r.append(btn);
			}
		}
		for (i=0;i<2;i++){
			lefts[i].style.width="450px";
			lefts[i].innerHTML=titles[i];
			lefts[i].style.display="inline-block";
			rights[i].style.display="inline-block";
			proper[i].append(lefts[i]);
			proper[i].append(rights[i]);
			this.place.append(proper[i]);
		}
	}
}

class Proot extends Algorithm{
	constructor(block){
		super(block);
		this.deter=block.radio_d;
		this.prob=block.radio_p;

		var i, j, btn, btn2, mini_size=20;
		this.divsCreator(5, 6, ["m factorization", "m'", "p:p|&#x03D5;(m')=m'-1", "Exponents", "Results", "Primitive root"]);
	}

	BeginningExecutor(){
		this.starter();
		var fas=this.input.value;
		this.stylistic.bs_butt_width_h=Math.max(40, fas.length*10);
		this.stylistic.bs_butt_width=`${this.stylistic.bs_butt_width_h}px`;
		this.place.style.width=`${(this.stylistic.bs_butt_width_h+20)*16+200}px`;

		this.is_deter=this.deter.checked;

		var a=0, x, i=0, c, j, btn, btn2, mini_size=20, allez;

		this.btnlist=[];
		for (i=0;i<6;i++) this.btnlist.push([]);
		
		c=this.dissolve_input(fas);
		this.m=c[0];

		var v=this.find_next_prime(2, this.m);
		this.bastard_m=this.m;

		this.lees.push([0, 2, v]);
		this.divsCreator(5, 6, ["m factorization", "m'", "p:p|&#x03D5;(m')=m'-1", "Exponents", "Results", "Primitive root"]);

		this.primes=[];
		this.exponents=[];
		this.amount_of_primes_m=0;

		this.t_primes=[];
		this.check_expos=[];

		this.candidates=[];
		this.recover=[];
		this.last_index=-1;
		this.falsify=0;
		this.finito=false;
		this.closed=false;
		this.current_exponent=-1;

		this.btnlist=[];
		for (i=0;i<6;i++){
			this.btnlist.push([]);
			for (j=0;j<16;j++){
				if (i==0) {
					btn=super.buttCreator();
					btn2=this.buttCreator(mini_size);
					if (j==0) btn2=this.buttCreator(0);
					btn2.innerHTML="";
					btn2.style.top=`${-(40-mini_size)/2}px`;
					btn2.style.position="relative";
				}

				if (i==5) {
					allez=this.doubleButtCreator(0, this.buttCreator.bind(this));
					btn=allez[1];
					btn2=allez[2];
					var butt_container=allez[0];
				}

				else if (i==1) btn=super.buttCreator();
				else btn=super.buttCreator();
				if (i!=5) this.zdivs[i].buttons.appendChild(btn);
				else this.zdivs[i].buttons.appendChild(butt_container);
				this.btnlist[i].push(btn);
				if (i==0) this.zdivs[i].buttons.appendChild(btn2);
				if (i==0 || i==5) this.btnlist[i].push(btn2);
			}
		}
	}

	StateMaker(){
		var l=this.lees.length;
		var s=this.lees[l-1], x, expo, base, old_base, old_expo;
		var staat=this.ephemeral.staat, passer=this.ephemeral.passer;
		var point=this.amount_of_primes_m*2;
		//var last_expo=(this.exponents.length>0?this.exponents[this.exponents.length-1]:-1);
		if (s[0]==0){
			x=s[2];
			base=this.btnlist[0][point+2];
			expo=this.btnlist[0][point+3];

			staat.push([2, this.primes, x]);
			if (this.current_exponent>-1) staat.push([2, this.exponents, this.current_exponent]);
			staat.push([3, 'current_exponent', this.current_exponent, 1]);
			staat.push([3, 'amount_of_primes_m', this.amount_of_primes_m, this.amount_of_primes_m+1]);
			staat.push([3, 'bastard_m', this.bastard_m, Math.floor(this.bastard_m/x)]);

			staat.push([0, base, 4, 1]);
			base.innerHTML=x;

			staat.push([0, expo, 4, 1]);
			expo.innerHTML=1;

			if (this.amount_of_primes_m>0){
				if (this.current_exponent==1) staat.push([0, this.btnlist[0][point], 1, 0]);
				staat.push([0, this.btnlist[0][point+1], 1, 0]);
			}
		}

		if (s[0]==1){
			x=s[1];
			base=this.btnlist[0][point];
			expo=this.btnlist[0][point+1];

			staat.push([3, 'current_exponent', this.current_exponent, this.current_exponent+1]);
			staat.push([3, 'bastard_m', this.bastard_m, Math.floor(this.bastard_m/x)]);

			if (this.current_exponent==1) staat.push([0, base, 1, 0]);
			staat.push([1, expo, this.current_exponent, this.current_exponent+1]);
		}

		if (s[0]==2){
			var base=this.btnlist[1][1];

			staat.push([2, this.exponents, this.current_exponent]);
			if (this.current_exponent==1) staat.push([0, this.btnlist[0][point], 1, 0]);
			staat.push([0, this.btnlist[0][point+1], 1, 0]);

			staat.push([0, base, 4, 1]);
			base.innerHTML=this.primes[this.primes.length-1];
		}

		if (s[0]==3){
			x=s[2];
			base=this.btnlist[2][this.t_primes.length+1];
			if (this.t_primes.length>0) old_base=this.btnlist[2][this.t_primes.length];
			else old_base=this.btnlist[1][1];

			staat.push([2, this.t_primes, x]);
			staat.push([3, 'bastard_toth', this.bastard_toth, this.Prime_Removal(this.bastard_toth, x)]);

			staat.push([0, base, 4, 1]);
			staat.push([0, old_base, 1, 0]);
			base.innerHTML=x;
		}

		if (s[0]==4){
			x=s[1];
			base=this.btnlist[3][x];
			var color=1, value_to_expos=1;
			if (x==0){
				old_base=this.btnlist[2][this.t_primes.length];
				base.innerHTML=1;
				color=1;
			}
			else{
				old_base=this.btnlist[3][x-1];
				base.innerHTML=Math.floor(this.toth/this.t_primes[x-1]);
				value_to_expos=Math.floor(this.toth/this.t_primes[x-1]);
			}
			staat.push([2, this.check_expos, value_to_expos]);
		
			staat.push([0, base, 4, color]);
			staat.push([0, old_base, 1, 0]);
		}

		if (s[0]==5){
			x=s[1];
			var candidate, index;
			if (x==0){
				index=this.Take_Next_Candidate(staat);
				if (this.is_deter) candidate=index;
				else candidate=this.candidates[index];

				staat.push([3, 'current_candidate', this.current_candidate, candidate]);
				staat.push([3, 'falsify', this.falsify, 0]);
				if (this.last_index>-1){
					for (var i=1;i<this.recover[this.last_index].length-1;i++) staat.push([0, this.btnlist[4][i], 0, 4]);
					staat.push([0, this.btnlist[4][this.recover[this.last_index].length-1], 1, 4]);
				}
			}
			else candidate=this.current_candidate, index=this.last_index;

			base=this.btnlist[4][x];
			if (x>0) old_base=this.btnlist[4][x-1];
			else old_base=this.btnlist[3][this.t_primes.length];

			if (x==0 && this.last_index==-1){
				staat.push([0, base, 4, 8]);
				staat.push([0, old_base, 1, 0]);
			}
			else if (x>1) staat.push([0, old_base, 1, 0]);
			if (x>0) staat.push([0, base, 4, 1]);

			var res=this.pow(candidate, this.check_expos[x], this.toth+1);
			staat.push([1, base, ((index>0 && this.recover[index-1].length>x)?this.recover[index-1][x]:0), res]);
			if (res==1) staat.push([3, 'falsify', this.falsify, 1]);
			staat.push([2, this.recover[index], res]);
		}

		if (s[0]==6){
			var finale=0, res=this.current_candidate;
			base=this.btnlist[5][s[1]*2];
			expo=this.btnlist[5][s[1]*2+1];
			if (s[1]>0){
				old_base=this.btnlist[5][s[1]*2-2];
				old_expo=this.btnlist[5][s[1]*2-1];

				staat.push([0, old_base, 1, 0]);
				staat.push([0, old_expo, 1, 0]);
			}
			else staat.push([0, this.btnlist[4][this.t_primes.length], 1, 0]);

			staat.push([0, base, 4, 1]);
			staat.push([0, expo, 4, 1]);
			var ln=this.exponents[this.primes.length-1];
			if (s[1]==0){
				res=this.current_candidate;
				staat.push([3, 'current_result', this.current_result, res]);
				expo.innerHTML=this.toth+1;
				if (this.toth+1==this.m) finale=1;
			}
			else if (s[1]==1 && ln>1){
				var numb=this.m;
				if (this.m%2!=0) finale=1;
				else numb=Math.floor(this.m/2);
				if (this.pow(this.current_candidate, this.toth, (this.toth+1)*(this.toth+1))==1) res=this.current_candidate+this.toth+1, staat.push([0, 'current_result', this.current_result, res]);
				expo.innerHTML=numb;
			}

			else{
				finale=1;
				if (this.current_result%2==0) res=this.current_candidate+Math.floor(this.m/2), staat.push([3, 'current_result', this.current_result, res]);
				expo.innerHTML=this.m;
			}
			base.innerHTML=res;

			if (finale==1){
				staat.push([3, 'closed', this.closed, true]);
				staat.push([0, base, 4, 8]);
				staat.push([0, expo, 4, 8]);
			}
		}
		
		if (s[0]==101){
			base=this.btnlist[0][point];
			expo=this.btnlist[0][point+1];

			if (this.current_exponent==1) staat.push([0, base, 1, 0]);
			staat.push([0, expo, 1, 0]);
		}
	}

	NextState(){
		var l=this.lees.length;
		var s=this.lees[l-1], x, y;
		if (s[0]==0){
			y=s[2];
			if (this.bastard_m==1){
				if (!this.Primitive_Condition()) this.lees.push([101])
				else this.lees.push([2]);
			}
			else if (this.bastard_m%y==0) this.lees.push([1, y]);
			else{
				x=this.find_next_prime(y+1, this.bastard_m);
				this.lees.push([0, y+1, x]);
			}
		}
		if (s[0]==1){
			y=s[1];
			if (this.bastard_m==1){
				if (!this.Primitive_Condition()) this.lees.push([101])
				else this.lees.push([2]);
			}
			else if (this.bastard_m%y==0) this.lees.push([1, y]);
			else{
				x=this.find_next_prime(y+1, this.bastard_m);
				this.lees.push([0, y+1, x]);
			}
		}
		if (s[0]==2){
			if (this.primes.length>1) this.toth=this.primes[1]-1;
			else this.toth=this.primes[0]-1;
			x=this.find_next_prime(2, this.toth);
			
			this.bastard_toth=this.toth;
			this.lees.push([3, 2, x])
		}
		if (s[0]==3){
			if (this.bastard_toth==1) this.lees.push([4, 0]);
			else{
				x=this.find_next_prime(s[2]+1, this.bastard_toth);
				this.lees.push([3, s[2]+1, x]);
			}
		}
		if (s[0]==4){
			if (this.t_primes.length>s[1]) this.lees.push([4, s[1]+1]);
			else this.lees.push([5, 0]);
		}

		if (s[0]==5){
			if (this.falsify==1) this.lees.push([5, 0]);
			else if (s[1]==this.t_primes.length) this.lees.push([6, 0]);
			else this.lees.push([5, s[1]+1]);
		}
		if (s[0]==6){
			if (this.closed==true) this.lees.push([100]);
			else this.lees.push([6, s[1]+1]);
		}
	}

	Primitive_Condition(){
		if ((this.m%4==0 && this.lees!=4) || this.primes.length>2 || (this.primes.length>1 && this.m%2!=0)) return false;
		return true;
	}

	Prime_Removal(a, div){
		while (a%div==0) a=Math.floor(a/div);
		return a;
	}
	Prime_Moval(sup, a, div){
		var mn_div=div;
		while (sup%mn_div==0) a*=div, mn_div*=div;
		return a;
	}

	Append_Randomness(arr, recover, amount, ceil){
		for (var i=0;i<amount;i++) arr.push(Math.floor(Math.random()*(ceil-1))+2), recover.push([]);
	}

	Take_Next_Candidate(staat){
		var s=this.last_index;
		if (this.is_deter) {
			if (s==-1) s+=2, staat.push([3, 'last_index', -1, 1]), this.recover.push([]), this.recover.push([]);
			s++;
			staat.push([3, 'last_index', s-1, s]);
			this.recover.push([]);
			return s;
		}
		if (this.candidates.length==s+1) this.Append_Randomness(this.candidates, this.recover, 200, this.toth);
		s++, staat.push([3, 'last_index', this.last_index, this.last_index+1]);
		return s;
	}

	Finito(){
		var n=this.amount_of_primes_m;

		return `As factorization of m was found, one may proceed to decide, whether ${this.m} has a primitive root: ${(n>2 || (n>1 && this.primes[0]!=2))?`This number does not have primitive root, as it has more than 1 prime divisor different than 2`:((this.m%4==0 && this.m!=4)?`This number has no primitive root, for it is divisible by 4, yet it is not equal to 4`:`This number does have a primitive root, for ${(n==2)?`It can be shown as 2p<sup>k</sup>, where p is odd prime`:((n==1 && this.m%2==1)?`It can be shown as p<sup>k</sup>, where p is odd`:`it is ${this.m} a special case`)}`)}`;
	}

	Last_Exit_For_The_Lost(){
		var vals=0, mine=0, p=this.primes[this.primes.length-1], s=this.lees[this.lees.length-1], x, form_1, sup, cur_sup;
		if (this.m%2==0) vals+=2;
		if (this.m-p>p) vals+=1;
		x=s[1];
		sup=(vals%2==1)?`<sup>k</sup>`:``;
		if (s[1]==0) mine=0;
		if (s[1]==1 && vals==3) mine=1;
		cur_sup=(mine==1)?`<sup>k</sup>`:``;
		
		if (x==2 || x==1 && vals<3 || x==0 && vals==0) return `As I've found primitive root of a number, for which ultimately I was trying to find primitive root, algorithm ends, result is ${this.current_result}`;
		return `As the number, for which ultimately I'm trying to find primitive root has form ${vals>1?`2`:``}p${sup}=${this.m}, and I've found a primitive root for p${cur_sup}, I still need to find primitive root of ${mine==0?((vals%2==1)?`p${sup}`:`2p`):`2p${sup}`}${(mine==0 && vals==3)?` and then 2p${sup}`:``}.`
	}

	StatementComprehension(){
		var l=this.lees.length;
		var last=this.lees[l-1], prev=this.lees[l-2], fa_m=this.bastard_m, ga_m=this.bastard_toth;
		var p=this.toth+1;
		
		if (last[0]==0 && fa_m!=1) return `I search for next prime dividing fa_m=${fa_m*last[2]} - m divided by all its prime divisors already found, starting from ${last[1]} ... all the way to ${last[2]}, which divides fa_m - I change fa_m=${fa_m*last[2]}/${last[2]}=${fa_m} and search for further primes dividing fa_m`;
		else if (last[0]==0) return `I search for next prime dividing fa_m=${this.bastard_m*last[2]} - m divided by all its prime divisors already found, starting from ${last[1]} ... all the way to ${Math.floor(Math.sqrt(last[2]))}, which does not divide fa_m - What follows, fa_m is a prime and whole number m is now factorized, which allows proceeding further in the algorithm. `+this.Finito();
		else if (last[0]==1) return `As ${last[1]} still divides fa_m, I divide fa_m by ${last[1]}: ${fa_m*last[1]}/${last[1]}=${fa_m}. ${fa_m==1?this.Finito():``}`;

		else if (last[0]==2) return `Now, one can have a primitive root of a number in form xp<sup>k</sup>, where x=1 or x=2, by finding primitive root modulo p and then adding to it p or p<sup>k</sup> (or both) - and so, I'll find primitive root modulo ${this.primes[this.primes.length-1]}`

		else if (last[0]==3 && (ga_m!=1 || this.toth%(this.t_primes[this.t_primes.length-1]*this.t_primes[this.t_primes.length-1])==0)) return `I search for next prime dividing ga_m=${this.Prime_Moval(this.toth, ga_m, last[2])} - &#x03D5;(m')=m'-1 divided by all its prime divisors already found, starting from ${last[1]} ... all the way to ${last[2]}, which divides ga_m - I divide ga_m while it is divisible by ${last[2]} not caring about exponent - because it has no use in further parts of algorithm, thus obtaining ${ga_m} ${(ga_m==1)?` and thus fully factorizing ga_m`:``}`
		else if (last[0]==3) return `I search for next prime dividing ga_m=${this.Prime_Moval(this.toth, ga_m, last[2])} - &#x03D5;(m')=m'-1 divided by all its prime divisors already found, starting from ${last[1]} ... all the way to ${Math.floor(Math.sqrt(last[2]))}, which does not divide ga_m - What follows, ga_m is a prime and whole number &#x03D5;(m')=m'-1 is now factorized, which allows proceeding further in the algorithm.`;

		else if (last[0]==4 && last[1]!=0) return `Now, I find exponents x, which I will later check on candidates for primitive roots for condition g<sup>x</sup> &equiv; 1 - they're just &#x03D5;(m') divided by its prime divisors. Now, the &#x03D5;(m')/p=${this.toth}/${this.t_primes[last[1]-1]}=${this.check_expos[last[1]]}`;
		else if (last[0]==4 && last[1]==0) return `Just for convenience, I add 1 to exponents to check to show currently processed candidate for primitive root.`;

		else if (last[0]==5 && last[1]==0) return `I draw ${this.is_deter==0?`another random`:`next natural`} number to check, whether it is a primitive root mod ${p}`;
		else if (last[0]==5 && last[1]!=0) return `It turns out, that ${this.current_candidate}<sup>${this.check_expos[last[1]]}</sup> &equiv; ${this.recover[this.last_index][last[1]]} (mod ${p}). ${(this.recover[this.last_index][last[1]]==1)?`This number cannot be a primitive root, as ord<sub>${p}</sub>(${this.current_candidate}) <= ${this.check_expos[last[1]]} < &#x03D5;(${p})`:((last[1]==this.t_primes.length?`As for all exponents this number was not equivalent to 1, this is primitive root`:` As it is not yet known whether this number is a primitive root, I check it against next exponent.`))}`;

		else if (last[0]==6 && last[1]==0) return `The primitive root for p=${p} is already found; `+this.Last_Exit_For_The_Lost();
		else if (last[0]==6 && last[1]==1 && (this.finito==false || this.m%2!=0)) return `The primitive root for p<sup>k</sup>=${this.m%2!=0?this.m:Math.floor(this.m/2)} is either equal to g=${this.current_candidate} or g+p=${this.current_candidate+p}, where g is primitive root of p - this follows from second case of existential proof of primitive root. As g<sup>&#x03D5;(p)</sup> ${this.current_result>p?`&equiv;`:`&#8802;`} 1 (mod p<sup>2</sup>), then primitive root mod p<sup>k</sup> is ${this.current_result<p?`g`:`g+p`}=${this.current_result} `+this.Last_Exit_For_The_Lost();
		else if (last[0]==6){
			var olden=this.current_result>Math.floor(this.m/2)?this.current_result-Math.floor(this.m/2):this.current_result, newer, sup;
			newer=olden+Math.floor(this.m/2);
			sup=(this.m-p>p)?`<sup>k</sup>`:``;
			return `The primitive root for 2p${sup}=${this.m} is either equal to g=${olden} or g+p${sup}=${newer}, depending on whether 2 divides g: as one can see, 2${olden%2==0?`|`:`&nmid;`}g - and so, primitive root modulo 2p${sup} is ${olden%2==0?`g+p${sup}`:`g`}=${this.current_result}. `+this.Last_Exit_For_The_Lost();
		}

		else if (last[0]==100){
			var amount=(this.is_deter==1)?this.last_index-1:this.last_index+1;
			return `Algorithm ended, result is ${this.current_result}. It was found after processing ${amount} candidate${amount>0?`s`:``} for primitive roots.`;
		}
		else if (last[0]==101) return `This number has no primitive root, so algorithm is finished.`;
	}

	find_next_prime(start, v){
		var i=start;
		for (;i*i<=v;i++){
			if (v%i==0) return i;
		}
		return v;
	}

	pow(ap, b, mp=1000000007){
		var res=1n, a=BigInt(ap), m=BigInt(mp);
		for (;b>0;b=Math.floor(b/2)){
			if (b%2==1) res=(res*a)%m;
			a=(a*a)%m;
		}
		return res;
	}
	
	//Creates buttons
	buttCreator(size=40, numb=null){
		var butt=super.buttCreator(numb);
		butt.style.width=`${size}px`;
		butt.style.height=`${size}px`;
		return butt;
	}
}

var feral1=Partial.ObjectParser(document.getElementById('Algo1'));
var sk1=new Order(feral1, 7);

var feral2=Algorithm.ObjectParser(document.getElementById('Algo2'));
feral2.radio_p=document.getElementById('Probabilistic');
feral2.radio_d=document.getElementById('Deterministic');
var sk2=new Proot(feral2);

//Prime: 20731
//Composite: 859548722
//Ultra-composite: 
//Problematic-deterministic: 409
//Large primes: 33456259, 998244353, 1000000007
