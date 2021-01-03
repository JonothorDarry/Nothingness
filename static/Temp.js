class Algorithm{
	static alldict={};

	Creato(block){
		this.inbut=block.sendButton;
		this.nextbut=block.nextButton;
		this.prevbut=block.prevButton;
		this.finitbut=block.finitButton;

		//Adding button ids to dictionary alldict
		Algorithm.alldict[this.inbut.id]=this;
		Algorithm.alldict[this.nextbut.id]=this;
		Algorithm.alldict[this.prevbut.id]=this;
		Algorithm.alldict[this.finitbut.id]=this;
		
		
		//Beginning button & sequence
		this.inbut.addEventListener('click', function(){
			var zis=Algorithm.alldict[this.id];
			zis.BeginningExecutor();
			zis.StateMaker();
			zis.ChangeStatement();
		});

		//Next value
		this.nextbut.addEventListener('click', function(){
			var zis=Algorithm.alldict[this.id];
			zis.NextState();
			zis.StateMaker();
			zis.ChangeStatement();
		});

		//Previous value
		this.prevbut.addEventListener('click', function(){
			var zis=Algorithm.alldict[this.id];
			if (zis.lees.length>1){
				zis.StateUnmaker();
				zis.ChangeStatement();
			}
		});
		
		//Finish Algorithm instantly	
		this.finitbut.addEventListener('click', function(){
			var zis=Algorithm.alldict[this.id];
			zis.FinishingSequence();
		});
	}

	constructor(block){
		this.lees=[];
		this.place=block.primePlace;
		this.wisdom=block.output;
		this.input=block.input;
		this.Creato(block);

		//Button style
		this.bs_butt_width="40px";
		this.bs_butt_height="40px";
		this.bs_font_size="12px";
		this.bs_border="0";
	}

	isFinished(){
		if (this.lees[this.lees.length-1][0]>=100) return true;
		return false;
	}

	FinishingSequence(){
		while (!this.isFinished()){
			this.NextState();
			this.StateMaker();
			this.ChangeStatement();
		}
	}
  
	
	//Printing statement on the output
	ChangeStatement(){
		var p=this.StatementComprehension();
		var l=this.wisdom;
		l.innerHTML=p;
	} 

	dissolve_input(str){
		var lst=[], j=0, i=0, x, a=0;
		lst.iter=-1;
		lst.get_next=function(){this.iter+=1; return this[this.iter];}
		while (j<str.length){
			for (;i<str.length;i++){
				x=str.charCodeAt(i);
				if (x<58 && x>=48) a=a*10+x-48;
				else break;
			}
			if (j!=i) lst.push(a);
			else i++;
			j=i, a=0;
		}
		return lst;
	}

	starter(){
		this.lees=[];
		this.state_transformation=[];
		this.place.innerHTML='';
		this.finito=false;
	}

	StateUnmaker(){
		var l=this.lees.length;
		var s=this.lees[l-1], n=this.n, i, elem;

		if (this.state_transformation.length==0) return;
		//Back to times of Splendor: 0 - buttons, 1 - innerHTML, 2 - list, 3 - field
		var x=this.state_transformation[this.state_transformation.length-1];
		for (i=x.length-1;i>=0;i--){
			elem=x[i];
			if (elem[0]==0) this.Painter(elem[1], elem[2]);
			if (elem[0]==1) elem[1].innerHTML=elem[2];
			if (elem[0]==2) elem[1].pop();
			if (elem[0]==3) this[elem[1]]=elem[2];
			if (elem[0]==5) elem[2](...elem[3]);
		}
		this.state_transformation.pop();

		if (l>1) this.lees.pop();
	}
	StatementComprehension(){}
	
	//0: red, 1:green, 2: white(gray), 3: dead white 5: black 6: gray 7: white(gray) with border 8: gold
	//9: yellow(grey) 10: blue 11: dark gold
	Painter(btn, col=1, only_bg=0){
		if ('upper' in btn){
			this.Painter(btn.upper, col, only_bg);
			this.Painter(btn.lower, col, only_bg);
			return;
		}
		var olden;
		if (only_bg==1) olden=btn.style.color;
		if (col==0 || col==1 || col==5 || col==6 || col==8 || col==10 || col==11 || col==12 || col==13 || col==14) btn.style.color="#FFFFFF";
		else btn.style.backgroundColor="#FFFFFF";

		if (col==0) btn.style.backgroundColor="#440000";
		else if (col==1) btn.style.backgroundColor="#004400";
		else if (col==2 || col==7 || col==9) btn.style.color="#666666";
		else if (col==3) btn.style.color="#FFFFFF";
		else if (col==5) btn.style.backgroundColor="#000000";
		else if (col==6) btn.style.backgroundColor="#888888";
		else if (col==8) btn.style.backgroundColor="#8A7400";
		else if (col==10) btn.style.backgroundColor="#0000FF";
		else if (col==11) btn.style.backgroundColor="#222200";
		if (col==12) btn.style.backgroundColor="#FF3333";
		if (col==9) btn.style.backgroundColor="#FFFF00";

		//Colors for additional post-green
		if (col==13) btn.style.backgroundColor="#669900";
		if (col==14) btn.style.backgroundColor="#00B359";

		if (col==7){
			btn.style.border="1px solid";
			btn.style.borderColor="#888888";
		}
		else btn.style.border="0px none";
		if (only_bg==1) btn.style.color=olden;
	}

	//Creates buttons
	buttCreator(numb=null, col='#440000'){
		var butt=document.createElement("BUTTON");
		butt.style.width=this.bs_butt_width;
		butt.style.height=this.bs_butt_height;
		butt.style.backgroundColor=col;
		butt.style.border=this.bs_border;
		butt.style.padding='0';
		butt.style.margin='0';
		butt.style.verticalAlign='middle';
		
		butt.style.color="#FFFFFF";
		if (numb!=null) {
			butt.innerHTML=numb;
			butt.style.fontSize=this.font_size;
		}
		else {
			butt.innerHTML=0;
			butt.style.backgroundColor="#FFFFFF";
		}
		return butt;
	}	


	//Create Button
	doubleButtCreator(v, fun){
		var butt1=fun(v);
		var butt2=fun(v);
		butt1.classList.add("fullNumb");
		butt2.classList.add("divisNumb");

		var dv = document.createElement("DIV");
		dv.style.display="inline-block";
		dv.style.position="relative";

		butt1.style.top="0";
		butt2.style.bottom="0";
		var lst=[butt1, butt2];
		for (var i=0;i<2;i++){
			lst[i].style.width=this.bs_butt_width;
			lst[i].style.height="20px";
			lst[i].style.textAlign="center";
			lst[i].style.margin="0";
			lst[i].style.position="absolute";
		}

		dv.style.width=this.bs_butt_width;
		dv.style.height="40px";
		dv.backgroundColor="#000000";
		dv.appendChild(butt1);
		dv.appendChild(butt2);
		dv.upper=butt1;
		dv.lower=butt2;
		return [dv, butt1, butt2];
	}

	transformator(staat){
		this.state_transformation.push(staat);
		var x, i;
		for (i=0;i<staat.length;i++){
			x=staat[i];
			if (x[0]==0) this.Painter(x[1], x[3]);
			if (x[0]==1) x[1].innerHTML=x[3];
			if (x[0]==2) x[1].push(x[2]);
			if (x[0]==3) this[x[1]]=x[3];
			if (x[0]==5) x[1](...x[3]);
		}
	}

	//mode: 1 - buttons, 2 - midian button, 4 - text, midian - width of middle
	divsCreator(mode, number_of_rows, title_list, midian){
		var divs=[], zdivs=[], i, j, mode_title=(((mode&4)>0)?1:0), mode_single=(((mode&2)>0)?1:0), mode_butts=mode&1;
		var title_id=0, single_id=mode_title, butts_id=mode_title+mode_single;

		for (i=0;i<number_of_rows;i++) divs.push(document.createElement("DIV")), zdivs.push([]);
		for (i=0;i<number_of_rows;i++){
			divs[i].style.height="40px";
			//zdivs - inside div: 0 is write-up, 1 is button
			for (j=0; j<butts_id+mode_butts; j++) {
				zdivs[i].push(document.createElement("DIV"));
				zdivs[i][j].style.margin="0";
				zdivs[i][j].style.padding="0";
				zdivs[i][j].style.display="inline-block";
				divs[i].appendChild(zdivs[i][j]);
			}
			if (mode_title==1) {
				zdivs[i][title_id].innerHTML=title_list[i];
				zdivs[i][title_id].style.width="200px";
			}
			if (mode_single==1) zdivs[i][single_id].style.width=midian;
			if (mode_butts==1) zdivs[i][butts_id].style.position="relative";

			this.place.appendChild(divs[i]);
		}
		this.divs=divs;
		this.zdivs=zdivs;
	}


	static ObjectParser(v){
		var dick={
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
}

class Partial extends Algorithm{
	Creato(block){
		this.show=block.showButton;
		Algorithm.alldict[this.show.id]=this;
		
		this.show.addEventListener('click', function(){
			var zis=Algorithm.alldict[this.id];
			zis.ShowReality();
		});
	}

	static ObjectParser(v){
		var dick={
			'primePlace':v.getElementsByClassName('primez')[0],
			'showButton':v.getElementsByClassName('show')[0],
			'input':v.getElementsByClassName('inputter')[0],
			'output':v.getElementsByClassName('comprehend')[0],
		}
		return dick;
	}
}


class NTMath{
	static pow(ap, bp, mp=1000000007){
		var res=1n, a=BigInt(ap), b=BigInt(bp), m=BigInt(mp);
		for (;b>0;b=b/2n){
			if (b%2n==1n) res=(res*a)%m;
			a=(a*a)%m;
		}
		return res;
	}
	static mul(a, b, m=1000000007){
		var res=0;
		for (;b>0;b=Math.floor(b/2)){
			if (b%2==1) res=(res+a)%m;
			a=(a+a)%m;
		}
		return res;
	}

	static ext_gcd(a, b){
		var p=[1, 0], q=[0, 1], lst=2, c, z;

		while (b>0){
			z=Math.floor(a/b);
			p.push(p[lst-2]-z*p[lst-1]);
			q.push(q[lst-2]-z*q[lst-1]);
			c=a%b, a=b, b=c;
			lst=lst+1
		}
		return [a, p[lst-2], q[lst-2]];
	}

	static inverse(a, m){
		var s=NTMath.ext_gcd(a, m);
		if (s[0]==0) return null;
		if (s[1]<0) return s[1]+m;
		return s[1];
	}

	static factorize(x){
		var i, ace=0, lst=[[],[]];
		for (i=2;i*i<=x;i++){
			if (x%i==0) lst[0].push(i), lst[1].push(0);
			while(x%i==0) x=Math.floor(x/i), lst[1][lst[1].length-1]++;
		}
		if (x>1) lst[0].push(x), lst[1].push(1);
		return lst;
	}

	static find_totient(x){
		var y=NTMath.factorize(x)[0], toth=x, i;
		for (i=0;i<y.length;i++)
			toth=Math.floor(toth/y[i])*(y[i]-1);
		return toth;
	}

	static find_proot(x){
		var fac_x=NTMath.factorize(x);
		var ln=fac_x[0].length;
		if (x==4) return 3;
		if (fac_x[0].length>2 || (fac_x[0].length==2 && fac_x[0][0]!=2) || (fac_x[0][0]==2 && fac_x[1][0]>=2)) return null;

		var p=fac_x[0][ln-1], toth_p=p-1, y, i;
		var fac_t=NTMath.factorize(toth_p);

		var ln=fac_t[0].length;
		var lst=[];
		for (i=0;i<ln;i++) lst.push(toth_p/fac_t[0][i]);

		while(true){
			y=Math.floor(Math.random()*(p-2))+2;
			for (i=0; i<ln; i++){
				if (NTMath.pow(y, lst[i], p)==1) break;
			}
			if (i==ln) break;
		}
		if (2*p<x && NTMath.pow(y, p-1, p*p)!=1) y=y+p;
		if (x%2==0 && y%2==0) y=y+(x>>1);
		return y;
	}
}

class Complex{
	constructor(a, b=0){
		this.real=a;
		this.img=b;
	}
	add(b){
		return new Complex(this.real+b.real, this.img+b.img);
	}
	mul(b){
		return new Complex(this.real*b.real-this.img*b.img, this.img*b.real+b.img*this.real);
	}
	toString(){
		if (-10e-6<this.img && this.img<10e-6) return `${this.real.toFixed(5)}`;
		return `${this.real.toFixed(5)}+${this.img.toFixed(5)}i`;
	}
}
