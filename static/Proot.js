class PowerTower extends Algorithm{
	constructor(block, n=-1, m, lees){
		super(block);
		if (n==-1) return;

		var i, j, btn, btn2, mini_size=20;
		this.divsCreator();
		for (i=0;i<6;i++){
			for (j=0;j<16;j++){
				if (i==0) {
					btn=this.buttCreator();
					btn2=this.buttCreator(mini_size);
					btn2.style.top=`${-(40-mini_size)/2}px`;
					btn2.style.position="relative";
				}
				else if (i==1) btn=this.buttCreator();
				else btn=this.buttCreator();
				this.zdivs[i][1].appendChild(btn);
				if (i==0) this.zdivs[i][1].appendChild(btn2);
			}
		}
	}

	BeginningExecutor(){
		this.lees=[];
		this.place.innerHTML='';
		var fas=this.input.value;
		var a=0, x, i=0, c, j, btn, btn2, mini_size=20;

		this.btnlist=[];
		for (i=0;i<6;i++) this.btnlist.push([]);
		
		c=this.getInput(0, fas);
		this.m=c[0];

		var v=this.find_next_prime(2, this.m);
		this.bastard_m=this.m;

		this.lees.push([0, 2, v]);
		this.divs=this.divsCreator();

		this.primes=[];
		this.exponents=[];
		this.amount_of_primes_m=0;

		this.t_primes=[];
		this.check_expos=[];
		this.amount_of_primes_t=0;

		this.candidates=[];
		this.recover=[];
		this.last_index=0;
		this.falsify=0;

		this.btnlist=[];
		for (i=0;i<6;i++){
			this.btnlist.push([]);
			for (j=0;j<16;j++){
				if (i==0) {
					btn=this.buttCreator();
					btn2=this.buttCreator(mini_size);
					if (j==0) btn2=this.buttCreator(0);
					btn2.innerHTML="";
					btn2.style.top=`${-(40-mini_size)/2}px`;
					btn2.style.position="relative";
				}
				else if (i==1) btn=this.buttCreator();
				else btn=this.buttCreator();
				this.zdivs[i][1].appendChild(btn);
				this.btnlist[i].push(btn);
				if (i==0) this.zdivs[i][1].appendChild(btn2), this.btnlist[i].push(btn2);
			}
		}
	}

	StateMaker(){
		var l=this.lees.length;
		var s=this.lees[l-1], x, expo, base, old_base, old_expo;
		if (s[0]==0){
			x=s[2];

			base=this.btnlist[0][this.amount_of_primes_m*2+2];
			expo=this.btnlist[0][this.amount_of_primes_m*2+3];

			this.primes.push(x);
			this.exponents.push(1);
			this.amount_of_primes_m++;
			this.bastard_m=Math.floor(this.bastard_m/x);

			this.Painter(base, 1);
			base.innerHTML=x;

			this.Painter(expo, 1);
			expo.innerHTML=1;
			if (this.amount_of_primes_m>1){
				this.Painter(this.btnlist[0][(this.amount_of_primes_m-2)*2+2], 0);
				this.Painter(this.btnlist[0][(this.amount_of_primes_m-2)*2+3], 0);
			}
		}
		if (s[0]==1){
			x=s[1];
			base=this.btnlist[0][(this.amount_of_primes_m-1)*2+2];
			expo=this.btnlist[0][(this.amount_of_primes_m-1)*2+3];

			this.exponents[this.exponents.length-1]++;
			this.bastard_m=Math.floor(this.bastard_m/x);

			this.Painter(base, 0);
			this.Painter(expo, 1);
			expo.innerHTML=this.exponents[this.exponents.length-1];
		}

		if (s[0]==2){
			base=this.btnlist[1][1];
			old_base=this.btnlist[0][(this.amount_of_primes_m-1)*2+2];
			old_expo=this.btnlist[0][(this.amount_of_primes_m-1)*2+3];

			this.Painter(base, 1);
			
			this.Painter(old_base, 0);
			this.Painter(old_expo, 0);
			base.innerHTML=this.primes[this.primes.length-1];
		}

		if (s[0]==3){
			x=s[2];
			base=this.btnlist[2][this.t_primes.length+1];
			if (this.t_primes.length>0) old_base=this.btnlist[2][this.t_primes.length];
			else old_base=this.btnlist[1][1];

			this.t_primes.push(x);
			this.amount_of_primes_t++;
			this.bastard_toth=this.Prime_Removal(this.bastard_toth, x);
			console.log("DEAD", this.bastard_toth);

			this.Painter(base, 1);
			this.Painter(old_base, 0);
			base.innerHTML=this.t_primes[this.t_primes.length-1];
		}

		if (s[0]==4){
			x=s[1];
			base=this.btnlist[3][x];
			var color=1;
			if (x==0){
				old_base=this.btnlist[2][this.t_primes.length];
				base.innerHTML=1;
				this.check_expos.push(1);
				color=8;
			}
			else{
				old_base=this.btnlist[3][x-1];
				base.innerHTML=Math.floor(this.toth/this.t_primes[x-1]);
				this.check_expos.push(Math.floor(this.toth/this.t_primes[x-1]));
			}
		
			this.Painter(base, color);
			if (x!=1) this.Painter(old_base, 0);
		}

		if (s[0]==5){
			x=s[1];
			if (x==0){
				this.current_candidate=this.Take_Next_Candidate()
				this.falsify=0;
				for (var i=0;i<this.t_primes.length;i++) this.Painter(this.btnlist[4][i], 4);
			}
			base=this.btnlist[4][x];
			if (x>0) old_base=this.btnlist[4][x-1];
			else old_base=this.btnlist[3][this.t_primes.length];

			if (x!=1) this.Painter(old_base, 0);
			if (x>0) this.Painter(base, 1);
			else this.Painter(base, 8);

			var res=this.pow(this.current_candidate, this.check_expos[x], this.toth+1);
			base.innerHTML=res;
			if (res==1) this.falsify=1;
			this.recover[this.last_index].push(res);
		}


		if (s[0]==101){
			base=this.btnlist[0][(this.amount_of_primes_m-1)*2];
			expo=this.btnlist[0][(this.amount_of_primes_m-1)*2+1];

			this.Painter(base, 0);
			this.Painter(expo, 0);
		}
	}

	StateUnmaker(){
		var l=this.lees.length;
		var s=this.lees[l-1], x, base, expo, old_base, old_expo;

		if (s[0]==0){
			x=s[2];
			this.amount_of_primes_m--;
			this.exponents.pop();
			this.primes.pop();
			base=this.btnlist[0][this.amount_of_primes_m*2+2];
			expo=this.btnlist[0][this.amount_of_primes_m*2+3];


			if (this.amount_of_primes_m>0){
				if (this.exponents[this.exponents.length-1]==1) this.Painter(this.btnlist[0][(this.amount_of_primes_m-1)*2+2], 1);
				this.Painter(this.btnlist[0][(this.amount_of_primes_m-1)*2+3], 1);
			}

			this.bastard_m=this.bastard_m*x;

			this.Painter(base, 4);
			this.Painter(expo, 4);
		}
		if (s[0]==1){
			x=s[1];
			base=this.btnlist[0][(this.amount_of_primes_m-1)*2+2];
			expo=this.btnlist[0][(this.amount_of_primes_m-1)*2+3];

			this.exponents[this.exponents.length-1]--;
			expo.innerHTML=this.exponents[this.exponents.length-1];
			if (this.exponents[this.exponents.length-1]==1) this.Painter(base, 1);
			this.bastard_m=this.bastard_m*x;
		}

		if (s[0]==2){
			base=this.btnlist[1][1];
			old_base=this.btnlist[0][(this.amount_of_primes_m-1)*2+2];
			old_expo=this.btnlist[0][(this.amount_of_primes_m-1)*2+3];

			this.Painter(base, 4);
			
			if (this.exponents[this.exponents.length-1]==1) this.Painter(old_base, 1);
			this.Painter(old_expo, 1);
		}

		if (s[0]==3){
			this.t_primes.pop();
			this.amount_of_primes_t--;

			x=s[2];
			base=this.btnlist[2][this.t_primes.length+1];
			if (this.t_primes.length>0) old_base=this.btnlist[2][this.t_primes.length];
			else old_base=this.btnlist[1][1];

			this.bastard_toth=this.Prime_Moval(this.toth, this.bastard_toth, x);
			this.Painter(base, 4);
			this.Painter(old_base, 1);
		}

		if (s[0]==4){
			x=s[1];
			base=this.btnlist[3][x];
			var color=1;
			this.check_expos.pop();

			if (x==0) old_base=this.btnlist[2][this.t_primes.length];
			else old_base=this.btnlist[3][x-1];
			
			this.Painter(base, 4);
			if (x!=1) this.Painter(old_base, 1);
		}

		if (s[0]==5){
			x=s[1];
			if (x==0){
				this.falsify=1;
				this.recover[this.last_index]=[];
				this.last_index--;
				var i;
				if (this.last_index>-1){
					for (i=0;i<this.recover[this.last_index].length;i++){
						if (i!=0) this.Painter(this.btnlist[4][i], 0);
						this.btnlist[4][i].innerHTML=this.recover[this.last_index][i];
					}
					for (;i<this.check_expos.length;i++) this.Painter(this.btnlist[4][i], 4);
					this.Painter(this.btnlist[4][this.recover[this.last_index].length-1], 1);
				}
				else{
					this.last_index++;
					this.Painter(this.btnlist[4][0], 4)
				}
			}
			base=this.btnlist[4][x];
			if (x>0) old_base=this.btnlist[4][x-1];
			else if (x==0 && this.recover[this.last_index].length-1>0) old_base=this.btnlist[4][this.recover[this.last_index].length-1];
			else old_base=this.btnlist[3][this.t_primes.length];

			if (x!=1) this.Painter(old_base, 1);
			if (x>0) this.Painter(base, 4);
		}


		if (s[0]==101){
			base=this.btnlist[0][(this.amount_of_primes_m-1)*2];
			expo=this.btnlist[0][(this.amount_of_primes_m-1)*2+1];

			if (this.exponents[this.exponents.length-1]==1) this.Painter(base, 1);
			this.Painter(expo, 1);
		}

		this.lees.pop();
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
			if (s[1]==this.t_primes.length) this.lees.push([6, 0]);
			else if (this.falsify==1) this.lees.push([5, 0]);
			else this.lees.push([5, s[1]+1]);
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
		for (var i=0;i<amount;i++) arr.push(Math.floor(Math.random()*(ceil-1))+1), recover.push([]);
	}

	Take_Next_Candidate(){
		if (this.candidates.length==this.last_index)	this.Append_Randomness(this.candidates, this.recover, 200, this.toth-1);
		else this.last_index++;
		return this.candidates[this.last_index];
	}

	Finito(){
		var n=this.amount_of_primes_m;
		console.log(n)

		return `As factorization of m was found, one may proceed to decide, whether ${this.m} has a primitive root: ${(n>2 || (n>1 && this.primes[0]!=2))?`This number does not have primitive root, as it has more than 1 prime divisor different than 2`:((this.m%4==0 && this.m!=4)?`This number has no primitive root, for it is divisible by 4, yet it is not equal to 4`:`This number does have a primitive root, for ${(n==2)?`It can be shown as 2p<sup>k</sup>, where p is odd prime`:((n==1 && this.m%2==1)?`It can be shown as p<sup>k</sup>, where p is odd`:`it is ${this.m} a special case`)}`)}`;
	}

	StatementComprehension(){
		var l=this.lees.length;
		var last=this.lees[l-1], prev=this.lees[l-2], fa_m=this.bastard_m, ga_m=this.bastard_toth;
		
		if (last[0]==0 && fa_m!=1) return `I search for next prime dividing fa_m=${fa_m*last[2]} - m divided by all its prime divisors already found, starting from ${last[1]} ... all the way to ${last[2]}, which divides fa_m - I change fa_m=${fa_m*last[2]}/${last[2]}=${fa_m} and search for further primes dividing fa_m`;
		else if (last[0]==0) return `I search for next prime dividing fa_m=${this.bastard_m*last[2]} - m divided by all its prime divisors already found, starting from ${last[1]} ... all the way to ${Math.floor(Math.sqrt(last[2]))}, which does not divide fa_m - What follows, fa_m is a prime and whole number m is now factorized, which allows proceeding further in the algorithm. `+this.Finito();
		else if (last[0]==1) return `As ${last[1]} still divides fa_m, I divide fa_m by ${last[1]}: ${fa_m*last[1]}/${last[1]}=${fa_m}. ${fa_m==1?this.Finito():``}`;

		else if (last[0]==2) return `Now, one can have a primitive root of a number in form mp<sup>k</sup>, where m=1 or m=2, by finding primitive root modulo p and then adding to it p or p<sup>k</sup> (or both) - and so, I'll find primitive root modulo ${this.primes[this.primes.length-1]}`

		else if (last[0]==3 && (ga_m!=1 || this.toth%(this.t_primes[this.t_primes.length-1]*this.t_primes[this.t_primes.length-1])==0)) return `I search for next prime dividing ga_m=${this.Prime_Moval(this.toth, ga_m, last[2])} - &#x03D5;(m')=m'-1 divided by all its prime divisors already found, starting from ${last[1]} ... all the way to ${last[2]}, which divides ga_m - I divide ga_m while it is divisible by ${last[2]} not caring about exponent - because it has no use in further parts of algorithm, thus obtaining ${ga_m} ${(ga_m==1)?` and thus fully factorizing ga_m`:``}`
		else if (last[0]==3) return `I search for next prime dividing ga_m=${this.Prime_Moval(this.toth, ga_m, last[2])} - &#x03D5;(m')=m'-1 divided by all its prime divisors already found, starting from ${last[1]} ... all the way to ${Math.floor(Math.sqrt(last[2]))}, which does not divide ga_m - What follows, ga_m is a prime and whole number &#x03D5;(m')=m'-1 is now factorized, which allows proceeding further in the algorithm.`;

		else if (last[0]==4 && last[1]!=0) return `Now, I find exponents x, which I will later check on candidates for primitive roots for condition g<sup>x</sup> &equiv; 1 - they're just &#x03D5;(m') divided by its prime divisors. Now, the &#x03D5;(m')/p=${this.toth}/${this.t_primes[last[1]-1]}=${this.check_expos[last[1]]}`;
		else if (last[0]==4 && last[1]==0) return `Just for convenience, I add 1 to exponents to check to show currently processed candidate for primitive root.`;

		
		else if (last[0]==101) return `This number has no primitive root, so algorithm is finished`;
	}

	//0: red, 1:green, 2: gray, 3: dead white
	Painter(btn, col=1){
		if (col==0 || col==1 || col==8) btn.style.color="#FFFFFF";
		else btn.style.backgroundColor="#FFFFFF";

		if (col==0) btn.style.backgroundColor="#440000";
		else if (col==1) btn.style.backgroundColor="#004400";
		else if (col==2) btn.style.color="#666666";
		else if (col==3) btn.style.color="#FFFFFF";
		else if (col==8) btn.style.backgroundColor="#8A7400";
	}

	find_next_prime(start, v){
		var i=start;
		for (;i*i<=v;i++){
			if (v%i==0) return i;
		}
		return v;
	}

	pow(a, b, m=1000000007){
		var res=1;
		for (;b>0;b=Math.floor(b/2)){
			if (b%2==1) res=(res*a)%m;
			a=(a*a)%m;
		}
		return res;
	}

	//Adding belt for write-ups and buttons 
	divsCreator(){
		var divs=[], zdivs=[], i, j;
		var title_list=["m factorization", "m'", "p:p|&#x03D5;(m')=m'-1", "Exponents", "Results", "Primitive root"];

		for (i=0;i<6;i++) divs.push(document.createElement("DIV")), zdivs.push([]);
		for (i=0;i<6;i++){
			divs[i].style.width="100%";
			divs[i].style.height="40px";
			//zdivs - inside div: 0 is write-up, 1 is button
			for (j=0;j<2;j++) {
				zdivs[i].push(document.createElement("DIV"));
				zdivs[i][j].style.margin="0";
				zdivs[i][j].style.padding="0";
				zdivs[i][j].style.display="inline-block";
				divs[i].appendChild(zdivs[i][j]);
			}
			zdivs[i][0].innerHTML=title_list[i];
			zdivs[i][0].style.width="200px";
			zdivs[i][1].style.position="relative";

			this.place.appendChild(divs[i]);
		}
		this.divs=divs;
		this.zdivs=zdivs;
	}
	
	//Creates buttons
	buttCreator(size=40, numb=null){
		var butt=document.createElement("BUTTON");
		butt.style.width=`${size}px`;
		butt.style.height=`${size}px`;
		butt.style.backgroundColor='#440000';
		butt.style.border="0";
		butt.style.padding='0';
		butt.style.margin='0';
		
		if (numb!=null) {
			butt.innerHTML=numb;
			butt.style.color='#FFFFFF';
			butt.style.fontSize='12px';
		}
		else {
			butt.innerHTML=0;
			butt.style.backgroundColor="#FFFFFF";
			butt.style.color="#FFFFFF";
		}
		return butt;
	}
}

var feral2=Algorithm.ObjectParser(document.getElementById('Algo1'));
var sk2=new PowerTower(feral2, 6, 107, [2, 7, 3, 12, 43, 25]);


//Prime: 20731
//Composite: 859548722
//Ultra-composite: 
