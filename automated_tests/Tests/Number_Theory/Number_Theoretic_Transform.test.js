/**
 * @jest-environment jsdom
 */

import Algorithm from '../../../static/Base/Algorithm.js';
import Partial from '../../../static/Base/Partial.js';
import Ntt from '../../../static/NumberTheory/Number_Theoretical_Transform/Ntt.js';
import SumNtt from '../../../static/NumberTheory/Number_Theoretical_Transform/SumNtt.js';
import {click_event, algorithm_standard, partial_standard, basic_moving_test} from '../fundamental.js'

test('Number Theoretic Transform', () => {
	var mod=257;
	document.write(algorithm_standard(`
		6
		2 7 3 12 43 25 19
		7
		4 6 7 1 2 3 4 132
		${mod}`) + `
		<input type="radio" name="mode" id="NTT" checked>
		<input type="radio" name="mode" id="DFT">
	`);

	var block = Algorithm.ObjectParser(document);
	block.radio_n=document.getElementById('NTT');
	block.radio_f=document.getElementById('DFT');
	var algo = new Ntt(block, 6, [2, 7, 3, 12, 43, 25, 19], 7, [4, 6, 7, 1, 2, 3, 4, 132], 257);
	var expected_result = [8, 40, 68, 117, 276, 465, 574, 657, 1216, 642, 1869, 5833, 3376, 2508, 0, 0];
	var expected_ntt_result = expected_result.map(x => BigInt(x%mod));

	basic_moving_test(algo, document);
	expect(algo.logic.res).toStrictEqual(expected_ntt_result);//Validated: (4+x( 6+x( 7+x( 1+x( 2+x(3+x(4+132x)))))))*(2+x( 7+x( 3 +x(12+x( 43+x( 25+x( 19))))))) in wolfram
	block.radio_f.checked = true;
	basic_moving_test(algo, document);

	var all_elements = expected_result.map((e, i) => [e, algo.logic.res[i]])
	var max_diff = 0.0001;
	for (var x of all_elements){
		expect(x[1].img).toBeLessThanOrEqual(max_diff);
		expect(Math.abs(x[1].real-Number(x[0]))).toBeLessThanOrEqual(max_diff);
	}
});

test('Product of polynomials', () => {
	document.write(algorithm_standard(`
		6
		2 3 5 4 2 3
	`));
	var block = Algorithm.ObjectParser(document);
	var algo = new SumNtt(block, 6, [2, 3, 5, 4, 2, 3]);

	basic_moving_test(algo, document); //Nic nie sprawdzono - brak logiki
})
