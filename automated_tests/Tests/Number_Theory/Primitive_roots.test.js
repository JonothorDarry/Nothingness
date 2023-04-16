/**
 * @jest-environment jsdom
 */

import 'core-js/stable/structured-clone';
import Algorithm from '../../../static/Base/Algorithm.js';
import Partial from '../../../static/Base/Partial.js';
import Order from '../../../static/NumberTheory/Primitive_Root/Order.js';
import Proot from '../../../static/NumberTheory/Primitive_Root/Proot.js';
import {click_event, algorithm_standard, partial_standard, basic_moving_test} from '../fundamental.js'

test('Orders', () => {
	document.write(partial_standard + `
		<input class="inputter" value="7" id="4">
	`);
	var block = Partial.ObjectParser(document);
	var algo = new Order(block, 7);
	document.getElementsByClassName('show')[0].dispatchEvent(click_event)
	expect(algo.logic.lambda).toBe(6);

	block.input.value = 147;
	document.getElementsByClassName('show')[0].dispatchEvent(click_event);
	expect(algo.logic.lambda).toBe(42);
});

test('Primitive root finding', () => {
	document.write(algorithm_standard + `
		<input class="inputter" value="334562" id="8">
		<input type="radio" name="rho" id="Probabilistic" checked>
		<input type="radio" name="rho" id="Deterministic">
	`);

	var block = Algorithm.ObjectParser(document);
	block.radio_p=document.getElementById('Probabilistic');
	block.radio_d=document.getElementById('Deterministic');

	var algo = new Proot(block, 334562n);
	basic_moving_test(algo, document);
	expect(algo.logic.correct_number).toBeTruthy();

	block.input.value = 8;
	var algo = new Proot(block, 334562n);
	basic_moving_test(algo, document);
	expect(!algo.logic.correct_number).toBeTruthy();

	block.radio_d.checked = true;
	block.input.value = `409`;
	basic_moving_test(algo, document);
	expect(algo.logic.full_primitive_root).toBe(21n);

	block.radio_d.checked = true;
	block.input.value = `409`;
	basic_moving_test(algo, document);
	expect(algo.logic.full_primitive_root).toBe(21n);

	block.radio_d.checked = true;
	block.input.value = `63358530532690727`;
	basic_moving_test(algo, document);
	expect(algo.logic.full_primitive_root).toBe(5n);
});
