import Algorithm from '../../Base/Algorithm.js';
import Partial from '../../Base/Partial.js';

import Totient_CRT from "./Totient_CRT.js";
import Totient_IEP from "./Totient_IEP.js";
import TotientSieve from "./TotientSieve.js";
//import PowerTower from "./PowerTower.js";

var feral3=Partial.ObjectParser(document.getElementById('Algo3'));
var sk3=new Totient_CRT(feral3, 10, 17);

var feral4=Partial.ObjectParser(document.getElementById('Algo4'));
var sk4=new Totient_IEP(feral4, 130);

var feral=Algorithm.ObjectParser(document.getElementById('Algo1'));
var sk=new TotientSieve(feral, 30);

//var feral2=Algorithm.ObjectParser(document.getElementById('Algo2'));
//var sk2=new PowerTower(feral2, 6, 107, [2, 7, 3, 12, 43, 25]);
//No help found here
//Only dreadful tears
