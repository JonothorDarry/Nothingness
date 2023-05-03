import Representation_utils from './Representation_utils.js';
import Modern_representation from './Modern_representation.js';
import ArrayUtils from './ArrayUtils.js';

class Algorithm{
	static alldict={};

	Creato(block){
		this.inbut=block.sendButton;
		this.nextbut=block.nextButton;
		this.prevbut=block.prevButton;
		this.finitbut=block.finitButton;
		this.progress_bar = block.progressBar;

		//Adding button ids to dictionary alldict
		Algorithm.alldict[this.inbut.id]=this;
		Algorithm.alldict[this.nextbut.id]=this;
		Algorithm.alldict[this.prevbut.id]=this;
		Algorithm.alldict[this.finitbut.id]=this;
		Algorithm.alldict[this.progress_bar.id]=this;

		//Beginning button & sequence
		this.inbut.addEventListener('click', function(){
			var zis=Algorithm.alldict[this.id];
			zis.post_beginning_executor(); //Here all system is generated
			zis.ChangeStatement();
		});

		//Next value
		this.nextbut.addEventListener('click', function(){
			var zis=Algorithm.alldict[this.id];
			zis.full_state_mover();
			zis.ChangeStatement();
		});

		//Previous value
		this.prevbut.addEventListener('click', function(){
			var zis=Algorithm.alldict[this.id];
			zis.full_state_remover();
			zis.ChangeStatement();
		});

		//Finish Algorithm instantly    
		this.finitbut.addEventListener('click', function(){
			var zis=Algorithm.alldict[this.id];
			zis.FinishingSequence();
		});

		//Change point in algorithm
		this.progress_bar.addEventListener('input', function(){
			var zis=Algorithm.alldict[this.id];
			var proto = this.value;
			while (proto > zis.state_nr) zis.full_state_mover();
			while (proto < zis.state_nr) zis.full_state_remover();
			zis.ChangeStatement();
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
		if (this.lees[this.lees.length-1][0] >= 100) return true;
		return false;
	}

	is_runtime_finished(){
		return this.state_nr == this.all_states_nr;
	}

	//Default action after finish
	finishing_sequence_basic(){
		while (!this.isFinished()){
			if (this.version >= 4) this.new_next_state();
			else this.NextState();
		}

		for (var state of this.lees) this.post_state_maker(state);
	}

	FinishingSequence(){
		while (this.state_nr < this.all_states_nr){
			this.state_nr+=1;
			this.transformator(this.state_transformation[this.state_nr]);
		}
		this.ChangeStatement();
		this.update_progress();
	}

	full_state_mover(){
		if (this.state_nr < this.all_states_nr){
			this.state_nr += 1;
			this.transformator(this.state_transformation[this.state_nr]);
			this.update_progress();
		}
	}

	full_state_remover(){
		if (this.state_nr > 0){
			this.StateUnmaker();
			this.state_nr -= 1;
			this.update_progress();
		}
	}

	post_beginning_executor(){
		this.starter();
		this.BeginningExecutor();
		this.progress_starter();
	}

	post_state_maker(state){
		this.before_state_maker();
		this.StateMaker(state);
		this.after_state_maker();
	}

	before_state_maker(){
		this.ephemeral.staat=this.pass_to_next_state.slice();
		this.ephemeral.passer=[];
	}

	after_state_maker(){
		this.ephemeral.staat.push([3, "pass_to_next_state", this.pass_to_next_state, this.ephemeral.passer]);
		this.fill_in_the_blank_states(this.ephemeral.staat);
		this.transformator(this.ephemeral.staat);
		
		this.state_transformation.push(this.ephemeral.staat);

		this.ephemeral={'staat':null, 'passer':null};
	}

	new_next_state(){ //Used only at the beginning
		var next_state=this.NextState();
		if (next_state!=null){ //Konieczne 2? Sprawdzić
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
	dissolve_input(str, bigint=false){
		var lst=[], j=0, i=0, x, is_string=false, negative=false;
		lst.iter=-1;
		var a = ((bigint)?0n:0);
		lst.get_next=function(){this.iter+=1; return this[this.iter];}

		while (j<str.length){
			negative = false;
			is_string = false;

			for (;i<str.length;i++){
				x=str.charCodeAt(i);
				if (x==45 && is_string==false) negative = true;
				else if (x<58 && x>=48 && is_string==false){
					if (bigint) a=a*10n+BigInt(x)-48n;
					else a=a*10+x-48;
				}
				else if ( (x>=65 && x<=90) || (x>=97 && x<=122) ){
					if (a==0) a="";
					a+=str[i];
				}
				else break;
			}

			if (negative && !is_string) a = -a;
			if (j!=i) lst.push(a);
			else i++;
			j=i, a = (bigint?0n:0);
		}
		return lst;
	}

	//Operations starting BeginningExecutor
	starter(){
		if (this.querier == true) this.reset_state_machine(true);

		this.lees=[];
		this.state_transformation=[];
		this.state={};
		this.place.innerHTML='';
		this.ephemeral={'staat':null, 'passer':null};
		this.pass_to_next_state=[];
		this.logic={};
		this.state_nr=0;
	}

	progress_starter(){
		this.finishing_sequence_basic();
		this.state_nr = this.lees.length - 1;
		this.all_states_nr = this.state_nr;

		this.reset_state_machine(false);
		this.progress_bar.setAttribute('min', 0);
		this.progress_bar.setAttribute('max', this.all_states_nr);
		this.update_progress();
	}

	update_progress(){
		this.progress_bar.value = this.state_nr;
	}

	reset_state_machine(everything){
		while (this.state_nr > 0) this.full_state_remover();
		if (everything) this.StateUnmaker(); //Move before state 0 - only for unmaker's eyes
	}

	//Reversing operation
	StateUnmaker(){
		var i, elem;

		if (this.state_nr < 0 || this.state_nr == undefined || this.state_transformation.length == 0) return; //last condition - botched algorithm before
		//Back to times of Splendor: 0 - buttons, 1 - innerHTML, 2 - list, 3 - field, 5 - fun
		var x=this.state_transformation[this.state_nr];
		for (i=x.length-1; i>=0; i--){
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
			if (elem[0]==7) Modern_representation.style(elem[1], elem[2]);
		}
	}

	StatementComprehension(){}

	//Creates buttons
	buttCreator(numb=null, col=0){
		return Representation_utils.button_creator(this.stylistic, numb, col);
	}


	//Create Button
	doubleButtCreator(v, fun){
		return Representation_utils.double_button_creator(this.stylistic, v, fun);
	}

	fill_in_the_blank_states(staat){
		var x;
		for (var i=0; i<staat.length; i++){
			x = staat[i];
			if (x[0] == 0 && x.length == 3) staat[i] = [7, x[1], Modern_representation.get_old_style_parts(x[1], Modern_representation.color_styles[ArrayUtils.is_iterable(x[2])?(x[2][0]):x[2]]), Modern_representation.get_style_from_id(x[2])];
			else if (x[0] == 0) staat[i] = [7, x[1], Modern_representation.get_style_from_id(x[2]), Modern_representation.get_style_from_id(x[3])];
			else if (x[0] == 7 && x.length == 3) staat[i] = [x[0], x[1], Modern_representation.get_old_style_parts(x[1], x[2]), x[2]];
		}
	}

	//Execute changes in the last state
	transformator(staat){
		var x, i;
		for (i=0;i<staat.length;i++){
			x=staat[i];
			if (x[0]==0) this.Painter(x[1], x[3]); //Probably not used
			if (x[0]==1) x[1].innerHTML=x[3];
			if (x[0]==2) x[1].push(x[2]);
			if (x[0]==3) this[x[1]]=x[3];
			if (x[0]==5) x[1](...x[3]);
			if (x[0]==6){
				x[1].iterator += 1;
				if (x[1].button) x[1].button.innerHTML = x[1].values[x[1].iterator];
			}
			if (x[0]==7) Modern_representation.style(x[1], x[3]);
		}
	}

	//Specific change - passing colors between states
	pass_color(btn, col_before=4, col_mid=1, col_after=0){
		this.ephemeral.staat.push([0, btn, col_before, col_mid]);
		this.ephemeral.passer.push([0, btn, col_mid, col_after]);
	}

	modern_pass_color(btn, col_mid=1, col_after=0){
		this.ephemeral.staat.push([0, btn, col_mid]);
		this.ephemeral.passer.push([0, btn, col_mid, col_after]);
	}

	modern_pass_style(btn, style_mid=1, style_after=0){
		if (! style_mid instanceof Object) style_mid = Modern_representation.color_styles[style_mid];
		if (! style_after instanceof Object) style_after = Modern_representation.color_styles[style_after];
		this.ephemeral.staat.push([7, btn, style_mid]);
		this.ephemeral.passer.push([7, btn, style_mid, style_after]);
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


	//To fix - trashcode
	static ObjectParser(v, id=0){
		if (id == 0){
			var dick={
			       'primePlace':v.getElementsByClassName('primez')[0],
			       'sendButton':v.getElementsByClassName('sender')[0],
			       'prevButton':v.getElementsByClassName('previous')[0],
			       'nextButton':v.getElementsByClassName('next')[0],
			       'input':v.getElementsByClassName('inputter')[0],
			       'output':v.getElementsByClassName('comprehend')[0],
			       'finitButton':v.getElementsByClassName('finish')[0],
			       'progressBar':v.getElementsByClassName('progress')[0]
			};
		}

		else{
			var dick={
				'primePlace':document.getElementById(`Primez${id}`),
				'sendButton':document.getElementById(`Sender${id}`),
				'prevButton':document.getElementById(`Prever${id}`),
				'nextButton':document.getElementById(`Nexter${id}`),
				'input':document.getElementById(`SomeInput${id}`),
				'output':document.getElementById(`Comprehend${id}`),
				'finitButton':document.getElementById(`Finisher${id}`),
				'progressBar':document.getElementById(`Progress${id}`)
			};
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
			if (values.length > 0 && btn_list!=null) btn_list.innerHTML = values[0];
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

	Painter(btn, col=1, only_bg=0) {
		return Representation_utils.Painter(btn, col, only_bg);
	}
}
export default Algorithm;
