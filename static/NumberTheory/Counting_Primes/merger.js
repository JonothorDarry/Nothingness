import Algorithm from '../../Base/Algorithm.js';
import PostPhi from './PostPhi.js'
import Segtree_Counter from './Segtree_Counter.js'

var feral1=Algorithm.ObjectParser(document.getElementById('Algo1'));
var sk1=new PostPhi(feral1, 121, 7);

var feral2=Algorithm.ObjectParser(document.getElementById('Algo2'));
var sk2=new Segtree_Counter(feral2, 5, [{'interval':7, 'prime_nr':2}, {'interval':15, 'prime_nr':3}, {'interval':11, 'prime_nr':0}, {'interval':14, 'prime_nr':4}, {'interval':12, 'prime_nr':3}]);
