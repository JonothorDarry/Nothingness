/**
 * @jest-environment jsdom
 */

import Algorithm from '../../../static/Base/Algorithm.js';
import BinaryExpo from '../../../static/NumberTheory/Binary_Exponentiation/BinaryExpo.js';
import {click_event, algorithm_standard, basic_moving_test} from '../fundamental.js'

test('Binary Exponentiation', () => {
	document.write(algorithm_standard(`17 43 107`));

	var block = Algorithm.ObjectParser(document);
	var input = block.input;
	var algo = new BinaryExpo(block, 17n, 43n, 107n);

	basic_moving_test(algo, document);
	expect(algo.logic.results[algo.logic.results.length-1]).toBe(45n);

	input.value = `3123 28381 1000000007`;
	basic_moving_test(algo, document);
	expect(algo.logic.results[algo.logic.results.length-1]).toBe(562632549n);
	
	input.value = `31231233 28331223181 1003172072017123010000007`;
	basic_moving_test(algo, document);
	expect(algo.logic.results[algo.logic.results.length-1]).toBe(639308013564529607224113n);
});
