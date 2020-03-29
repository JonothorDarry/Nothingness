lees=[];
marked=Array.apply(null, Array(100)).map(function (x, i) { return 0; });
marked[0]=1;
marked[1]=1;


function MarkNormally(v){
	//document.getElementById('debug').innerHTML=v
	if (marked[v]==0){
    document.getElementById("Primez").getElementsByTagName("button")[v].style.backgroundColor='#440000';
    document.getElementById("Primez").getElementsByTagName("button")[v].style.color='#FFFFFF';
  }
  if (marked[v]==1){
    document.getElementById("Primez").getElementsByTagName("button")[v].style.backgroundColor='#FFFFFF';
    document.getElementById("Primez").getElementsByTagName("button")[v].style.color='#888888';
  }
}

function NextState(){
	var l=lees.length;
  var s=lees[l-1];
  var lim=s[1];
  
  document.getElementById('debug').innerHTML=lees;
  if (s[0]==0){
    if (s[2]+s[3]<=lim)	lees.push([0, lim, s[2]+s[3], s[3]]);
    else if (s[3]<=lim)	lees.push([1, lim, s[3]+1]);
    else	lees.push([100]);
  }
  
  else if (s[0]==1){
  	if (s[2]*s[2]>lim) 			lees.push([100]);
    else if (marked[s[2]]==0) 		lees.push([0, lim, s[2]*s[2], s[2]]);
    else lees.push([1, lim, s[2]+1]);
  }
}

function StateMaker(){
	var l=lees.length;
  var s=lees[l-1];
  var lim=s[1];
	
  if (s[0]==0) {
  	marked[s[2]]=1;
  	document.getElementById("Primez").getElementsByTagName("button")[s[2]].style.backgroundColor='#FFFF00';
    document.getElementById("Primez").getElementsByTagName("button")[s[2]].style.color='#888888';
  }
  if (s[0]==1) document.getElementById("Primez").getElementsByTagName("button")[s[2]].style.backgroundColor='#000000';
  if (l>1){
  	s=lees[l-2];
    //document.getElementById('debug').innerHTML=s;
    if (lees[l-1][0]!=0 || lees[l-2][0]!=1) MarkNormally(s[2]);
    if (s[0]==0 && s[2]+s[3]>s[1]) 		MarkNormally(s[3]);
  }
}

function buttCreator(v){
	var butt = document.createElement("BUTTON");
  butt.innerHTML=v;
  butt.style.backgroundColor="#440000"
  butt.style.color="#FFFFFF"
  butt.style.width="40px";
  butt.style.height="40px";
  butt.style.border="None";
  return butt;
}


var butt;
for (var i=0;i<100;i++){
	/*Button Stylization*/ 
	butt = buttCreator(i);
	//document.getElementById('Primez').innerHTML=i;
  document.getElementById('Primez').appendChild(butt);
}
var inbut=document.getElementById('Sender');
inbut.addEventListener('click', function(){
	fas=document.getElementById('Erasto').value;
  document.getElementById("Primez").textContent='';
  for (var i=0;i<=fas;i++){
  butt = buttCreator(i);
  document.getElementById("Primez").appendChild(butt);
  }
  
  lees.push([1, fas, 0]);
  StateMaker();
  lees.push([1, fas, 1]);
  StateMaker();
  NextState();
});

var nextbut=document.getElementById('Nexter');
nextbut.addEventListener('click', function(){
  StateMaker();
  NextState(); 
});


//x.value="Jonasz";
//var butt = document.createButton(1);
//x.appendChild(butt);
