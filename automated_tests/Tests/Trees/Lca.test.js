/**
 * @jest-environment jsdom
 */

import Algorithm from '../../../static/Base/Algorithm.js';
import Lca_binary from '../../../static/Trees/LCA/Lca_binary.js';
import Lca_binary_querier from '../../../static/Trees/LCA/Lca_binary_querier.js';
import Lca_RMQ from '../../../static/Trees/LCA/Lca_RMQ.js';
import Lca_RMQ_querier from '../../../static/Trees/LCA/Lca_RMQ_querier.js';
import {click_event, algorithm_standard, algorithm_standard_make, basic_moving_test, trees} from '../fundamental.js'

test('Lca with binary lifting', () => {
	document.write(
		algorithm_standard_make(1, `<input class="inputter" value="${trees.basic_tree_1}" id="1_8">`)+
		algorithm_standard_make(2, `<input class="inputter" value="l 5 8" id="2_8">`)
	);
	var div_algo = document.getElementById('1_var');
	var div_query = document.getElementById('2_var');

	var block = Algorithm.ObjectParser(div_algo);
	var algo = new Lca_binary(block, [[1, 2], [2, 3]]);
	var query_block = Algorithm.ObjectParser(div_query);
	var querier = new Lca_binary_querier(query_block, algo, 'l', 1, 2);

	var lca_binary_test = function(test_str, expected_res){
		query_block.input.value = test_str;
		basic_moving_test(querier, div_query);
		if (test_str[0] == 'k') expect(querier.logic.res).toBe(expected_res);
		else expect(querier.logic.lca_ans).toBe(expected_res);
	}
	var lca_base_changer = function(tree){
		block.input.value = tree;
		basic_moving_test(algo, div_algo);
	}

	basic_moving_test(algo, div_algo);
	expect(algo.logic.lca_parents[5]).toStrictEqual([4, 3, 1, 1]);

	basic_moving_test(querier, div_query);
	expect(querier.logic.lca_ans).toBe(3);
	lca_binary_test('l 8 3', 3);
	lca_binary_test('k 8 2', 3);

	lca_base_changer(trees.basic_tree_2);
	expect(algo.logic.lca_parents[5]).toStrictEqual([1, 1, 1, 1]);
	lca_binary_test('l 8 4', 1);
	lca_binary_test('l 8 1', 1);
	lca_binary_test('l 1 8', 1);
	lca_binary_test('k 8 0', 8);
	lca_binary_test('k 8 1', 1);
	lca_binary_test('k 8 2', 1); //controversial (albeit correct) one

	lca_base_changer(trees.basic_tree_3);
	expect(algo.logic.lca_parents[8]).toStrictEqual([7, 6, 4, 1]);
	lca_binary_test('l 8 5', 5);
	lca_binary_test('k 8 6', 2);

	lca_base_changer(trees.basic_tree_4);
	expect(algo.logic.lca_parents[7]).toStrictEqual([3, 1, 1, 1]);
	lca_binary_test('l 4 5', 2);
	lca_binary_test('k 5 1', 2);

	lca_base_changer(trees.megatree);
	expect(algo.logic.lca_parents[22]).toStrictEqual([21, 16, 14, 1, 1, 1]);
	lca_binary_test('k 9 3', 3);
	lca_binary_test('k 14 3', 3);
	lca_binary_test('k 20 5', 13);
	lca_binary_test('k 20 6', 6);
	lca_binary_test('k 20 7', 3);
	lca_binary_test('k 20 8', 1);

	lca_binary_test('l 17 2', 1);
	lca_binary_test('l 20 22', 16);
	lca_binary_test('l 12 9', 8);
	lca_binary_test('l 12 5', 3);
});

test('Lca with RMQ', () => {
	document.write(
		algorithm_standard_make(1, `<input class="inputter" value="${trees.basic_tree_1}" id="1_8">`)+
		algorithm_standard_make(2, `<input class="inputter" value="5 8" id="2_8">`)
	);

	var div_algo = document.getElementById('1_var');
	var div_query = document.getElementById('2_var');

	var block = Algorithm.ObjectParser(div_algo);
	var algo = new Lca_RMQ(block, [[1, 2], [2, 3]]);
	var query_block = Algorithm.ObjectParser(div_query);
	var querier = new Lca_RMQ_querier(query_block, algo, 1, 2);

	var lca_rmq_test = function(test_str, expected_res){
		query_block.input.value = test_str;
		basic_moving_test(querier, div_query);
		expect(querier.logic.lca).toBe(expected_res);
	}
	var lca_base_changer = function(tree){
		block.input.value = tree;
		basic_moving_test(algo, div_algo);
	}

	basic_moving_test(algo, div_algo);
	expect(algo.logic.layers).toBe(4);
	expect(algo.logic.path.length).toBe(15);
	lca_rmq_test('5 8', 3);
	lca_rmq_test('2 1', 1);
	lca_rmq_test('1 2', 1);

	lca_base_changer(trees.basic_tree_2);
	expect(algo.logic.layers).toBe(4);
	expect(algo.logic.path.length).toBe(15);
	lca_rmq_test('2 2', 2);
	lca_rmq_test('4 7', 1);

	lca_base_changer(trees.basic_tree_3);
	expect(algo.logic.layers).toBe(4);
	expect(algo.logic.path.length).toBe(15);
	lca_rmq_test('5 7', 5);
	lca_rmq_test('3 7', 3);
	lca_rmq_test('1 6', 1);

	lca_base_changer(trees.basic_tree_4);
	expect(algo.logic.layers).toBe(4);
	expect(algo.logic.path.length).toBe(13);
	lca_rmq_test('5 6', 1);
	lca_rmq_test('4 5', 2);
	lca_rmq_test('6 7', 3);

	lca_base_changer(trees.megatree);
	expect(algo.logic.layers).toBe(6);
	lca_rmq_test('17 2', 1);
	lca_rmq_test('20 22', 16);
	lca_rmq_test('12 9', 8);
	lca_rmq_test('12 5', 3);
});
