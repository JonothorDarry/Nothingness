import NTMath from '../../../static/Base/NTMath.js';

test('pow', () => {
	expect(NTMath.pow(2, 7, 1000)).toBe(128n);
	expect(NTMath.pow(4163, 312881, 1000000007)).toBe(907424972n);
	expect(NTMath.pow(1231, 0, 1000000007)).toBe(1n);	
	expect(NTMath.pow(0, 132312, 1000000007)).toBe(0n);	
});

test('gcd', () => {
	expect(NTMath.gcd(7004, 7837)).toBe(17n);
	expect(NTMath.gcd(871231, 3123217)).toBe(1n);
	expect(NTMath.gcd(871231n, 3123217n)).toBe(1n);
	expect(NTMath.gcd(0, 312)).toBe(312n);
	expect(NTMath.gcd(312, 0)).toBe(312n);
});

//test('inverse', () => {
//	expect(NTMath.inverse(123912873189273812n, 1000000007)).toBe(981186644n);
//	expect(NTMath.inverse(1723, 1000000007)).toBe(438769591n);
//});

test('pollard rho', () => {
	expect(NTMath.pollard_rho_factorize(123912873189273812n)).toStrictEqual([2n, 2n, 7n, 37n, 1931n, 61940455957n]);
	expect(NTMath.pollard_rho_factorize(65404439719n)).toStrictEqual([85619n, 763901n]);
	expect(NTMath.pollard_rho_factorize(85619n)).toStrictEqual([85619n]);
	expect(NTMath.pollard_rho_factorize(1)).toStrictEqual([]);
});

test('check prime', () => {
	expect(NTMath.check_prime(123912873189273812n)).toBe(false);
	expect(NTMath.check_prime(1000000007)).toBe(true);
	expect(NTMath.check_prime(1)).toBe(false);
	expect(NTMath.check_prime(2)).toBe(true);
});

