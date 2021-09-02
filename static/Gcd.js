class SuperEuclid{
	static logical_box(w, v){
		var logica={};

		logica.a=['-', w];
		logica.b=[w, v];
		logica.z=['-'];
		logica.p=[1, 0];
		logica.q=[0, 1];

		var index=2;
		var a=w, b=v, c, z, p, q;

		while(b>0){
			z = Math.floor(a/b);
			p = logica.p[index-2]-z*logica.p[index-1];
			q = logica.q[index-2]-z*logica.q[index-1];

			c=a%b;
			a=b;
			b=c;
			logica.a.push(a);
			logica.b.push(b);

			logica.z.push(z);
			logica.p.push(p);
			logica.q.push(q);
			index+=1;
		}
		return logica;
	}
	
	//Generates random color
	static _presentation_color_generator(beg=0, end=255){
		var col="#", s=0;
		for (var i=0; i<3; i++){
			s=Math.ceil(Math.random()*(end-beg)+beg).toString(16);
			if (s.length==1) s="0"+s;
			col=col+s;
		}
		return col;
	}

	static _presentation_fill_one_div(div, n){
		var buttons=[];
		for (var i=0; i<n; i++){
			var btn=Modern_representation.button_creator('', {});
			Representation_utils.Painter(btn, 0);
			div.appendChild(btn);
			buttons.push(btn);
		}
		return buttons;
	}

	static _presentation_lower(buttons, range){
		for (i=range[0]; i<range[1]; i++){
			buttons[i].style.display='none';
		}
	}
	static _presentation_lower_inverse(buttons, range){
		for (i=range[0]; i<range[1]; i++){
			buttons[i].style.display='inline-block';
		}
	}
	static _presentation_swap(buttons1, buttons2, a, b){
		var i;
		if (a<b){
			for (i=a; i<b; i++) buttons1[i].style.display='none';
			for (i=a; i<b; i++) buttons2[i].style.display='inline-block', buttons2[i].style.backgroundColor='#440000';
		}
		else{
			for (i=b; i<a; i++) buttons1[i].style.display='inline-block', buttons1[i].style.backgroundColor='#440000';
			for (i=b; i<a; i++) buttons2[i].style.display='none';
		}
	}
	static _presentation_unswap(buttons1, buttons2, a, b){
		SuperEuclid._presentation_swap(buttons1, buttons2, b, a);
	}

	static _presentation_color(fun, buttons, range, div){
		var i, j, color, to_pass=[];
		var v=range[1]%div;
		for (i=v; i<range[1]; i+=div){
			color=SuperEuclid._presentation_color_generator();
			for (j=i; j<i+div; j++){
				to_pass.push([buttons[j], 0, color, 0]);
			}
		}
		return to_pass;
	}

	static _presentation_shower(obj){
		if (!obj.shower){
			var erste_div=Modern_representation.div_creator('', {
				'general':{
					'left':0,
					'display':'inline-block',
				},
				'%':{
					'width':30,
				}
			});
			var zweite_div=Modern_representation.div_creator('', {
				'general':{
					'left':0,
					'display':'inline-block',
				},
				'%':{
					'width':30,
				}
			});

			obj.place.appendChild(erste_div);
			obj.place.appendChild(zweite_div);

			if (obj.logic.w < obj.logic.v){
				obj.buttons.partial_a = ArrayUtils.revert(SuperEuclid._presentation_fill_one_div(erste_div, obj.logic.v));
				obj.buttons.partial_b = ArrayUtils.revert(SuperEuclid._presentation_fill_one_div(zweite_div, obj.logic.v));
				for (var i=obj.logic.w; i<obj.logic.v; i++) obj.buttons.partial_a[i].style.display='none';
			}
			else{
				obj.buttons.partial_a = ArrayUtils.revert(SuperEuclid._presentation_fill_one_div(erste_div, obj.logic.w));
				obj.buttons.partial_b = ArrayUtils.revert(SuperEuclid._presentation_fill_one_div(zweite_div, obj.logic.v));
			}
		}
	}

	static _presentation_construct_div_and_grid(obj, ln, cols){
		var div = obj.modern_divsCreator(1, ln+2, []);
		for (var i=0; i<ln+2; i++) div.divs[i].style.height='30px';
		for (var i=0; i<ln+2; i++) div.zdivs[i].buttons.style.height='30px';
		var grid = new Grid(ln+2, cols, obj.stylistic, {'place':div.zdivs});
		div.full_div.style.display='inline-block';
		if (obj.shower) div.full_div.style.marginLeft='40%';
		else div.full_div.style.marginLeft='15%';

		return {'div':div, 'grid':grid};
	}


	static StatementComprehension(system, a, b, index){
		var strr=``;
		if (system==1 || system==0) strr=`I find modulus from dividing a and b: a%b=${a[index-1]}%${b[index-1]}=${b[index]}`;
		if (system==2) strr=`Modulus a%b is found (it's equal to ${b[index]}), it's written to a`;
		if (system==3) strr=`Now I swap a and b, so that b(${b[index]}) will be lower than a(${a[index]})`;
		if (system==100) strr=`b is equal to 0, so algorithm finishes - gcd(${a[1]}, ${b[1]}) is a=${a[a.length-1]}`;
		return strr;
	}

	static StateMaker(obj){
		var l=obj.lees.length;
		var s=obj.lees[l-1], staat=[], i;
		var staat=obj.ephemeral.staat, passer=obj.ephemeral.passer;
		var index=s[1];

		if (s[0]==0 || s[0]==1) obj.pass_color(obj.buttons.index[index]);

		if (s[0]==2){
			staat.push([1, obj.buttons.a[index], obj.logic.a[index], obj.logic.b[index]]);
			staat.push([1, obj.buttons.b[index], obj.logic.b[index], obj.logic.a[index]]);
			obj.pass_color(obj.buttons.a[index]);
			obj.pass_color(obj.buttons.b[index]);

			obj.pass_color(obj.buttons.a[index-1], 0, 14);
			obj.pass_color(obj.buttons.b[index-1], 0, 14);
		}

		if (s[0]==3){
			staat.push([1, obj.buttons.a[index], obj.logic.b[index], obj.logic.a[index]]);
			staat.push([1, obj.buttons.b[index], obj.logic.a[index], obj.logic.b[index]]);
			obj.pass_color(obj.buttons.a[index], 0);
			obj.pass_color(obj.buttons.b[index], 0);
		}
		if( s[0]==100){
			staat.push([0, obj.buttons.a[obj.logic.a.length-1], 0, 8]);
		}

		if (!obj.shower){
			if (s[0]==0 || s[0]==1){
				var to_color=SuperEuclid._presentation_color(obj.pass_color, obj.buttons.partial_a, [0, obj.logic.a[index-1]], obj.logic.b[index-1]);
				for (var x of to_color) obj.pass_color(...x);
			}
			if (s[0]==2) staat.push([5, SuperEuclid._presentation_lower, SuperEuclid._presentation_lower_inverse, [obj.buttons.partial_a, [obj.logic.b[index], obj.logic.a[index-1]] ]]);
			if (s[0]==3) staat.push([5, SuperEuclid._presentation_swap, SuperEuclid._presentation_unswap, [obj.buttons.partial_a, obj.buttons.partial_b, obj.logic.a[index], obj.logic.b[index]] ]);
		}
	}

	static NextState(obj){
		var l=obj.lees.length;
		var s=obj.lees[l-1];

		if (s[0]==100) return;
		var index=s[1];

		if (s[0]==1 || s[0]==0) return [2, index];
		if (s[0]==2) return [3, index];
		if (s[0]==3 && index < obj.logic.a.length-1) return [1, index+1];
		if (s[0]==3) return [100];
	}
}

