import Algorithm from '../../Base/Algorithm.js';
import Stl_decomposition from './Stl_decomposition.js';

var parsed = Algorithm.ObjectParser(document.getElementById('Algo1'));
var algo = new Stl_decomposition(parsed, [[1, 2], [1, 3], [3, 4], [4, 5], [3, 6], [3, 7], [7, 8]], [1, 2, 1, 1, 3, 3, 2, 1]);
