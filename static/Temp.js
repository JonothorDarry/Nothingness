class Algorithm{
	static alldict={};

	Creato(block){
		this.inbut=block.sendButton;
		this.nextbut=block.nextButton;
		this.prevbut=block.prevButton;
		this.finitbut=block.finitButton;

		//Adding button ids to dictionary alldict
		Algorithm.alldict[this.inbut.id]=this;
		Algorithm.alldict[this.nextbut.id]=this;
		Algorithm.alldict[this.prevbut.id]=this;
		Algorithm.alldict[this.finitbut.id]=this;
		
		
		//Beginning button & sequence
		this.inbut.addEventListener('click', function(){
			var zis=Algorithm.alldict[this.id];
			zis.post_beginning_executor();
			zis.post_state_maker();
			zis.ChangeStatement();
		});

		//Next value
		this.nextbut.addEventListener('click', function(){
			var zis=Algorithm.alldict[this.id];
			if (zis.version>=4){
				zis.new_next_state();
			}
			else{
				zis.NextState();
			}
			zis.post_state_maker();
			zis.ChangeStatement();
		});

		//Previous value
		this.prevbut.addEventListener('click', function(){
			var zis=Algorithm.alldict[this.id];
			if (zis.lees.length>1){
				zis.StateUnmaker();
				zis.ChangeStatement();
			}
		});
		
		//Finish Algorithm instantly	
		this.finitbut.addEventListener('click', function(){
			var zis=Algorithm.alldict[this.id];
			zis.FinishingSequence();
		});
	}

	constructor(block){
		this.lees=[];
		this.logic={};
		this.buttons={};
		this.state={};

		this.place=block.primePlace;
		this.wisdom=block.output;
		this.input=block.input;
		this.Creato(block);
		this.version=1;

		//Button style
		this.stylistic={};
		this.stylistic.bs_butt_width="40px";
		this.stylistic.bs_butt_width_h=40;
		this.stylistic.bs_small_butt_width="20px";

		this.stylistic.bs_butt_height="40px";
		this.stylistic.bs_butt_height_h=40;

		this.stylistic.bs_font_size="14px";
		this.stylistic.bs_border="0";
	}

	isFinished(){
		if (this.lees[this.lees.length-1][0]>=100) return true;
		return false;
	}

	//Default action after finish
	FinishingSequence(){
		while (!this.isFinished()){
			if (this.version>=4){
				this.new_next_state();
			}
			else{
				this.NextState();
			}
			this.post_state_maker();
			this.ChangeStatement();
		}
	}

	post_beginning_executor(){
		this.starter();
		this.BeginningExecutor();
	}

	post_state_maker(){
		if (this.finito==true) return;
		this.before_state_maker();
		this.StateMaker();
		this.after_state_maker();
	}

	before_state_maker(){
		this.ephemeral.staat=this.pass_to_next_state.slice();
		this.ephemeral.passer=[];
	}

	after_state_maker(){
		if (this.isFinished()==true) 
			this.ephemeral.staat.push([3, "finito", false, true]);

		this.ephemeral.staat.push([3, "pass_to_next_state", this.pass_to_next_state, this.ephemeral.passer]);
		this.transformator(this.ephemeral.staat);
		this.ephemeral={'staat':null, 'passer':null};
	}

	new_next_state(){
		//If !this.finito? check validity
		var next_state=this.NextState();
		if (!this.finito && next_state!=null){ //Konieczne 2? Sprawdzić
			this.lees.push(next_state);
		}
	};
  
	
	//Printing statement on the output
	ChangeStatement(){
		var p=this.StatementComprehension();
		var l=this.wisdom;
		l.innerHTML=p;
	}

	//reading input
	dissolve_input(str){
		var lst=[], j=0, i=0, x, a=0, is_string=false;
		lst.iter=-1;
		lst.get_next=function(){this.iter+=1; return this[this.iter];}
		while (j<str.length){
			is_string=false;
			for (;i<str.length;i++){
				x=str.charCodeAt(i);
				if (x<58 && x>=48 && is_string==false) a=a*10+x-48;
				else if ( (x>=65 && x<=90) || (x>=97 && x<=122) ){
					if (a==0) a="";
					a+=str[i];
				}
				else break;
			}
			if (j!=i) lst.push(a);
			else i++;
			j=i, a=0;
		}
		return lst;
	}

	//Operations starting BeginningExecutor
	starter(){
		if (this.querier==true) this.reset_state_machine();

		this.lees=[];
		this.state_transformation=[];
		this.state={};
		this.place.innerHTML='';
		this.finito=false;
		this.ephemeral={'staat':null, 'passer':null};
		this.pass_to_next_state=[];
		this.logic={};
	}

	reset_state_machine(){
		while(this.lees.length>1) this.StateUnmaker();
		if (this.lees.length==1) this.StateUnmaker();
	}

	//Reversing operation
	StateUnmaker(){
		var l=this.lees.length, i, elem;

		if (this.state_transformation.length==0) return;
		//Back to times of Splendor: 0 - buttons, 1 - innerHTML, 2 - list, 3 - field, 5 - fun
		var x=this.state_transformation[this.state_transformation.length-1];
		for (i=x.length-1;i>=0;i--){
			elem=x[i];
			if (elem[0]==0) this.Painter(elem[1], elem[2]);
			if (elem[0]==1) elem[1].innerHTML=elem[2];
			if (elem[0]==2) elem[1].pop();
			if (elem[0]==3) this[elem[1]]=elem[2];
			if (elem[0]==5) elem[2](...elem[3]);
			if (elem[0]==6){
				elem[1].iterator -= 1;
				if (elem[1].button) elem[1].button.innerHTML = elem[1].values[elem[1].iterator];
			}
		}
		this.state_transformation.pop();

		if (l>1) this.lees.pop();
	}
	StatementComprehension(){}
	
	Painter(btn, col=1, only_bg=0){
		Representation_utils.Painter(btn, col, only_bg);
	}

	//Creates buttons
	buttCreator(numb=null, col='#440000'){
		return Representation_utils.button_creator(this.stylistic, numb, col);
	}


	//Create Button
	doubleButtCreator(v, fun){
		return Representation_utils.double_button_creator(this.stylistic, v, fun);
	}

	//Execute changes in the last state
	transformator(staat){
		this.state_transformation.push(staat);
		var x, i;
		for (i=0;i<staat.length;i++){
			x=staat[i];
			if (x[0]==0) this.Painter(x[1], x[3]);
			if (x[0]==1) x[1].innerHTML=x[3];
			if (x[0]==2) x[1].push(x[2]);
			if (x[0]==3) this[x[1]]=x[3];
			if (x[0]==5) x[1](...x[3]);
			if (x[0]==6){
				x[1].iterator += 1;
				if (x[1].button) x[1].button.innerHTML = x[1].values[x[1].iterator];
			}
		}
	}
	//Specific change - passing colors between states
	pass_color(btn, col_before=4, col_mid=1, col_after=0){
		this.ephemeral.staat.push([0, btn, col_before, col_mid]);
		this.ephemeral.passer.push([0, btn, col_mid, col_after]);
	}


	divsCreator(mode, number_of_rows, title_list, midian, elements=['divs', 'zdivs']){
		var lst=Representation_utils.proto_divsCreator(mode, number_of_rows, title_list, midian, this.place, this.stylistic);
		this[elements[0]]=lst.divs;
		this[elements[1]]=lst.zdivs;
	}

	modern_divsCreator(mode, number_of_rows, title_list, midian=null, place=this.place){
		var lst=Representation_utils.proto_divsCreator(mode, number_of_rows, title_list, midian, place, this.stylistic);
		return lst;
	}


	static ObjectParser(v){
		var dick={
			'primePlace':v.getElementsByClassName('primez')[0],
			'sendButton':v.getElementsByClassName('sender')[0],
			'prevButton':v.getElementsByClassName('previous')[0],
			'nextButton':v.getElementsByClassName('next')[0],
			'input':v.getElementsByClassName('inputter')[0],
			'output':v.getElementsByClassName('comprehend')[0],
			'finitButton':v.getElementsByClassName('finish')[0]
		}
		return dick;
	}

	_statial_binding(name, values, btn_list){
		if (!ArrayUtils.is_iterable(btn_list)){
			this.state[name] = {
				'iterator':0,
				'button':btn_list,
				'values':values,
				'current':function(){return this.values[this.iterator];},
				'previous':function(){return this.values[this.iterator-1];}
			};
			return;
		}

		this.state[name] = [];
		for (var i=0; i<values.length; i++){
			this.state[name].push({
				'button':btn_list[i],
				'values':values[i],
				'iterator':0,
				'current':function(){return this.values[this.iterator];},
				'previous':function(){return this.values[this.iterator-1];}
			});
			if (values[i].length > 0 && btn_list[i]!=null) btn_list[i].innerHTML = values[i][0];
		}
	}
}

