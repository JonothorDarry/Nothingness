import ArrayUtils from './ArrayUtils.js';
import Modern_representation from './Modern_representation.js'

class Representation_utils{
	//mode: 1 - buttons, 2 - midian button, 4 - text (logical or), midian - width of middle
	static title_id='title';
	static single_id='midian'
	static buttons_id='buttons';
	static proto_divsCreator(mode, number_of_rows, title_list, midian, to_add, style){
		var divs=[], zdivs=[], i, j, mode_title=(((mode&4)>0)?1:0), mode_single=(((mode&2)>0)?1:0), mode_butts=mode&1;
		var elems=[];
		if (mode_title==1) elems.push(Representation_utils.title_id);
		if (mode_single==1) elems.push(Representation_utils.single_id);
		if (mode_butts==1) elems.push(Representation_utils.buttons_id);

		var full_div=document.createElement("DIV");
		for (i=0;i<number_of_rows;i++) divs.push(document.createElement("DIV")), zdivs.push([]);
		for (i=0;i<number_of_rows;i++){
			divs[i].style.height=style.bs_butt_height;
			//zdivs - inside div: 0 is write-up, 1 is button
			for (j of elems) {
				zdivs[i][j]=document.createElement("DIV");
				zdivs[i][j].style.margin="0";
				zdivs[i][j].style.padding="0";
				zdivs[i][j].style.display="inline-block";
				divs[i].appendChild(zdivs[i][j]);
			}
			if (mode_title==1) {
				zdivs[i][Representation_utils.title_id].innerHTML=title_list[i];
				zdivs[i][Representation_utils.title_id].style.width = '200px';
			}
			if (mode_single==1) zdivs[i][Representation_utils.single_id].style.width=midian;
			if (mode_butts==1) zdivs[i][Representation_utils.buttons_id].style.position="relative";

			full_div.appendChild(divs[i]);
		}
		if (to_add!=null) to_add.appendChild(full_div);

		return {'zdivs':zdivs, 'divs':divs, 'full_div':full_div}
	}

	static gridlike_divs_creator(number_of_rows, to_add, style){
		return Representation_utils.proto_divsCreator(1, number_of_rows, [], null, to_add, style);
	}

	//place_coordinates: pair {x:x, y:y}
	static get_place_for_companion_button(place_coordinates, x_axis, y_axis, diameter = 40, button_properties={'width':20, 'height':20}){
		var place={};
		var radius=Math.floor(diameter/2);
		var small_radius = Math.floor(button_properties.width/2);
		var sqrt2 = Math.sqrt(2);

		//if (x_axis>0) place.left = place_coordinates.x + diameter/Math.sqrt(2) + button_properties.width*(x_axis-1) - radius;
		if (x_axis>0) place.left = place_coordinates.x + button_properties.width*(x_axis-1) + radius/sqrt2;
		else place.left = place_coordinates.x - radius/sqrt2 - button_properties.width*(-x_axis);

		if (y_axis>0) place.top = place_coordinates.y - button_properties.height*(y_axis-1) - (radius+small_radius)/sqrt2 - small_radius;
		else place.top = place_coordinates.y + radius/sqrt + button_properties.height*(-y_axis-1);
		return place;
	}

	static gridify_div(place, n, m, style, divs = false){
		var i, j, btn;
		var grid=ArrayUtils.create_2d(n, m);

		for (i=0; i<n; i++){
			for (j=0; j<m; j++){
				if (!divs) btn=Representation_utils.button_creator(style);
				else btn=Modern_representation.div_creator('', {});

				place[i].buttons.appendChild(btn);
				grid[i][j]=btn;
			}
		}
		return grid;
	}

	static modern_gridify_div(place, n, m, style){ //style: {general, px, ...}
		var i, j, btn;
		var grid=ArrayUtils.create_2d(n, m);

		for (i=0; i<n; i++){
			for (j=0; j<m; j++){
				btn=Modern_representation.button_creator('', style);

				place[i].appendChild(btn);
				grid[i][j]=btn;
			}
		}
		return grid;
	}
	

	static Painter(btn, col=1, only_bg=0){
		Modern_representation.Painter(btn, col, only_bg);
	}
	
