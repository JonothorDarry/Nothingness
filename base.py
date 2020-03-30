from flask import Flask, render_template

app=Flask(__name__)

@app.route('/')
def ErastotenesSieve():
    return render_template('Primes.html')

@app.context_processor
def jinjautils():
    def jipow(a, b):
        return pow(a, b)
    return dict(jipow=jipow)

if __name__=='__main__':
    app.run()
