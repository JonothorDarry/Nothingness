class Object_utils{
	static merge(base, substitute){
		for (var x in substitute){
			if (x in base) continue;
			base[x] = substitute[x];
		}
	}
	static construct_if_null(value){
		if (value!=null) return value;
		else return {};
	}
}
export default Object_utils;