	//Creates buttons
	static button_creator(style, numb=null, col=0){
		var btn = Modern_representation.button_creator(((numb!=null)?numb:''), {
			'general':{
				'border':style.bs_border,
				'verticalAlign':'middle',
				'color':'#FFFFFF',
				'fontSize':((numb!=null)?style.bs_font_size:''),
			},
			'px':{
				'width':style.bs_butt_width_h,
				'height':style.bs_butt_height_h,
			}
		});

		Representation_utils.Painter(btn, (numb != null)?col:4);
		return btn;
	}
	
	//Creates buttons with exponent to the right
	static expo_style_button_creator(style, numb=null, args=null){
		var base=Representation_utils.button_creator(style, numb.base);
		var expo=Representation_utils.button_creator(style, numb.expo);
		var size=20;
		if (args && args.size!=null) size=args.size;

		expo.style.width=`${size}px`;
		expo.style.height=`${size}px`;
		expo.style.lineHeight=`${size}px`;

		expo.style.top=`${-(40-size)/2}px`;
		expo.style.position="relative";
		return {'base':base, 'expo':expo, '_is_expo_offline':true};
	}

	//Creates buttons with exponent from within
	static expo_inner_style_button_creator(style, numb=null, args=null){
		var all=Representation_utils.double_button_creator(style, null, Representation_utils.button_creator);
		var base=all[2];
		var expo=all[1];
		all=all[0];
		if (numb){
			base.innerHTML=numb.base;
			expo.innerHTML=numb.expo;
		}

		//Zamienić zmienne
		all.style.height=style.bs_butt_height;
		all.style.width=style.bs_butt_width;

		base.style.height=style.bs_butt_height;
		base.style.width=style.bs_butt_width;
		base.style.paddingTop="10px";
		base.style.verticalAlign="bottom";

		expo.style.width=style.bs_small_butt_width;
		expo.style.right="0";
		expo.style.zIndex="2";

		return {'system':all, '_base':base, '_expo':expo, '_is_expo_offline':false};
	}
	
	//Create Button
	static double_button_creator(style, v, fun){
		var butt1=fun(style, v);
		var butt2=fun(style, v);
		butt1.classList.add("fullNumb");
		butt2.classList.add("divisNumb");

		var dv = document.createElement("DIV");
		dv.style.display="inline-block";
		dv.style.position="relative";

		butt1.style.top="0";
		butt2.style.bottom="0";
		var lst=[butt1, butt2];
		for (var i=0;i<2;i++){
			lst[i].style.width=style.bs_butt_width;
			lst[i].style.height="20px";
			lst[i].style.lineHeight="20px";
			lst[i].style.textAlign="center";
			lst[i].style.margin="0";
			lst[i].style.position="absolute";
		}

		dv.style.width=style.bs_butt_width;
		dv.style.height="40px";
		dv.backgroundColor="#000000";
		dv.appendChild(butt1);
		dv.appendChild(butt2);
		dv.upper=butt1;
		dv.lower=butt2;
		return [dv, butt1, butt2];
	}

	static better_button_creator(style, name, color, place, fun, args){
		var btn=fun(style, name, args);
		if (btn._is_expo_offline==null){ //Negated expo-style button - like in primes/proot
			Representation_utils.Painter(btn, color);
			place.append(btn);
		}

		else{
			for (var x in btn){
				if (x[0]!='_'){
					Representation_utils.Painter(btn[x], color);
					place.append(btn[x]);
				}
			}
		}

		return btn;
	}

	static change_button_width(style, mx, cur_ln=40){
		style.bs_butt_width_h=Math.max(cur_ln, mx.toString().length*10);
		style.bs_butt_width=`${style.bs_butt_width_h}px`;
	}
	static get_width(mx, cur_ln=40){
		return Math.max(cur_ln, mx.toString().length*10);
	}

	static fill_with_buttons_horizontal(style, place, names, color, ln=-1, creator=Representation_utils.button_creator, additional_args=null){
		var single_name=false, single_color=false, btn_list=[], btn, cur_name, cur_color;
		if (ArrayUtils.is_iterable(names)==false) single_name=true;
		else ln=names.length;

		if (ArrayUtils.is_iterable(color)==false) single_color=true;
		else ln=color.length;

		for (var i=0; i<ln; i++){
			if (single_name) cur_name=names;
			else cur_name=names[i];
			if (single_color) cur_color=color;
			else cur_color=color[i];

			btn=Representation_utils.better_button_creator(style, cur_name, cur_color, place, creator, additional_args);
			btn_list.push(btn);
		}
		return btn_list;
	}
}
export default Representation_utils;
