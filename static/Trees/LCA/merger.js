import Lca_binary from './Lca_binary.js'
import Lca_binary_querier from './Lca_binary_querier.js'
import Lca_RMQ from './Lca_RMQ.js'
import Lca_RMQ_querier from './Lca_RMQ_querier.js'

var feral2=Algorithm.ObjectParser(document.getElementsByClassName('Algo2')[0], 2);
var eg2=new Lca_binary(feral2, [[1, 2], [1, 3], [3, 4], [4, 5], [3, 6], [3, 7], [7, 8]]);
//var eg2=new Lca_binary(feral2, [[1, 2], [2, 3], [3, 4], [4, 5], [2, 6], [6, 7]]);
//var eg2=new Lca_binary(feral2, [[1, 2], [1, 3], [2, 4], [4, 6], [6, 7], [6, 8], [8, 9], [3, 11], [3, 12], [12, 13], [2, 5], [5, 10]]);

var feral3=Algorithm.ObjectParser(document.getElementsByClassName('Algo3')[0], 3);
var eg3=new Lca_binary_querier(feral3, eg2, 'l', 8, 5);

var feral4=Algorithm.ObjectParser(document.getElementsByClassName('Algo4')[0], 4);
var eg4=new Lca_RMQ(feral4, [[1, 2], [1, 3], [3, 4], [4, 5], [3, 6], [3, 7], [7, 8]]);

var feral5=Algorithm.ObjectParser(document.getElementsByClassName('Algo5')[0], 5);
var eg5=new Lca_RMQ_querier(feral5, eg4, 8, 5);
