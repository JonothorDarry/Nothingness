alldict={};

class Sieve{
	constructor(len, location, beg, prev, next, comp, inp){
  	this.lees=[];
    this.createMarked(len);
    this.place=location;
    this.wisdom=comp;
    this.input=inp;
    
    var butt;
    for (var i=0;i<len;i++){
      /*Button Stylization*/ 
      butt = this.buttCreator(i);
      //document.getElementById('Primez').innerHTML=i;
      this.place.appendChild(butt);
    }
    
    //Beginning button & sequence
    var inbut=beg;
    var nextbut=next;
    var prevbut=prev;
		
    alldict[inbut.id]=this;
    alldict[nextbut.id]=this;
    alldict[prevbut.id]=this;
    
    inbut.addEventListener('click', function(){
    	var zis=alldict[this.id];
      zis.lees=[];
      var fas=zis.input.value;
      zis.place.textContent='';

      zis.createMarked(fas);
      for (var i=0;i<=fas;i++){
        var butt = zis.buttCreator(i);
        zis.place.appendChild(butt);
      }
      zis.lees.push([1, fas, 0]);
      zis.StateMaker();
      zis.lees.push([1, fas, 1]);
      zis.StateMaker();
      zis.NextState();
  });
  
    //Next value
    nextbut.addEventListener('click', function(){
    	var zis=alldict[this.id];
      zis.StateMaker();
      zis.NextState();
      zis.ChangeStatement();
    });

    //Previous value
    prevbut.addEventListener('click', function(){
    	var zis=alldict[this.id];
      zis.StateUnmaker();
    	zis.ChangeStatement();
    });
  }
  
  //Marked=1 - not prime
  //This function creates array of elements marked as primes
  createMarked(len){
  	this.marked=[];
    for (var i=0;i<=len;i++) this.marked[i]=0;
    this.marked[0]=-1;
    this.marked[1]=-1;
  }
  
  //If value is currently evaluated as prime, returns 1, elsewise 0
  PrimeCheck(value){
    if (this.marked[value]!=value && this.marked[value]!=0) return 0;
    return 1;
  }

  //Make value non-prime, divided by divisor
  DestroyPrime(value, divisor){
    if (this.marked[value]==0) this.marked[value]=divisor;
  }
  //Make value prime
  MakePrime(value, divisor){
    if (this.marked[value]==divisor) this.marked[value]=0;
  }
  
  //Mark number depending on values defined in sieve
  MarkNormally(v){
  	var bt=this.place.getElementsByTagName("button")[v];
    if (this.PrimeCheck(v)==1){
      bt.style.backgroundColor='#440000';
      bt.style.color='#FFFFFF';
    }
    if (this.PrimeCheck(v)==0){
      bt.style.backgroundColor='#FFFFFF';
      bt.style.color='#888888';
    }
  }

  //Color processed slaying number
  Darken(v){
    this.place.getElementsByTagName("button")[v].style.backgroundColor='#000000';
  }

  //Color processed just slain by prime
  PrimeColor(v1, v2){
  	var bt=this.place.getElementsByTagName("button")[v1];
    bt.style.backgroundColor='#FFFF00';
    bt.style.color='#888888';
    this.Darken(v2);
  }

  ChangeStatement(){
    var p=this.StatementComprehension(), l=this.wisdom;
    l.innerHTML=p;
  }

  StatementComprehension(){
    var l=this.lees.length;
    var prev=this.lees[l-3], last=this.lees[l-2];
    var strr=``;
    if (prev[0]==0 && last[0]==1) strr=`I've already marked all integers lower than limit divisible by ${prev[3]}, so I search for next primes, starting from last prime I've found +1 - ${prev[3]+1}. `;
    if (prev[0]==1 && last[0]==1) strr=`Last number I checked (${prev[2]}) was not a prime, so I search further. `;
    if (prev[0]==0 && last[0]==0) strr=`I mark the next number (${last[2]-last[3]}+${last[3]}=${last[2]}) as divisible by ${last[3]}. `;
    if (prev[0]==1 && last[0]==0) strr=`I found a prime (${last[3]}), so I start finding numbers divisible by it, starting from ${last[3]}*${last[3]}=${last[2]}, because it is the lowest number divisible by it - read proof above. `;

    if (last[0]==0) strr=strr+`This number's lowest divisor >1 is ${this.marked[last[2]]!=last[3]?`not ${last[3]}, but ${this.marked[last[2]]} - so it was already marked.`:`${last[3]} - so it's marked just from now.`} `
    if (last[0]==1) strr=strr+`This number is ${this.PrimeCheck(last[2])?`a prime - so I'll start marking perhaps-primes as divisible by it.`:`not a prime - so I have to search further.`}`
    return strr;
  }


