class Tree extends Algorithm{
	constructor(block, wid=100){
		super(block);
		this.treeConstructor(wid);
	}

	BeginningExecutor(){
		this.place.innerHTML="";
		this.treeConstructor();
	}

	//Tworzy drzewo o zadanym widthu, obok niego stacks razem z sąsiedztwem
	//tree_vertex - wierzchołek drzewa
	//companion data - informacja przy vertexie
	treeConstructor(wid=70){
		this.place.style.position="relative";
		this.treeDiv=document.createElement("DIV");
		this.treeDiv.style.position="relative";
		this.treeDiv.style.width=`${wid}%`;
		this.treeDiv.style.display="inline-block";
		this.place.appendChild(this.treeDiv);

		this.tabDiv=document.createElement("DIV");
		this.tabDiv.style.position="relative";
		this.tabDiv.style.width=`${99-wid}%`;
		this.tabDiv.style.display="inline-block";
		this.place.appendChild(this.tabDiv);

		var n, i=0, j=0, a, b, width=this.treeDiv.offsetWidth, floater, angle, cval;
		var edges=[[1, 2], [3, 4], [2, 4], [3, 5], [3, 6], [3, 7]];
		var widvs=[];	
		var precise_wid=[];
		this.tr=[];
		this.width=width/100;

		this.dissolved_input=this.dissolve_input(this.input.value);
		edges=this.get_tree_from_input(this.dissolved_input);
		n=this.n;

		this.tree_vertex=[];
		this.divis=[];
		this.buttData=[];
		var namez=['Stack:'];
		this.state_data=[];

		for (i=0;i<=n;i++) {
			this.tr.push([]), this.tree_vertex.push(0), this.divis.push(0);
			this.buttData.push(0), widvs.push(0), precise_wid.push(0);
			namez.push(`edges ${i+1}:`)
			this.state_data.push([])
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
				this.place.style.height=`${Math.max(i*75, 40*(this.tr.length+1))}px`;
				this.treeDiv.style.height=`${i*75+40-75}px`;
				this.divCreator(this.tr, namez, this.tabDiv, i);
				break;
			}
			for (j=0;j<depth[i].length;j++){
				a=depth[i][j];
				var bt=this.buttCreator(a);
				this.tree_vertex[a]=bt;

				floater=(j/depth[i].length+1/(2*depth[i].length));
				widvs[a]=width*floater;
				precise_wid[a]=floater;


				if (a!=1){
					var dv=document.createElement("DIV");
					this.divis[a]=dv;

					dv.style.position="absolute";
					cval=Math.sqrt(Math.pow(widvs[a]-widvs[par[a]], 2)+75*75);
					dv.style['--prec_point_zis']=precise_wid[a];
					dv.style['--prec_point_par']=precise_wid[par[a]];
					dv.style.width=`${cval}px`;
					
					dv.tree_reference=this.treeDiv;


					if (!('bound_tree' in window)){
						window.bound_tree=[this];
						window.addEventListener('resize', function(){
							for (var j=0;j<window.bound_tree.length;j++){
								var dv_container=this.bound_tree[j].divis;
								for (var i=2;i<dv_container.length;i++){
									var dv=dv_container[i], angle;
									var width=this.bound_tree[j].treeDiv.offsetWidth;
									var th=dv.style['--prec_point_zis']*width, tpar=dv.style['--prec_point_par']*width;
									var cval=Math.sqrt(Math.pow(th-tpar, 2)+75*75);
									dv.style.width=`${cval}px`


									if (th-tpar==0) angle=-Infinity;
									else angle=Math.sin(75/cval);
									if (th-tpar==0) dv.style.transform=`rotate(${-Math.PI/2}rad)`;
									else if (th-tpar<0) dv.style.transform=`rotate(${-Math.asin(angle)}rad)`;
									else dv.style.transform=`rotate(${Math.asin(angle)-Math.PI}rad)`;
								}
							}
						}
						)
					}
					else window.bound_tree.push(this);

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

	get_tree_from_input(){
		var str=this.dissolved_input, edges=[];
		var n=str.get_next();
		this.n=n;
		for (var i=1; i<n; i++) edges.push([str.get_next(), str.get_next()]);
		return edges;

	};
	
	
	//Creates buttons
	buttCreator(numb=null, col='#440000'){
		var butt=super.buttCreator(numb, col);
		butt.style.borderRadius="100%";
		return butt;
	}
	

	//Tworzenie jakiegoś zestawu (jak binaryExpo) po prawej
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
				zdivs[i][j].style.display="inline-block";
				divs[i].appendChild(zdivs[i][j]);
			}
			zdivs[i][0].innerHTML=namez[i];
			zdivs[i][0].style.width="200px";
			//zdivs[i][1].style.width="50px";

			local.appendChild(divs[i]);

			//Tworzenie buttonów z prawej: 0 - stos, 1-n: ijs
			for (j=0;j<(i==0?depth:tree[i].length);j++){
				if (i>0) btn=this.buttCreator(tree[i][j]);
				else btn=this.buttCreator(0);
				btn.style.borderRadius="0%";
				if (i==0) this.Painter(btn, 4);
				
				this.state_data[i].push(btn);
				zdivs[i][1].appendChild(btn);
			}
		}
		this.divs=divs;
		this.zdivs=zdivs;
	}