class EuclidGcd extends Algorithm{
	logical_box(){
		var logica = SuperEuclid.logical_box(this.logic.w, this.logic.v);
		Object_utils.merge(this.logic, logica)
	}

	presentation(){
		var ln=this.logic.a.length-1;
		SuperEuclid._presentation_shower(this);
		var elems = SuperEuclid._presentation_construct_div_and_grid(this, ln, 3);
		var grid=elems.grid;
		var div=elems.div;

		var mx_width = Representation_utils.get_width(Math.max(this.logic.v, this.logic.w), 30);
		var partial_stylistic = {'general':{'border':'1px solid white'}, 'px':{'width':mx_width, 'height':30}};
		var standard_stylistic = {'color':4, 'stylistic':partial_stylistic};

		grid.filler([0, [0, 2]], ['i', 'a<sub>i</sub>', 'b<sub>i</sub>'], {'color':5, 'stylistic':partial_stylistic});
		this.buttons.index = [null].concat(grid.filler([[1, ln], 0], ArrayUtils.range(1, ln), standard_stylistic));
		this.buttons.a = [null].concat(grid.filler([[1, ln], 1], this.logic.a.slice(1), standard_stylistic));
		this.buttons.b = [null].concat(grid.filler([[1, ln], 2], this.logic.b.slice(1), standard_stylistic));

		this.Painter(this.buttons.a[1], 0);
		this.Painter(this.buttons.b[1], 0);
		this.Painter(this.buttons.index[1], 0);
	}

