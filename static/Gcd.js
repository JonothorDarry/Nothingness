var alldict={};

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


class EuclidGcd extends Algorithm{
	constructor(block, a=-1, b=-1){
		super(block);
		if (a!=-1 && b!=-1){
			this.divs=this.divsCreator();

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

		if (s[0]==100) return;
		var a=s[1], b=s[2], i=0;

		if (s[0]==0){
			for (i=0;i<2;i++) this.divs[i].innerHTML='';
			var butt;
			this.div3Appendor(s[1], s[2]);
			for (i=0;i<a;i++){
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
			for (i=0;i<a;i++){
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
			for (i=dp;i>a;i--) 	this.divs[0].getElementsByTagName("button")[0].outerHTML="";
		}
	}

	StateUnmaker(){
		var l=this.lees.length;
		var s=this.lees[l-1], col;

		var a=s[1], b=s[2], i=0;
		
		if (s[0]==3){
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
		this.lees=[]
		this.place.innerHTML='';
		var fas=this.input.value;
		var a=0, b=0, x, i=0;
		
		for (i=0;i<fas.length;i++){
			x=fas.charCodeAt(i);
			if (x<58 && x>=48) a=a*10+x-48;
			else break;
		}
		i+=1;

		for (;i<fas.length;i++){
			x=fas.charCodeAt(i);
			if (x<58 && x>=48) b=b*10+x-48;
			else break;
		}
		this.lees.push([0, a, b])
		this.divs=this.divsCreator();
		//document.createElement("BUTTON");
	}

	div3Appendor(a, b){
		var butt=this.buttCreator('#440000', a);
		this.divs[2].appendChild(butt);
		butt=this.buttCreator('#440000', b);	
		this.divs[2].appendChild(butt);
		this.divs[2].appendChild(document.createElement("BR"));
	}
	
	div3Exterminator(){
		for (var i=0;i<3;i++) this.divs[2].lastElementChild.outerHTML='';
	}


	colorGenerator(beg=0, end=255){
		var col="#", s=0;
		for (var i=0;i<3;i++){
			s=Math.ceil(Math.random()*(end-beg)+beg).toString(16);
			if (s.length==1) s="0"+s;
			col=col+s;
		}
		return col;
	}

	buttCreator(col="#440000", numb=null){
		var butt=document.createElement("BUTTON");
		butt.style.width="30px";
		butt.style.height="30px";
		butt.style.border="1px solid";
		butt.style.backgroundColor=col;
		butt.style.padding='0px';
		if (numb!=null) {
			butt.innerHTML=numb;
			butt.style.color='#FFFFFF';
			butt.style.fontSize='12px';
		}
		return butt;
	}

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
		lees[0].style.width="42%";
		lees[1].style.width="42%";
		lees[2].style.width="14%";
		
		
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
		this.varp=[1, 0];
		this.varq=[0, 1];

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
			this.varp=[1, 0];
			this.varq=[0, 1];

			this.div3Creator();
			this.div3Appendor("-", s[1], 0);
			this.div3Appendor(s[1], s[2], 1);
			for (i=0;i<a;i++){
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
		var col='#000000';
		var butt=this.buttCreator(col, "a");
		this.divs[2].appendChild(butt);
		butt=this.buttCreator(col, "b");
		this.divs[2].appendChild(butt);

		var butt=this.buttCreator(col, "p");
		this.divs[2].appendChild(butt);
		butt=this.buttCreator(col, "q");
		this.divs[2].appendChild(butt);

		this.divs[2].appendChild(document.createElement("BR"));	
	}

	div3Appendor(a, b, ind=null){
		var p, q, z, ln=this.varp.length;

		if (ind==null){
			var s=this.lees[this.lees.length-3];
			z=Math.floor(s[1]/s[2]);
			p=this.varp[ln-2]-this.varp[ln-1]*z;
			q=this.varq[ln-2]-this.varq[ln-1]*z;
			this.varp.push(p);
			this.varq.push(q);
		}

		else{
			p=this.varp[ind];
			q=this.varq[ind];
		}

		var butt=this.buttCreator('#440000', a);
		this.divs[2].appendChild(butt);
		butt=this.buttCreator('#440000', b);
		this.divs[2].appendChild(butt);

		var butt=this.buttCreator('#440000', p);
		this.divs[2].appendChild(butt);
		butt=this.buttCreator('#440000', q);
		this.divs[2].appendChild(butt);

		this.divs[2].appendChild(document.createElement("BR"));
	}
	
	div3Exterminator(){
		for (var i=0;i<5;i++) this.divs[2].lastElementChild.outerHTML='';
	}
	
	StatementComprehension(){
		var l=this.lees.length, strr=super.StatementComprehension(), ln=this.varp.length;

		var prev=this.lees[l-2], last=this.lees[l-1];
		if (last[0]==1 || last[0]==0) strr+=`. Result of dividing a by b is z=a/b=${last[1]}/${last[2]}=${Math.floor(last[1]/last[2])} - it will be used to calculate next p and q`;
		if (last[0]==3) strr+=`. I also change p[i]=p[i-2]-z*p[i-1], q=q[i-2]-z*q[i-1], so that p[i]*u+q[i]*v are equal to current b=${last[2]} in the algorithm`;
		if (last[0]==100) strr+=`. Numbers x, y such that u*x+v*y=gcd(u,v) are x=p[i-1]=${this.varp[ln-2]}, y=q[i-1]=${this.varq[ln-2]}: u*x+v*y=${this.lees[0][1]}*${this.varp[ln-2]}+${this.lees[0][2]}*${this.varq[ln-2]}=${this.lees[0][1]*this.varp[ln-2]+this.lees[0][2]*this.varq[ln-2]}`;
		return strr;
	}
}

var feral=ObjectParser(document.getElementById('Algo1'));
var eg1=new EuclidGcd(feral, 84, 35);
document.getElementById("Comprehend").innerHTML="AHHASHPenis";
var feral2=ObjectParser(document.getElementById('Algo2'));
var eg2=new ExtendedEuclidGcd(feral2, 84, 35);