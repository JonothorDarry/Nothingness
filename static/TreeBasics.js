class Tree extends Algorithm{
	constructor(block){
		super(block);
		this.treeConstructor();
	}
	BeginningExecutor(){
		this.place.innerHTML="";
		this.treeConstructor();
	}

	treeConstructor(){
		var n, i=0, j=0, a, b, width=this.place.offsetWidth, floater, angle, cval;
		var edges=[[1, 2], [3, 4], [2, 4], [3, 5], [3, 6], [3, 7]];
		var widvs=[];	
		this.tr=[];
		this.width=width/100;

		edges=this.getTreeFromInput();
		n=this.n;

		this.butts=[];
		this.divis=[];
		this.buttData=[];
		for (i=0;i<=n;i++) this.tr.push([]), this.butts.push(0), this.divis.push(0), this.buttData.push(0), widvs.push(0);

		for (i=0;i<edges.length;i++){
			a=edges[i][0];
			b=edges[i][1];

			this.tr[a].push(b), this.tr[b].push(a);
		}

		var params=this.dfsen(n, this.tr)
		var depth=params[1];
		var par=params[0];

		this.place.style.position="relative";
		for (i=0;i<depth.length;i++){
			for (j=0;j<depth[i].length;j++){
				a=depth[i][j];
				var bt=this.buttCreator(a);
				this.butts[a]=bt;

				floater=(j/depth[i].length+1/(2*depth[i].length));
				widvs[a]=width*floater;

				if (a!=1){
					var dv=document.createElement("DIV");
					this.divis[a]=dv;

					dv.style.position="absolute";
					cval=Math.sqrt(Math.pow(widvs[a]-widvs[par[a]], 2)+75*75);
					dv.style.width=`${cval}px`;
					dv.style.top=`${i*75+20}px`;

					dv.style.left=`${100*floater+(20*100)/width}%`;
					dv.style.backgroundColor="#000000";
					dv.style.height="2px"
					dv.style.zIndex="-1";

					if (widvs[a]-widvs[par[a]]==0) angle=-Infinity;
					else angle=Math.sin(75/cval);

					dv.style.transformOrigin="top left";
					if (widvs[a]-widvs[par[a]]==0) dv.style.transform=`rotate(${-Math.PI/2}rad)`;
					else if (widvs[a]-widvs[par[a]]<0) dv.style.transform=`rotate(${-Math.asin(angle)}rad)`;
					else dv.style.transform=`rotate(${Math.asin(angle)-Math.PI}rad)`;

					this.place.appendChild(dv);
				}

				bt.style.position="absolute";
				bt.style.top=`${i*75}px`;
				bt.style.left=`${100*floater}%`;
				this.buttData[a]={'left': 100*floater, 'top':i*75}

				this.place.appendChild(bt);
			}
		}
	}


	dfsen(n, tree){
		var i=1, j=0, a, b;

		var par=[], dep=[], check=[], s=[], sysdep=[], ij=[];
		for (i=0;i<n+1;i++){
			par.push(0);
			dep.push(0);
			check.push(0);
			ij.push(tree[i].length);
			sysdep.push([]);
		}

		check[1]=1;
		s.push(1);
		dep[1]=0;
		sysdep[dep[1]].push(1);

		while(s.length>0){
			a=s[s.length-1];

			if (ij[a]<=0) s.pop();	
			else if (check[tree[a][ij[a]-1]]==1) ij[a]--;
			else{
				b=tree[a][ij[a]-1];
				ij[a]--;
				check[b]=1;
				dep[b]=dep[a]+1;
				par[b]=a;
				sysdep[dep[b]].push(b);
				s.push(b);
			}
		}
		this.par=par
		return [par, sysdep];
	}

	getTreeFromInput(){
		var fas=this.input.value;
		var dis, c=this.getInput(0, fas), a, b, edges=[], n, i=0;
		n=c[0];
		console.log(c);
		this.n=n;
		dis=c[1];

		for (i=0;i<n;i++){
			c=this.getInput(dis+1, fas);
			a=c[0];
			c=this.getInput(c[1]+1, fas);
			b=c[0];
			edges.push([a, b]);
			dis=c[1];
		}

		return edges;
	}
	
	
	//Creates buttons
	buttCreator(numb=null, col='#440000'){
		var butt=document.createElement("BUTTON");
		butt.style.width="40px";
		butt.style.height="40px";
		butt.style.borderRadius="100%";
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
	
	//0: red, 1:green, 2: gray, 3: dead white
	Painter(btn, col=1){
		if (col==0 || col==1 || col==5) btn.style.color="#FFFFFF";
		else btn.style.backgroundColor="#FFFFFF";

		if (col==0) btn.style.backgroundColor="#440000";
		else if (col==1) btn.style.backgroundColor="#004400";
		else if (col==2) btn.style.color="#666666";
		else if (col==3) btn.style.color="#FFFFFF";
		else if (col==5) btn.style.backgroundColor="#000000"
	}
}

class DiamFinder extends Tree{
	BeginningExecutor(){
		super.BeginningExecutor();
		var dimension, valar, valar2, x, y;

		this.lees.push([0, 1])
		this.ij=[0]
		this.dp=[0]
		this.dpval=[0]

		for (var i=1;i<=this.n;i++){
			this.ij.push(0)
			y=this.buttData[i].top-20/Math.sqrt(2);
			x=this.buttData[i].left+40/(Math.sqrt(2)*this.width);

			valar=this.betterButtCreator(0);
			valar2=this.betterButtCreator(0);
			valar.style.top=`${y}px`;
			valar.style.left=`${x}%`;

			valar2.style.top=`${y}px`;
			valar2.style.left=`${x+20/(Math.sqrt(2)*this.width)}%`;

			this.dp.push([valar, valar2]);
			this.dpval.push([0, 0]);
			this.place.appendChild(valar);
			this.place.appendChild(valar2);
		}
	}

	StateMaker(){
		var l=this.lees.length;
		var s=this.lees[l-1], a, v0, para;
					
		if (s[0]==100) return;

		a=s[1];
		v0=this.ij[a];
		if (s[0]==0 || s[0]==1){
			this.Painter(this.butts[a], 1);
			if (a!=1) this.Painter(this.butts[this.par[a]], 5);
		}

		if (s[0]==2){

		}

		if (s[0]==3){
			this.Painter(this.butts[a], 2);
			if (a!=1) {
				para=this.par[a];
				this.Painter(this.butts[para], 1);
				if (this.dpval[para][0]<this.dpval[a][0]+1)		this.dpval[para][1]=this.dpval[para][0], this.dpval[para][0]=this.dpval[a][0]+1;
				else if (this.dpval[para][1]<this.dpval[a][0]+1)	this.dpval[para][1]=this.dpval[a][0]+1;

				this.dp[para][0].innerHTML=this.dpval[para][0];
				this.dp[para][1].innerHTML=this.dpval[para][1];

				this.butts[a].style.border="1px solid";
				this.butts[a].style.borderColor="#888888";
			}
		}

	}


	NextState(){
		var l=this.lees.length;
		var s=this.lees[l-1], a, v0;
		a=s[1];
		if (s[0]==3) a=this.par[a];
		v0=this.ij[a];

		if (v0>=this.tr[a].length && a==1) this.lees.push([100]);
		else if (v0>=this.tr[a].length) this.lees.push([3, a]);
		else if (this.tr[a][v0]==this.par[a]) this.lees.push([2, a]);
		else this.lees.push([1, this.tr[a][v0]]);
		this.ij[a]+=1;
	}


	betterButtCreator(numb=null, col='#440000'){
		var butt=this.buttCreator(numb, col);
		butt.style.width="20px";
		butt.style.height="20px";
		butt.style.borderRadius="0%";
		butt.style.position="absolute";

		return butt;
	}
}

var feral=Algorithm.ObjectParser(document.getElementById('Algo1'));
var eg1=new DiamFinder(feral);
