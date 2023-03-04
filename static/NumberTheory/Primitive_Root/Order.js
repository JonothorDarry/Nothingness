class Order extends Partial{
	constructor(block, x){
		super(block);
		this.place.position="relative";
		this.ShowReality(x);
	}

	ShowReality(x=-1){
		var i=0, toth;
		if (x==-1) x=this.input.value;
		toth=this.sieve_mark(x);
		this.logic.lambda=this.find_carmichael(x);

		this.place.innerHTML='';

		this.present={}
		this.present.content = Modern_representation.div_creator('', {'general':{'position':'relative'}});
		this.place.appendChild(this.present.content);

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

	find_carmichael(x){
		var i=0, lambda=1, k=0, pw=i;
		for (i=2; i*i<=x; i++){
			if (x%i != 0) continue;
			pw=1,  k=0;
			while (x%i==0) x=Math.floor(x/i), pw=pw*i, k+=1;
			if (i==2 && k>=3) lambda=NTMath.lcm(lambda, Math.floor(pw/4));
			else lambda = Number(NTMath.lcm(lambda, pw-Math.floor(pw/i)));
		}

		if (x>1) lambda = Number(NTMath.lcm(lambda, (x-1)));
		return lambda;
	}

	create_standard_div(g, mod, toth){
		var i, a=g;
		var dv=document.createElement("DIV"), btn=[];
		dv.style.position="relative";
		dv.style.width=`${(Number(this.logic.lambda)+6)*40}px`;
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
			if (i==1) {
				btn[i].style.position='sticky';
				btn[i].style.left=0;
			}
			else {
				btn[i].style.position='relative';
				btn[i].style.zIndex=-1;
			}
			btn[i].style.display="inline-block";

			if (lst[i]=='x') Representation_utils.Painter(btn[i], 3);
			dv.append(btn[i]);
		}
		//Tocjent
		if (lst[3]==toth) Representation_utils.Painter(btn[1], 8);
		this.present.content.appendChild(dv);
	}

	create_upper_div(x, toth){
		var i;
		var dv=document.createElement("DIV"), btn=[];
		this.place.position="relative";
		dv.style.position="sticky";
		dv.style.top=0;
		dv.style.width=`${(Number(this.logic.lambda)+6)*40}px`;
		dv.style.height="40px"
		var lst=['x', 'g', `ord<sub>${x}</sub>(g)`, 'g<sup>i</sup>; i='];

		for (i=1; i<=this.logic.lambda; i++) lst.push(i);
		for (i=0; i<lst.length; i++){
			btn.push(this.buttCreator(lst[i]));
			btn[i].style.position="relative";
			btn[i].style.display="inline-block";
			if (lst[i]=='x') Representation_utils.Painter(btn[i], 3);
			else Representation_utils.Painter(btn[i], 5);
			dv.append(btn[i]);
		}
		btn[2].style.width="80px";
		this.present.content.appendChild(dv);
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
				if (i==toth) Representation_utils.Painter(btn, 8);
				else Representation_utils.Painter(btn, 5);
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
export default Order
