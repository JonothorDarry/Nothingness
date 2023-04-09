import DiamFinder from './DiamFinder.js'
import DoubleWalk from './DoubleWalk.js'

var feral=Algorithm.ObjectParser(document.getElementById('Algo1'));
var eg1=new DiamFinder(feral, [[1, 2], [1, 3], [3, 4], [4, 5], [3, 6], [3, 7], [7, 8]]);

var feral2=Algorithm.ObjectParser(document.getElementById('Algo2'));
var eg2=new DoubleWalk(feral2, [[1, 2], [2, 3], [3, 4], [4, 5], [2, 6], [6, 7]], [1, 4, 7]);
