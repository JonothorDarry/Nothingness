/**
 * @jest-environment jsdom
 */

import Algorithm from '../../../static/Base/Algorithm.js';
import Partial from '../../../static/Base/Partial.js';
import Crt from '../../../static/NumberTheory/Chinese_Remainder_Theorem/Crt.js';

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

test('Chinese Remainder Theorem', () => {
	document.write(algorithm_standard + `
		<input class="inputter" value="
			3
			2 3
			5 7
			8 33
		" id="8">
	`);

	var block = Algorithm.ObjectParser(document);
	var input = block.input;
	var algo = new Crt(block, 3, [[2n, 3n], [5n, 7n], [8n, 33n]]);

	basic_moving_test(algo, document);
	expect(algo.logic.results[algo.logic.results.length-1].final_congruent).toBe(173n);
	expect(algo.logic.results[algo.logic.results.length-1].final_mod).toBe(231n);
});
