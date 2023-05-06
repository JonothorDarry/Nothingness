import Representation_utils from './Representation_utils.js';
import Modern_representation from './Modern_representation.js';

class Graph_utils{
	//Positions+w/h of v1, v2; v1 below; general_params: h/w of an overarching div
	static create_edge(v1_pos, v2_pos, stylistic, general_params){
		var cval, angle; 
		var dv=document.createElement("DIV");
		var width=general_params.width, height=general_params.height;

		dv.style.position="absolute";

		var ln_x=(v1_pos.x-v2_pos.x)*width;
		var ln_y=(v1_pos.y-v2_pos.y)*height;

		cval=Math.sqrt(ln_x*ln_x+ln_y*ln_y);
		dv.style.width=`${cval}px`;
		
		dv.style.top=`${v1_pos.y*100}%`;
		dv.style.left=`${v1_pos.x*100}%`;

		if (!('backgroundColor' in stylistic)) Representation_utils.Painter(dv, 5);
		else dv.style.backgroundColor=stylistic.backgroundColor;
		dv.style.height=`${stylistic.height}px`;
		if ('color' in stylistic) dv.style.backgroundColor=`${stylistic.color}`;

		if (ln_x == 0) angle=-Infinity;
		else angle=ln_y/cval;

		dv.style.transformOrigin="top left";
		if (ln_x == 0){
			if (v1_pos.y < v2_pos.y) dv.style.transform=`rotate(${Math.PI/2}rad)`;
			else dv.style.transform=`rotate(${-Math.PI/2}rad)`;
		}
		else if (ln_x<0) dv.style.transform=`rotate(${-Math.asin(angle)}rad)`;
		else dv.style.transform=`rotate(${Math.asin(angle)-Math.PI}rad)`;

		dv.style.transform += ` translate(0, -${stylistic.height/2}px)`;
		return dv;
	}

	static change_edge_height(edge, height){
		edge.style.transform = edge.style.transform.split('transl')[0] + `translate(0, -${height/2}px)`;
	}

	static button_creator(stylistic, numb=null, col=4){
		var butt=Representation_utils.button_creator(stylistic.nonsense, numb, col);

		if (stylistic.vertex.label == 'none'){
			butt.innerHTML='';
		}
		Modern_representation.style(butt, {'display':'flex', 'justifyContent':'center', 'alignItems':'center'}); //Terrible fix
		butt.style.width=`${stylistic.vertex.width}px`
		butt.style.height=`${stylistic.vertex.height}px`
		butt.style.borderRadius=`${stylistic.vertex.radius}%`;
		if ('color' in stylistic.vertex) butt.style.backgroundColor=`${stylistic.vertex.color}`;

		butt.style.zIndex=1;
		return butt;
	}
	
	/*
	//places the graph
	//Currently nonsensical distinction width-height
	//Additional stuff - among them, buttons

		//this.calculate_position_vertexes();
		var height=place.height;
		var width=place.width;
		var place=place.div;

		var buttons={'vertexes':ArrayUtils.steady(vertex_no, 0), 'edges':ArrayUtils.steady(edge_list.length, 0)};
		if ('vertexes' in additional_stuff) this.buttons.vertexes=additional_stuff.vertexes;

		var vertex_pos=this.parameters.vertexes;
		for (i=1; i<=vertex_no; i++){
			a=i;
			
			if ('vertexes' in additional_stuff){
				bt=this.buttons.vertexes[a];
			}
			else{
				bt=Graph_utils.buttCreator(style, a);
				this.buttons.vertexes[a]=bt;
			}

			//Normalized vertex positions
			bt.style.position="absolute";
			bt.style.top=`calc(${100*this.parameters.vertexes[a].y}% - ${style.vertex.height/2}px)`;
			bt.style.left=`calc(${100*this.parameters.vertexes[a].x}% - ${style.vertex.width/2}px)`;
			this.place.appendChild(bt);
		}

		//edge order - uncanny
		for (i=1; i<=edge_list.length; i++){
			dv=Graph_utils.create_edge(postion[edge_list[i][0]], position[edge_list[i][1]], style);
			this.buttons.edges[i]=dv;
			this.place.appendChild(dv);
		}

	}
	*/
}
export default Graph_utils;
