class EuclidGcd extends Algorithm{
	constructor(block, a=-1, b=-1){
		super(block);
		this.check=block.check;

		this.bs_butt_width="30px";
		this.bs_butt_width_h=30;
		this.bs_butt_height="30px";
		this.bs_border="1px solid";

		if (a!=-1 && b!=-1){
			this.divs=this.divsCreator();

			this.div3Creator()
			var butt, col='#440000', i=0;
			this.div3Appendor(a, b);
			for (i=0;i<a;i++){	
				butt=this.buttCreator(col);
				this.divs[0].appendChild(butt);
			}
			col=this.colorGenerator();

			for (i=0;i<b;i++){
				butt=this.buttCreator();
				this.divs[1].appendChild(butt);
			}
		}
	}
	
	StatementComprehension(){
		var l=this.lees.length;

		var prev=this.lees[l-2], last=this.lees[l-1];
		var strr=``;
		if (last[0]==1 || last[0]==0) strr=`I find modulus from dividing a and b: a%b=${last[1]}%${last[2]}=${last[1]%last[2]}`;
		if (last[0]==2) strr=`Modulus a%b is found (it's equal to ${last[1]%last[2]}), it's written to a`;
		if (last[0]==3) strr=`Now I swap a and b, so that b(${last[2]}) will be lower than a(${last[1]})`;
		if (last[0]==100) strr=`b is equal to 0, so algorithm finishes - gcd(${this.lees[0][1]}, ${this.lees[0][2]}) is a=${prev[1]}`;
		return strr;
	}

	
	NextState(){
		var l=this.lees.length;
		var s=this.lees[l-1];

		if (s[0]==100) return;
		var a=s[1], b=s[2], i=0;

		if (s[0]==1 || s[0]==0) this.lees.push([2, a%b, b]);
		if (s[0]==2) this.lees.push([3, b, a]);
		if (s[0]==3 && b>0)	this.lees.push([1, a, b]);
		if (s[0]==3 && b==0)	this.lees.push([100]);
	}

	StateMaker(){
		var l=this.lees.length;
		var s=this.lees[l-1], col;

		if (s[0]==100){
			if (this.dead==1) return;
			staat.push([3, 'dead', 0, 1]);
		}
		var a=s[1], b=s[2], i=0;

		if ((s[0]==2 || s[0]==1) && this.shower){}
		else if (s[0]==0){
			for (i=0;i<2;i++) this.divs[i].innerHTML='';
			var butt;
			this.div3Creator()
			this.div3Appendor(s[1], s[2]);
			if (this.shower) return;
			for (i=BigInt(0);i<a;i++){
				if (i%b==0 && a-i>=b) col=this.colorGenerator(192);
				else if (i%b==0) col='#440000';
				butt=this.buttCreator(col);
				this.divs[0].appendChild(butt);
			}

			for (i=0;i<b;i++){
				butt=this.buttCreator();
				this.divs[1].appendChild(butt);
			}
		}

		else if (s[0]==1){
			for (i=BigInt(0);i<a;i++){
				if (i%b==0 && a-i>=b) col=this.colorGenerator(192);
				else if (i%b==0) col='#440000';
				this.divs[0].getElementsByTagName("button")[i].style.backgroundColor=col;
			}
		}

		else if (s[0]==3){
			this.div3Appendor(s[1], s[2]);
			var tmp=this.divs[0].innerHTML;
			this.divs[0].innerHTML=this.divs[1].innerHTML;
			this.divs[1].innerHTML=tmp;
		}

		else if (s[0]==2){
			var dp=this.lees[l-2][1];
			for (i=dp;i>a;i--) this.divs[0].getElementsByTagName("button")[0].outerHTML="";
		}
	}

