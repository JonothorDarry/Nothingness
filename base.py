from flask import Flask, render_template, url_for, redirect, request
from sqlalchemy import create_engine
import smtplib, ssl

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
            'signup':'Signer',
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

@app.route('/logger/<login>')
def logChecker(login):
    return Router('index.html')

@app.route('/', methods=['GET', 'POST'])
def Wisdom():
    return Router('index.html')

@app.route('/signup', methods=['GET', 'POST'])
def Signer():
    req=request
    print(req.form)
    if (req.method=='POST' and 'pass' in req.form):
        login=req.form['login']
        mail=req.form['email']
        engine.execute(f"insert into logging(mail, login, password, activated) values('{mail}', '{login}', '{req.form['pass']}', 0)")
        sender_of_wisdom(f"a {login} was passed, behold!", mail)
        
    return Router('signup.html')

@app.context_processor
def jinjautils():
    def jipow(a, b):
        return pow(a, b)
    return dict(jipow=jipow)

def sender_of_wisdom(text, receiver="sebastian.michon10@protonmail.com"):
    port = 465
    passwd="awaits_you"
    # Create a secure SSL context
    context = ssl.create_default_context()
    sender="nothingnessproject@gmail.com"

    with smtplib.SMTP_SSL("smtp.gmail.com", port, context=context) as server:
        server.login(sender, passwd)
        server.sendmail(sender, receiver, text)

if __name__=='__main__':
    engine=create_engine("postgres://onvvlkvayxvbpz:7a5152102ba6bd5b56218396dddfd40bef4fb12855877e60d8546c0b7b0b0f72@ec2-35-174-127-63.compute-1.amazonaws.com:5432/d7v74vvpqtnp17")
    #engine.execute("drop table logging")
    #engine.execute("create table logging(id int primary key generated always as identity, mail text unique not null, login text unique not null, password text, authValue text, activated int)")

    #engine.execute("insert into logging values('Stefan', 'Stannis', 'kappa')")
    #w=engine.execute("select * from logging;")
    app.run()
