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

		this.lees=[];
		this.place.innerHTML='';
		var fas=this.input.value;
		var a=0, b=0, x, i=0, c, m;
		
		
		for (i=0;i<3;i++) this.btlist.push([]);
		c=this.getInput(0, fas);
		a=c[0];

		c=this.getInput(c[1]+1, fas);
		b=c[0];

		c=this.getInput(c[1]+1, fas);
		m=c[0];

		this.lees.push([0, a, b, 1, m]);
		this.Create_reality(a, b);
	}

	Create_reality(a, b){
		var i=0, j=0, z=Math.floor(Math.log2(b))+1, btn, crb=b, mylst=[];
		for (i=0;i<z;i++) mylst.push(crb%2), crb=Math.floor(crb/2);

		this.divCreator();
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
	}

	//0: red, 1:green, 2: gray, 3: dead white
	Painter(btn, col=1){
		if (col==0 || col==1) btn.style.color="#FFFFFF";
		else btn.style.backgroundColor="#FFFFFF";

		if (col==0) btn.style.backgroundColor="#440000";
		else if (col==1) btn.style.backgroundColor="#004400";
		else if (col==2) btn.style.color="#666666";
		else if (col==3) btn.style.color="#FFFFFF";
	}

	StateMaker(){
		var l=this.lees.length;
		var s=this.lees[l-1], col, vl, lst;
		if (s[0]>=100) lst=this.lees[l-2];

		var a=s[1], b=s[2], res=s[3], m=s[4], i=0;

		if (s[0]==0){
			this.Painter(this.btlist[0][this.reality], 1);
			vl=(res*(b%2==0?1:a))%m;
			this.btlist[0][this.reality].innerHTML=vl;
			this.utilbts[0].innerHTML=vl;			
		}

		else if (s[0]==1){
			this.Painter(this.btlist[0][this.reality], 2);
			this.Painter(this.btlist[1][this.reality], 2);
			this.Painter(this.btlist[2][this.reality], 2);

			this.Painter(this.btlist[1][this.reality-1], 1);
			this.Painter(this.btlist[2][this.reality-1], 1);

			this.btlist[1][this.reality-1].innerHTML=(a*a)%m;
			this.utilbts[1].innerHTML=(a*a)%m;
			this.utilbts[2].innerHTML=Math.floor(b/2);			
			this.reality--;
		}

		else if (s[0]>=100){
			this.Painter(this.btlist[1][this.reality], 0);
			this.Painter(this.btlist[2][this.reality], 0);

			this.utilbts[1].innerHTML=(lst[1]*lst[1])%lst[4];
			this.utilbts[2].innerHTML=0;
		}
	}

	StateUnmaker(){
		var l=this.lees.length;
		var s=this.lees[l-1], col, vl;
		if (l>1){
			var s2=this.lees[l-1];
			if (s[0]>=100) s2=this.lees[l-2];

			var a=s2[1], b=s2[2], res=s2[3], m=s2[4], i=0;
			if (s[0]<100) 	this.utilbts[0].innerHTML=res;
			this.utilbts[1].innerHTML=a;
			this.utilbts[2].innerHTML=b;

			if (s[0]==1){
				this.reality++;

				this.Painter(this.btlist[0][this.reality], 1);
				this.Painter(this.btlist[1][this.reality], 1);
				this.Painter(this.btlist[2][this.reality], 1);

				this.Painter(this.btlist[1][this.reality-1], 3);
				this.Painter(this.btlist[2][this.reality-1], 0);
			}
			if (s[0]==0){
				this.Painter(this.btlist[0][this.reality], 3);
			}
			if (s[0]==100){
				this.Painter(this.btlist[1][this.reality], 1);
				this.Painter(this.btlist[2][this.reality], 1);
			}

		}
		if (l>1) this.lees.pop();
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

	divCreator(){
		var divs=[], zdivs=[], i, j;
		for (i=0;i<3;i++) divs.push(document.createElement("DIV")), zdivs.push([]);
		for (i=0;i<3;i++){
			divs[i].style.width="100%";
			divs[i].style.height="40px";
			for (j=0;j<3;j++) {
				zdivs[i].push(document.createElement("DIV"));
				zdivs[i][j].style.margin="0";
				zdivs[i][j].style.padding="0";
				zdivs[i][j].style.display="inline flow-root";
				divs[i].appendChild(zdivs[i][j]);
			}
			if (i==0) zdivs[i][0].innerHTML="Current result:";
			if (i==1) zdivs[i][0].innerHTML="Current a:";
			if (i==2) zdivs[i][0].innerHTML="Current b:";
			zdivs[i][0].style.width="200px";
			zdivs[i][1].style.width="50px";

			this.place.appendChild(divs[i]);
		}
		this.divs=divs;
		this.zdivs=zdivs;
	}
	
	//Creates buttons
	buttCreator(numb=null, col='#440000'){
		var butt=document.createElement("BUTTON");
		butt.style.width="40px";
		butt.style.height="40px";
		butt.style.backgroundColor=col;
		butt.style.border="0";
		butt.style.padding='0';
		butt.style.margin='0';
		
		if (numb!=null) {
			butt.innerHTML=numb;
			butt.style.color='#FFFFFF';
			butt.style.fontSize='12px';
		}
		else {
			butt.style.backgroundColor="#FFFFFF";
			butt.style.color="#FFFFFF";
		}
		return butt;
	}	
}



var feral=Algorithm.ObjectParser(document.getElementById('Algo1'));
var eg1=new BinaryExpo(feral, 17, 43, 107);
