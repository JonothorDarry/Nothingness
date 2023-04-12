/**
 * @jest-environment jsdom
 */

import Algorithm from '../../../static/Base/Algorithm.js';
import Partial from '../../../static/Base/Partial.js';
import BinaryExpo from '../../../static/NumberTheory/Binary_Exponentiation/BinaryExpo.js';

const click_event = new MouseEvent("click", {
	view: window,
	bubbles: true,
	cancelable: true,
});

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

test('Binary Exponentiation', () => { //Based and wolframpilled
	document.write(algorithm_standard + `
		<input class="inputter" value="17 43 107" id="8">
	`);

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
