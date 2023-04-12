import ArrayUtils from '../../../static/Base/ArrayUtils.js';

test('range', () => {
	expect(ArrayUtils.range(17, 21)).toStrictEqual([17, 18, 19, 20, 21]);
	expect(ArrayUtils.range(17, 26, 3)).toStrictEqual([17, 20, 23, 26]);
	expect(ArrayUtils.range(45, 12, -10)).toStrictEqual([45, 35, 25, 15]);
});

test('revert', () => {
	expect(ArrayUtils.revert([1, 321, 'stalin', 132])).toStrictEqual([132, 'stalin', 321, 1])
});
