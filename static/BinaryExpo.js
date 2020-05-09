var alldict={};

class BinaryExpo extends Algorithm{
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
		var s=this.lees[l-1], col, vl;

		if (s[0]>=100) return;
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
	}



	StatementComprehension(){}

	NextState(){
		var l=this.lees.length;
		var s=this.lees[l-1], col;
		var a=s[1], b=s[2], res=s[3], m=s[4], i=0;
		console.log(b, s[0], b);

		if (s[0]>=100) return;
		if (s[0]==0 && b==1) this.lees.push([100]);
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










function ObjectParser(v){
	dick={
		'primePlace':v.getElementsByClassName('primez')[0],
		'sendButton':v.getElementsByClassName('sender')[0],
		'prevButton':v.getElementsByClassName('previous')[0],
		'nextButton':v.getElementsByClassName('next')[0],
		'input':v.getElementsByClassName('inputter')[0],
		'output':v.getElementsByClassName('comprehend')[0],
		'finitButton':v.getElementsByClassName('finish')[0]
	}
	return dick;
}

var feral=ObjectParser(document.getElementById('Algo1'));
var eg1=new BinaryExpo(feral);
