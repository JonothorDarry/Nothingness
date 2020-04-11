from flask import Flask, render_template, url_for, redirect, request

app=Flask(__name__)

@app.route('/gcd')
def EuclidAlgo():
    return render_template('Gcd.html')

@app.route('/erasto')
def ErastotenesSieve():
    return render_template('Primes.html')


@app.route('/', methods=['GET', 'POST'])
def Wisdom():
    req=request
    if (req.method=='POST'):
        s=req.form['next']
        if (s=='sieve'):
            return redirect(url_for('ErastotenesSieve'))
        if (s=='gcd'):
            return redirect(url_for('EuclidAlgo'))

    else:
        return render_template('index.html')
    

@app.context_processor
def jinjautils():
    def jipow(a, b):
        return pow(a, b)
    return dict(jipow=jipow)

if __name__=='__main__':
    app.run()
