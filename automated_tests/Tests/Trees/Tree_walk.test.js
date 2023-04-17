/**
 * @jest-environment jsdom
 */

import {click_event, algorithm_standard, partial_standard, basic_moving_test, trees} from '../fundamental.js'
import Algorithm from '../../../static/Base/Algorithm.js';
import DiamFinder from '../../../static/Trees/Tree_Walk/DiamFinder.js'
import DoubleWalk from '../../../static/Trees/Tree_Walk/DoubleWalk.js'

test('Diameter Finding', () => {
	document.write(algorithm_standard(trees.basic_tree_1));

	var block = Algorithm.ObjectParser(document);
	var algo = new DiamFinder(block, [[1, 2], [1, 3], [3, 4], [4, 5], [3, 6], [3, 7], [7, 8]]);
	basic_moving_test(algo, document);
	expect(algo.logic.solution_value).toBe(4);
	expect(algo.logic.solution_vertex).toBe(1);

	block.input.value = trees.basic_tree_2;
	basic_moving_test(algo, document);
	expect(algo.logic.solution_value).toBe(2);
	expect(algo.logic.solution_vertex).toBe(1);

	block.input.value = trees.basic_tree_3;
	basic_moving_test(algo, document);
	expect(algo.logic.solution_value).toBe(7);
	expect(algo.logic.solution_vertex).toBe(1);

	block.input.value = trees.basic_tree_4;
	basic_moving_test(algo, document);
	expect(algo.logic.solution_value).toBe(4);
	expect(algo.logic.solution_vertex).toBe(1);

	block.input.value = trees.megatree;
	basic_moving_test(algo, document);
	expect(algo.logic.solution_value).toBe(11);
	expect(algo.logic.solution_vertex).toBe(3);
});

test('Bottom top dfs', () => {
	document.write(algorithm_standard(trees.basic_tree_1 + `
	3
	1 4 7`));

	var make_intelligible = function(distances){
		var result = distances.map(x => x[x.length-1][0]);
		return result.slice(1, result.length);
	}

	var block = Algorithm.ObjectParser(document);

	var algo = new DoubleWalk(block, [[1, 2], [2, 3], [3, 4], [4, 5], [2, 6], [6, 7]], [1, 4, 7]);

	basic_moving_test(algo, document);
	expect(make_intelligible(algo.logic.longest_distances)).toStrictEqual([2, 3, 1, 2, 3, 2, 2, 3]);

	block.input.value = trees.basic_tree_2 + `1 1`
	basic_moving_test(algo, document);
	expect(make_intelligible(algo.logic.longest_distances)).toStrictEqual([0, 1, 1, 1, 1, 1, 1, 1]);

	block.input.value = trees.basic_tree_3 + `1 4`
	basic_moving_test(algo, document);
	expect(make_intelligible(algo.logic.longest_distances)).toStrictEqual([3, 2, 1, 0, 1, 2, 3, 4]);

	block.input.value = trees.megatree + `7 1 5 7 12 15 16 20`
	basic_moving_test(algo, document);
	expect(make_intelligible(algo.logic.longest_distances)).toStrictEqual([8, 9, 7, 8, 9, 6, 8, 9, 10, 10, 10, 11, 6, 7, 8, 9, 10, 10, 11, 11, 10, 11]);
});
