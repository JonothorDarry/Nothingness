import ArrayUtils from '../../Base/ArrayUtils.js';
import Modern_representation from '../../Base/Modern_representation.js';
import Representation_utils from '../../Base/Representation_utils.js';
import Grid from '../../Base/Grid.js';

class SuperEuclid{
	static logical_box(w, v){
		var logica={};

		logica.a=['-', w];
		logica.b=[w, v];
		logica.z=['-'];
		logica.p=[1n, 0n];
		logica.q=[0n, 1n];

		var index=2;
		var a=w, b=v, c, z, p, q;

		while(b>0){
			z = a/b;
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
		for (var i=range[0]; i<range[1]; i++){
			buttons[i].style.display='none';
		}
	}
	static _presentation_lower_inverse(buttons, range){
		for (var i=range[0]; i<range[1]; i++){
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
		for (var i=0; i<ln+2; i++) Modern_representation.button_modifier(div.divs[i], {'stylistic':{'px':{'height':30, 'lineHeight':30}}});
		for (var i=0; i<ln+2; i++) Modern_representation.button_modifier(div.zdivs[i].buttons, {'stylistic':{'px':{'height':30, 'lineHeight':30}}});

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

	static StateMaker(obj, s){
		var staat=[], i;
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
export default SuperEuclid;
