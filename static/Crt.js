var alldict={};

class CrtSolver extends Algorithm{
	constructor(block, n=-1, s, c){
		super(block);
		if (n!=-1){
			var i, af=[];
			this.divs=this.divsCreator();

			for (i=0;i<s.length;i++) af.push([c[i], s[i]]);
			this.buttMaker(af);

		}
	}
	
	BeginningExecutor(){
		this.lees=[];
		this.solstack=[];
		var fas=this.input.value, resp;
		this.place.innerHTML='';
		this.btn1=this.btn2=null;
		this.dt=[];
		var n, c, d, i=0, dis, vd, lst;

		c=this.getInput(0, fas);
		n=c[0];
		dis=c[1];
		for (i=0;i<n;i++){
			c=this.getInput(dis+1, fas);
			vd=c[0];
			c=this.getInput(c[1]+1, fas);
			this.dt.push([vd, c[0]]);
			dis=c[1];
		}
		this.solstack.push(this.dt[0]);
		this.lees.push([0, this.dt[1], this.extended_euclid(this.dt[0][1], this.dt[1][1])]);
		this.divs=this.divsCreator();
		this.buttMaker(this.dt);

		this.buttChanger(0, 2);
		this.ite=1;

		//String values: c1, c2, s1, s2
		this.stc1=`c<sub>1</sub>`
		this.stc2=`c<sub>2</sub>`
		this.sts1=`s<sub>1</sub>`
		this.sts2=`s<sub>2</sub>`
	}

	buttChanger(a, b, rev=0){
		var cl1="#FFFFFF", cl2="#004400", tcol="#666666", wh="#FFFFFF";
		var toldcol="#FFFFFF", clb="#440000";
		if (this.btn1){
			if (rev==0){
				this.btn1.style.backgroundColor=cl1;
				this.btn1.style.color=tcol;
			}
			else{
				this.btn1.style.backgroundColor=clb;
				this.btn1.style.color=toldcol;
			}
		}
		if (this.btn2){
			if (rev==0){
				this.btn2.style.backgroundColor=cl1;
				this.btn2.style.color=tcol;
			}
			else{
				this.btn2.style.backgroundColor=clb;
				this.btn2.style.color=toldcol;
			}
		}

		this.btn1=this.divs[0].getElementsByTagName("button")[a];
		this.btn2=this.divs[0].getElementsByTagName("button")[b];

		if (this.btn1){
			this.btn1.style.backgroundColor=cl2;
			this.btn1.style.color=wh;
		}

		if (this.btn2) {
			this.btn2.style.backgroundColor=cl2;
			this.btn2.style.color=wh;
		}
	}
	
	extended_euclid(a, b){
		var p=[1, 0], q=[0, 1], z, c, i=2;
		for (i=2;b>0;i++){
			z=Math.floor(a/b);
			p[i]=p[i-2]-z*p[i-1];
			q[i]=q[i-2]-z*q[i-1];
			c=a%b, a=b, b=c;
		}
		return [a, p[i-2], q[i-2]];
	}

