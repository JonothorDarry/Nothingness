class BinaryExpo extends Algorithm{

	constructor(block, a=17, b=43, m=107){
		super(block);
		this.btlist=[];
		this.utilbts=[];

		this.place.innerHTML='';
		for (var i=0;i<3;i++) this.btlist.push([]);
		this.Create_reality(a, b);
	}

	BeginningExecutor(){
		this.btlist=[];
		this.utilbts=[];
		this.state_transformation=[];

		this.lees=[];
		this.place.innerHTML='';
		this.dead=0;
		var fas=this.input.value;
		var a=0, b=0, x, i=0, c, m;
		
		
		for (i=0;i<3;i++) this.btlist.push([]);
		c=this.dissolve_input(fas);
		a=c.get_next();
		b=c.get_next();
		m=c.get_next();
		var mx_all=Math.max(Math.max(a.toString().length, b.toString().length), m.toString().length)*10;
		this.bs_butt_width=`${Math.max(40, mx_all)}px`;
		this.bs_butt_width_h=Math.max(40, mx_all);

		this.lees.push([0, a, b, 1, m]);
		this.Create_reality(a, b);
	}

	Create_reality(a, b){
		var i=0, j=0, z=Math.floor(Math.log2(b))+1, btn, crb=b, mylst=[];
		for (i=0;i<z;i++) mylst.push(crb%2), crb=Math.floor(crb/2);

		this.divsCreator(7, 3, ["Current result:", "Current a:", "Current b:"],`${this.bs_butt_width}+100px`);
		for (j=0;j<3;j++){
			for (i=0;i<z;i++) {
				if (j==1 && i==z-1) btn=this.buttCreator(a, '#004400');
				else if (j==2) btn=this.buttCreator(mylst[z-i-1], i==(z-1)?'#004400':'#440000');
				else btn=this.buttCreator();
				this.btlist[j].push(btn);	
				this.zdivs[j][2].appendChild(btn);
			}
			if (j==1) btn=this.buttCreator(a);
			if (j==2) btn=this.buttCreator(b);
			if (j==0) btn=this.buttCreator(1);
			
			this.utilbts.push(btn);
			this.zdivs[j][1].appendChild(btn);
		}
		this.reality=z-1;
		//Controversial - there must be a better way than hardcoding width
		this.place.style.width=`${(z+1)*this.bs_butt_width_h+200}px`;
	}

	StateMaker(){
		var l=this.lees.length;
		var s=this.lees[l-1], col, vl, lst;
		var staat=[];
		var a=s[1], b=s[2], res=s[3], m=s[4], i=0;

		if (s[0]==0){
			staat.push([0, this.btlist[0][this.reality], 4, 1]);

			//this.Painter(this.btlist[0][this.reality], 1);
			vl=(res*(b%2==0?1:a))%m;
			this.btlist[0][this.reality].innerHTML=vl;
			staat.push([1, this.utilbts[0], res, vl]);
			this.utilbts[0].innerHTML=vl;	
		}

		else if (s[0]==1){
			staat.push([0, this.btlist[0][this.reality], 1, 2]);
			staat.push([0, this.btlist[1][this.reality], 1, 2]);
			staat.push([0, this.btlist[2][this.reality], 1, 2]);

			staat.push([0, this.btlist[1][this.reality-1], 4, 1]);
			staat.push([0, this.btlist[2][this.reality-1], 0, 1]);

			this.btlist[1][this.reality-1].innerHTML=(a*a)%m;
			staat.push([1, this.utilbts[1], a, (a*a)%m]);
			staat.push([1, this.utilbts[2], b, Math.floor(b/2)]);
			staat.push([3, 'reality', this.reality, this.reality-1]);
		}

		else if (s[0]>=100){
			if (this.dead==1) return;
			staat.push([3, 'dead', 0, 1]);
			lst=this.lees[l-2];
			staat.push([0, this.btlist[1][this.reality], 1, 0]);
			staat.push([0, this.btlist[2][this.reality], 1, 0]);

			staat.push[1, this.utilbts[1], lst[1], (lst[1]*lst[1])%lst[4]];
			staat.push[1, this.utilbts[2], lst[2], 0];
		}

		this.transformator(staat);
	}


	StatementComprehension(){
		var l=this.lees.length;
		var s=this.lees[l-1];
		var a=s[1], b=s[2], res=s[3], m=s[4];

		var strr=``;
		if (s[0]==0) strr=`New result is calculated as res*a<sup>b mod 2</sup> mod m=res*a<sup>${b%2}</sup> mod ${m}=${res}*${(b%2==0)?1:a} mod ${m}=${(res*((b%2==0)?1:a))%m}`;
		if (s[0]==1) strr=`Value of b is divided by 2: b/2=${b}/2=${Math.floor(b/2)}, a is multiplied by itself: a=(a*a)%m=${a}*${a} mod ${m}=${(a*a)%m}`;
		if (s[0]==100) strr=`Now, b=0: algorithm ends, result is ${a}`;
		return strr;
	}

	NextState(){
		var l=this.lees.length;
		var s=this.lees[l-1], col;
		var a=s[1], b=s[2], res=s[3], m=s[4], i=0;

		if (s[0]>=100) return;
		if (s[0]==0 && b==1) this.lees.push([100, (res*(b%2==0?1:a))%m]);
		else if (s[0]==0) this.lees.push([1, a, b, (res*(b%2==0?1:a))%m, m]);
		else if (s[0]==1) this.lees.push([0, (a*a)%m, Math.floor(b/2), res, m]); 
	}
}

var feral=Algorithm.ObjectParser(document.getElementById('Algo1'));
var eg1=new BinaryExpo(feral, 17, 43, 107);