	//Pozycja buttona od lewej jako funkcja miejsca vertexa(perc_left, px_top) i miejsca - góra: +1 -> +Inf, dół: -1 -> -Inf, analogicznie l/p
	//Założenie: butt dodatkowy jest kwadratem 20x20
	buttPositioner(butt, perc_left, px_top, xaxis, yaxis){
		if (xaxis>0)	butt.style.left=`calc(${perc_left}% + ${40/Math.sqrt(2)+20*(xaxis-1)}px)`;
		else 		butt.style.left=`calc(${perc_left}% + ${-40+40/Math.sqrt(2)-20*(-xaxis-1)}px)`;

		if (yaxis>0)	butt.style.top=`${px_top-20/Math.sqrt(2)-20*(yaxis-1)}px`;
		else		butt.style.top=`${px_top+20+20/Math.sqrt(2)+20*(-yaxis-1)}px`;
	}
}

class DiamFinder extends Tree{
	companionize_buttonize(place, x, y){
		var valar, valar2;
		valar=this.betterButtCreator(0);
		valar2=this.betterButtCreator(0);
		this.buttPositioner(valar, x, y, 1, 1);
		this.buttPositioner(valar2, x, y, 2, 1);
		this.companion.push([valar, valar2]);
		this.companion_value.push([0, 0]);
		this.snapshot.push([[0, 0]]);

		this.treeDiv.appendChild(valar);
		this.treeDiv.appendChild(valar2);
	}

	//Just change companion according to current values
	reformulate_companion(a){
		for (var j=0;j<2;j++) this.companion[a][j].innerHTML=this.companion_value[a][j];
	}
	//Add data from son to parent
	reformulate_parent(a){
		var para=this.par[a];
		this.Painter(this.tree_vertex[para], 1);
		if (this.companion_value[para][0]<this.companion_value[a][0]+1){
			this.companion_value[para][1]=this.companion_value[para][0];
			this.companion_value[para][0]=this.companion_value[a][0]+1;
			this.Painter(this.companion[para][0], 1);
		}
		else if (this.companion_value[para][1]<this.companion_value[a][0]+1){
			this.companion_value[para][1]=this.companion_value[a][0]+1;
			this.Painter(this.companion[para][1], 1);
		}
		this.snapshot[para].push(this.companion_value[para].slice());
		this.reformulate_companion(para);

		if (this.companion_value[para][0]+this.companion_value[para][1]>this.ans)
			this.ans=this.companion_value[para][0]+this.companion_value[para][1];
		this.ans_snapshot.push(this.ans);

		if (this.ij[para]<this.tr[para].length)
			this.Painter(this.state_data[para][this.ij[para]], 1);
	}
	
	//No more color
	decolor_companion(a){
		this.Painter(this.companion[a][0], 0);
		this.Painter(this.companion[a][1], 0);
	}

	//Throw companion back to times of splendor
	purify_companion(a){
		var old_diam=this.snapshot[a][this.snapshot[a].length-2].slice();
		var new_diam=this.snapshot[a][this.snapshot[a].length-1].slice();
		if (old_diam[0]!=new_diam[0]) this.Painter(this.companion[a][0], 1);
		else if (old_diam[1]!=new_diam[1]) this.Painter(this.companion[a][1], 1);
	}

