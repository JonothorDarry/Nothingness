class Tree extends Algorithm{
	constructor(block, wid=100){
		super(block);
		this.treeConstructor(wid);
	}
	BeginningExecutor(){
		this.place.innerHTML="";
		this.treeConstructor();
	}

	treeConstructor(wid=70){
		this.place.style.position="relative";
		this.treeDiv=document.createElement("DIV");
		this.treeDiv.style.position="relative";
		this.treeDiv.style.width=`${wid}%`;
		this.treeDiv.style.display="inline flow-root";
		this.place.appendChild(this.treeDiv);

		this.tabDiv=document.createElement("DIV");
		this.tabDiv.style.position="relative";
		this.tabDiv.style.width=`${99-wid}%`;
		this.tabDiv.style.display="inline flow-root";
		this.place.appendChild(this.tabDiv);

		var n, i=0, j=0, a, b, width=this.treeDiv.offsetWidth, floater, angle, cval;
		var edges=[[1, 2], [3, 4], [2, 4], [3, 5], [3, 6], [3, 7]];
		var widvs=[];	
		this.tr=[];
		this.width=width/100;

		edges=this.getTreeFromInput();
		n=this.n;

		this.butts=[];
		this.divis=[];
		this.buttData=[];
		var namez=['Stack:'];
		this.btlist=[];

		for (i=0;i<=n;i++) {
			this.tr.push([]), this.butts.push(0), this.divis.push(0);
			this.buttData.push(0), widvs.push(0);
			namez.push(`edges ${i+1}:`)
			this.btlist.push([])
		}

		for (i=0;i<edges.length;i++){
			a=edges[i][0];
			b=edges[i][1];

			this.tr[a].push(b), this.tr[b].push(a);
		}
		var params=this.dfsen(n, this.tr)
		var depth=params[1];
		var par=params[0];

		for (i=0;i<depth.length;i++){
			if (depth[i].length==0){
				this.place.style.height=`${Math.max(i*75+40-75, 40*(this.tr.length+1))}px`;
				this.treeDiv.style.height=`${i*75+40-75}px`;
				this.divCreator(this.tr, namez, this.tabDiv, i);
				break;
			}
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

					this.treeDiv.appendChild(dv);
				}

				bt.style.position="absolute";
				bt.style.top=`${i*75}px`;
				bt.style.left=`${100*floater}%`;
				this.buttData[a]={'left': 100*floater, 'top':i*75}

				this.treeDiv.appendChild(bt);
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
		this.par=par;
		this.dep=dep;
		return [par, sysdep];
	}

	getTreeFromInput(){
		var fas=this.input.value;
		var dis, c=this.getInput(0, fas), a, b, edges=[], n, i=0;
		n=c[0];
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

	divCreator(tree, namez, local, depth){
		var divs=[], zdivs=[], i, j;
		var btn;
		for (i=0;i<tree.length;i++){
			divs.push(document.createElement("DIV")), zdivs.push([]);
			divs[i].style.width="100%";
			divs[i].style.height="40px";
			for (j=0;j<2;j++) {
				zdivs[i].push(document.createElement("DIV"));
				zdivs[i][j].style.margin="0";
				zdivs[i][j].style.padding="0";
				zdivs[i][j].style.display="inline flow-root";
				divs[i].appendChild(zdivs[i][j]);
			}
			zdivs[i][0].innerHTML=namez[i];
			zdivs[i][0].style.width="200px";
			//zdivs[i][1].style.width="50px";

			local.appendChild(divs[i]);

			for (j=0;j<(i==0?depth:tree[i].length);j++){
				if (i>0) btn=this.buttCreator(tree[i][j]);
				else btn=this.buttCreator(0);
				btn.style.borderRadius="0%";
				if (i==0) this.Painter(btn, 4);
				
				this.btlist[i].push(btn)
				zdivs[i][1].appendChild(btn)
			}
		}

		this.divs=divs;
		this.zdivs=zdivs;
	}
}

class DiamFinder extends Tree{
	BeginningExecutor(){
		super.BeginningExecutor();
		this.ans=0;
		this.ans_snapshot=[0];
		var dimension, valar, valar2, x, y;

		this.lees.push([0, 1]);
		this.ij=[0];
		this.dp=[0];
		this.dpval=[0];
		this.diams=[0];

		for (var i=1;i<=this.n;i++){
			this.ij.push(0);
			this.diams.push([[0, 0]]);

			y=this.buttData[i].top-20/Math.sqrt(2);
			x=this.buttData[i].left+40/(Math.sqrt(2)*this.width);

			valar=this.betterButtCreator(0);
			valar2=this.betterButtCreator(0);
			valar.style.top=`${y}px`;
			valar.style.left=`${x}%`;

			valar2.style.top=`${y}px`;
			valar2.style.left=`${x+20/this.width}%`;

			this.dp.push([valar, valar2]);
			this.dpval.push([0, 0]);
			this.treeDiv.appendChild(valar);
			this.treeDiv.appendChild(valar2);
		}
	}

	StateMaker(){
		var l=this.lees.length;
		var s=this.lees[l-1], a, v0, para;
					
		if (s[0]==100) return;

		a=s[1];
		v0=this.ij[a];

		this.Painter(this.dp[a][0], 0);
		this.Painter(this.dp[a][1], 0);
		if (a!=1 && s[0]!=3){
			this.Painter(this.dp[this.par[a]][0], 0);
			this.Painter(this.dp[this.par[a]][1], 0);
		}
		if (s[0]==0 || s[0]==1){
			this.Painter(this.butts[a], 1);

			this.Painter(this.btlist[0][this.dep[a]], 1);
			if (this.dep[a]>0) this.Painter(this.btlist[0][this.dep[a]-1], 5);
			this.btlist[0][this.dep[a]].innerHTML=a;

			this.Painter(this.btlist[a][this.ij[a]], 1);
			if (a!=1){
				var para=this.par[a];
				this.Painter(this.btlist[para][this.ij[para]-1], 2);
				this.Painter(this.butts[para], 5);
			}
		}

		if (s[0]==2){
			this.Painter(this.btlist[a][this.ij[a]-1], 2);
			if (this.ij[a]<this.tr[a].length) this.Painter(this.btlist[a][this.ij[a]], 1);	
		}

		if (s[0]==3){
			this.Painter(this.butts[a], 2);
			this.Painter(this.btlist[0][this.dep[a]], 4);
			if (this.dep[a]>0) this.Painter(this.btlist[0][this.dep[a]-1], 1);

			if (a!=1) {
				para=this.par[a];
				this.Painter(this.butts[para], 1);
				if (this.dpval[para][0]<this.dpval[a][0]+1){
					this.dpval[para][1]=this.dpval[para][0];
					this.dpval[para][0]=this.dpval[a][0]+1;
					this.Painter(this.dp[para][0], 1);
				}
				else if (this.dpval[para][1]<this.dpval[a][0]+1){
					this.dpval[para][1]=this.dpval[a][0]+1;
					this.Painter(this.dp[para][1], 1);
				}
				this.diams[para].push(this.dpval[para].slice());

				this.dp[para][0].innerHTML=this.dpval[para][0];
				this.dp[para][1].innerHTML=this.dpval[para][1];
				if (this.dpval[para][0]+this.dpval[para][1]>this.ans)
					this.ans=this.dpval[para][0]+this.dpval[para][1];
				this.ans_snapshot.push(this.ans);

				this.butts[a].style.border="1px solid";
				this.butts[a].style.borderColor="#888888";

				if (this.ij[para]<this.tr[para].length)
					this.Painter(this.btlist[para][this.ij[para]], 1);
			}
		}
	}

	StateUnmaker(){
		var l=this.lees.length;
		var s=this.lees[l-1], seminal=this.lees[l-2], a, v0, para;
		a=s[1];

		if (a!=1) var para=this.par[a];

		if (s[0]==0 || s[0]==1){
			if (a!=1){
				this.Painter(this.btlist[para][this.ij[para]-1], 1);
				this.Painter(this.butts[para], 1);
			}
			this.Painter(this.btlist[a][this.ij[a]], 0);
			this.Painter(this.butts[a], 0);

			this.Painter(this.btlist[0][this.dep[a]], 4);
			if (this.dep[a]>0) this.Painter(this.btlist[0][this.dep[a]-1], 1);
		}

		if (s[0]==2){
			this.Painter(this.btlist[a][this.ij[a]-1], 1);
			if (this.ij[a]<this.tr[a].length) this.Painter(this.btlist[a][this.ij[a]], 0);
		}

		if (s[0]==3){
			this.Painter(this.butts[a], 1);
			this.Painter(this.btlist[0][this.dep[a]], 1);
			if (this.dep[a]>0) this.Painter(this.btlist[0][this.dep[a]-1], 5);

			if (a!=1) {
				para=this.par[a];
				if (this.ij[para]<this.tr[para].length)
					this.Painter(this.btlist[para][this.ij[para]], 0);

				this.Painter(this.butts[para], 5);
				this.diams[para].pop();
				this.ans_snapshot.pop();
				this.ans=this.ans_snapshot[this.ans_snapshot.length-1];

				this.dpval[para]=this.diams[para][this.diams[para].length-1].slice();
				this.Painter(this.dp[para][0], 0);
				this.Painter(this.dp[para][1], 0);

				this.dp[para][0].innerHTML=this.dpval[para][0];
				this.dp[para][1].innerHTML=this.dpval[para][1];

				this.butts[a].style.border="0px none";
			}
		}

		if (seminal[0]==3){
			para=this.par[seminal[1]];
			var old_diam=this.diams[para][this.diams[para].length-2].slice();
			var new_diam=this.diams[para][this.diams[para].length-1].slice();
			if (old_diam[0]!=new_diam[0]) this.Painter(this.dp[para][0], 1);
			else if (old_diam[1]!=new_diam[1]) this.Painter(this.dp[para][1], 1);
		}

		this.lees.pop();
		a=seminal[1];
		if (seminal[0]==3) a=this.par[seminal[1]];
		this.ij[a]-=1;
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
	StatementComprehension(){
		var l=this.lees.length;
		var s=this.lees[l-1];
		var diams=this.diams;
		if (l>1) var prev=this.lees[l-2];

		var a=0;
		if (l==1) a=s[1];
		else a=prev[1];
		if (a!=1) var para=this.par[a];

		var strr=``;
		if (s[0]==0) strr=`Firstly, edge list is rewritten to an adjacency list for simplicity. I start searching through tree by processing arbitrary root r=1 and pushing it onto stack.`;
		else if (s[0]>0) strr=`I get the currently processed vertex as a last vertex on stack.`;
		if (s[0]<=2 && s[0]>0) strr+=` In adjacency list of this vertex, next vertex is ${this.tr[a][this.ij[a]-1]}.`

		if (s[0]<=1) strr+=` It wasn't processed yet, so I add this vertex to a stack and move forward iterator of the currently processed vertex.`;
		if (s[0]==2) strr+=` It's a parent of this vertex, so it's not in a subtree of current vertex - and so, I only move forward iterator of the current vertex.`;
		if (s[0]==3) strr+=` This vertex does not have any other not processed descendants - so it's considered finished, and it's data is passed to it's parent. Longest path, whose vertex of lowest depth is this vertex has length ${this.dpval[a][0]+this.dpval[a][1]}, and the longest found path up to now was ${this.ans_snapshot[this.ans_snapshot.length-2]} - ${this.ans==this.dpval[a][0]+this.dpval[a][1]?`thus, this is the longest path in a tree found up to now`:`therefore, this is not the longest path in a tree`}. Furthermore, the length of longest path starting in this vertex with lenght increased by 1 (because of adding edge going to parent): ${this.dpval[a][0]+1} is passed to a parent of this vertex - ${para}. ${diams[para][diams[para].length-2][1]>=this.dpval[a][0]+1?`Still, it's not greater number than currently 2nd greatest path starting from parent.`:(diams[para][diams[para].length-2][0]<this.dpval[a][0]+1?`This is the longest path starting from parent going onto it's subtree found up to now, so the old longest path is replaced with new longest path, and old 2nd longest path is replaced with old 1st longest path starting from parent`:`This is the 2nd longest path starting from parent going onto it's subtree found up to now, so the old 2nd longest path is replaced with new 2nd longest path`)} Currently, longest paths starting in it have length ${this.dpval[para][0]} and ${this.dpval[para][1]}.`;
		if (s[0]==100) strr=`Now, b=0: algorithm ends, result is ${this.ans}.`;
		return strr;
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
var eg1=new DiamFinder(feral, 70);
