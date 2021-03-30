function make_toc(){
	var lst=document.querySelectorAll('h1,h2,h3,h4,h5,h6');
	var toc=document.getElementById('toc_list');
	var contents=[], numbers=[0, 0, 0, 0, 0, 0], Limit=4;
	var title="";

	for (i=0; i<lst.length; i++){
		lst[i].id=`${i}.${lst[i].innerHTML}`;
		numbers[lst[i].tagName[1]-1]++;
		for (j=lst[i].tagName[1]; j<6; j++) numbers[j]=0;
		if (lst[i].tagName[1]=='1' || lst[i].tagName[1]>Limit) continue;

		for (j=1; j<lst[i].tagName[1]; j++) title+=`&nbsp;&nbsp;`;
		for (j=1; j<lst[i].tagName[1]; j++) title+=`${numbers[j]}.`;
		title+=` ${lst[i].innerHTML}`;

		var refer=document.createElement("A");
		refer.classList.add("toc");
		if (lst[i].className=='shower') refer.classList.add("shower"); //Dubious - prevent 2nd class
		if (lst[i].className=='algo') refer.classList.add("algo");
		if (lst[i].className=='querier') refer.classList.add("querier");
		refer.href=`#${lst[i].id}`;

		refer.innerHTML=title;
		var tr=document.createElement("TR");
		var td=document.createElement("TR");
		tr.appendChild(td);
		td.appendChild(refer);

		toc.appendChild(td);
		title="";
	}
}

make_toc();