	BeginningExecutor(){
		super.BeginningExecutor();
		this.ans=0;
		this.ans_snapshot=[0];
		var dimension, x, y, x2;

		this.lees=[];
		this.lees.push([0, 1]);
		this.ij=[0];
		this.companion=[0];
		this.companion_value=[0];
		this.snapshot=[0];

		for (var i=1;i<=this.n;i++){
			this.ij.push(0);

			y=this.buttData[i].top;
			x=this.buttData[i].left
			this.companionize_buttonize(this.treeDiv, x, y);
		}
	}

	StateMaker(){
		var l=this.lees.length;
		var s=this.lees[l-1], a, para;

		if (s[0]>=100){
			this.Painter(this.state_data[0][0], 4);
			this.Painter(this.tree_vertex[1], 7);
			this.decolor_companion(1);
			return;
		}

		a=s[1];
		this.decolor_companion(a);
		if (a!=1 && s[0]!=3) this.decolor_companion(this.par[a]);

		if (s[0]==0 || s[0]==1){
			this.Painter(this.tree_vertex[a], 1);

			this.Painter(this.state_data[0][this.dep[a]], 1);
			if (this.dep[a]>0) this.Painter(this.state_data[0][this.dep[a]-1], 5);
			this.state_data[0][this.dep[a]].innerHTML=a;

			this.Painter(this.state_data[a][this.ij[a]], 1);
			if (a!=1){
				var para=this.par[a];
				this.Painter(this.state_data[para][this.ij[para]-1], 2);
				this.Painter(this.tree_vertex[para], 5);
			}
		}

		if (s[0]==2){
			this.Painter(this.state_data[a][this.ij[a]-1], 2);
			if (this.ij[a]<this.tr[a].length) this.Painter(this.state_data[a][this.ij[a]], 1);	
		}

		if (s[0]==3){
			this.Painter(this.tree_vertex[a], 7);
			this.Painter(this.state_data[0][this.dep[a]], 4);
			if (this.dep[a]>0) this.Painter(this.state_data[0][this.dep[a]-1], 1);
			if (a!=1) this.reformulate_parent(a);
		}
	}


	StateUnmaker(){
		var l=this.lees.length;
		var s=this.lees[l-1], seminal=this.lees[l-2], a, para;
		a=s[1];

		if (a!=1) var para=this.par[a];

		if (s[0]>=100) 	{
			this.Painter(this.state_data[0][0], 1);
			this.tree_vertex[1].style.border="0px none";
			this.Painter(this.tree_vertex[1], 1);
		}
		if (s[0]==0 || s[0]==1){
			if (a!=1){
				this.Painter(this.state_data[para][this.ij[para]-1], 1);
				this.Painter(this.tree_vertex[para], 1);
			}
			this.Painter(this.state_data[a][this.ij[a]], 0);
			this.Painter(this.tree_vertex[a], 0);

			this.Painter(this.state_data[0][this.dep[a]], 4);
			if (this.dep[a]>0) this.Painter(this.state_data[0][this.dep[a]-1], 1);
		}

		if (s[0]==2){
			this.Painter(this.state_data[a][this.ij[a]-1], 1);
			if (this.ij[a]<this.tr[a].length) this.Painter(this.state_data[a][this.ij[a]], 0);
		}

		if (s[0]==3){
			this.Painter(this.tree_vertex[a], 1);
			this.Painter(this.state_data[0][this.dep[a]], 1);
			this.state_data[0][this.dep[a]].innerHTML=a;

			if (this.dep[a]>0) this.Painter(this.state_data[0][this.dep[a]-1], 5);

			if (a!=1) {
				para=this.par[a];
				if (this.ij[para]<this.tr[para].length)
					this.Painter(this.state_data[para][this.ij[para]], 0);

				this.Painter(this.tree_vertex[para], 5);
				this.snapshot[para].pop();
				this.ans_snapshot.pop();
				this.ans=this.ans_snapshot[this.ans_snapshot.length-1];

				this.companion_value[para]=this.snapshot[para][this.snapshot[para].length-1].slice();
				this.decolor_companion(para);

				this.reformulate_companion(para);
				this.tree_vertex[a].style.border="0px none";
			}
		}

		if (seminal[0]==3){
			this.purify_companion(this.par[seminal[1]]);
			para=this.par[seminal[1]];
		}

		this.lees.pop();
		a=seminal[1];
		if (seminal[0]==3) a=this.par[seminal[1]];
		if (seminal[0]!=4) this.ij[a]-=1;
	}


