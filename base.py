from flask import Flask, render_template, url_for, redirect, request, make_response, render_template_string
from sqlalchemy import create_engine
from bs4 import BeautifulSoup
import smtplib, ssl
from email.mime.text import MIMEText

app=Flask(__name__)


def comeBackin(place, old_place):
    places={
            'sieve':'ErastotenesSieve',
            'gcd':'EuclidAlgo',
            'crt':'ChineseTheorem',
            'binex':'BinExpo',
            'totient':'Totient',
            'treewalk':'TreeBasic',
            'index':'Wisdom',
            'signup':'Signer',
            'unlog':'Wisdom',
            'login':'Login',
            'taskAdder':'TaskAdder',
    }
    if (places[place]=='TaskAdder'):
        return redirect(url_for(places[place], olden=old_place))

    return redirect(url_for(places[place]))


def modify(name, login="Sebix"):
    with open(f'./templates/{name}') as x_file:
        strval=BeautifulSoup(x_file.read(), 'html.parser')
        bt=strval.find(id="loginButton")
        if (bt!=None):
            bt.string='Unlog'
            bt['value']='unlog'

        bt=strval.find(id="signupButton")
        if (bt!=None):
            for x in ['form', 'type', 'formmethod', 'name', 'value']:
                del bt[x]
            bt.string=f"Welcome, {login}"

        bt=strval.find(id="taskButton")
        if (bt!=None):
            bt['style']="display:inline-block;"

    return strval.prettify()


def listAdd(name, login):
    list_problems=engine.execute(f"select name, difficulty, description, link from logging where login='{login}'")
    with open(f'./templates/{name}') as x_file:
        document=BeautifulSoup(x_file.read(), 'html.parser')
        most_outer_div=document.find(id="problems")
        for x in list_problems:
            outer_div=soup.new_tag("div")
            inner_div_above=soup.new_tag("div")
            inner_div_below=soup.new_tag("div")
            link=soup.new_tag("a", href=x[3])
            link.string=x[0]
            inner_div_below.string=x[2]

            inner_div_above.append(link)
            outer_div.append(inner_div_above)
            outer_div.append(inner_div_below)

            
def input_fill(html, olden):
    document=BeautifulSoup(html, 'html.parser')
    vl=document.find(id="domain")
    vl['value']=olden
    return document.prettify()


def Router(htmlName, olden=None):
    req=request
    #DEBUGGED
    if 'UserID' in req.cookies:
        print(req.cookies['UserID'])

    if (req.method=='POST'):
        s=req.form['next']
        return comeBackin(s, htmlName)
    else:
        if 'UserID' in  req.cookies:
            if (req.cookies['UserID']!=''):
                html_full=modify(htmlName, req.cookies['UserID'])
                if (htmlName=='task_adder.html'):
                    html_full=input_fill(html_full, olden)

                resp=make_response(render_template_string(html_full))
            else:
                resp=make_response(render_template(htmlName))
            resp.set_cookie('UserID', req.cookies['UserID'])

        else:
            resp=make_response(render_template(htmlName))
            resp.set_cookie('UserID', '')
        return resp


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
    req=request
    if (req.method=='POST' and req.form['next']=='unlog'):
        resp=make_response(render_template('index.html'))
        resp.set_cookie('UserID', '')
        return resp
    return Router('index.html')

@app.route('/signup', methods=['GET', 'POST'])
def Signer():
    req=request
    print(req.form)
    if (req.method=='POST' and 'pass' in req.form):
        login=req.form['login']
        authValue=login
        mail=req.form['email']
        engine.execute(f"insert into logging(mail, login, password, activated, authValue) values('{mail}', '{login}', '{req.form['pass']}', 0, '{authValue}')")

        #Vulnerable to change
        cursite="127.0.0.1:5000"

        wisdom=MIMEText(f"<a href='{cursite}/validat/{authValue}'> {cursite}/validat/{authValue}</a>", 'html')
        wisdom['Subject'] = 'The Rain was waving goodbye'
        wisdom['From'] = "nothingnessproject@gmail.com"
        wisdom['To'] = mail
        sender_of_wisdom(wisdom.as_string(), mail)
        
    return Router('signup.html')

@app.route('/validat/<auth>', methods=['GET', 'POST'])
def Palingnesia(auth):
    engine.execute(f"update logging set activated=1 where authValue='{auth}'")
    return Router('Finalized.html')


@app.route('/login', methods=['GET', 'POST'])
def Login():
    req=request
    if (req.method=='POST' and 'pass' in req.form):
        results=engine.execute(f"select * from logging where activated=1 and login='{req.form['login']}' and password='{req.form['pass']}'") 

        if results.rowcount>0:
            html_file=modify('index.html', req.form['login'])
            resp=make_response(render_template_string(html_file))
            resp.set_cookie('UserID', req.form['login'])
            return resp
    return Router('login.html')


@app.route('/task_adder/<olden>', methods=['GET', 'POST'])
def TaskAdder(olden="Primez.html"):
    req=request
    if (req.method=='POST' and 'link' in req.form):
        results=engine.execute(f"select * from logging where activated=1 and login='{req.form['login']}' and password='{req.form['pass']}'") 

        if results.rowcount>0:
            html_file=modify('index.html', req.form['login'])
            resp=make_response(render_template_string(html_file))
            resp.set_cookie('UserID', req.form['login'])
            return resp
    return Router('task_adder.html', olden=olden)


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
    #Vulnerable as fuck
    engine=create_engine("postgres://onvvlkvayxvbpz:7a5152102ba6bd5b56218396dddfd40bef4fb12855877e60d8546c0b7b0b0f72@ec2-35-174-127-63.compute-1.amazonaws.com:5432/d7v74vvpqtnp17")

    #engine.execute("delete from logging")
    #engine.execute("drop table logging")

    #engine.execute("create table logging(id int primary key generated always as identity, mail text unique not null, login text unique not null, password text, authValue text, activated int)")
    #engine.execute("create table vision(id int primary key generated always as identity, login text references logging(login), description text, link text, name text, difficulty int)")

    #engine.execute("insert into logging values('Stefan', 'Stannis', 'kappa')")
    app.run()
