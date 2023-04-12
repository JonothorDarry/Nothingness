import ArrayUtils from './ArrayUtils.js'
import Object_utils from './Object_utils.js'

class Modern_representation{
	//0: red, 1:green, 2: white(gray), 3: dead white 5: black 6: gray 7: white(gray) with border 8: gold
	//9: yellow(grey) 10: blue 11: dark gold
	//Refactor this shit as soon, as possibru
	static colors={
		0:'#440000',
		1:'#004400',
		4:'#FFFFFF',
		5:'#000000',
		6:'#888888',
		8:'#8A7400',
		10:'#0000FF',
		11:'#222200',
		12:'#FF3333',
		
		//Colors for additional post-green
		13:'#669900',
		14:'#00B359',
		//Colors for tmp information - post-orange
		15:'#E64C00',

		//moderate-red, moderate-green, violet, pinko
		30:'#880000',
		31:'#008800',
		32:'#800080',
		33:'#FF0080',

		//Emptiness
		42:'rgba(255, 255, 255, 0.0)',

		//Exponent brown, black-on-white
		101:'#804000',
		102:'#FFFFFF',

		//transparent
		104:'rgba(255, 255, 255, 0.0)'
	}

	//Garbage, only there to avoid conflit - removal necessary, immediate effect
	static Painter(btn, col=1, only_bg=0){
		btn._color = col;

		if ('upper' in btn){
			Modern_representation.Painter(btn.upper, col, only_bg);
			Modern_representation.Painter(btn.lower, col, only_bg);
			return;
		}
		var olden;
		if (only_bg==1) olden=btn.style.color;
		if (col==0 || col==1 || col==4 || col==5 || col==6 || col==8 || col==10 || col==11 || col==12 || col==13 || col==14 || col==15 || col == 101) btn.style.color="#FFFFFF";
		else if (col == 104) btn.style.color = Modern_representation.colors[104];
		else if (col==102) btn.style.color = "#000000";
		else btn.style.backgroundColor="#FFFFFF";

		if (col==2 || col==7 || col==9) btn.style.color="#666666";
		if (col==3) btn.style.color="#FFFFFF";

		if (col in Modern_representation.colors){
			btn.style.background=Modern_representation.colors[col];
		}
		else if (ArrayUtils.is_iterable(col)){
			btn.style.background = `linear-gradient(to right bottom, ${Modern_representation.colors[col[0]]} 50%, ${Modern_representation.colors[col[1]]} 50%)`;						
		}

		if (col==7){
			btn.style.border="1px solid";
			btn.style.borderColor="#888888";
		}
		if (col == 42){
			btn.style.color = `rgba(255, 255, 255, 0.0)`
		}
		//else btn.style.border="0px none";
		if (only_bg==1) btn.style.color=olden;
	}

	static button_creator(inner_html, stylistic={}){
		var base={
			'general':{'backgroundColor':'#FFFFFF', 
				'color':'#FFFFFF',
				'verticalAlign':'middle',
				'textAlign':'center',
				'font-family':'system-ui',
				'display':'inline-block',
			},
			'px':{
				'width':40,
				'height':40,
				'line-height':('px' in stylistic && 'height' in stylistic.px) ? stylistic.px.height : 40,
				'font-size':14,
				'padding':0,
				'margin':0,
				'border':0,
			}
		}
		return Modern_representation.element_creator('DIV', inner_html, stylistic, base);
	}

	static div_creator(inner_html, stylistic={}){
		var base={
			'general':{
				'color':'#FFFFFF',
				'verticalAlign':'top',
				'display':'inline-block',
				'width':'max-content',
				'position':'relative',
			},
			'px':{
				'padding':0,
				'margin':0,
			}
		}
		return Modern_representation.element_creator('DIV', inner_html, stylistic, base);
	}

	//Warn: stylistic + innerHTML
	static button_modifier(button, packet){
		if ('inner_html' in packet) button.innerHTML=packet.inner_html;
		if (!('stylistic' in packet)) return;

		packet.stylistic.general = Object_utils.construct_if_null(packet.stylistic.general);
		packet.stylistic.px = Object_utils.construct_if_null(packet.stylistic.px);
		packet.stylistic['%'] = Object_utils.construct_if_null(packet.stylistic['%']);

		for (var x in packet.stylistic.general) button.style[x]=packet.stylistic.general[x];
		for (var x in packet.stylistic.px) button.style[x]=`${packet.stylistic.px[x]}px`;
		for (var x in packet.stylistic['%']) button.style[x]=`${packet.stylistic['%'][x]}%`;
	}

	static element_creator(element_name, inner_html, stylistic, base){
		var x;
		for (x in base){
			stylistic[x]=Object_utils.construct_if_null(stylistic[x]);
			Object_utils.merge(stylistic[x], base[x]);
		}
		var element=document.createElement(element_name);
		
		element.innerHTML=inner_html;
		for (x in stylistic.general) element.style[x]=stylistic.general[x];
		for (x in stylistic.px) element.style[x]=`${stylistic.px[x]}px`;
		for (x in stylistic['%']) element.style[x]=`${stylistic['%'][x]}%`;
		return element;
	}

	static fill_with_buttons_horizontal(style, place, names, color, ln=-1, creator=Modern_representation.button_creator, additional_args=null){
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

			btn=creator(cur_name, style);
			Modern_representation.Painter(btn, color);
			place.appendChild(btn);
			btn_list.push(btn);
		}
		return btn_list;
	}

	static gridmaker(n){
		var full_div = Modern_representation.div_creator('');
		var rows = [];

		for (var i=0; i<n; i++){
			var next_div = Modern_representation.div_creator('', {'general':{'position':'static', 'display':'block'}, 'px':{'height':40}});
			full_div.appendChild(next_div);
			rows.push(next_div);
		}

		return {'full_div':full_div , 'rows':rows};
	}
}
export default Modern_representation;
