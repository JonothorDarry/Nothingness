from flask import Flask, render_template, url_for, redirect, request

app=Flask(__name__)


def comeBackin(place):
    places={
            'sieve':'ErastotenesSieve',
            'gcd':'EuclidAlgo',
            'crt':'ChineseTheorem',
            'binex':'BinExpo',
            'totient':'Totient',
            'treewalk':'TreeBasic',
            'index':'Wisdom',
    }
    return redirect(url_for(places[place]))

def Router(htmlName):
    req=request
    if (req.method=='POST'):
        s=req.form['next']
        return comeBackin(s)
    else:
        return render_template(htmlName)


@app.route('/gcd', methods=['GET', 'POST'])
def EuclidAlgo():
    return Router('Gcd.html')

@app.route('/erasto', methods=['GET', 'POST'])
def ErastotenesSieve():
    return Router('Primes.html')

@app.route('/crt', methods=['GET', 'POST'])
def ChineseTheorem():
    return Router('Crt.html')

@app.route('/totient', methods=['GET', 'POST'])
def Totient():
    return Router('Totient.html')

@app.route('/binex', methods=['GET', 'POST'])
def BinExpo():
    return Router('BinaryExpo.html')

@app.route('/treewalk', methods=['GET', 'POST'])
def TreeBasic():
    return Router('TreeBasics.html')

@app.route('/', methods=['GET', 'POST'])
def Wisdom():
    return Router('index.html')

@app.context_processor
def jinjautils():
    def jipow(a, b):
        return pow(a, b)
    return dict(jipow=jipow)

if __name__=='__main__':
    app.run()
