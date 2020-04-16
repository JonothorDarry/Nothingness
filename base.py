from flask import Flask, render_template, url_for, redirect, request

app=Flask(__name__)


def comeBackin(place):
    if (place=='sieve'):
        return redirect(url_for('ErastotenesSieve'))
    if (place=='gcd'):
        return redirect(url_for('EuclidAlgo'))
    if (place=='crt'):
        return redirect(url_for('ChineseTheorem'))
    if (place=='index'):
        return render_template('index.html')


@app.route('/gcd', methods=['GET', 'POST'])
def EuclidAlgo():
    req=request
    if (req.method=='POST'):
        s=req.form['next']
        return comeBackin(s)
    else:
        return render_template('Gcd.html')

@app.route('/erasto', methods=['GET', 'POST'])
def ErastotenesSieve():
    req=request
    if (req.method=='POST'):
        s=req.form['next']
        return comeBackin(s)
    else:
        return render_template('Primes.html')

@app.route('/crt', methods=['GET', 'POST'])
def ChineseTheorem():
    req=request
    if (req.method=='POST'):
        s=req.form['next']
        return comeBackin(s)

    else:
        return render_template('Crt.html')

@app.route('/', methods=['GET', 'POST'])
def Wisdom():
    req=request
    if (req.method=='POST'):
        s=req.form['next']
        return comeBackin(s)

    else:
        return render_template('index.html')
    

@app.context_processor
def jinjautils():
    def jipow(a, b):
        return pow(a, b)
    return dict(jipow=jipow)

if __name__=='__main__':
    app.run()
