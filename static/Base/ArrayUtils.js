class ArrayUtils{
	static range(a, b, diff=1){
		var elements=[];
		if (diff>0)
			for (var i=a; i<=b; i+=diff) elements.push(i);
		else
			for (var i=a; i>=b; i+=diff) elements.push(i);
		return elements;
	}

	static steady(num, elem){
		var elements=[];
		for (var i=0; i<num; i++) elements.push(elem);
		return elements;
	}

	static sum(arr){
		var summer=(acc, starter) => acc+starter;
		return arr.reduce(summer, 0);
	}

	static is_iterable(value){
		return Symbol.iterator in Object(value);
	}

	//If value is sort of list - returns element under index, if not - returns value
	static get_elem(value, ite){
		if (ArrayUtils.is_iterable(value)){
			if (ite<0) return value[value.length+ite];
			return value[ite];
		}
		return value;
	}

	static back(value){
		return ArrayUtils.get_elem(value, -1);
	}

	static revert(lst){
		var rev_lst=[];
		for (var i=lst.length-1; i>=0; i--) rev_lst.push(lst[i]);
		return rev_lst;
	}

	//comparer(a,b): a<=b - True
	static binaria_lower(lst, elem, comparer){
		var r=lst.length-1, l=0, m=Math.floor(r/2);
		while (l<=r){
			m=Math.floor((l+r)/2);
			if (comparer(lst[m], elem)) l=m+1;
			else r=m-1;
		}
		return l;
	}
	static create_2d(dim1, dim2){
		var i, j, arr;
		arr=Array.apply(null, Array(dim1)).map(e => []);
		for (j=0; j<dim1; j++){
			for (i=0; i<dim2; i++) arr[j].push(0);
		}
		return arr;
	}

	static subsetting(array, d1, d2){
		var i=0, res=[];
		if (ArrayUtils.is_iterable(d1)){
			for (i=d1[0]; i<d1[1]; i+=1)
				res.push(array[i][d2]);
		}

		else{
			for (i=d2[0]; i<d2[1]; i+=1)
				res.push(array[i][d1]);
		}
		return res;
	}

	static zip(arr1, arr2){
		return Array.prototype.map.call(arr1, function(e,i){return [e, arr2[i]];})
	}
}

export default ArrayUtils;
