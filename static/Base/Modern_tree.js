import ArrayUtils from './ArrayUtils.js';

//par - parent, dep-depth, pre - preorder, apre - inverse preorder, sons - subtree size
class Modern_tree{
	constructor(edges, root=1){
		var tree=Modern_tree.edges_to_edge_list(edges)
		this.n=tree.length-1;
		this.root=root;
		this.tr=tree;
		this.edge_list=edges;

		var i=1, j=0, a, b, ip=2;

		this.par=ArrayUtils.steady(this.n+1, 0);
		this.depth=ArrayUtils.steady(this.n+1, 0);
		this.pre=ArrayUtils.steady(this.n+1, 0);
		this.apre=ArrayUtils.steady(this.n+1, 0);
		this.sons=ArrayUtils.steady(this.n+1, 1);

		var s=[root], ij=ArrayUtils.steady(this.n+1, 0).map(function(e,i){return tree[i].length});
		this.kids=ArrayUtils.steady(this.n+1, 0).map(e => []);
		this.depth[root]=0;
		this.pre[root]=1, this.apre[1]=root;

		while(s.length>0){
			a=s[s.length-1];
			if (ij[a]<=0) s.pop();
			else{
				b=tree[a][ij[a]-1];
				if (this.par[a]==b) ij[a]--, this.sons[this.par[a]]+=this.sons[a];
				else{
					ij[a]--;
					this.kids[a].push(b);
					this.depth[b]=this.depth[a]+1;
					this.par[b]=a;
					this.pre[b]=ip;
					this.apre[ip]=b;

					s.push(b);
					ip+=1;
				}
			}
		}
	}

	//Right now assumes n is root
	encode_prufer(){
		this.prufer_code=[];
		this.prufer_removed=[];
		var removed = ArrayUtils.steady(this.n+1, 0);
		var primary=-1, i=1, x, p;

		while (this.prufer_code.length < this.n-2){
			if (primary!=-1){
				x=primary;
				primary=-1;
			}
			else x=i;

			if (this.kids[x].length - removed[x] == 0){
				this.prufer_removed.push(x);
				p = this.par[x];
				this.prufer_code.push(p);
				removed[p]+=1;
				if (this.kids[p].length - removed[p] == 0 && p<i){
					primary=p;
				}
			}
			if (x == i) i+=1;
		}
	}

	//Adds system_depth
	add_on_listed_depths(){
		this.system_depth=ArrayUtils.create_2d(this.n, 0);
		for (var i=1; i<=this.n; i++){
			this.system_depth[this.depth[i]].push(i);
		}
	}

	static edges_to_edge_list(edges){
		var n=edges.length+1, i, a, b;
		var tr=ArrayUtils.create_2d(n+1, 0);

		for (i=0;i<edges.length;i++){
			a=edges[i][0];
			b=edges[i][1];

			tr[a].push(b), tr[b].push(a);
		}
		return tr;
	}

	static tree_reader(input){
		var str=input, edges=[];
		var n=str.get_next();
		for (var i=1; i<n; i++) edges.push([str.get_next(), str.get_next()]);
		return edges;
	}

	get_height(){ return Math.max(...this.depth); }
	get_width(){ 
		this.add_on_listed_depths();
		return Math.max(...this.system_depth.map(x => x.length));
	}
}
export default Modern_tree;