class Partial extends Algorithm{
	Creato(block){
		this.show=block.showButton;
		Algorithm.alldict[this.show.id]=this;
		
		this.show.addEventListener('click', function(){
			var zis=Algorithm.alldict[this.id];
			zis.ShowReality();
		});
	}

	static ObjectParser(v){
		var dick={
			'primePlace':v.getElementsByClassName('primez')[0],
			'showButton':v.getElementsByClassName('show')[0],
			'input':v.getElementsByClassName('inputter')[0],
			'output':v.getElementsByClassName('comprehend')[0],
		}
		return dick;
	}
}

class Grid{
	//Later, perhaps: create grid w/o overlay of divsCreator - no place; left margin, topmargin
	constructor(n, m, style, params={'place':null, 'divs':false}){
		Object_utils.merge(params, {'top_margin':0, 'left_margin':0});

		this.grid=Representation_utils.gridify_div(params.place, n+params.top_margin, m+params.left_margin, style, params.divs);
		this.left_margin=params.left_margin;
		this.top_margin=params.top_margin;
	}

	//positions:[[a,b], c] or [a, [b,c]]; arr: array (iterable) to fill; Dict: color (default 4)
	filler(positions, arr, params){
		var btn, results=[];
		Object_utils.merge(params, {'color':4});

		var is_row=false, to_update, elem;
		if (ArrayUtils.is_iterable(positions[0])){
			is_row=true;
		}
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
		Object_utils.merge(params, {'color':4});
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

/*
class Style{
	constructor(background_color, color='#FFFFFF', additional_info={}){
		base = {
			'general':{
				'backgroundColor':background_color,
				'color':color
			}
		}

	}
}*/

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
				zdivs[i][Representation_utils.title_id].style.width="200px";
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
	

	static Painter(btn, col=1, only_bg=0){
		if ('upper' in btn){
			Representation_utils.Painter(btn.upper, col, only_bg);
			Representation_utils.Painter(btn.lower, col, only_bg);
			return;
		}
		var olden;
		if (only_bg==1) olden=btn.style.color;
		if (col==0 || col==1 || col==5 || col==6 || col==8 || col==10 || col==11 || col==12 || col==13 || col==14 || col==15) btn.style.color="#FFFFFF";
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
		//else btn.style.border="0px none";
		if (only_bg==1) btn.style.color=olden;
	}
	
	//Creates buttons
	static button_creator(style, numb=null, col='#440000'){
		var butt=document.createElement("BUTTON");

		return Modern_representation.button_creator(((numb!=null)?numb:''), {
			'general':{
				'backgroundColor':((numb!=null)?col:'#FFFFFF'),
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

class Modern_representation{
	//0: red, 1:green, 2: white(gray), 3: dead white 5: black 6: gray 7: white(gray) with border 8: gold
	//9: yellow(grey) 10: blue 11: dark gold
	//Refactor this shit as soon, as possibru
	static colors={
		0:'#440000',
		1:'#004400',
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

		101:'#804000',
	}

	static button_creator(inner_html, stylistic){
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

		for (var x in packet.stylistic.general){
			button.style[x]=packet.stylistic.general[x];
		}
		for (var x in packet.stylistic.px){
			button.style[x]=`${packet.stylistic.px[x]}px`;
		}
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
			Representation_utils.Painter(btn, color);
			place.appendChild(btn);
			btn_list.push(btn);
		}
		return btn_list;
	}
}


class ChildBigIntMath{
	sqrt(value) {
	    if (value < 0n) {
		throw 'square root of negative numbers is not supported'
	    }

	    if (value < 2n) {
		return value;
	    }

	    function newtonIteration(n, x0) {
		const x1 = ((n / x0) + x0) >> 1n;
		if (x0 === x1 || x0 === (x1 - 1n)) {
		    return x0;
		}
		return newtonIteration(n, x1);
	    }

	    return newtonIteration(value, 1n);
	}
}


class NTMath{
	static pow(ap, bp, mp=1000000007){
		var res=1n, a=BigInt(ap), b=BigInt(bp), m=BigInt(mp);
		for (;b>0;b=b/2n){
			if (b%2n==1n) res=(res*a)%m;
			a=(a*a)%m;
		}
		return res;
	}
	static mul(a, b, m=1000000007){
		var res=0;
		for (;b>0;b=Math.floor(b/2)){
			if (b%2==1) res=(res+a)%m;
			a=(a+a)%m;
		}
		return res;
	}

	static gcd(a, b){
		var c;
		while (b>0){
			c=a%b;
			a=b;
			b=c;
		}
		return a;
	}

	static lcm(a, b){
		return Math.floor((a*b)/NTMath.gcd(a, b));
	}

	static ext_gcd(a, b){
		var p=[1, 0], q=[0, 1], lst=2, c, z;

		while (b>0){
			z=Math.floor(a/b);
			p.push(p[lst-2]-z*p[lst-1]);
			q.push(q[lst-2]-z*q[lst-1]);
			c=a%b, a=b, b=c;
			lst=lst+1
		}
		return [a, p[lst-2], q[lst-2]];
	}

    //returns lowest prime factor list
    static sievify(n){
        var i, j, nothing=-1;
        var lpf=ArrayUtils.steady(n+1, nothing);

        for (i=2; i<=n; i++){
            if (lpf[i]==nothing) lpf[i]=i;
            for (j=i*i; j<=n; j+=i){
                if (lpf[j]==nothing) lpf[j]=i;
            }
        }
        return lpf;
    }

	static inverse(a, m){
		var s=NTMath.ext_gcd(a, m);
		if (s[0]==0) return null;
		if (s[1]<0) return s[1]+m;
		return s[1];
	}

	static factorize(x){
		var i, ace=0, lst=[[],[]];
		for (i=2;i*i<=x;i++){
			if (x%i==0) lst[0].push(i), lst[1].push(0);
			while(x%i==0) x=Math.floor(x/i), lst[1][lst[1].length-1]++;
		}
		if (x>1) lst[0].push(x), lst[1].push(1);
		return lst;
	}

	static find_totient(x){
		var y=NTMath.factorize(x)[0], toth=x, i;
		for (i=0;i<y.length;i++)
			toth=Math.floor(toth/y[i])*(y[i]-1);
		return toth;
	}

	static find_proot(x, prob=true){
		var fac_x=NTMath.factorize(x);
		var ln=fac_x[0].length;
		if (x==4) return 3;
		if (fac_x[0].length>2 || (fac_x[0].length==2 && fac_x[0][0]!=2) || (fac_x[0][0]==2 && fac_x[1][0]>=2)) return null;

		var p=fac_x[0][ln-1], toth_p=p-1, y=0, i;
		var fac_t=NTMath.factorize(toth_p);

		var ln=fac_t[0].length;
		var lst=[];
		for (i=0;i<ln;i++) lst.push(toth_p/fac_t[0][i]);

		while(true){
			if (prob==true) y=Math.floor(Math.random()*(p-2))+2;
			else y+=1;

			for (i=0; i<ln; i++){
				if (NTMath.pow(y, lst[i], p)==1) break;
			}
			if (i==ln) break;
		}
		if (2*p<x && NTMath.pow(y, p-1, p*p)!=1) y=y+p;
		if (x%2==0 && y%2==0) y=y+(x>>1);
		return y;
	}

	//It's shit in n^2 - make it NTT or FFT
	static multiply_polynominals(p1, p2, M=998244353){
		var p3=[], size=p1.length+p2.length, p2_size=p2.length, p1_size=p1.length, res=0, i, j;
		for (i=0; i<size-1; i++) p3.push(0);
		for (i=0; i<p1_size; i++){
			for (j=0; j<p2_size; j++){
				p3[i+j]=(p3[i+j]+p2[j]*p1[i])%M;
			}
		}
		return p3;
	}
}

class Combinatorisation{
	static make_system_combinations_repetitions(n, k){
		var all_combinats=[];
		var i, j, cur_perm=[], new_perm, zeros;
		for (i=0; i<n-k; i++) cur_perm.push(0);
		for (i=0; i<k; i++) cur_perm.push(1);
		all_combinats.push(cur_perm);

		while (true){
			new_perm=[], zeros=0;
			for (i=n-1; i>0; i--){
				if (cur_perm[i]==1 && cur_perm[i-1]==0) break;
			}
			if (i==0) break;
			for (j=0; j<i-1; j++) {
				new_perm.push(cur_perm[j]);
				if (cur_perm[j]==0) zeros++;
			}
			new_perm.push(1);
			for (j=0; j<n-k-zeros; j++) new_perm.push(0);
			for (j=j+i; j<n; j++) new_perm.push(1);
			all_combinats.push(new_perm);
			cur_perm=new_perm;
		}
		return all_combinats;
	}

	static combination_repetitions_to_list(list){
		var counter=0, elems=[];
		for (var x of list){
			if (x==1) elems.push(counter);
			else counter+=1;
		}
		return elems;
	}
}



class NTMath_presentation{
	static show_factorization(factors){
		var lst=factors.map(function(e){return `${e.base}<sup>${e.expo}</sup>`});
		return lst.join('');
	}
}

class Bitmasks{
	//Up to ln: sgn, lmost, bits
	static calculate_standard_bmasks(ln){
		var lmost=[-1], sgn=[-1], bits=[0], i;
		for (i=1; i<ln; i++){
			lmost.push(lmost[Math.floor(i/2)]+1);
			bits.push(bits[Math.floor(i/2)]+i%2);
			sgn.push(bits[i]%2==0?(-1):1);
		}
		return {'leftmost':lmost, 'sgn':sgn, 'bits':bits};
	}

	//All bitmasks up to 2^bits-1 inclusive
	static list_all_bitmasks(bits){
		var all_bitmasks=[], pows=[], pw=1<<bits, i, j;
		for (i=0; i<bits; i++) pows.push(1<<i);

		for (i=0; i<pw; i++)
			all_bitmasks.push(pows.map(function(e){return ((e&i)>0)?1:0;}));
		return all_bitmasks;
	}

	static list_all_bits(bitmasks){
		var all_bits=[], ln=bitmasks[0].length, i, _;

		for (i=0; i<bitmasks.length; i++){
			all_bits.push([]);
			_=bitmasks[i].map(function(e, j){return (e==1)?all_bits[i].push(j):0;});
		}
		return all_bits;
	}

	//Just a little bits - with added pows, for which they have to be calculated
	static calculate_binary(x, pows){
		var binaria=pows.map(function(e,i){return ((e&x)>0)?1:0});
		binaria.reverse();
		return binaria;
	}
}

class Complex{
	constructor(a, b=0){
		this.real=a;
		this.img=b;
	}
	add(b){
		return new Complex(this.real+b.real, this.img+b.img);
	}
	mul(b){
		return new Complex(this.real*b.real-this.img*b.img, this.img*b.real+b.img*this.real);
	}
	toString(){
		if (-10e-6<this.img && this.img<10e-6) return `${this.real.toFixed(5)}`;
		return `${this.real.toFixed(5)}+${this.img.toFixed(5)}i`;
	}
}


class ArrayUtils{
	static range(a, b, diff=1){
		var elements=[];
		if (diff>0)
			for (var i=a; i<=b; i+=diff) elements.push(i);
		else
			for (var i=a; i>=b; i+=diff) elements.push(i);
		return elements;
	}

	static steady(num, elem){
		var elements=[];
		for (var i=0; i<num; i++) elements.push(elem);
		return elements;
	}

	static sum(arr){
		var summer=(acc, starter) => acc+starter;
		return arr.reduce(summer, 0);
	}

	static is_iterable(value){
		return Symbol.iterator in Object(value);
	}

	//If value is sort of list - returns element under index, if not - returns value
	static get_elem(value, ite){
		if (ArrayUtils.is_iterable(value)){
			if (ite<0) return value[value.length+ite];
			return value[ite];
		}
		return value;
	}

	static revert(lst){
		var rev_lst=[];
		for (var i=lst.length-1; i>=0; i--) rev_lst.push(lst[i]);
		return rev_lst;
	}

	//comparer(a,b): a<=b - True
	static binaria_lower(lst, elem, comparer){
		var r=lst.length-1, l=0, m=Math.floor(r/2);
		while (l<=r){
			m=Math.floor((l+r)/2);
			if (comparer(lst[m], elem)) l=m+1;
			else r=m-1;
		}
		return l;
	}
	static create_2d(dim1, dim2){
		var i, j, arr;
		arr=Array.apply(null, Array(dim1)).map(e => []);
		for (j=0; j<dim1; j++){
			for (i=0; i<dim2; i++) arr[j].push(0);
		}
		return arr;
	}

	static subsetting(array, d1, d2){
		var i=0, res=[];
		if (ArrayUtils.is_iterable(d1)){
			for (i=d1[0]; i<d1[1]; i+=1)
				res.push(array[i][d2]);
		}

		else{
			for (i=d2[0]; i<d2[1]; i+=1)
				res.push(array[i][d1]);
		}
		return res;
	}

	static zip(arr1, arr2){
		return Array.prototype.map.call(arr1, function(e,i){return [e, arr2[i]];})
	}
}

class Object_utils{
	static merge(base, substitute){
		for (var x in substitute){
			if (x in base) continue;
			base[x] = substitute[x];
		}
	}
	static construct_if_null(value){
		if (value!=null) return value;
		else return {};
	}
}


class Graph_utils{
	//Positions+w/h of v1, v2; v1 below; general_params: h/w of a button
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

		if (!('backgroundColor' in stylistic)) dv.style.backgroundColor="#000000";
		else dv.style.backgroundColor=stylistic.backgroundColor;

		dv.style.height=`${stylistic.height}px`;
		if ('color' in stylistic) dv.style.backgroundColor=`${stylistic.color}`;

		if (ln_x==0) angle=-Infinity;
		else angle=ln_y/cval;

		dv.style.transformOrigin="top left";
		if (ln_x==0) dv.style.transform=`rotate(${-Math.PI/2}rad)`;
		else if (ln_x<0) dv.style.transform=`rotate(${-Math.asin(angle)}rad)`;
		else dv.style.transform=`rotate(${Math.asin(angle)-Math.PI}rad)`;
		return dv;
	}

	static button_creator(stylistic, numb=null, col='#440000'){
		var butt=Representation_utils.button_creator(stylistic.nonsense, numb, col);

		if (stylistic.vertex.label=='none'){
			butt.innerHTML='';
		}

		butt.style.width=`${stylistic.vertex.width}px`
		butt.style.height=`${stylistic.vertex.height}px`
		butt.style.borderRadius=`${stylistic.vertex.radius}px`;
		if ('color' in stylistic.vertex) butt.style.backgroundColor=`${stylistic.vertex.color}px`;
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

class Modern_tree_presenter{
	//Gives position to a tree - banal shit boring, besides tree is bad
	_calculate_position_vertexes(){
		var i, j, n=this.tree.n, ln, x;
		if (this.tree.system_depth==null)
			this.tree.add_on_listed_depths();

		var parameters=ArrayUtils.steady(n+1, 0);
		var max_depth=Math.max(...this.tree.depth), min_depth=1;

		for (i=0; i<n; i++){
			ln=this.tree.system_depth[i].length
			for (j=0; j<ln; j++){
				x=this.tree.system_depth[i][j];
				parameters[x]={
					'y':(this.tree.depth[x])/(max_depth+1),
					'x':(j+1)/(ln+1)
				};
			}
		}
		this.parameters={'vertexes':parameters};
	}

	//Proper binar penetrator
	_segtree_calculate_position_vertexes(h_full, h_btn){
		var i, j, n=this.tree.n, ln, x;
		if (this.tree.system_depth==null)
			this.tree.add_on_listed_depths();

		var parameters=ArrayUtils.steady(n+1, 0);
		var max_depth=Math.max(...this.tree.depth), min_depth=1;

		for (i=0; i<n; i++){
			ln=this.tree.system_depth[i].length
			for (j=0; j<ln; j++){
				x=this.tree.system_depth[i][j];
				parameters[x]={
					'y':(this.tree.depth[x]+1)/(max_depth+1)-h_btn/(2*h_full),
					'x':(2*j+1)*(1/(1<<(i+1)))
				};
			}
		}
		this.parameters={'vertexes':parameters};
	}

	//Ponoć to Reingold-Tilford Algorithm (Chuj wie, kto to byli)
	//lc, rc - left/right contour
	calculate_position_vertexes(){
		var i, j, ij, n=this.tree.n, ln, x, a, b, prev;

		var position=ArrayUtils.steady(n+1, 0);
		var parameters=ArrayUtils.steady(n+1, 0);
		var mod=ArrayUtils.steady(n+1, 0);
		var lc=ArrayUtils.create_2d(n+1, 0); //Left contour
		var rc=ArrayUtils.create_2d(n+1, 0); //Right contour

		var max_depth=Math.max(...this.tree.depth), min_depth=1;
		var max_diff=0;

		for (i=n; i>0; i--){
			a=this.tree.apre[i];
			position[a]=0;

			var tmp_rc = [];
			for (j=0; j<this.tree.kids[a].length; j++){
				b=this.tree.kids[a][j];
				if (j>0){
					prev=this.tree.kids[a][j-1];

					for (ij=0; ij<Math.min(tmp_rc.length, lc[b].length); ij++){
						mod[b]=Math.max(mod[b], tmp_rc[ij]-lc[b][ij]+1); //1 - dystans między parą punktów
					}
				}

				for (ij=0; ij<Math.min(tmp_rc.length, rc[b].length); ij++) tmp_rc[ij] = rc[b][ij]+mod[prev];
				for (ij=tmp_rc.length; ij<rc[b].length; ij++) tmp_rc.push(rc[b][ij]+mod[b]);
			}

			for (j=1; j<this.tree.kids[a].length; j++){
				b=this.tree.kids[a][j];
				prev=this.tree.kids[a][j-1];
				max_diff=Math.max(max_diff, mod[b]+position[b]-position[prev]-mod[prev]);
			}

			for (j=1; j<this.tree.kids[a].length; j++){
				b=this.tree.kids[a][j];
				prev=this.tree.kids[a][j-1];

				mod[b]=position[prev]+mod[prev]-position[b]+max_diff;
			}

			var v, v1, v2;
			if (this.tree.kids[a].length%2==1){
				v=this.tree.kids[a][(this.tree.kids[a].length>>1)];
				position[a]=position[v]+mod[v];
			}
			else if (this.tree.kids[a].length>0){
				v1=this.tree.kids[a][(this.tree.kids[a].length>>1) - 1];
				v2=this.tree.kids[a][(this.tree.kids[a].length>>1)];

				position[a] = (position[v1] + mod[v1] + position[v2] + mod[v2])/2;
			}
		

			if (this.tree.kids[a].length>0){
				var v=this.tree.kids[a][this.tree.kids[a].length-1];
				rc[a]=[mod[v]+position[v]];
				lc[a]=[mod[this.tree.kids[a][0]] + position[this.tree.kids[a][0]]];
			}
			else{
				lc[a]=[0];
				rc[a]=[0];
			}


			for (j=0; j<this.tree.kids[a].length; j++){
				b=this.tree.kids[a][j];
				for (ij=lc[a].length; ij<=lc[b].length; ij++){
					lc[a].push(lc[b][ij-1]+mod[b]);
				}
			}

			for (j=this.tree.kids[a].length-1; j>=0; j--){
				b=this.tree.kids[a][j];
				for (ij=rc[a].length; ij<=rc[b].length; ij++){
					rc[a].push(rc[b][ij-1]+mod[b]);
				}
			}
		}

		for (i=1; i<=n; i++){
			a=this.tree.apre[i];
			mod[a]+=mod[this.tree.par[a]];
			position[a]=mod[a]+position[a];
		}

		var mx=Math.max(...position);
		for (i=1; i<=n; i++){
			parameters[i]={
				'x':(position[i]+1)/(mx+2),
				'y':(this.tree.depth[i]+0.5)/(max_depth+1),
			};
		}
		this.parameters={'vertexes':parameters};
	}

	create_edge(a, stylistic){
		var verts=this.parameters.vertexes;
		return Graph_utils.create_edge(verts[a], verts[this.tree.par[a]], stylistic.edge, {'width':this.width, 'height':this.height});
	}

	//x, y - position, like, (1,1) - above, right
	//Assumption - homogeneous buttons
	get_place_for_companion_button(vertex, x_axis, y_axis, button_properties={'width':20, 'height':20}){
		var place={};
		var full_radius=40; //Temp
		var half_radius=Math.floor(full_radius/2);

		if (x_axis>0) place.left=`calc(${this.parameters.vertexes[vertex].x*100}% + ${full_radius/Math.sqrt(2)+button_properties.width*(x_axis-1)-half_radius}px)`;
		else place.left=`calc(${this.parameters.vertexes[vertex].x*100}% + ${-full_radius-half_radius+full_radius/Math.sqrt(2)-button_properties.width*(-x_axis-1)}px)`;

		if (y_axis>0) place.top=`calc(${this.parameters.vertexes[vertex].y*100}% + ${-half_radius/Math.sqrt(2)-button_properties.height*(y_axis-1)-half_radius}px)`;
		else place.top=`calc(${this.parameters.vertexes[vertex].y*100}% + ${half_radius/Math.sqrt(2)+button_properties.height*(-y_axis-1)}px)`;
		return place;
	}

	//Creates buttons
	buttCreator(stylistic, numb=null, col='#440000'){
		return Graph_utils.button_creator(stylistic, numb, col);
	}

	//places the tree
	//Currently nonsensical distinction width-height
	place_tree(place, style, used_fun){
		var i, a, j;

		if (used_fun == 'standard') this.calculate_position_vertexes();
		else this._segtree_calculate_position_vertexes(place.height, 40);

		this.height=place.height;
		this.width=place.width;
		this.place=place.div
		this.buttons={'vertexes':ArrayUtils.steady(this.tree.n, 0), 'edges':ArrayUtils.steady(this.tree.n, 0)};

		var vertex_pos=this.parameters.vertexes;
		for (i=1; i<=this.tree.n; i++){
			a=i;
			var bt=this.buttCreator(style, a);
			this.buttons.vertexes[a]=bt;

			if (a!=this.tree.root){
				var dv=this.create_edge(a, style);
				this.buttons.edges[a]=dv;
				this.place.appendChild(dv);
			}

			//Normalized vertex positions
			bt.style.position='absolute';
			bt.style.top=`calc(${100*this.parameters.vertexes[a].y}% - ${style.vertex.height/2}px)`;
			bt.style.left=`calc(${100*this.parameters.vertexes[a].x}% - ${style.vertex.width/2}px)`;
			this.place.appendChild(bt);
		}
	}

	constructor(tree, place, style, used_fun='standard'){
		this.tree=tree;
		this.place_tree(place, style, used_fun);
	}
}

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
			//console.log(i, this.kids[i].length, removed[i], primary, this.prufer_code);
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
/*
9
1 2
2 3
1 5
5 4
5 6
5 7
5 8
5 9
*/
