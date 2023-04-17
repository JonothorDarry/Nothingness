/**
 * @jest-environment jsdom
 */

import Algorithm from '../../../static/Base/Algorithm.js';
import Partial from '../../../static/Base/Partial.js';
import Sieve from '../../../static/NumberTheory/Sieves/Sieve.js';
import ExtendedSieve from '../../../static/NumberTheory/Sieves/ExtendedSieve.js';
import Factorizer from '../../../static/NumberTheory/Sieves/Factorizer.js';
import Simple_factorizer from '../../../static/NumberTheory/Sieves/Simple_factorizer.js';
import {click_event, algorithm_standard, algorithm_standard_make, basic_moving_test} from '../fundamental.js'

test('Sieve', () => {
	document.write(algorithm_standard(`30`));

	var block = Algorithm.ObjectParser(document);
	var input = block.input;
	var algo = new Sieve(block, 30);

	basic_moving_test(algo, document);
	expect(algo.logic.lpf[25]).toBe(5);

	input.value = `1000`;
	basic_moving_test(algo, document);
	expect(algo.logic.lpf[756]).toBe(2);
	expect(algo.logic.lpf[317]).toBe(317);
});

test('Extended Sieve', () => {
	document.write(
		algorithm_standard_make(1, `<input class="inputter" value="30" id="1_8">`)+
		algorithm_standard_make(2, `<input class="inputter" value="24" id="2_8">`)
	);

	var div_algo = document.getElementById('1_var');
	var div_query = document.getElementById('2_var');

	var block = Algorithm.ObjectParser(div_algo);
	var algo = new ExtendedSieve(block, 30);
	var query_block = Algorithm.ObjectParser(div_query);
	var querier = new Factorizer(query_block, 24, algo);

	basic_moving_test(algo, div_algo);
	basic_moving_test(querier, div_query);
	expect(algo.logic.lpf[25]).toBe(5);
	expect(Object.keys(querier.logic.factors).length).toBe(2);

	block.input.value = `1000`;
	basic_moving_test(algo, div_algo);
	expect(algo.logic.lpf[756]).toBe(2);
	expect(algo.logic.lpf[317]).toBe(317);

	querier.input.value = `317`;
	basic_moving_test(querier, div_query);
	expect(Object.keys(querier.logic.factors).length).toBe(1);

	querier.input.value = `210`;
	basic_moving_test(querier, div_query);
	expect(Object.keys(querier.logic.factors).length).toBe(4);
});

test('Simple Factorizer', () => {
	document.write(algorithm_standard(`24`));

	var block = Algorithm.ObjectParser(document);
	var input = block.input;
	var algo = new Simple_factorizer(block, 24);

	basic_moving_test(algo, document);
	expect(Object.keys(algo.logic.factors).length).toBe(2);

	input.value = `317`;
	basic_moving_test(algo, document);
	expect(Object.keys(algo.logic.factors).length).toBe(1);

	input.value = `210`;
	basic_moving_test(algo, document);
	expect(Object.keys(algo.logic.factors).length).toBe(4);

	input.value = `312083921`;
	basic_moving_test(algo, document);
	expect(Object.keys(algo.logic.factors).length).toBe(1);
});