	StateUnmaker(){
		var l=this.lees.length;
		var s=this.lees[l-1], col;

		var a=s[1], b=s[2], i=0;
		
		if ((s[0]==2 || s[0]==1) && this.shower){}
		else if (s[0]==3){
			this.div3Exterminator();
			var tmp=this.divs[0].innerHTML;
			this.divs[0].innerHTML=this.divs[1].innerHTML;
			this.divs[1].innerHTML=tmp;
		}

		else if (s[0]==2){
			var dp=this.lees[l-2][1], bt;
			for (i=a;i<dp;i++){
				if ((i-a)%b==0) col=this.colorGenerator(192);
				bt=this.buttCreator(col);
				this.divs[0].prepend(bt);
			}
		}
		
		else if (s[0]==1){
			for (i=0;i<a;i++) this.divs[0].getElementsByTagName("button")[i].style.backgroundColor='#440000';
		}

		if (s[0]!=0)	this.lees.pop();
	}

	BeginningExecutor(){
		this.shower=this.check.checked;
		this.lees=[]
		this.place.innerHTML='';
		this.dead=0;
		var fas=this.input.value;
		var a=0, b=0, x, i=0, c;
		
		c=this.dissolve_input(fas);
		a=c.get_next();
		b=c.get_next();
		a=BigInt(a);
		b=BigInt(b);
		this.bs_butt_width_h=Math.max(Math.max(a.toString().length, b.toString().length)*10, 30);

		this.lees.push([0, a, b])
		this.divs=this.divsCreator();
	}

	//Appends things from lst in color
	simpleAppend(lst, color='#440000'){
		for (var i=0;i<lst.length;i++){
			var butt=this.buttCreator(color, lst[i]);
			this.divs[2].appendChild(butt);
		}
		this.divs[2].appendChild(document.createElement("BR"));
	}

	//Appends one verse with numbers to 3rd div
	div3Appendor(a, b){
		this.simpleAppend([this.ite, a, b]);
		this.ite+=1;
	}
	
	//Fills 3rd div in the beginning with certain verse and button names
	div3Creator(){
		this.simpleAppend(["i", "a", "b"], "#000000")
		this.ite=0;
	}
	
	//Dissolves one verse in 3rd div
	div3Exterminator(){
		for (var i=0;i<4;i++) this.divs[2].lastElementChild.outerHTML='';
		this.ite-=1;
	}


	//Generates random color
	colorGenerator(beg=0, end=255){
		var col="#", s=0;
		for (var i=0;i<3;i++){
			s=Math.ceil(Math.random()*(end-beg)+beg).toString(16);
			if (s.length==1) s="0"+s;
			col=col+s;
		}
		return col;
	}

	//Creates buttons
	buttCreator(col="#440000", numb=null){
		var butt=super.buttCreator(numb, col);
		butt.style.backgroundColor=col;
		if (numb==null) butt.innerHTML="", butt.style.color="";
		else butt.style.width=`${this.bs_butt_width_h}px`;
		return butt;
	}


	//Creates 3 div blocks: one for a, one for b, one for parameters
	divsCreator(){
		var d1=document.createElement("DIV");
		var d2=document.createElement("DIV");
		var d3=document.createElement("DIV");
		var lees=[d1,d2, d3];
		for (var i=0;i<3;i++){
			lees[i].style.position="relative";
			lees[i].style.display="inline-block";
			lees[i].style.verticalAlign="top";
		}

		var width=this.place.offsetWidth;
		var width_h=5*this.bs_butt_width_h;
		var part=Math.max(0.14, width_h/width);
		var rest=(1-part)*50-1;

		lees[0].style.width=lees[1].style.width=`${rest}%`;
		lees[2].style.width=`${100*part}%`;
		if (this.shower){
			lees[0].style.width="0";
			lees[1].style.width="0";
			lees[2].style.width="100%";
			lees[2].style.marginLeft=`${rest+1}%`;
		}
		
		lees[0].style.left=0;
		lees[1].style.rigth=0;
		lees[2].style.rigth=0;
		lees[0].style.marginRight="10px";

		this.place.appendChild(d1);
		this.place.appendChild(d2);
		this.place.appendChild(d3);
		return lees;
	}
}

