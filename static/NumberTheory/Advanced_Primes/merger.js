import Algorithm from '../../Base/Algorithm.js';
import Partial from '../../Base/Partial.js';

import Muller from './Muller.js'
import PollardRho from './PollardRho.js'

var feral1=Partial.ObjectParser(document.getElementById('Algo1'));
feral1.check=document.getElementById('summary_exec1');
var sk1=new Muller(feral1, 15);

var feral2=Algorithm.ObjectParser(document.getElementById('Algo2'));
feral2.radio_simple=document.getElementById('Basic');
feral2.radio_factor=document.getElementById('Single factor');
feral2.radio_all=document.getElementById('All factors');
var sk2=new PollardRho(feral2, 18209n);
