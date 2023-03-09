class LCA_RMQ extends Algorithm{
	logical_box(){
	}
	presentation(){
	}

	palingenesia(){
		this.logical_box();
		var buttons={};
	}

	read_data(){
		var fas=this.input.value;
		var c=this.dissolve_input(fas);
		var edges=Modern_tree.tree_reader(c);
		this.logic.tree = new Modern_tree(edges);
	}

	constructor(block, edges){
		super(block);
		this.logic.tree = new Modern_tree(edges);

		this.version=5;
		this.palingenesia();
		console.log(this.logic.tree)
	}

	BeginningExecutor(){
		this.read_data();
		this.palingenesia();
		this.lees.push([0]);
	}

	StateMaker(s){
		var i, staat=this.ephemeral.staat, passer=this.ephemeral.passer;

		if (s[0]==0){
			for (i=0; i<=this.logic.L; i++){
				this.pass_color(this.buttons.counts[i], 0, 1);
			}
		}
	}

	NextState(){
		var l=this.lees.length;
		var s=this.lees[l-1];

		if (s[0]==0) return [100];
	}

	StatementComprehension(){
		var l=this.lees.length;
		var s=this.lees[l-1], x=s[1];

		if (s[0]==0) return `Whatever`;
	}
}
export default LCA_RMQ;
