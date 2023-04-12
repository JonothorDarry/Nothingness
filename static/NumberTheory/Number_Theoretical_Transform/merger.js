import Algorithm from '../../Base/Algorithm.js';
import Ntt from './Ntt.js';
import SumNtt from './SumNtt.js';

var feral=Algorithm.ObjectParser(document.getElementById('Algo1'));
feral.radio_n=document.getElementById('NTT');
feral.radio_f=document.getElementById('DFT');
var eg1=new Ntt(feral, 6, [2, 7, 3, 12, 43, 25, 19], 7, [4, 6, 7, 1, 2, 3, 4, 132], 257);

var feral2=Algorithm.ObjectParser(document.getElementById('Algo2'));
var eg2=new SumNtt(feral2, 6, [2, 3, 5, 4, 2, 3]);
// 998244353
//8,40,68,117,19,208,60,143,188,128,70,179,35,195,0,0
