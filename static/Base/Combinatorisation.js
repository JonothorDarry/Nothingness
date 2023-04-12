class Combinatorisation{
	static make_system_combinations_repetitions(n, k){
		var all_combinats=[];
		var i, j, cur_perm=[], new_perm, zeros;
		for (i=0; i<n-k; i++) cur_perm.push(0);
		for (i=0; i<k; i++) cur_perm.push(1);
		all_combinats.push(cur_perm);

		while (true){
			new_perm=[], zeros=0;
			for (i=n-1; i>0; i--){
				if (cur_perm[i]==1 && cur_perm[i-1]==0) break;
			}
			if (i==0) break;
			for (j=0; j<i-1; j++) {
				new_perm.push(cur_perm[j]);
				if (cur_perm[j]==0) zeros++;
			}
			new_perm.push(1);
			for (j=0; j<n-k-zeros; j++) new_perm.push(0);
			for (j=j+i; j<n; j++) new_perm.push(1);
			all_combinats.push(new_perm);
			cur_perm=new_perm;
		}
		return all_combinats;
	}

	static combination_repetitions_to_list(list){
		var counter=0, elems=[];
		for (var x of list){
			if (x==1) elems.push(counter);
			else counter+=1;
		}
		return elems;
	}
}
export default Combinatorisation.js;
