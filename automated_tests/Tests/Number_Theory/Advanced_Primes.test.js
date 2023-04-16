/**
 * @jest-environment jsdom
 */

import Algorithm from '../../../static/Base/Algorithm.js';
import Partial from '../../../static/Base/Partial.js';
import Muller from '../../../static/NumberTheory/Advanced_Primes/Muller.js';
import PollardRho from '../../../static/NumberTheory/Advanced_Primes/PollardRho.js';
import {click_event, algorithm_standard, partial_standard, basic_moving_test} from '../fundamental.js'

test('Muller', () => {
	document.write(partial_standard + `
		<input class="inputter" value="561" id="4">
		<input type="checkbox" id="summary_exec1">
	`);
	var block = Partial.ObjectParser(document);
	block.check = document.getElementById('summary_exec1');
	var algo = new Muller(block, 561n);
	var input = block.input;

	document.getElementsByClassName('show')[0].dispatchEvent(click_event)
	expect(algo.logic.summaric_amount['non_witnesses']).toBe(10);//Inner test
	expect(algo.logic.summaric_amount['fermat_witnesses']).toBe(0);
	expect(algo.logic.summaric_amount['mr_witnesses']).toBe(310);

	block.check.checked = true;
	document.getElementsByClassName('show')[0].dispatchEvent(click_event);
	expect(algo.logic.summaric_amount['non_witnesses']).toBe(10);//Inner test

	input.value = 3123;
	document.getElementsByClassName('show')[0].dispatchEvent(click_event);
	expect(algo.logic.summaric_amount['mr_witnesses']).toBe(2);//Inner test
	expect(algo.logic.summaric_amount['fermat_witnesses']).toBe(2072);
});

test('Pollard Rho', () => {
	document.write(algorithm_standard + `
		<input class="inputter" value="18209" id="8">
		<input type="radio" name="rho" id="Basic" checked>
		<input type="radio" name="rho" id="Single factor">
		<input type="radio" name="rho" id="All factors">
	`);

	var block = Algorithm.ObjectParser(document);
	block.radio_simple=document.getElementById('Basic');
	block.radio_factor=document.getElementById('Single factor');
	block.radio_all=document.getElementById('All factors');
	var input = block.input;
	var algo = new PollardRho(block, 18209n);

	basic_moving_test(algo, document);
	expect(algo.logic.gcds[algo.logic.gcds.length-1]).toBe(131n);//Only local test

	block.radio_factor.checked = true;
	input.value = `
		2206637
		Y 2
	`;
	basic_moving_test(algo, document);
	expect(algo.logic.gcds[algo.logic.gcds.length-1]).toBe(317n);
	block.radio_all.checked = true;
	basic_moving_test(algo, document);
	expect(algo.logic.gcds[algo.logic.gcds.length-1]).toBe(317n);

	input.value = `
		18209
		X 4 1 0 4 0 5
	`;
	basic_moving_test(algo, document);
	expect(algo.logic.gcds[algo.logic.gcds.length-1]).toBe(139n);

	input.value = `
		18209
		X 4 1 0 4 0 5
		Y 7990
	`;
	basic_moving_test(algo, document);
	expect(algo.logic.gcds[algo.logic.gcds.length-1]).toBe(131n);

	input.value = `
		17
		X 4 1 0 4 0 5
		Y 131
	`;
	basic_moving_test(algo, document);
	expect(algo.logic.gcds[algo.logic.gcds.length-1]).toBe(17n);

	block.radio_simple.checked = true;
	input.value = `
		22782126392474883631
	`;
	basic_moving_test(algo, document);
	expect(algo.logic.gcds[algo.logic.gcds.length-1]).toBe(73n);
});