	NextState(){
		var l=this.lees.length;
		var s=this.lees[l-1], a, v0;
		if (s[0]==100) return;
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
		var snapshot=this.snapshot;
		if (l>1) var prev=this.lees[l-2];

		var a=0;
		if (l==1) a=s[1];
		else {
			a=prev[1];
			if (prev[0]==3) a=this.par[a];
		}

		if (a!=1) var para=this.par[a];

		var strr=``;
		if (s[0]==0) strr=`Firstly, edge list is rewritten to an adjacency list for simplicity. I start searching through tree by processing arbitrary root r=1 and pushing it onto stack.`;
		else if (s[0]>0) strr=`I get the currently processed vertex as a last vertex on stack. - ${a}`;
		if (s[0]<=2 && s[0]>0) strr+=` In adjacency list of this vertex, next vertex is ${this.tr[a][this.ij[a]-1]}.`

		if (s[0]<=1) strr+=` It wasn't processed yet, so I add this vertex to a stack and move forward iterator of the currently processed vertex.`;
		if (s[0]==2) strr+=` It's a parent of this vertex, so it's not in a subtree of current vertex - and so, I only move forward iterator of the current vertex.`;
		if (s[0]==3) strr+=` This vertex does not have any other not processed descendants - so it's considered finished, and it's data is passed to it's parent. Longest path, whose vertex of lowest depth is this vertex has length ${this.companion_value[a][0]+this.companion_value[a][1]}, and the longest found path up to now was ${this.ans_snapshot[this.ans_snapshot.length-2]} - ${this.ans_snapshot[this.ans_snapshot.length-2]==this.companion_value[a][0]+this.companion_value[a][1]?`thus, this is the longest path in a tree found up to now`:`therefore, this is not the longest path in a tree`}. Furthermore, the length of longest path starting in this vertex with lenght increased by 1 (because of adding edge going to parent): ${this.companion_value[a][0]+1} is passed to a parent of this vertex - ${para}. ${snapshot[para][snapshot[para].length-2][1]>=this.companion_value[a][0]+1?`Still, it's not greater number than currently 2nd greatest path starting from parent.`:(snapshot[para][snapshot[para].length-2][0]<this.companion_value[a][0]+1?`This is the longest path starting from parent going onto it's subtree found up to now, so the old longest path is replaced with new longest path, and old 2nd longest path is replaced with old 1st longest path starting from parent`:`This is the 2nd longest path starting from parent going onto it's subtree found up to now, so the old 2nd longest path is replaced with new 2nd longest path`)}. Currently, longest paths starting in it have length ${this.companion_value[para][0]} and ${this.companion_value[para][1]}.`;
		if (s[0]==100) strr=`Now stack is empty, algorithm ends, result is ${this.ans}.`;
		return strr;
	}

	betterButtCreator(numb=null, col='#440000'){
		var butt=super.buttCreator(numb, col);
		butt.style.width="20px";
		butt.style.height="20px";
		butt.style.borderRadius="0%";
		butt.style.position="absolute";

		return butt;
	}
}

class DoubleWalk extends DiamFinder{
	treeConstructor(wid=70){
		super.treeConstructor(wid);
		this.newDivCreator(this.place, this.n, 'Inverse Preorder:');
		var m=this.dissolved_input.get_next();
		this.marked=[];
		for (var i=0; i<m; i++) this.marked.push(this.dissolved_input.get_next());
		//this.marked=[3, 7, 2, 5];
	}
	
	
	reformulate_companion(a){
		for (var j=0;j<3;j++){
			if (this.companion_value[a][j]>=-1) this.companion[a][j].innerHTML=this.companion_value[a][j];
			else this.companion[a][j].innerHTML="-&infin;";
		}
	}
	//Add data from son to parent
	reformulate_parent(a){
		var para=this.par[a];
		this.Painter(this.tree_vertex[para], 1);
		if (this.companion_value[a][0]>=0){
			if (this.companion_value[para][0]<this.companion_value[a][0]+1){
				this.companion_value[para][1]=this.companion_value[para][0];
				this.companion_value[para][0]=this.companion_value[a][0]+1;
				this.companion_value[para][2]=a;
				this.Painter(this.companion[para][0], 1);
				this.Painter(this.companion[para][2], 1);
			}
			else if (this.companion_value[para][1]<this.companion_value[a][0]+1){
				this.companion_value[para][1]=this.companion_value[a][0]+1;
				this.Painter(this.companion[para][1], 1);
			}
			this.reformulate_companion(para);
		}
		this.snapshot[para].push(this.companion_value[para].slice());

		if (this.ij[para]<this.tr[para].length)
			this.Painter(this.state_data[para][this.ij[para]], 1);
	}

