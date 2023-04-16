/**
 * @jest-environment jsdom
 */

import Algorithm from '../../../static/Base/Algorithm.js';
import PostPhi from '../../../static/NumberTheory/Counting_Primes/PostPhi.js';
import Segtree_Counter from '../../../static/NumberTheory/Counting_Primes/Segtree_Counter.js';
import {click_event, algorithm_standard, basic_moving_test} from '../fundamental.js'

test('Recursive counting primes', () => {
	document.write(algorithm_standard + `
		<input class="inputter" value="121 7" id="8">
	`);
	var block = Algorithm.ObjectParser(document);
	var algo = new PostPhi(block, 121, 7);

	basic_moving_test(algo, document);
	expect(algo.logic.layers_phis[7][0].value).toBe(24);

	block.input.value = `2112 4`;
	basic_moving_test(algo, document);
	expect(algo.logic.layers_phis[4][0].value).toBe(482);
});

test('Counting primes with segment tree', () => { //Unstable sort order - sort it out
	document.write(algorithm_standard + `
		<input class="inputter" value="
		5
		7 2
		15 3
		11 0
		14 4
		12 5
		" id="8">
	`);
	var block = Algorithm.ObjectParser(document);
	var algo = new Segtree_Counter(block, 5, [{'interval':7, 'prime_nr':2}, {'interval':15, 'prime_nr':3}, {'interval':11, 'prime_nr':0}, {'interval':14, 'prime_nr':4}, {'interval':12, 'prime_nr':3}]);
	basic_moving_test(algo, document);
	expect(algo.logic.queries.map(x => x.answer[x.answer.length-1])).toStrictEqual([11, 3, 4, 3, 1]);
});
