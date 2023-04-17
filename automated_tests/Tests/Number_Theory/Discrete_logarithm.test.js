/**
 * @jest-environment jsdom
 */

import Algorithm from '../../../static/Base/Algorithm.js';
import Dlog from '../../../static/NumberTheory/Discrete_Logarithm/Dlog.js';
import {click_event, algorithm_standard, partial_standard, basic_moving_test} from '../fundamental.js'
test('Discrete Logarithm', () => {
	document.write(algorithm_standard(`6 17 23`));

	var block = Algorithm.ObjectParser(document);
	var algo = new Dlog(block, 6n, 17n, 23n);

	basic_moving_test(algo, document);
	expect(algo.logic.success).toBe(false);

	block.input.value = `17 6 23`;
	basic_moving_test(algo, document);
	expect(algo.logic.dlog).toBe(12n);

	block.input.value = `231 3451 10709`;
	basic_moving_test(algo, document);
	expect(algo.logic.dlog).toBe(3480n);

	//Test isn't executed - caveat at input data
	// block.input.value = `2 34 256`;
	// basic_moving_test(algo, document);
	// expect(algo.logic.success).toBe(false);
});
