class Complex{
	constructor(a, b=0){
		this.real=a;
		this.img=b;
	}
	add(b){
		return new Complex(this.real+b.real, this.img+b.img);
	}
	mul(b){
		return new Complex(this.real*b.real-this.img*b.img, this.img*b.real+b.img*this.real);
	}
	toString(){
		if (-10e-6<this.img && this.img<10e-6) return `${this.real.toFixed(5)}`;
		return `${this.real.toFixed(5)}+${this.img.toFixed(5)}i`;
	}
}
export default Complex
