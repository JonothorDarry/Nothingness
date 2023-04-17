/**
 * @jest-environment jsdom
 */

import Algorithm from '../../../static/Base/Algorithm.js';
import Partial from '../../../static/Base/Partial.js';
import Crt from '../../../static/NumberTheory/Chinese_Remainder_Theorem/Crt.js';
import {click_event, algorithm_standard, basic_moving_test} from '../fundamental.js'


test('Chinese Remainder Theorem', () => {
	document.write(algorithm_standard(`
			3
			2 3
			5 7
			8 33
	`));

	var block = Algorithm.ObjectParser(document);
	var algo = new Crt(block, 3, [[2n, 3n], [5n, 7n], [8n, 33n]]);

	basic_moving_test(algo, document);
	expect(algo.logic.results[algo.logic.results.length-1].final_congruent).toBe(173n);
	expect(algo.logic.results[algo.logic.results.length-1].final_mod).toBe(231n);

	block.input.value = `4
		1237 12712390
		390281 13232098712
		181 23882
		3812 172371
	`
	basic_moving_test(algo, document);
	expect(algo.logic.results[algo.logic.results.length-1].final_congruent).toBe(62806421379295785453689297n);
	expect(algo.logic.results[algo.logic.results.length-1].final_mod).toBe(173113462897710959668893240n);
});