	palingnesia(){
		this.logical_box();
		this.presentation();
	}

	read_data(){
		var fas=this.input.value;
		var c=this.dissolve_input(fas);
		this.logic.w=c.get_next();
		this.logic.v=c.get_next();
	}

	constructor(block, a, b){
		super(block);
		this.logic.w=a;
		this.logic.v=b;
		this.version=4;
		this.check=block.check;
		this.palingnesia();
	}

	BeginningExecutor(){
		this.shower = this.check.checked;
		this.read_data();
		this.palingnesia();
		this.lees.push([0, 2]);
	}

	StateMaker(){
		SuperEuclid.StateMaker(this);
	}

	NextState(){
		return SuperEuclid.NextState(this);
	}

	Painter(btn, col=1, only_bg=0){
		if (typeof col === 'string' || col instanceof String){
			btn.style.backgroundColor = col;
			return;
		}
		var style_border=btn.style.border;
		super.Painter(btn, col, only_bg);
		btn.style.border=style_border;
	}

	StatementComprehension(){
		var l=this.lees.length;
		var s=this.lees[l-1], index=s[1];

		return SuperEuclid.StatementComprehension(s[0], this.logic.a, this.logic.b, index);
	}
}

class ExtendedEuclidGcd extends Algorithm{
	logical_box(){
		var logica = SuperEuclid.logical_box(this.logic.w, this.logic.v);
		Object_utils.merge(this.logic, logica)
	}

	presentation(){
		var ln=this.logic.a.length;
		SuperEuclid._presentation_shower(this);
		var elems = SuperEuclid._presentation_construct_div_and_grid(this, ln, 6);
		var grid=elems.grid;
		var div=elems.div;

		var mx_width = Representation_utils.get_width(Math.max(this.logic.v, this.logic.w), 30);
		var partial_stylistic = {'general':{'border':'1px solid white'}, 'px':{'width':mx_width, 'height':30}};
		var standard_stylistic = {'color':4, 'stylistic':partial_stylistic};

		grid.filler([0, [0, 5]], ['i', 'a<sub>i</sub>', 'b<sub>i</sub>', 'z<sub>i</sub>', 'p<sub>i</sub>', 'q<sub>i</sub>'], {'color':5, 'stylistic':partial_stylistic});


		var elements=[
			['index', ArrayUtils.range(0, ln)],
			['a', this.logic.a],
			['b', this.logic.b],
			['z', this.logic.z],
			['p', this.logic.p],
			['q', this.logic.q],
		];
		
		var i=0;
		for (var x of elements){
			this.buttons[x[0]] = grid.filler([[1, ln+1], i], x[1], standard_stylistic);
			this.Painter(this.buttons[x[0]][0], 0);
			if (x[0]!='z') this.Painter(this.buttons[x[0]][1], 0);
			i+=1;
		}
	}

	palingnesia(){
		this.logical_box();
		this.presentation();
	}