	StateUnmaker(){
		var ln=this.lees.length;
		var s=this.lees[ln-1], vv=this.solstack[this.solstack.length-1];
		if (s[0]==0 && this.ite!=1){
			var s1=this.sts1, s2=this.sts2, c1=this.stc1, c2=this.stc2, resp;
			var sp1=this.lees[ln-2], sp2=this.lees[ln-4];
			this.divs[1].innerHTML="";
			vv=this.solstack[this.solstack.length-2];

			this.addSpan(this.divs[1], `${c1}=${vv[0]}, ${s1}=${vv[1]}`);
			this.addSpan(this.divs[1], `${c2}=${sp2[1][0]}, ${s2}=${sp2[1][1]}`);
			resp=sp2[2];
			this.addSpan(this.divs[1], `${resp[1]}*${s1}+${resp[2]}*${s2}=${resp[0]}`);


			s2=sp2[1][1], c2=sp2[1][0], s1=vv[1], c1=vv[0];
			this.addSpan(this.divs[1], `x=${s1}*${resp[1]}*(${c2}-${c1})/gcd(${s1}, ${s2})+${c1}=${s1*resp[1]*Math.floor(((c2-c1)/resp[0]))+c1}`);
			this.addSpan(this.divs[1], `lcm(${s1}, ${s2})=${Math.floor((s1*s2)/s[2][0])}`);

			var x=sp1[2]%sp1[1], lcm=sp1[1];
			if (x<0) x+=sp1[1];
			this.addSpan(this.divs[1], `x &equiv; ${x} (mod ${sp1[1]})`);
		}

		if (s[0]==1){
			var vah=this.divs[1].getElementsByTagName("span");
			this.divs[1].removeChild(vah[vah.length-1]);
			this.divs[1].removeChild(vah[vah.length-1]);
		}

		if (s[0]==2){
			this.ite-=1;
			if (this.ite>1) this.buttChanger(this.ite*2-1, this.ite*2, 1);
			else this.buttChanger(2, 0, 1);
			this.solstack.pop();
			var btt=this.divs[0].getElementsByTagName("button")[this.ite*2+1];
			btt.style.display="None";
			var vah=this.divs[1].getElementsByTagName("span");
			this.divs[1].removeChild(vah[vah.length-1]);
		}
		if (s[0]!=0 || this.ite!=1) this.lees.pop();
	}


	StateMaker(){
		var s=this.lees[this.lees.length-1], vv=this.solstack[this.solstack.length-1];
		if (s[0]==0){
			var s1="s<sub>1</sub>", s2="s<sub>2</sub>", c1="c<sub>1</sub>", c2="c<sub>2</sub>", resp;
			this.divs[1].innerHTML="";
			this.addSpan(this.divs[1], `${c1}=${vv[0]}, ${s1}=${vv[1]}`);
			this.addSpan(this.divs[1], `${c2}=${s[1][0]}, ${s2}=${s[1][1]}`);
			resp=s[2];
			this.addSpan(this.divs[1], `${resp[1]}*${s1}+${resp[2]}*${s2}=${resp[0]}`);
		}
		if (s[0]==1){
			var s2=s[1][1], c2=s[1][0], s1=vv[1], c1=vv[0];
			if ((c2-c1)%s[2][0]!=0){
				this.addSpan(this.divs[1], `(${c2}-${c1})%${s[2][0]} != 0 - and so, there is no solution`);
			}
			else{
				this.addSpan(this.divs[1], `x=${s1}*${s[2][1]}*(${c2}-${c1})/gcd(${s1}, ${s2})+${c1}=${s1*s[2][1]*Math.floor(((c2-c1)/s[2][0]))+c1}`);
				this.addSpan(this.divs[1], `lcm(${s1}, ${s2})=${Math.floor((s1*s2)/s[2][0])}`);
			}
		}
		if (s[0]==2){
			var x=s[2]%s[1], lcm=s[1], btt;
			if (x<0) x+=s[1];
			this.addSpan(this.divs[1], `x &equiv; ${x} (mod ${s[1]})`);
			btt=this.divs[0].getElementsByTagName("button")[this.ite*2+1];
			btt.innerHTML=`x &equiv; ${x} (mod ${s[1]})`
			btt.style.display="inline flow-root";
			this.solstack.push([x, s[1]]);

			this.buttChanger(this.ite*2+1, this.ite*2+2);
			this.ite+=1;
		}
	}

	NextState(){
		var s=this.lees[this.lees.length-1], vv=this.solstack[this.solstack.length-1];
		if (s[0]==0){
			this.lees.push([1, s[1], s[2]]);
		}
		if (s[0]==1){
			var s2=s[1][1], c2=s[1][0], s1=vv[1], c1=vv[0];
			if ((c2-c1)%s[2][0]!=0) this.lees.push([101]);
			else this.lees.push([2, Math.floor((s1*s2)/s[2][0]), s1*s[2][1]*Math.floor(((c2-c1)/s[2][0]))+c1]);
		}
		if (s[0]==2){
			if (this.ite>=this.dt.length) this.lees.push([100]);
			else this.lees.push([0, this.dt[this.ite], this.extended_euclid(this.solstack[this.solstack.length-1][1], this.dt[this.ite][1])]);
		}
	}

	
	addSpan(place, text){
		var span=document.createElement("SPAN");
		span.classList.add("central");
		span.innerHTML=text;
		place.appendChild(span);
	}

