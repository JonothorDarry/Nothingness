class Muller extends Partial{
	constructor(block, x){
		super(block);
		this.ShowReality(x);
	}

	read_data(){
		this.logic.m=this.input.value;
	}

	_logical_find_all_expos(){
		this.logic.neo_toth=this.logic.m-1;
		this.logic.expos=[];

		for (var x=this.logic.neo_toth; true; x=Math.floor(x/2)){
			this.logic.expos.push(x);
			if (x%2!=0) break;
		}
	}
	_logical_find_all_power(){
		var i, j;

		this.logic.power=[[]];
		for (i=1; i<=this.logic.m; i++){
			this.logic.power.push([]);
			for (j=0; j<this.logic.expos.length; j++){
				this.logic.power[i].push(NTMath.pow(i, this.logic.expos[j], this.logic.m));
				if ((i==0 && this.logic.power[i][j]!=1) || (i>0 && this.logic.power[i][j]!=1)) break;
			}
		}
	}

	logical_box(){
		this._logical_find_all_expos();
		this._logical_find_all_power();
	}

	_btn_appender(place, name=null, color=-1){
		var btn;
		if (name==null) btn=this.buttCreator();
		else btn=this.buttCreator(name);
		if (color!=-1) this.Painter(btn, color);
		
		place.appendChild(btn);
	}

	presentation(){
		var divs=this.modern_divsCreator(1, this.logic.m, []);
		var i=0, j, btn;
		
		this._btn_appender(divs.zdivs[0].buttons, "g", 5);
		this._btn_appender(divs.zdivs[0].buttons, "g<sup>x</sup>; x=", 5);
		for (j=0; j<this.logic.expos.length; j++){
			this._btn_appender(divs.zdivs[0].buttons, this.logic.expos[j], 5);
		}

		//Meat
		for (i=1; i<this.logic.m; i++){

			var last=this.logic.power[i][this.logic.power[i].length-1];
			if (NTMath.gcd(i, this.logic.m)>1){
				divs.divs[i].style.display="none";
				this._btn_appender(divs.zdivs[i].buttons, i, 2);
			}
			else if (this.logic.power[i].length==1) this._btn_appender(divs.zdivs[i].buttons, i, 5);
			else if (last!=1 && last!=this.logic.m-1) this._btn_appender(divs.zdivs[i].buttons, i, 8);

			else this._btn_appender(divs.zdivs[i].buttons, i);
			this._btn_appender(divs.zdivs[i].buttons);

			for (j=0; j<this.logic.power[i].length; j++){
				this._btn_appender(divs.zdivs[i].buttons, this.logic.power[i][j]);
			}
		}
	}

	ShowReality(x=-1){
		this.starter();
		this.read_data();
		this.logical_box();

		this.presentation();
	}
}

var feral1=Partial.ObjectParser(document.getElementById('Algo1'));
var sk1=new Muller(feral1, 15);
