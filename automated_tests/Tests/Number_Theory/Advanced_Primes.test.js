/**
 * @jest-environment jsdom
 */

import Algorithm from '../../../static/Base/Algorithm.js';
import Partial from '../../../static/Base/Partial.js';
import Muller from '../../../static/NumberTheory/Advanced_Primes/Muller.js';
import PollardRho from '../../../static/NumberTheory/Advanced_Primes/PollardRho.js';

const click_event = new MouseEvent("click", {
	view: window,
	bubbles: true,
	cancelable: true,
});

const partial_standard = `
		<!DOCTYPE html>
		<div class="primez" id="1"></div>
		<div class="show" id="2"></div>
		<div class="comprehend" id="3"></div>
`;
const algorithm_standard = `
		<!DOCTYPE html>
		<div class="primez" id="1"></div>
		<div class="sender" id="2"></div>
		<div class="previous" id="3"></div>
		<div class="next" id="4"></div>
		<div class="comprehend" id="5"></div>
		<div class="finish" id="6"></div>
		<div class="progress" id="7"></div>
`;

var basic_moving_test = function(algorithm, doc){
	doc.getElementsByClassName('sender')[0].dispatchEvent(click_event)
	expect(algorithm.state_nr).toBe(0);
	doc.getElementsByClassName('finish')[0].dispatchEvent(click_event)
	expect(algorithm.state_nr).toBe(algorithm.all_states_nr);

	var prev = doc.getElementsByClassName('previous')[0];
	for (var i=0; i<algorithm.all_states_nr; i++) prev.dispatchEvent(click_event);
	expect(algorithm.state_nr).toBe(0);
}

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
});
