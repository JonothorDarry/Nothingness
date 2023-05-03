import ArrayUtils from './ArrayUtils.js'
import Object_utils from './Object_utils.js'

class Modern_representation{

	static create_color_style(background, color='#FFFFFF'){
		return {
			'background': background,
			'color': color,
			'border': '0',
			'borderColor': 'rgba(255, 255, 255, 0)',
		}
	}

	static color_styles = {
		0: Modern_representation.create_color_style('#440000'),

		1: Modern_representation.create_color_style('#004400'),
		2: Modern_representation.create_color_style('#FFFFFF', '#666666'),

		4: Modern_representation.create_color_style('#FFFFFF'),
		5: Modern_representation.create_color_style('#000000'),
		6: Modern_representation.create_color_style('#888888'),
		7: {'background':'#FFFFFF', 'color':'#666666', 'border':'1px solid', 'borderColor':'#888888'},
		8: Modern_representation.create_color_style('#8A7400'),
		10: Modern_representation.create_color_style('#0000FF'),
		11: Modern_representation.create_color_style('#222200'),
		12: Modern_representation.create_color_style('#FF3333'),

		13: Modern_representation.create_color_style('#669900'),
		14: Modern_representation.create_color_style('#00B359'),
		15: Modern_representation.create_color_style('#E64C00'),

		30: Modern_representation.create_color_style('#880000'),
		31: Modern_representation.create_color_style('#008800'),
		32: Modern_representation.create_color_style('#800080'),
		33: Modern_representation.create_color_style('#FF0080'),

		101: Modern_representation.create_color_style('#804000'),
		102: Modern_representation.create_color_style('#FFFFFF', '#000000'),
		104: Modern_representation.create_color_style('rgba(255, 255, 255, 0.0)', 'rgba(255, 255, 255, 0.0)'),
	};

	//Ancient: 2 operates alike 9 (prob not used anymore)
	//0: red, 1:green, 2: white(gray), 3: dead white 5: black 6: gray 7: white(gray) with border 8: gold
	//9: yellow(grey) 10: blue 11: dark gold
	//Refactor this shit as soon, as possibru
	static colors = Object.fromEntries(Object.keys(Modern_representation.color_styles).map(e => [e, Modern_representation.color_styles[e].background]));
	
	//Garbage, only there to avoid conflit - removal necessary, immediate effect; removed olden; remove col==9
	static Painter(btn, col=1, only_bg=0){
		if ('upper' in btn){
			Modern_representation.Painter(btn.upper, col, only_bg);
			Modern_representation.Painter(btn.lower, col, only_bg);
			return;
		}
		if (ArrayUtils.is_iterable(col)){
			Modern_representation.style(btn, Modern_representation.color_styles[col[0]]);
			Modern_representation.style(btn, {'background':`linear-gradient(to right bottom, ${Modern_representation.colors[col[0]]} 50%, ${Modern_representation.colors[col[1]]} 50%)`});
		}
		else Modern_representation.style(btn, Modern_representation.color_styles[col]);
	}

	static button_creator(inner_html, stylistic={}){
		var base={
			'general':{'background':'#FFFFFF', 
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

	//Użyte w tree isomorphism - raczej do kosza
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

	static style(element, style){
		if ('upper' in element){
			Modern_representation.style(element.upper, style);
			Modern_representation.style(element.lower, style);
			return;
		}
		for (var x in style) element.style[x] = style[x];
	}

	static get_old_style_parts(element, style){
		if ('upper' in element){ //relikty - usunąć (co, jeśli style a->b różne?)
			return Modern_representation.get_old_style_parts(element.upper, style);
		}
		var old_style = {};
		for (var x in style) old_style[x] = element.style[x];
		return old_style;
	}

	//Powinno być structuredClone zamiast Object.assign(), ale nie przejdzie pod jestem
	static get_style_from_id(styles){
		if (ArrayUtils.is_iterable(styles)){
			var res = Object.assign({}, Modern_representation.color_styles[styles[0]]);
			res.background = `linear-gradient(to right bottom, ${Modern_representation.colors[styles[0]]} 50%, ${Modern_representation.colors[styles[1]]} 50%)`;
			return res;
		}
		return Object.assign({}, Modern_representation.color_styles[styles]);
	}
}
export default Modern_representation;
