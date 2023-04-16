/**
 * @jest-environment jsdom
 */

import Algorithm from '../../../static/Base/Algorithm.js';
import Partial from '../../../static/Base/Partial.js';
import Totient_CRT from '../../../static/NumberTheory/Totient/Totient_CRT.js';
import Totient_IEP from '../../../static/NumberTheory/Totient/Totient_IEP.js';
import TotientSieve from '../../../static/NumberTheory/Totient/TotientSieve.js';
import {click_event, algorithm_standard, partial_standard, algorithm_standard_make, basic_moving_test} from '../fundamental.js'

test('Totient with Chinese Remainder Theorem', () => {
	document.write(partial_standard + `
		<input class="inputter" value="10 21" id="4">
	`);
	var block = Partial.ObjectParser(document);
	var algo = new Totient_CRT(block, 10, 21);

	document.getElementsByClassName('show')[0].dispatchEvent(click_event)
	expect(algo.logic.table[1][4]).toBe(151);

	block.input.value = '61 37'
	document.getElementsByClassName('show')[0].dispatchEvent(click_event)
	expect(algo.logic.table[25][18]).toBe(1794);

	block.input.value = '10 20'
	document.getElementsByClassName('show')[0].dispatchEvent(click_event)
});

test('Totient with Inclusion Exclusion Principle', () => {
	document.write(partial_standard + `
		<input class="inputter" value="252" id="4">
	`);
	var block = Partial.ObjectParser(document);
	var algo = new Totient_IEP(block, 252);

	document.getElementsByClassName('show')[0].dispatchEvent(click_event)
	expect(algo.logic.prime_divs[162]).toStrictEqual([2, 3]);
	expect(algo.logic.power_sets[7]).toStrictEqual({'set':[2, 3, 7], 'amount':6, 'parity':-1});
	expect(algo.logic.summa).toBe(72);

	block.input.value = 2112;
	document.getElementsByClassName('show')[0].dispatchEvent(click_event);
	expect(algo.logic.prime_divs[473]).toStrictEqual([11]);
	expect(algo.logic.summa).toBe(640);

	block.input.value = 210;
	document.getElementsByClassName('show')[0].dispatchEvent(click_event);
	expect(algo.logic.prime_divs[210]).toStrictEqual([2, 3, 5, 7]);
	expect(algo.logic.summa).toBe(48);
});

test('Totient Sieve', () => {
	document.write(algorithm_standard + `
		<input class="inputter" value="30" id="8">
	`);

	var block = Algorithm.ObjectParser(document);
	var algo = new TotientSieve(block, 30);

	basic_moving_test(algo, document);
	expect(algo.logic.series_of_toths[21]['7']).toBe(12);//Only local test

	block.input.value = `415`;
	basic_moving_test(algo, document);
	expect(algo.logic.series_of_toths[317]['317']).toBe(316);//Only local test
});
