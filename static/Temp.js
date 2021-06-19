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
		this.place=block.primePlace;
		this.wisdom=block.output;
		this.input=block.input;
		this.Creato(block);
		this.version=1;

		//Button style
		this.stylistic={};
		this.stylistic.bs_butt_width="40px";
		this.stylistic.bs_small_butt_width="20px";
		this.stylistic.bs_butt_height="40px";
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
		var lst=[], j=0, i=0, x, a=0;
		lst.iter=-1;
		lst.get_next=function(){this.iter+=1; return this[this.iter];}
		while (j<str.length){
			for (;i<str.length;i++){
				x=str.charCodeAt(i);
				if (x<58 && x>=48) a=a*10+x-48;
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
		this.lees=[];
		this.state_transformation=[];
		this.place.innerHTML='';
		this.finito=false;
		this.ephemeral={'staat':null, 'passer':null};
		this.pass_to_next_state=[];
		this.logic={};
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

	modern_divsCreator(mode, number_of_rows, title_list, midian, place=this.place){
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
		to_add.appendChild(full_div);
		return {'zdivs':zdivs, 'divs':divs, 'full_div':full_div}
	}
	
	//0: red, 1:green, 2: white(gray), 3: dead white 5: black 6: gray 7: white(gray) with border 8: gold
	//9: yellow(grey) 10: blue 11: dark gold
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

		if (col==0) btn.style.backgroundColor="#440000";
		else if (col==1) btn.style.backgroundColor="#004400";
		else if (col==2 || col==7 || col==9) btn.style.color="#666666";
		else if (col==3) btn.style.color="#FFFFFF";
		else if (col==5) btn.style.backgroundColor="#000000";
		else if (col==6) btn.style.backgroundColor="#888888";
		else if (col==8) btn.style.backgroundColor="#8A7400";
		else if (col==10) btn.style.backgroundColor="#0000FF";
		else if (col==11) btn.style.backgroundColor="#222200";
		if (col==12) btn.style.backgroundColor="#FF3333";
		if (col==9) btn.style.backgroundColor="#FFFF00";

		if (col==101) btn.style.backgroundColor="#804000";

		//Colors for additional post-green
		if (col==13) btn.style.backgroundColor="#669900";
		if (col==14) btn.style.backgroundColor="#00B359";
		//Colors for tmp information - post-orange
		if (col==15) btn.style.backgroundColor="#E64C00";

		if (col==7){
			btn.style.border="1px solid";
			btn.style.borderColor="#888888";
		}
		else btn.style.border="0px none";
		if (only_bg==1) btn.style.color=olden;
	}
	
	//Creates buttons
	static button_creator(style, numb=null, col='#440000'){
		var butt=document.createElement("BUTTON");
		butt.style.width=style.bs_butt_width;
		butt.style.height=style.bs_butt_height;
		butt.style.backgroundColor=col;
		butt.style.border=style.bs_border;
		butt.style.padding='0';
		butt.style.margin='0';
		butt.style.verticalAlign='middle';
		
		butt.style.color="#FFFFFF";
		if (numb!=null) {
			butt.innerHTML=numb;
			butt.style.fontSize=style.bs_font_size;
		}
		else {
			butt.innerHTML=0;
			butt.style.backgroundColor="#FFFFFF";
		}
		return butt;
	}
	
	//Creates buttons with exponent to the right
	static expo_style_button_creator(style, numb=null, args=null){
		var base=Representation_utils.button_creator(style, numb.base);
		var expo=Representation_utils.button_creator(style, numb.expo);
		var size=20;
		if (args && args.size!=null) size=args.size;

		expo.style.width=`${size}px`;
		expo.style.height=`${size}px`;

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

	static find_proot(x){
		var fac_x=NTMath.factorize(x);
		var ln=fac_x[0].length;
		if (x==4) return 3;
		if (fac_x[0].length>2 || (fac_x[0].length==2 && fac_x[0][0]!=2) || (fac_x[0][0]==2 && fac_x[1][0]>=2)) return null;

		var p=fac_x[0][ln-1], toth_p=p-1, y, i;
		var fac_t=NTMath.factorize(toth_p);

		var ln=fac_t[0].length;
		var lst=[];
		for (i=0;i<ln;i++) lst.push(toth_p/fac_t[0][i]);

		while(true){
			y=Math.floor(Math.random()*(p-2))+2;
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
		for (var i=a; i<=b; i++) elements.push(elem);
		return elements;
	}

	static is_iterable(value){
		return Symbol.iterator in Object(value);
	}

	//If value is sort of list - returns element under index, if not - returns value
	static get_elem(value, ite){
		if (ArrayUtils.is_iterable(value)) return value[ite];
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
}