	buttMaker(lst){
		var i, bt;
		for (i=0;i<lst.length;i++){
			bt=this.buttCreator("#440000", `x &equiv; ${lst[i][0]} (mod ${lst[i][1]})`);
			this.divs[0].appendChild(bt);
			bt=this.buttCreator("#440000", ``);
			bt.style.display="None";
			this.divs[0].appendChild(bt);
			this.divs[0].appendChild(document.createElement("BR"))
		}
	}

	buttCreator(col="#440000", numb=null){
		var butt=document.createElement("BUTTON");
		butt.style.width="200px";
		butt.style.height="30px";
		//butt.style.border="1px solid";
		butt.style.border="None";
		butt.style.backgroundColor=col;
		butt.style.color="#FFFFFF";
		butt.style.padding='0px';
		if (numb!=null) butt.innerHTML=numb;
		return butt;
	}

	divsCreator(){
		var d1=document.createElement("DIV");
		var d2=document.createElement("DIV");
		var d3=document.createElement("DIV");
		var lees=[d1,d2, d3];
		for (var i=0;i<3;i++){
			lees[i].style.position="relative";
			lees[i].style.display="inline flow-root";
			lees[i].style.verticalAlign="top";
		}
		lees[0].style.width="30%";
		lees[1].style.width="52%";
		lees[2].style.width="14%";
		lees[0].style.marginRight="10px";

		this.place.appendChild(d1);
		this.place.appendChild(d2);
		this.place.appendChild(d3);
		return lees;
	}

	StatementComprehension(){
		var l=this.lees.length, vv=this.solstack[this.solstack.length-1];
		var s1=this.sts1, s2=this.sts2, c1=this.stc1, c2=this.stc2;
		var vc1, vc2, vs1, vs2, lc, x, exa, exb;

		var prev=this.lees[l-2], last=this.lees[l-1];
		vc1=vv[0], vs1=vv[1];


		if (last[0]==2) lc=last[1][0], x=last[1][1], vs1=prev[1][1], vs2=prev[1][2];
		//else if (last[0]==1)
		else if (last[0]<99) vs2=last[1][1], vc2=last[1][0];
		else vs2=prev[1][1], vc2=prev[1][0];


		var strr=``;
		if (last[0]==0) strr=`Now, two equation marked in green are being solved: to find their gcd and coefficients is to solve bezout identity (a${s1}+b${s2}=gcd(${s1}, ${s2}) : solution is ${last[2][1]}*${s1}+${last[2][2]}*${s2}=${last[2][0]}) extended euclidean algorithm is used`;
		if (last[0]==1) strr=`First solution to given equation is computed if (${c1}-${c2}/gcd(${s1}, ${s2}) : (${vc2}-${vc1})/gcd(${vs1}, ${vs2}): if it's not divisible, there is no solution; also lcm(${s1}, ${s2}) is computed`;
		if (last[0]==2) strr=`After finding out the solution and lcm(${s1}, ${s2}), the base solution is changed to interval <0;lcm(${s1}, ${s2})-1> : <0;${last[1]-1}>`;
		if (last[0]==100) strr=`All equations were solved, the final solution is x &equiv; ${(prev[2]%prev[1])+((prev[2]%prev[1])<0?prev[1]:0)} (mod ${prev[1]})`;
		if (last[0]==101) strr=`Solution is impossible to attain, for gcd(${s1}, ${s2}) &nmid; ${c2}-${c1}`;
		return strr;
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
var eg1=new CrtSolver(feral, 3, [2, 5, 8], [3, 7, 33]);