	read_data(){
		var fas=this.input.value;
		var c=this.dissolve_input(fas);
		this.logic.w=c.get_next();
		this.logic.v=c.get_next();
	}

	constructor(block, a, b){
		super(block);
		this.logic.w=a;
		this.logic.v=b;
		this.version=4;
		this.check=block.check;
		this.palingnesia();
	}

	BeginningExecutor(){
		this.shower = this.check.checked;
		this.read_data();
		this.palingnesia();
		this.lees.push([0, 2]);
	}

	StateMaker(){
		SuperEuclid.StateMaker(this);

		var l=this.lees.length;
		var s=this.lees[l-1], staat=[], i;
		var staat=this.ephemeral.staat, passer=this.ephemeral.passer;
		var index=s[1];


		if (s[0]==0 || s[0]==1){
			this.pass_color(this.buttons.z[index-1]);
			this.pass_color(this.buttons.a[index-1], 0, 14);
			this.pass_color(this.buttons.b[index-1], 0, 14);
		}
		if (s[0]==3){
			this.pass_color(this.buttons.p[index-1], 0, 13);
			this.pass_color(this.buttons.q[index-1], 0, 14);

			this.pass_color(this.buttons.p[index-2], 0, 13);
			this.pass_color(this.buttons.q[index-2], 0, 14);
			this.pass_color(this.buttons.z[index-1], 0, [13,14]);

			this.pass_color(this.buttons.p[index]);
			this.pass_color(this.buttons.q[index]);
		}
		if( s[0]==100){
			staat.push([0, this.buttons.b[this.logic.b.length-2], 0, 8]);
			staat.push([0, this.buttons.p[this.logic.b.length-2], 0, 101]);
			staat.push([0, this.buttons.a[1], 0, 101]);

			staat.push([0, this.buttons.b[1], 0, 15]);
			staat.push([0, this.buttons.q[this.logic.b.length-2], 0, 15]);
		}
	}

	NextState(){
		return SuperEuclid.NextState(this);
	}

	Painter(btn, col=1, only_bg=0){
		if (typeof col === 'string' || col instanceof String){
			btn.style.backgroundColor = col;
			return;
		}
		var style_border=btn.style.border;
		super.Painter(btn, col, only_bg);
		btn.style.border=style_border;
	}

	StatementComprehension(){
		var l=this.lees.length;
		var prev=this.lees[l-2], last=this.lees[l-1];
		var ln=last[1], index=last[1];
		var a=this.logic.a, b=this.logic.b, z=this.logic.z, p=this.logic.p, q=this.logic.q;
		var strr=SuperEuclid.StatementComprehension(last[0], this.logic.a, this.logic.b, index);

		if (last[0]==1 || last[0]==0) strr+=`. Result of dividing a by b is z=a/b=${a[index-1]}/${b[index-1]}=${z[index]} - it will be used to calculate next p and q`;
		if (last[0]==3) strr+=`. I also change p<sub>i</sub>=p<sub>i-2</sub>-z*p<sub>i-1</sub>, q=q<sub>i-2</sub>-z*q<sub>i-1</sub>, so that p<sub>i</sub>*u+q<sub>i</sub>*v are equal to current b=${b[index]} in the algorithm`;
		if (last[0]==100) strr+=`. Numbers x, y such that u*x+v*y=gcd(u,v) are x=p<sub>i-1</sub>=${p[p.length-2]}, y=q<sub>i-1</sub>=${q[q.length-2]}: u*x+v*y=${this.logic.w}*${p[p.length-2]}+${this.logic.v}*${q[q.length-2]}=${this.logic.w*p[p.length-2]+this.logic.v*q[q.length-2]}`;
		return strr;
	}
}

var feral=Algorithm.ObjectParser(document.getElementById('Algo1'));
feral.check=document.getElementById('Nothingness1');
var eg1=new EuclidGcd(feral, 84, 35);

var feral2=Algorithm.ObjectParser(document.getElementById('Algo2'));
feral2.check=document.getElementById('Nothingness2');
var eg2=new ExtendedEuclidGcd(feral2, 84, 35);
