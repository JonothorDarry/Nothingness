import Algorithm from './Algorithm.js';
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
export default Partial;
