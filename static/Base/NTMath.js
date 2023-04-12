import ArrayUtils from './ArrayUtils.js';

class NTMath{
	static pow(ap, bp, mp=1000000007){ //BIfriendly
		var res=1n, a=BigInt(ap), b=BigInt(bp), m=BigInt(mp);
		for (;b>0;b=b/2n){
			if (b%2n == 1n) res=(res*a)%m;
			a=(a*a)%m;
		}
		return res;
	}

	static mul(a, b, m=1000000007){
		var res=0;
		for (;b>0;b=Math.floor(b/2)){
			if (b%2==1) res=(res+a)%m;
			a=(a+a)%m;
		}
		return res;
	}

	static gcd(ap, bp){ //BIfriendly
		var a = BigInt(ap), b = BigInt(bp);
		var c;
		while (b>0){
			c=a%b;
			a=b;
			b=c;
		}
		return a;
	}

	static lcm(ap, bp){
		var a=BigInt(ap), b=BigInt(bp);
		return (a*b)/NTMath.gcd(a, b);
	}

	static extended_gcd(a, b){
		var p=[1n, 0n], q=[0n, 1n], lst=2, c, z;

		while (b>0){
			z=a/b;
			p.push(p[lst-2]-z*p[lst-1]);
			q.push(q[lst-2]-z*q[lst-1]);
			c=a%b, a=b, b=c;
			lst=lst+1
		}
		return [a, p[lst-2], q[lst-2]];
	}

	//returns lowest prime factor list
	static sievify(n){
		var i, j, nothing=-1;
		var lpf=ArrayUtils.steady(n+1, nothing);

		for (i=2; i<=n; i++){
			if (lpf[i]==nothing) lpf[i]=i;
			for (j=i*i; j<=n; j+=i){
				if (lpf[j]==nothing) lpf[j]=i;
			}
		}
		return lpf;
	}

	static inverse(a, m){
		var s=NTMath.extended_gcd(a, m);
		if (s[0] == 0) return null;
		if (s[1] < 0) return s[1]+m;
		return s[1];
	}

	static factorize(x){
		var i, ace=0, lst=[[],[]];
		for (i=2;i*i<=x;i++){
			if (x%i==0) lst[0].push(i), lst[1].push(0);
			while(x%i==0) x=Math.floor(x/i), lst[1][lst[1].length-1]++;
		}
		if (x>1) lst[0].push(x), lst[1].push(1);
		return lst;
	}

	static find_totient(x){
		var y=NTMath.factorize(x)[0], toth=x, i;
		for (i=0;i<y.length;i++)
			toth=Math.floor(toth/y[i])*(y[i]-1);
		return toth;
	}

	static find_proot(x, prob=true){
		var fac_x=NTMath.factorize(x);
		var ln=fac_x[0].length;
		if (x==4) return 3;
		if (fac_x[0].length>2 || (fac_x[0].length==2 && fac_x[0][0]!=2) || (fac_x[0][0]==2 && fac_x[1][0]>=2)) return null;

		var p=fac_x[0][ln-1], toth_p=p-1, y=0, i;
		var fac_t=NTMath.factorize(toth_p);

		var ln=fac_t[0].length;
		var lst=[];
		for (i=0;i<ln;i++) lst.push(toth_p/fac_t[0][i]);

		while(true){
			if (prob==true) y=Math.floor(Math.random()*(p-2))+2;
			else y+=1;

			for (i=0; i<ln; i++){
				if (NTMath.pow(y, lst[i], p)==1) break;
			}
			if (i==ln) break;
		}
		if (2*p<x && NTMath.pow(y, p-1, p*p)!=1) y=y+p;
		if (x%2==0 && y%2==0) y=y+(x>>1);
		return y;
	}

	//It's shit in n^2 - make it NTT or FFT
	static multiply_polynominals(p1, p2, M=998244353){
		var p3=[], size=p1.length+p2.length, p2_size=p2.length, p1_size=p1.length, res=0, i, j;
		for (i=0; i<size-1; i++) p3.push(0);
		for (i=0; i<p1_size; i++){
			for (j=0; j<p2_size; j++){
				p3[i+j]=(p3[i+j]+p2[j]*p1[i])%M;
			}
		}
		return p3;
	}

	//Muller-Robinho
	static check_prime(x, tests=20){
		x = BigInt(x);
		if (x == 1) return false;

		for (var i=0; i<tests; i++){
			var expo = x-1n;
			var base = BigInt(Math.floor(Math.random()*(1<<30)))%(x-1n)+1n; //Wrong (too small range) - but, for all practical purposes, it doesn't matter

			var res = NTMath.pow(base, expo, x);
			if (res != 1n) return false;
			expo = expo/2n;

			while (expo > 0 && expo%2n == 0){
				var res = NTMath.pow(base, expo, x);
				if (res != x-1n && res != 1n) return false;
				if (res == x-1n) break;

				expo = expo/2n;
			}
		}
		return true;
	}

	//Pollard-rho
	static pollard_rho_factorize(xp){
		var x = BigInt(xp)
		var prime = NTMath.check_prime(x);
		if (x == 1) return [];
		if (prime) return [x];

		var modulus = x;
		while(true){
			var g = 1n;
			var seed = BigInt(Math.floor(Math.random() * (1<<30)))%x; //wrong - but doesn't matter
			var free = BigInt(Math.floor(Math.random() * (1<<30)));
			var apply_poly = function(x){return (x*x + 7n*x + free)%modulus};

			var slow = seed;
			var fast = seed;

			var abs = function(a){return ((a<0)?(-a):a);}
			while (g == 1n){
				var slow = apply_poly(slow);
				var fast = apply_poly(apply_poly(fast));

				g = NTMath.gcd(abs(fast-slow), x);
			}
			if (g != x) break;
		}

		var res = [...this.pollard_rho_factorize(g), ...this.pollard_rho_factorize(x/g)];
		res.sort((a,b) => {return (a < b) ? -1 : ((a==b)?0:1)});
		return res;
	}
}
export default NTMath;
