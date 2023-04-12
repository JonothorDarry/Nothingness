class NTMath_presentation{
	static show_factorization(factors){
		var lst=factors.map(function(e){return `${e.base}<sup>${e.expo}</sup>`});
		return lst.join('');
	}
}
export default NTMath_presentation;
