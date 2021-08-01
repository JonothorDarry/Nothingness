class Kummer extends Partial{
	constructor(block, x){
		super(block);
		this.ShowReality(x);
	}

	read_data(){
		var c=this.dissolve_input(this.input.value);

		this.logic.n=c.get_next();
		this.logic.d=c.get_next();
	}

	logical_box(){
		var i, j;

		this.logic.cn=[[1]];
		for (j=1; j<=this.logic.n; j++) this.logic.cn[0].push(0);

		for (i=1; i<=this.logic.n; i++){
			this.logic.cn.push([1]);
			for (j=1; j<=this.logic.n; j++){
				this.logic.cn[i].push((this.logic.cn[i-1][j-1]+this.logic.cn[i-1][j])%this.logic.d);
			}
		}
	}


	_btn_appender(place, btn, color=-1){
		if (color!=-1) this.Painter(btn, color);
		place.appendChild(btn);
	}
	_full_btn_appender(place, name=null, color=-1){
		var btn;
		if (name==null) btn=this.buttCreator();
		else btn=this.buttCreator(name);
		this._btn_appender(place, btn, color);
	}

	_stickify(btn, places, index){
		btn.style.position="sticky"
		for (var x of places) btn.style[x]=0;
		btn.style.zIndex=index;
	}

	presentation(){
		var divs=this.modern_divsCreator(1, this.logic.n+2, []);
		this.place.style.width=`max-content`;
		this.buttons={'x':[], 'y':[], 'cn':[], 'basis':null};

		var i=0, j, btn;

		this._stickify(divs.divs[0], ['top'], 2);
		btn=this.buttCreator('n\\k');
		this.buttons.basis=btn;
		this._btn_appender(divs.zdivs[0].buttons, btn, 8);
		for (j=0; j<=this.logic.n; j++){
			btn=this.buttCreator(j);
			this.buttons.x.push(btn);
			this._btn_appender(divs.zdivs[0].buttons, btn, 5);
		}

		//Meat
		for (i=0; i<=this.logic.n; i++){
			this.buttons.cn.push([]);

			btn=this.buttCreator(i);
			this.buttons.y.push(btn);
			this._btn_appender(divs.zdivs[i+1].buttons, btn, 5);
			for (j=0; j<=i; j++){
				btn=this.buttCreator(this.logic.cn[i][j]);
				this.buttons.cn[i].push(btn);
				this.buttons.cn[i][j].dataProperties={'i':i, 'j':j, 'elems_x':this.buttons.x[j], 'elems_y':this.buttons.y[i]};

				//On the usury of preferences
				this.buttons.cn[i][j].addEventListener('mouseenter', function(){
					var prop=this.dataProperties;
					prop.elems_x.style.backgroundColor='#888888';
					prop.elems_y.style.backgroundColor='#888888';
				});
				this.buttons.cn[i][j].addEventListener('mouseleave', function(){
					var prop=this.dataProperties;
					prop.elems_x.style.backgroundColor='#000000';
					prop.elems_y.style.backgroundColor='#000000';
				});

				this._btn_appender(divs.zdivs[i+1].buttons, btn, ((this.logic.cn[i][j]%this.logic.d)==0)?8:0);
			}
		}

		for (i=0; i<=this.logic.n; i++){
			this._stickify(this.buttons.y[i], ['left'], 1);
		}
		this._stickify(this.buttons.basis, ['top', 'left'], 1);
	}

	ShowReality(x=-1){
		this.starter();
		this.read_data();
		this.logical_box();

		this.presentation();
	}
}

var feral1=Partial.ObjectParser(document.getElementById('Algo1'));
var sk1=new Kummer(feral1, 77);