class ExtendedEuclidGcd extends EuclidGcd{
	constructor(block, a, b){
		super(block, -1, -1);
		this.varp=[BigInt(1), BigInt(0)];
		this.varq=[BigInt(0), BigInt(1)];

		var butt, col='#440000', i=0;
		this.divs=this.divsCreator();
		this.div3Creator();
		this.div3Appendor("-", a, 0);
		this.div3Appendor(a, b, 1);

		for (i=0;i<a;i++){	
			butt=this.buttCreator(col);
			this.divs[0].appendChild(butt);
		}
		col=this.colorGenerator();

		for (i=0;i<b;i++){
			butt=this.buttCreator();
			this.divs[1].appendChild(butt);
		}
	}
	StateMaker(){
		var l=this.lees.length;
		var s=this.lees[l-1], col;

		if (s[0]==100) return;
		var a=s[1], b=s[2], i=0;

		if (s[0]==0){
			for (i=0;i<2;i++) this.divs[i].innerHTML='';
			var butt;
			this.varp=[BigInt(1), BigInt(0)];
			this.varq=[BigInt(0), BigInt(1)];

			this.div3Creator();
			this.div3Appendor("-", s[1], 0);
			this.div3Appendor(s[1], s[2], 1);
			if (this.shower) return;
			for (i=BigInt(0);i<a;i++){
				if (i%b==0 && a-i>=b) col=this.colorGenerator(192);
				else if (i%b==0) col='#440000';
				butt=this.buttCreator(col);
				this.divs[0].appendChild(butt);
			}
			col=this.colorGenerator();

			for (i=0;i<b;i++){
				butt=this.buttCreator();
				this.divs[1].appendChild(butt);
			}
		}
		else super.StateMaker();
	}

	div3Creator(){
		this.simpleAppend(["i", "a", "b", "p", "q"], "#000000");
		this.ite=0;
	}

	div3Appendor(a, b, ind=null){
		var p, q, z, ln=this.varp.length;

		if (ind==null){
			var s=this.lees[this.lees.length-3];
			z=s[1]/s[2];
			p=this.varp[ln-2]-this.varp[ln-1]*z;
			q=this.varq[ln-2]-this.varq[ln-1]*z;
			this.varp.push(p);
			this.varq.push(q);
		}

		else{
			p=this.varp[ind];
			q=this.varq[ind];
		}

		this.simpleAppend([this.ite, a, b, p, q]);
		this.ite+=1;
	}
	
	div3Exterminator(){
		for (var i=0;i<6;i++) this.divs[2].lastElementChild.outerHTML='';
		this.varp.pop();
		this.varq.pop();
		this.ite-=1;
	}
	
	StatementComprehension(){
		var l=this.lees.length, strr=super.StatementComprehension(), ln=this.varp.length;

		var prev=this.lees[l-2], last=this.lees[l-1];
		if (last[0]==1 || last[0]==0) strr+=`. Result of dividing a by b is z=a/b=${last[1]}/${last[2]}=${last[1]/last[2]} - it will be used to calculate next p and q`;
		if (last[0]==3) strr+=`. I also change p[i]=p[i-2]-z*p[i-1], q=q[i-2]-z*q[i-1], so that p[i]*u+q[i]*v are equal to current b=${last[2]} in the algorithm`;
		if (last[0]==100) strr+=`. Numbers x, y such that u*x+v*y=gcd(u,v) are x=p[i-1]=${this.varp[ln-2]}, y=q[i-1]=${this.varq[ln-2]}: u*x+v*y=${this.lees[0][1]}*${this.varp[ln-2]}+${this.lees[0][2]}*${this.varq[ln-2]}=${this.lees[0][1]*this.varp[ln-2]+this.lees[0][2]*this.varq[ln-2]}`;
		return strr;
	}
}

var feral=Algorithm.ObjectParser(document.getElementById('Algo1'));
feral.check=document.getElementById('Nothingness1');
var eg1=new EuclidGcd(feral, 84, 35);

var feral2=Algorithm.ObjectParser(document.getElementById('Algo2'));
feral2.check=document.getElementById('Nothingness2');
var eg2=new ExtendedEuclidGcd(feral2, 84, 35);
//incorrect: 3122132132932 917232687231 - gcd - cor, multiplication result - shit
