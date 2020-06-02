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
		var tr=[], widvs=[];

		edges=this.getTreeFromInput();
		n=this.n;

		for (i=0;i<=n;i++) tr.push([]), widvs.push(0);

		for (i=0;i<edges.length;i++){
			a=edges[i][0];
			b=edges[i][1];

			tr[a].push(b), tr[b].push(a);
		}

		var params=this.dfsen(n, tr)
		var depth=params[1];
		var par=params[0];


		this.place.style.position="relative";
		for (i=0;i<depth.length;i++){
			for (j=0;j<depth[i].length;j++){
				a=depth[i][j];
				var bt=this.buttCreator(a);
				var dv=document.createElement("DIV");
				floater=(j/depth[i].length+1/(2*depth[i].length));
				widvs[a]=width*floater;

				if (a!=1){
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
}


var feral=Algorithm.ObjectParser(document.getElementById('Algo1'));
var eg1=new Tree(feral);
