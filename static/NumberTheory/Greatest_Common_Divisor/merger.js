import Algorithm from '../../Base/Algorithm.js';
import EuclidGcd from "./EuclidGcd.js";
import ExtendedEuclidGcd from "./ExtendedEuclidGcd.js";

var feral=Algorithm.ObjectParser(document.getElementById('Algo1'));
feral.check=document.getElementById('Nothingness1');
var eg1=new EuclidGcd(feral, 84n, 35n);

var feral2=Algorithm.ObjectParser(document.getElementById('Algo2'));
feral2.check=document.getElementById('Nothingness2');
var eg2=new ExtendedEuclidGcd(feral2, 84n, 35n);
