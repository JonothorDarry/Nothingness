class Tree extends Algorithm{
	constructor(block, wid=100){
		super(block);
		this.treeConstructor(wid);
	}

	BeginningExecutor(){
		this.treeConstructor();
	}

	emergency_resize(){
		if (!('bound_tree' in window)){
			window.bound_tree=[this];
			window.addEventListener('resize', function(){
				for (var j=0; j<window.bound_tree.length; j++){
					var dv_container=this.bound_tree[j].divis;
					for (var i=2; i<dv_container.length; i++){
						var dv=dv_container[i], angle;
						var width=this.bound_tree[j].treeDiv.offsetWidth;
						var th=dv.style['--prec_point_zis']*width, tpar=dv.style['--prec_point_par']*width;
						var cval=Math.sqrt(Math.pow(th-tpar, 2)+120*120);
						dv.style.width=`${cval}px`


						if (th-tpar==0) angle=-Infinity;
						else angle=Math.sin(120/cval);
						if (th-tpar==0) dv.style.transform=`rotate(${-Math.PI/2}rad)`;
						else if (th-tpar<0) dv.style.transform=`rotate(${-Math.asin(angle)}rad)`;
						else dv.style.transform=`rotate(${Math.asin(angle)-Math.PI}rad)`;
					}
				}
			}
			)
		}
		else window.bound_tree.push(this);
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

		var i=0, j=0, a, b, width=this.treeDiv.offsetWidth;

		this.dissolved_input=this.dissolve_input(this.input.value);
		var tr=Modern_tree.tree_reader(this.dissolved_input);

		var namez=['Stack:'];
		this.state_data=[];

		this.buttons.edges=ArrayUtils.steady(this.logic.n+1, null);
		this.buttons.vertexes=ArrayUtils.steady(this.logic.n+1, null);

		this.logic.tree=new Modern_tree(tr);
		this.logic.tree.add_on_listed_depths();

		var depth=this.logic.tree.system_depth;
		var par=this.logic.tree.par;
		var n=this.logic.tree.n;

		for (i=0; i<=n; i++) {
			namez.push(`edges ${i+1}:`);
			this.state_data.push([]);
		}

		var max_depth=Math.max(...this.logic.tree.depth), post_max_depth=max_depth+1;
		
		var magic=160;
		var used_mx=Math.max(post_max_depth*magic, 40*(this.logic.tree.tr.length+1));
		//var tree_height=Math.max(post_max_depth*magic+40-magic, 40*(this.logic.tree.tr.length+1));
		var tree_height=post_max_depth*magic+40-magic;

		this.place.style.height=`${used_mx}px`;
		this.treeDiv.style.height=`${tree_height}px`;
		this.divCreator(tr, namez, this.tabDiv, post_max_depth);

		var present_tree = new Modern_tree_presenter(this.logic.tree);
		present_tree.calculate_position_vertexes();
		present_tree.height=tree_height;
		present_tree.width=width;
		this.tree_presentation=present_tree;

		var vertex_pos=present_tree.parameters.vertexes;
		for (i=0; i<=max_depth; i++){
			for (j=0;j<depth[i].length;j++){
				a=depth[i][j];
				var bt=this.buttCreator(a);
				this.buttons.vertexes[a]=bt;

				if (a!=1){
					var dv=present_tree.create_edge(a);
					this.buttons.edges[a]=dv;
					this.treeDiv.appendChild(dv);
				}

				//Normalized vertex positions
				bt.style.position="absolute";
				bt.style.top=`calc(${100*present_tree.parameters.vertexes[a].y}% - 20px)`;
				bt.style.left=`calc(${100*present_tree.parameters.vertexes[a].x}% - 20px)`;
				this.treeDiv.appendChild(bt);
			}
		}
		this.emergency_resize();
	}

	//Creates buttons
	buttCreator(numb=null, col='#440000'){
		var butt=super.buttCreator(numb, col);
		butt.style.borderRadius="100%";
		return butt;
	}
	

	//Tworzenie jakiegoś zestawu (jak stary binaryExpo) po prawej
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
			for (j=0; j<(i==0?depth:tree[i].length); j++){
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
	buttPositioner(butt, vertex, xaxis, yaxis){
		var props=this.tree_presentation.get_place_for_companion_button(vertex, xaxis, yaxis);
		butt.style.left=props.left;
		butt.style.top=props.top;
	}
}

class DiamFinder extends Tree{
	companionize_buttonize(place, vertex){
		var valar, valar2;
		valar=this.betterButtCreator(0);
		valar2=this.betterButtCreator(0);
		this.buttPositioner(valar, vertex, 1, 1);
		this.buttPositioner(valar2, vertex, 2, 1);
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
		var para=this.logic.tree.par[a];
		this.Painter(this.buttons.vertexes[para], 1);
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

		if (this.ij[para]<this.logic.tree.tr[para].length)
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

		this.lees.push([0, 1]);
		this.ij=[0];
		this.companion=[0];
		this.companion_value=[0];
		this.snapshot=[0];

		for (var i=1; i<=this.logic.tree.n; i++){
			this.ij.push(0);
			this.companionize_buttonize(this.treeDiv, i);
		}
	}

	StateMaker(){
		var l=this.lees.length;
		var s=this.lees[l-1], a, para;

		if (s[0]>=100){
			this.Painter(this.state_data[0][0], 4);
			this.Painter(this.buttons.vertexes[1], 7);
			this.decolor_companion(1);
			return;
		}

		a=s[1];
		this.decolor_companion(a);
		if (a!=1 && s[0]!=3) this.decolor_companion(this.logic.tree.par[a]);

		if (s[0]==0 || s[0]==1){
			this.Painter(this.buttons.vertexes[a], 1);

			this.Painter(this.state_data[0][this.logic.tree.depth[a]], 1);
			if (this.logic.tree.depth[a]>0) this.Painter(this.state_data[0][this.logic.tree.depth[a]-1], 5);
			this.state_data[0][this.logic.tree.depth[a]].innerHTML=a;

			this.Painter(this.state_data[a][this.ij[a]], 1);
			if (a!=1){
				var para=this.logic.tree.par[a];
				this.Painter(this.state_data[para][this.ij[para]-1], 2);
				this.Painter(this.buttons.vertexes[para], 5);
			}
		}

		if (s[0]==2){
			this.Painter(this.state_data[a][this.ij[a]-1], 2);
			if (this.ij[a] < this.logic.tree.tr[a].length) this.Painter(this.state_data[a][this.ij[a]], 1);	
		}

		if (s[0]==3){
			this.Painter(this.buttons.vertexes[a], 7);
			this.Painter(this.state_data[0][this.logic.tree.depth[a]], 4);
			if (this.logic.tree.depth[a]>0) this.Painter(this.state_data[0][this.logic.tree.depth[a]-1], 1);
			if (a!=1) this.reformulate_parent(a);
		}
	}


	StateUnmaker(){
		var l=this.lees.length;
		var s=this.lees[l-1], seminal=this.lees[l-2], a, para;
		a=s[1];

		if (a!=1) var para=this.logic.tree.par[a];

		if (s[0]>=100) 	{
			this.Painter(this.state_data[0][0], 1);
			this.buttons.vertexes[1].style.border="0px none";
			this.Painter(this.buttons.vertexes[1], 1);
		}
		if (s[0]==0 || s[0]==1){
			if (a!=1){
				this.Painter(this.state_data[para][this.ij[para]-1], 1);
				this.Painter(this.buttons.vertexes[para], 1);
			}
			this.Painter(this.state_data[a][this.ij[a]], 0);
			this.Painter(this.buttons.vertexes[a], 0);

			this.Painter(this.state_data[0][this.logic.tree.depth[a]], 4);
			if (this.logic.tree.depth[a]>0) this.Painter(this.state_data[0][this.logic.tree.depth[a]-1], 1);
		}

		if (s[0]==2){
			this.Painter(this.state_data[a][this.ij[a]-1], 1);
			if (this.ij[a]<this.logic.tree.tr[a].length) this.Painter(this.state_data[a][this.ij[a]], 0);
		}

		if (s[0]==3){
			this.Painter(this.buttons.vertexes[a], 1);
			this.Painter(this.state_data[0][this.logic.tree.depth[a]], 1);
			this.state_data[0][this.logic.tree.depth[a]].innerHTML=a;

			if (this.logic.tree.depth[a]>0) this.Painter(this.state_data[0][this.logic.tree.depth[a]-1], 5);

			if (a!=1) {
				para=this.logic.tree.par[a];
				if (this.ij[para]<this.logic.tree.tr[para].length)
					this.Painter(this.state_data[para][this.ij[para]], 0);

				this.Painter(this.buttons.vertexes[para], 5);
				this.snapshot[para].pop();
				this.ans_snapshot.pop();
				this.ans=this.ans_snapshot[this.ans_snapshot.length-1];

				this.companion_value[para]=this.snapshot[para][this.snapshot[para].length-1].slice();
				this.decolor_companion(para);

				this.reformulate_companion(para);
				this.buttons.vertexes[a].style.border="0px none";
			}
		}

		if (seminal[0]==3){
			this.purify_companion(this.logic.tree.par[seminal[1]]);
			para=this.logic.tree.par[seminal[1]];
		}

		super.StateUnmaker();
		a=seminal[1];
		if (seminal[0]==3) a=this.logic.tree.par[seminal[1]];
		if (seminal[0]!=4) this.ij[a]-=1;
	}


	NextState(){
		var l=this.lees.length;
		var s=this.lees[l-1], a, v0;
		if (s[0]==100) return;
		a=s[1];
		if (s[0]==3) a=this.logic.tree.par[a];
		v0=this.ij[a];

		if (v0>=this.logic.tree.tr[a].length && a==1) this.lees.push([100]);
		else if (v0>=this.logic.tree.tr[a].length) this.lees.push([3, a]);
		else if (this.logic.tree.tr[a][v0]==this.logic.tree.par[a]) this.lees.push([2, a]);
		else this.lees.push([1, this.logic.tree.tr[a][v0]]);
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
			if (prev[0]==3) a=this.logic.tree.par[a];
		}

		if (a!=1) var para=this.logic.tree.par[a];

		var strr=``;
		if (s[0]==0) strr=`Firstly, edge list is rewritten to an adjacency list for simplicity. I start searching through tree by processing arbitrary root r=1 and pushing it onto stack.`;
		else if (s[0]>0) strr=`I get the currently processed vertex as a last vertex on stack. - ${a}`;
		if (s[0]<=2 && s[0]>0) strr+=` In adjacency list of this vertex, next vertex is ${this.logic.tree.tr[a][this.ij[a]-1]}.`

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
		this.newDivCreator(this.place, this.logic.tree.n, 'Inverse Preorder:');
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
		var para=this.logic.tree.par[a];
		this.Painter(this.buttons.vertexes[para], 1);
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

		if (this.ij[para]<this.logic.tree.tr[para].length)
			this.Painter(this.state_data[para][this.ij[para]], 1);
	}

	//Add data from son to parent
	reformulate_son(a){
		var para=this.logic.tree.par[a];
		this.Painter(this.buttons.vertexes[a], 1);

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

		if (this.ij[para]<this.logic.tree.tr[para].length)
			this.Painter(this.state_data[para][this.ij[para]], 1);
	}


	companionize_buttonize(place, vertex){
		var valar, valar2, valar3;
		valar=this.betterButtCreator("-&infin;");
		valar2=this.betterButtCreator("-&infin;");
		valar3=this.betterButtCreator(-1);

		this.buttPositioner(valar, vertex, 1, 1);
		this.buttPositioner(valar2, vertex, 2, 1);
		this.buttPositioner(valar3, vertex, 1, 2);

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
		for (var i=0; i<=this.logic.tree.n; i++) this.preorder.push(0);
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

		a=s[1], para=this.logic.tree.par[a];
		v0=this.ij[para];
		if (s[0]==3 && para==1 && v0>=this.logic.tree.tr[para].length) this.lees.push([4, this.inverse_preorder[1]]), this.ij[para]+=1;
		else if (s[0]==4 && this.preorder[a]+1 < this.logic.tree.n) this.lees.push([4, this.inverse_preorder[this.preorder[a]+1]]);
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
			if (seminal[0]==4) this.Painter(this.buttons.vertexes[seminal[1]], 7), this.decolor_companion(seminal[1]);
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
			this.Painter(this.buttons.vertexes[a], 6);
		}

		if (s[0]==4){
			this.Painter(this.state_data[0][0], 4);
			this.Painter(this.inv_pre_tree_vertex[this.preorder[a]-1], 2);
			this.Painter(this.inv_pre_tree_vertex[this.preorder[a]], 1);
			this.reformulate_son(a);
			if (seminal[0]==4) this.decolor_companion(seminal[1]);

			if (seminal[0]==4) this.Painter(this.buttons.vertexes[seminal[1]], 7);
			else {
				this.Painter(this.buttons.vertexes[1], 7);
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
				this.Painter(this.buttons.vertexes[seminal[1]], 1);
				this.purify_companion(seminal[1]);
			}
			else {
				this.Painter(this.inv_pre_tree_vertex[this.preorder[a]-1], 0);
				this.Painter(this.buttons.vertexes[1], 1);
				this.Painter(this.state_data[0][0], 1);
			}
			this.Painter(this.buttons.vertexes[a], 6);

			this.snapshot[a].pop();
			this.companion_value[a]=this.snapshot[a][this.snapshot[a].length-1].slice();
			this.reformulate_companion(a);
			this.decolor_companion(a);
		}

		super.StateUnmaker();
		if (s[0]>=100)	{
			this.Painter(this.state_data[0][0], 4);
			var seminal=this.lees[l-2];
			this.Painter(this.buttons.vertexes[1], 7);
			this.Painter(this.buttons.vertexes[seminal[1]], 1);
			this.purify_companion(seminal[1]);
			this.Painter(this.inv_pre_tree_vertex[this.preorder[seminal[1]]], 1);
		}
	}
}

var feral=Algorithm.ObjectParser(document.getElementById('Algo1'));
var eg1=new DiamFinder(feral, 70);

var feral2=Algorithm.ObjectParser(document.getElementById('Algo2'));
var eg2=new DoubleWalk(feral2, 70);
/*
15
1 2
2 3
2 4
4 5
4 6
1 7
1 8
8 9
8 10
10 11
10 12
10 13
10 14
10 15



4
1 2
1 3
1 4
*/
