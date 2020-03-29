lees=[];
//Marked=1 - not prime
marked=Array.apply(null, Array(100)).map(function (x, i) { return 0; });
marked[0]=-1;
marked[1]=-1;


//If value is currently evaluated as prime, returns 1, elsewise 0
function PrimeCheck(value){
	if (marked[value]!=value && marked[value]!=0) return 0;
  return 1;
}

//Make value non-prime, divided by divisor
function DestroyPrime(value, divisor){
	if (marked[value]==0) marked[value]=divisor;
}
//Make value prime
function MakePrime(value, divisor){
	if (marked[value]==divisor) marked[value]=0;
}

//Color depending on being marked
function MarkNormally(v){
	if (PrimeCheck(v)==1){
    document.getElementById("Primez").getElementsByTagName("button")[v].style.backgroundColor='#440000';
    document.getElementById("Primez").getElementsByTagName("button")[v].style.color='#FFFFFF';
  }
  if (PrimeCheck(v)==0){
    document.getElementById("Primez").getElementsByTagName("button")[v].style.backgroundColor='#FFFFFF';
    document.getElementById("Primez").getElementsByTagName("button")[v].style.color='#888888';
  }
}

//Color processed number
function Darken(v){
	document.getElementById("Primez").getElementsByTagName("button")[v].style.backgroundColor='#000000';
}

//Color processed slain by prime
function PrimeColor(v1, v2){
	document.getElementById("Primez").getElementsByTagName("button")[v1].style.backgroundColor='#FFFF00';
  document.getElementById("Primez").getElementsByTagName("button")[v1].style.color='#888888';
  Darken(v2);
}

function ChangeStatement(){
	var p=StatementComprehension(), l=document.getElementById("Comprehend");
  l.innerHTML=p;
}

function StatementComprehension(){
	var l=lees.length;
  var prev=lees[l-3], last=lees[l-2];
  var strr=``;
	if (prev[0]==0 && last[0]==1) strr=`I've already marked all integers lower than limit divisible by ${prev[3]}, so I search for next primes, starting from last prime I've found +1 - ${prev[3]+1}. `;
  if (prev[0]==1 && last[0]==1) strr=`Last number I checked (${prev[2]}) was not a prime, so I search further. `;
  if (prev[0]==0 && last[0]==0) strr=`I mark the next number (${last[2]-last[3]}+${last[3]}=${last[2]}) as divisible by ${last[3]}. `;
  if (prev[0]==1 && last[0]==0) strr=`I found a prime (${last[3]}), so I start finding numbers divisible by it, starting from ${last[3]}*${last[3]}=${last[2]}, because it is the lowest number divisible by it - read proof above. `;
  
  if (last[0]==0) strr=strr+`This number's lowest divisor >1 is ${marked[last[2]]!=last[3]?`not ${last[3]}, but ${marked[last[2]]} - so it was already marked.`:`${last[3]} - so it's marked just from now.`} `
  if (last[0]==1) strr=strr+`This number is ${PrimeCheck(last[2])?`a prime - so I'll start marking perhaps-primes as divisible by it.`:`not a prime - so I have to search further.`}`
  return strr;
}


//Go to the next state of the algorithm
function NextState(){
	var l=lees.length;
  var s=lees[l-1];
  var lim=s[1];
  //Debug line
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

//Make the last state in list of states
function StateMaker(){
	var l=lees.length;
  var s=lees[l-1];
  var lim=s[1];
	
  if (s[0]==0) {
  	DestroyPrime(s[2], s[3]);
  	PrimeColor(s[2], s[3]);
  }
  if (s[0]==1) Darken(s[2]);
  if (l>1){
  	s=lees[l-2];
    if (lees[l-1][0]!=0 || lees[l-2][0]!=1) MarkNormally(s[2]);
    if (s[0]==0 && s[2]+s[3]>s[1]) 		MarkNormally(s[3]);
  }
}


//Unmake last move in list of states
function StateUnmaker(){
	lees.pop();
  var l=lees.length;
  var s=lees[l-1];
  if (s[0]==0)	MakePrime(s[2], s[3]);
  MarkNormally(s[2]);  
  
  if (l>1){
  	s=lees[l-2];
  	if (s[0]==1)	Darken(s[2]);
    if (s[0]==0)  PrimeColor(s[2], s[3]);
  }
}

//Create Button
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

//Beginning button & sequence
var inbut=document.getElementById('Sender');
inbut.addEventListener('click', function(){
	lees=[];
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
//Next value
var nextbut=document.getElementById('Nexter');
nextbut.addEventListener('click', function(){
  StateMaker();
  NextState();
  ChangeStatement();
});

//Previous value
var prevbut=document.getElementById('Prever');
prevbut.addEventListener('click', function(){
  StateUnmaker();
  ChangeStatement();
});


//x.value="Jonasz";
//var butt = document.createButton(1);
//x.appendChild(butt);
