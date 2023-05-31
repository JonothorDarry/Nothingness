import Algorithm from '../../Base/Algorithm.js';
import Stl_decomposition from './Stl_decomposition.js';
import Small_to_large from './Small_to_large.js';

var parsed = Algorithm.ObjectParser(document.getElementById('Algo1'));
var algo = new Stl_decomposition(parsed, [[1, 2], [1, 3], [3, 4], [4, 5], [3, 6], [3, 7], [7, 8]], [1, 2, 1, 1, 3, 3, 2, 1]);

var parsed_2 = Algorithm.ObjectParser(document.getElementById('Algo2'));
var algo_2 = new Small_to_large(parsed_2, [1, 1, 3, 4, 3, 3, 7], [1, 2, 1, 1, 3, 3, 2, 1]);
