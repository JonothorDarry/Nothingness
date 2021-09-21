class Sieve extends Algorithm{
    logical_box(){
        this.logic.lpf = NTMath.sievify(this.logic.n);
    }

    presentation(){
		var buttons={'sieve':[]}, i=0, j=0, btn;
        var dv = Modern_representation.div_creator('', {'general':{'width':null}});
        for (i=0; i<=this.logic.n; i++){
            btn = Modern_representation.button_creator(i, {'general':{'backgroundColor':'#440000'}});
            buttons.sieve.push(btn);
            dv.appendChild(btn);
        }
        this.place.appendChild(dv);
    }

	palingnesia(){
		this.logical_box();
        this.presentation();
	}

	read_data(){
		var fas=this.input.value;
		var c=this.dissolve_input(fas);
		this.logic.n=c.get_next();
	}

	constructor(block, n){
		super(block);
		this.logic.n=n;
		this.version=4;
		this.palingnesia();
	}

	BeginningExecutor(){
		this.read_data();
		this.palingnesia();
		this.lees.push([0]);
	}

	StateMaker(){
		var l=this.lees.length;
		var s=this.lees[l-1], staat=[], i;
		var staat=this.ephemeral.staat, passer=this.ephemeral.passer;

		if (s[0]==0){
            
		}
	}

	NextState(){
		var l=this.lees.length;
		var s=this.lees[l-1], staat=[], i;
		var staat=this.ephemeral.staat, passer=this.ephemeral.passer;

        if (s[0]==0) return [2, 2];
		if (s[0]==1){
			if (s[2]+s[1] <= this.logic.n) return [1, s[1], s[1]+s[2]];
            else if ((s[1]+1)*(s[1]+1) <= this.logic.n) return [2, s[1]+1];
			else return [100];
		}

		else if (s[0]==2){
			if (s[1]*s[1] > this.logic.n) this.lees.push([100]);
			else if (this.PrimeCheck(s[2])==1 && s[2]*s[2]<=s[1]) this.lees.push([0, lim, s[2]*s[2], s[2]]);
			else this.lees.push([1, lim, s[2]+1]);
		}
	}

	StatementComprehension(){
		var l=this.lees.length;
		var s=this.lees[l-1], x=s[1];

		if (s[0]==0) return `Whatever`;
	}
}