	//Add data from son to parent
	reformulate_son(a){
		var para=this.par[a];
		this.Painter(this.tree_vertex[a], 1);

		if (this.companion_value[para][0]>=0){
			if (this.companion_value[para][2]!=a){
				this.companion_value[a][1]=this.companion_value[a][0];
				this.companion_value[a][0]=this.companion_value[para][0]+1;
				this.companion_value[a][2]=para;
				this.Painter(this.companion[a][0], 1);
				this.Painter(this.companion[a][2], 1);
			}
			else if (this.companion_value[para][1]+1>this.companion_value[a][0]){
				this.companion_value[a][1]=this.companion_value[a][0];
				this.companion_value[a][0]=this.companion_value[para][1]+1;
				this.companion_value[a][2]=para;
				this.Painter(this.companion[a][0], 1);
				this.Painter(this.companion[a][2], 1);
			}
			else if (this.companion_value[para][1]+1>this.companion_value[a][1]){
				this.companion_value[a][1]=this.companion_value[para][1]+1;
				this.Painter(this.companion[a][1], 1);
			}
			this.reformulate_companion(a);
		}
		this.snapshot[a].push(this.companion_value[a].slice());

		if (this.ij[para]<this.tr[para].length)
			this.Painter(this.state_data[para][this.ij[para]], 1);
	}


	companionize_buttonize(place, x, y){
		var valar, valar2, valar3;
		valar=this.betterButtCreator("-&infin;");
		valar2=this.betterButtCreator("-&infin;");
		valar3=this.betterButtCreator(-1);

		this.buttPositioner(valar, x, y, 1, 1);
		this.buttPositioner(valar2, x, y, 2, 1);
		this.buttPositioner(valar3, x, y, 1, 2);

		this.companion.push([valar, valar2, valar3]);
		this.companion_value.push([-1000000000, -1000000000, -1]);
		this.snapshot.push([[-1000000000, -1000000000, -1]]);

		this.treeDiv.appendChild(valar);
		this.treeDiv.appendChild(valar2);
		this.treeDiv.appendChild(valar3);
	}

	decolor_companion(a){
		this.Painter(this.companion[a][0], 0);
		this.Painter(this.companion[a][1], 0);
		this.Painter(this.companion[a][2], 0);
	}
	
	//Throw companion back to times of splendor
	purify_companion(a){
		var old_max=this.snapshot[a][this.snapshot[a].length-2].slice();
		var new_max=this.snapshot[a][this.snapshot[a].length-1].slice();
		if (old_max[0]!=new_max[0]) this.Painter(this.companion[a][0], 1), this.Painter(this.companion[a][2], 1);
		else if (old_max[1]!=new_max[1]) this.Painter(this.companion[a][1], 1);
	}

	BeginningExecutor(){
		super.BeginningExecutor();
		this.inverse_preorder=[];
		this.preorder=[];
		var a;
		for (var i=0;i<this.marked.length;i++){
			this.preorder.push(0);
			a=this.marked[i];

			this.snapshot[a].push([0, -1000000000, a]);
			this.companion_value[a][0]=0;
			this.companion_value[a][2]=a;
			this.reformulate_companion(a);
		}
		for (var i=0; i<=this.n; i++)	this.preorder.push(0);
	}

	newDivCreator(local, n, name){
		var inv_pre_full, inv_pre=[], i, j;
		var btn;

		inv_pre_full=document.createElement("DIV");
		inv_pre_full.style.width="100%";
		inv_pre_full.style.height="40px";

		for (j=0;j<2;j++) {
			inv_pre.push(document.createElement("DIV"));
			inv_pre[j].style.margin="0";
			inv_pre[j].style.padding="0";
			inv_pre[j].style.display="inline-block";
			inv_pre_full.appendChild(inv_pre[j]);
		}
		inv_pre[0].innerHTML=name;
		inv_pre[0].style.width="200px";
		local.appendChild(inv_pre_full);

		this.inv_pre_tree_vertex=[];
		for (j=1;j<=n;j++){
			btn=this.buttCreator(0);
			btn.style.borderRadius="0%";
			this.Painter(btn, 4);
			
			this.inv_pre_tree_vertex.push(btn)
			inv_pre[1].appendChild(btn)
		}
		this.last_inv_pre=0;
	}

