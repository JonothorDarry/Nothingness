/**
 * @jest-environment jsdom
 */

import Algorithm from '../../../static/Base/Algorithm.js';
import EuclidGcd from '../../../static/NumberTheory/Greatest_Common_Divisor/EuclidGcd.js';
import ExtendedEuclidGcd from '../../../static/NumberTheory/Greatest_Common_Divisor/ExtendedEuclidGcd.js';
import {click_event, algorithm_standard, basic_moving_test} from '../fundamental.js'

test('Euclidean algorithm', () => {
	document.write(algorithm_standard(`84 35`) + `
		<input type="checkbox" id="Nothingness1">
	`);
	var block = Algorithm.ObjectParser(document);
	block.check = document.getElementById('Nothingness1');
	var algo = new EuclidGcd(block, 84n, 35n);

	basic_moving_test(algo, document);
	expect(algo.logic.a[algo.logic.a.length-1]).toBe(7n);

	block.check.checked = true;
	block.input.value = `7121838184852866945 319028125233196861`;
	basic_moving_test(algo, document);
	expect(algo.logic.a[algo.logic.a.length-1]).toBe(1000000007n);

	block.input.value = `1 32801`;
	basic_moving_test(algo, document);
	expect(algo.logic.a[algo.logic.a.length-1]).toBe(1n);
});

test('Extended Euclidean algorithm', () => {
	document.write(algorithm_standard(`84 35`) + `
		<input type="checkbox" id="Nothingness2">
	`);
	var block = Algorithm.ObjectParser(document);
	block.check = document.getElementById('Nothingness2');
	var input = block.input;
	var algo = new ExtendedEuclidGcd(block, 84n, 35n);

	basic_moving_test(algo, document);
	expect(algo.logic.a[algo.logic.a.length-1]).toBe(7n);

	block.check.checked = true;
	block.input.value = `7121838184852866945 319028125233196861`;
	basic_moving_test(algo, document);
	expect(algo.logic.a[algo.logic.a.length-1]).toBe(1000000007n);

	block.input.value = `1 32801`;
	basic_moving_test(algo, document);
	expect(algo.logic.a[algo.logic.a.length-1]).toBe(1n);
});
