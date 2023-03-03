import ExtendedSieve from './ExtendedSieve.js'
//Pollard-rho under da hood
import Factorizer from './Factorizer.js'
import Sieve from './Sieve.js'
import Simple_factorizer from './Simple_factorizer.js'

var feral4=Algorithm.ObjectParser(document.getElementById('Algo4'));
var eg4=new Simple_factorizer(feral4, 84);

var feral=Algorithm.ObjectParser(document.getElementById('Algo1'));
var sk=new Sieve(feral, 30);

var feral2=Algorithm.ObjectParser(document.getElementsByClassName('Algo2')[0], 2);
var sk2=new ExtendedSieve(feral2, 30);

var foul=Algorithm.ObjectParser(document.getElementsByClassName('Algo3')[0], 3);
var sk3=new Factorizer(foul, 24, sk2);
