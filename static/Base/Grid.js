import Representation_utils from './Representation_utils.js';
import Modern_representation from './Modern_representation.js';
import Object_utils from './Object_utils.js';
import ArrayUtils from './ArrayUtils.js';

class Grid{
	//Later, perhaps: create grid w/o overlay of divsCreator - no place; left margin, topmargin
	constructor(n, m, style, params={'place':null, 'divs':false}){
		Object_utils.merge(params, {'top_margin':0, 'left_margin':0});

		if (params.place) this.grid=Representation_utils.gridify_div(params.place, n+params.top_margin, m+params.left_margin, style, params.divs);
		else{
			var div_for_grid = Modern_representation.gridmaker(n + params.top_margin);
			this.place = {'full_div':div_for_grid.full_div, 'rows':div_for_grid.rows};

			this.grid = Representation_utils.modern_gridify_div(this.place.rows, n+params.top_margin, m+params.left_margin, style, params.divs);
		}

		this.left_margin=params.left_margin;
		this.top_margin=params.top_margin;
	}

	//positions:[[a,b], c] or [a, [b,c]]; arr: array (iterable) to fill; Dict: color (default 104)
	filler(positions, arr, params){
		var btn, results=[];
		Object_utils.merge(params, {'color':104});

		var is_row=false, to_update, elem;
		if (ArrayUtils.is_iterable(positions[0])){
			is_row=true;
		}
		if (is_row && positions[0][0] > positions[0][1]) return [];
		else if (!is_row && positions[1][0] > positions[1][1]) return [];

		if (is_row) to_update=ArrayUtils.range(positions[0][0], positions[0][1]).map(e => [e, positions[1]]);
		else to_update=ArrayUtils.range(positions[1][0], positions[1][1]).map(e => [positions[0], e]);

		var intertwined=to_update.map((e,i) => [e, arr[i]]);

		for (elem of intertwined){
			var btn=this.grid[elem[0][0]+this.top_margin][elem[0][1]+this.left_margin];
			btn.innerHTML = elem[1];
			Representation_utils.Painter(btn, params.color);
			Modern_representation.button_modifier(btn, params);
			results.push(btn);
		}
		return results;
	}

	single_filler(position, value, params={}){
		Object_utils.merge(params, {'color':104});
		var btn=this.grid[position[0]+this.top_margin][position[1]+this.left_margin];
		if (value!=null) btn.innerHTML=value;
		Representation_utils.Painter(btn, params.color);
		Modern_representation.button_modifier(btn, params);
		return btn;
	}

	get(a, b){
		return this.grid[a+this.top_margin][b+this.left_margin];
	}
}
export default Grid;