  //Go to the next state of the algorithm
  NextState(){
    var l=this.lees.length;
    var s=this.lees[l-1];
    var lim=s[1];
    //Debug line
    //document.getElementById('debug').innerHTML=lees;
    if (s[0]==0){
      if (s[2]+s[3]<=lim)	this.lees.push([0, lim, s[2]+s[3], s[3]]);
      else if (s[3]<=lim)	this.lees.push([1, lim, s[3]+1]);
      else	this.lees.push([100]);
    }

    else if (s[0]==1){
      if (s[2]*s[2]>lim) 			this.lees.push([100]);
      else if (this.PrimeCheck(s[2])==1) 		this.lees.push([0, lim, s[2]*s[2], s[2]]);
      else this.lees.push([1, lim, s[2]+1]);
    }
  }

  //Make the last state in list of states
  StateMaker(){
    var l=this.lees.length;
    var s=this.lees[l-1];
    var lim=s[1];
    if (s[0]==0) {
      this.DestroyPrime(s[2], s[3]);
      this.PrimeColor(s[2], s[3]);
    }
    if (s[0]==1) this.Darken(s[2]);
    if (l>1){
      s=this.lees[l-2];
      if (this.lees[l-1][0]!=0 || this.lees[l-2][0]!=1) this.MarkNormally(s[2]);
      if (s[0]==0 && s[2]+s[3]>s[1]) 		this.MarkNormally(s[3]);
    }
  }


  //Unmake last move in list of states
  StateUnmaker(){
    this.lees.pop();
    var l=this.lees.length;
    var s=this.lees[l-1];
    if (s[0]==0)	this.MakePrime(s[2], s[3]);
    this.MarkNormally(s[2]);  

    if (l>1){
      s=this.lees[l-2];
      if (s[0]==1)	this.Darken(s[2]);
      if (s[0]==0)  this.PrimeColor(s[2], s[3]);
    }
  }

  //Create Button
  buttCreator(v){

    var butt = document.createElement("BUTTON");
    butt.innerHTML=v;
    butt.style.backgroundColor="#440000"
    butt.style.color="#FFFFFF"
    butt.style.width="40px";
    butt.style.height="40px";
    butt.style.border="None";
    //butt.appendChild(sub);
    return butt;
  }
}

class ExtendedSieve extends Sieve{
	
  MarkNormally(v){
  	var bt=this.place.getElementsByTagName("button")[v];
    if (this.PrimeCheck(v)==1){
      bt.style.backgroundColor='#440000';
      bt.style.color='#FFFFFF';
    }
    if (this.PrimeCheck(v)==0){
      bt.style.backgroundColor='#FFFFFF';
      bt.style.color='#888888';
    }
    bt.getElementsByTagName("sub")[0].innerHTML=this.marked[v];
  }
  
  //Color prime and change subscript note
  PrimeColor(v1, v2){
  	var bt=this.place.getElementsByTagName("button")[v1];
    bt.style.backgroundColor='#FFFF00';
    bt.style.color='#888888';
    this.Darken(v2);
    bt.getElementsByTagName("sub")[0].innerHTML=this.marked[v1];
  }

	//Create Button
  buttCreator(v){
		var sub= document.createElement("SUB");
    if (v>1)	sub.innerHTML=0;
    else sub.innerHTML=-1;
    sub.style.fontSize="10px";
    
    var butt = document.createElement("BUTTON");
    butt.innerHTML=v;
    butt.style.backgroundColor="#440000"
    butt.style.color="#FFFFFF"
    butt.style.width="40px";
    butt.style.height="40px";
    butt.style.border="None";
    butt.appendChild(sub);
   	//butt.appendChild(sub);
    return butt;
  }
}


var sk=new Sieve(100, document.getElementById('Primez'), 
		document.getElementById('Sender'), document.getElementById('Prever'), document.getElementById('Nexter'), 
    document.getElementById('Comprehend'), document.getElementById('Erasto'));

var sk2=new ExtendedSieve(100, document.getElementById('Primez2'), 
		document.getElementById('Sender2'), document.getElementById('Prever2'), document.getElementById('Nexter2'), 
    document.getElementById('Comprehend2'), document.getElementById('Erasto2'));



//x.value="Jonasz";
//var butt = document.createButton(1);
//x.appendChild(butt);