	NextState(){
		var l=this.lees.length;
		var s=this.lees[l-1], v0, a, para;
		if (s[0]==100) return;

		a=s[1], para=this.par[a];
		v0=this.ij[para];
		if (s[0]==3 && para==1 && v0>=this.tr[para].length) this.lees.push([4, this.inverse_preorder[1]]), this.ij[para]+=1;
		else if (s[0]==4 && this.preorder[a]+1 < this.n) this.lees.push([4, this.inverse_preorder[this.preorder[a]+1]]);
		else if (s[0]==4) this.lees.push([100]);
		else super.NextState();
	}

	StateMaker(){
		super.StateMaker();
		var l=this.lees.length;
		var s=this.lees[l-1], seminal=this.lees[l-2], a, v0, para;

		if (this.last_inv_pre>0)
			this.Painter(this.inv_pre_tree_vertex[this.last_inv_pre-1], 0);

		if (s[0]>=100){
			this.Painter(this.inv_pre_tree_vertex[this.last_inv_pre-1], 2);
			if (seminal[0]==4) this.Painter(this.tree_vertex[seminal[1]], 7), this.decolor_companion(seminal[1]);
			return;
		}
		a=s[1];

		if (s[0]==0 || s[0]==1){
			this.Painter(this.inv_pre_tree_vertex[this.last_inv_pre], 1);
			this.inv_pre_tree_vertex[this.last_inv_pre].innerHTML=a;
			this.inverse_preorder.push(a);
			this.preorder[a]=this.last_inv_pre;
			this.last_inv_pre++;
		}

		if (s[0]==3){
			this.Painter(this.tree_vertex[a], 6);
		}

		if (s[0]==4){
			this.Painter(this.state_data[0][0], 4);
			this.Painter(this.inv_pre_tree_vertex[this.preorder[a]-1], 2);
			this.Painter(this.inv_pre_tree_vertex[this.preorder[a]], 1);
			this.reformulate_son(a);
			if (seminal[0]==4) this.decolor_companion(seminal[1]);

			if (seminal[0]==4) this.Painter(this.tree_vertex[seminal[1]], 7);
			else {
				this.Painter(this.tree_vertex[1], 7);
			}
		}
	}

	StatementComprehension(){}

	StateUnmaker(){
		var l=this.lees.length;
		var s=this.lees[l-1], seminal=this.lees[l-2], a, v0, para;
		a=s[1];

		if (s[0]==0 || s[0]==1){
			this.last_inv_pre--;
			this.Painter(this.inv_pre_tree_vertex[this.last_inv_pre], 4);
		}
		if (seminal[0]==0 || seminal[0]==1){
			this.Painter(this.inv_pre_tree_vertex[this.last_inv_pre-1], 1);
		}

		if (s[0]==4){
			var seminal=this.lees[l-2];
			this.Painter(this.inv_pre_tree_vertex[this.preorder[a]], 0);
			if (seminal[0]==4) {
				this.Painter(this.inv_pre_tree_vertex[this.preorder[a]-1], 1);
				this.Painter(this.tree_vertex[seminal[1]], 1);
				this.purify_companion(seminal[1]);
			}
			else {
				this.Painter(this.inv_pre_tree_vertex[this.preorder[a]-1], 0);
				this.Painter(this.tree_vertex[1], 1);
				this.Painter(this.state_data[0][0], 1);
			}
			this.Painter(this.tree_vertex[a], 6);

			this.snapshot[a].pop();
			this.companion_value[a]=this.snapshot[a][this.snapshot[a].length-1].slice();
			this.reformulate_companion(a);
			this.decolor_companion(a);
		}

		super.StateUnmaker();
		if (s[0]>=100)	{
			this.Painter(this.state_data[0][0], 4);
			var seminal=this.lees[l-2];
			this.Painter(this.tree_vertex[1], 7);
			this.Painter(this.tree_vertex[seminal[1]], 1);
			this.purify_companion(seminal[1]);
			this.Painter(this.inv_pre_tree_vertex[this.preorder[seminal[1]]], 1);
		}
	}
}

var feral=Algorithm.ObjectParser(document.getElementById('Algo1'));
var eg1=new DiamFinder(feral, 70);

var feral2=Algorithm.ObjectParser(document.getElementById('Algo2'));
var eg2=new DoubleWalk(feral2, 70);
