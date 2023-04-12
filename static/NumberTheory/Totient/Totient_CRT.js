import Partial from '../../Base/Partial.js';
import ArrayUtils from '../../Base/ArrayUtils.js';
import Modern_representation from '../../Base/Modern_representation.js';
import Representation_utils from '../../Base/Representation_utils.js';
import Grid from '../../Base/Grid.js';
import NTMath from '../../Base/NTMath.js';

class Totient_CRT extends Partial{
	presentation(){
		this.place.position='relative';
		this.place.style.width='max-content';
		this.buttons={'upper':null, 'lefty':null};

		var table = Representation_utils.proto_divsCreator(1, this.logic.n+4, [], null, this.place, this.stylistic);
		var grid = new Grid(this.logic.n+3, this.logic.m+3, this.stylistic, {'place':table.zdivs, 'top_margin':1, 'left_margin':1});

		var i, j, color, phi_nm=0;
		for (i=0; i<this.logic.n; i++){
			for (j=0; j<this.logic.m; j++){
				if (NTMath.gcd(this.logic.table[i][j], this.logic.n*this.logic.m) > 1) color = 2;
				else color = 0, phi_nm+=this.logic.redundant[i][j];

				if (this.logic.table[i][j] == 0) grid.single_filler([i, j], `-`, {'color':32});
				else grid.single_filler([i, j], this.logic.table[i][j], {'color':color});
			}
		}

		grid.single_filler([-1, -1], 'n\\m', {'color':5});
		this.buttons.upper = grid.filler([-1, [0, this.logic.m-1]], ArrayUtils.range(0, this.logic.m-1), {'color':101});
		this.buttons.lefty = grid.filler([[0, this.logic.n-1], -1], ArrayUtils.range(0, this.logic.n-1), {'color':101});
		var phi_n = this.logic.n, phi_m = this.logic.m;
		for (i=0; i<this.logic.m; i++){
			if (NTMath.gcd(i, this.logic.m) > 1) Representation_utils.Painter(this.buttons.upper[i], 6), phi_m--;
		}
		for (i=0; i<this.logic.n; i++){
			if (NTMath.gcd(i, this.logic.n) > 1) Representation_utils.Painter(this.buttons.lefty[i], 6), phi_n--;
		}

		var _size=90;
		table.divs[this.logic.n+2].style.display = "none";
		table.divs[this.logic.n+3].style.display = "none";
		grid.single_filler([this.logic.n, -1], `&phi;(${this.logic.n}) = ${phi_n}`, {'color':8, 'stylistic':{'general':{'writing-mode':'vertical-rl'}, 'px':{'height':_size}}});
		grid.single_filler([-1, this.logic.m], `&phi;(${this.logic.m}) = ${phi_m}`, {'color':8, 'stylistic':{'px':{'width':_size}}});
		grid.single_filler([this.logic.n, this.logic.m], `&phi;(${this.logic.n * this.logic.m}) = ${phi_nm}`, {'color':8, 'stylistic':{'px':{'height':_size, 'lineHeight':_size, 'width':_size}}});
	}

	read_data(){
		var c=this.dissolve_input(this.input.value);
		this.logic.n = c.get_next();
		this.logic.m = c.get_next();
	}

	logical_box(){
		this.logic.table = ArrayUtils.create_2d(this.logic.n, this.logic.m);
		this.logic.redundant = ArrayUtils.create_2d(this.logic.n, this.logic.m);

		for (var i=1; i <= this.logic.n * this.logic.m; i++){
			this.logic.redundant[i%this.logic.n][i%this.logic.m]++;
			this.logic.table[i%this.logic.n][i%this.logic.m] = i;
		}
	}

	ShowReality(){
		this.starter();
		this.read_data();
		this.logical_box();
		this.presentation();
	}

	constructor(block, n, m){
		super(block);
		this.logic.n = n;
		this.logic.n = m;
		this.ShowReality();
	}
}

export default Totient_CRT;
