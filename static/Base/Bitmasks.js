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

export default Bitmasks;
