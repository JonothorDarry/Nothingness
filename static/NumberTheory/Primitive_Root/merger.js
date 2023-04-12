import Algorithm from '../../Base/Algorithm.js';
import Partial from '../../Base/Partial.js';
import Order from './Order.js'
import Proot from './Proot.js'

var feral1=Partial.ObjectParser(document.getElementById('Algo1'));
var sk1=new Order(feral1, 7);

var feral2=Algorithm.ObjectParser(document.getElementById('Algo2'));
feral2.radio_p=document.getElementById('Probabilistic');
feral2.radio_d=document.getElementById('Deterministic');
var sk2=new Proot(feral2, 334562n);

//Prime: 20731
//Composite: 859548722
//Ultra-composite: 
//Problematic-deterministic: 409
//Large primes: 33456259, 998244353, 1000000007, 421607, 18670177
