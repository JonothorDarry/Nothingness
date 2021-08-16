class PostPhi extends Algorithm{
	_logical_construct_sieve(x){
		var i, j;
		var sieve=ArrayUtils.steady(x+1, 1);
		sieve[0]=sieve[1]=0;

		for (i=2; i*i<=x; i+=1){
			if (sieve[i]==0) continue;
			for (j=i*i; j<=x; j+=i){
				sieve[j]=0;
			}
		}
		return sieve;
	}

	_logical_sievify_sequence(sieve){
		var seq=[], i;
		for (i=2; i<sieve.length; i+=1){
			if (sieve[i]==1) seq.push(i);
		}
		return seq;
	}

	_logical_construct_phi(n, seq, a){
		function Phi(n, layer){
			return {'n':n, 'layer':layer, 'value':null, 'left':null, 'right':null};
		}
		var i, s, p1, p2, elem, h, layerros;

		layerros=ArrayUtils.steady(a+1, 0);
		layerros[a]=[Phi(n, a)];
		for (i=a; i>0; i-=1){
			s=layerros[i].length;
			p1=0, p2=0, h=0;
			layerros[i-1]=[];
			for (; p1<s || p2<s; ){
				if (h>0 && p2<s && (p1>=s || Math.floor(layerros[i][p2].n/seq[i-1]) == layerros[i-1][h-1].n)){
					layerros[i][p2].right=h-1;
					p2+=1;
					continue;
				}
				if (p2 >= s || (layerros[i][p1].n <= Math.floor(layerros[i][p2].n/seq[i-1]))) {
					elem=Phi(layerros[i][p1].n, i-1);
					layerros[i][p1].left=h;
					p1+=1;
				}
				else{
					elem=Phi(Math.floor(layerros[i][p2].n/seq[i-1]), i-1);
					layerros[i][p2].right=h;
					p2+=1;
				}
				layerros[i-1].push(elem);
				h+=1;
			}
		}
		return layerros;
	}

	_logical_go_above(layerros){
		var i, j, a=layerros.length, elem;
		
		for (j=0; j<layerros[0].length; j++){
			layerros[0][j].value=layerros[0][j].n;
		}

		for (i=1; i<a; i+=1){
			for (j=0; j<layerros[i].length; j++){
				elem=layerros[i][j];
				elem.value=layerros[i-1][elem.left].value-layerros[i-1][elem.right].value;
			}
		}
	}


	logical_box(){
		var sieve=this._logical_construct_sieve(this.logic.a*Math.log(this.logic.a)*5);
		this.logic.seq=this._logical_sievify_sequence(sieve);
		this.logic.layers_phis=this._logical_construct_phi(this.logic.n, this.logic.seq, this.logic.a);
		this._logical_go_above(this.logic.layers_phis);
	}

	presentation(){
		var buttons={};
	}

	palingnesia(){
		this.logical_box();
		this.presentation();
	}

	read_data(){
		var fas=this.input.value;
		var c=this.dissolve_input(fas);
		this.logic.n=c.get_next();
		this.logic.a=c.get_next();
	}

	constructor(block, n, a){
		super(block);
		this.logic.n=n;
		this.logic.a=a;
		this.version=4;
		this.palingnesia();
	}

	BeginningExecutor(){
		this.read_data();
		this.palingnesia();
		this.lees.push([0]);
	}

	StateMaker(){
		var l=this.lees.length;
		var s=this.lees[l-1], staat=[], i;
		var staat=this.ephemeral.staat, passer=this.ephemeral.passer;

		if (s[0]==0){
			for (i=0; i<=this.logic.L; i++){
				this.pass_color(this.buttons.counts[i], 0, 1);
			}
		}
	}

	NextState(){
		var l=this.lees.length;
		var s=this.lees[l-1];

		if (s[0]==0) return [100];
	}

	StatementComprehension(){
		var l=this.lees.length;
		var s=this.lees[l-1], x=s[1];

		if (s[0]==0) return `Whatever`;
	}
}

var feral1=Algorithm.ObjectParser(document.getElementById('Algo1'));
var sk1=new PostPhi(feral1, 121, 7);
