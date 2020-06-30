from flask import Flask, render_template, url_for, redirect, request, make_response, render_template_string
from sqlalchemy import create_engine
from bs4 import BeautifulSoup
import smtplib, ssl
from email.mime.text import MIMEText
import re
import random
import string
import os

app=Flask(__name__)

#Później: zamienić na graf i przechodzić pomiędzy przestrzeniami funkcją
class transformation:
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
            'forgotten':'PassRecoverer',
    }

    place_mapper={
            'NumberTheory/Crt.html':'Chineese_Remainder_Theorem',
            'NumberTheory/BinaryExpo.html':'Binary_Exponentation',
            'NumberTheory/Primes.html':'Erastotenes_Sieve',
            'NumberTheory/Gcd.html':'Greatest_Common_Divisor',
            'NumberTheory/Totient.html':'Totient_function',
            'Trees/TreeBasics.html':'Tree_Walk',
    }

    inverse_place_mapper={
            'Chineese Remainder Theorem':'crt',
            'Binary Exponentation':'binex',
            'Erastotenes Sieve':'sieve',
            'Greatest Common Divisor':'gcd',
            'Totient function':'totient',
            'Tree Walk':'treewalk',
            'index':'index',
    }

    funeral_procession={
            'Chineese Remainder Theorem':'NumberTheory/Crt.html',
            'Binary Exponentation':'NumberTheory/BinaryExpo.html',
            'Erastotenes Sieve':'NumberTheory/Primes.html',
            'Greatest Common Divisor':'NumberTheory/Gcd.html',
            'Totient function':'NumberTheory/Totient.html',
            'Tree Walk':'Trees/TreeBasics.html',
    }
    
    html_to_place={
            'NumberTheory/Crt.html':'crt',
            'NumberTheory/BinaryExpo.html':'binex',
            'NumberTheory/Primes.html':'sieve',
            'NumberTheory/Gcd.html':'gcd',
            'NumberTheory/Totient.html':'totient',
            'Trees/TreeBasics.html':'treewalk', 
    }


def get_random_string(N=40):
    return ''.join(random.SystemRandom().choice(string.ascii_uppercase + string.digits) for _ in range(N))


def comeBackin(place, old_place):
    places=transformation.places
    place_mapper=transformation.place_mapper
    inverse_place_mapper=transformation.inverse_place_mapper

    if (place in places and places[place]=='TaskAdder'):
        return redirect(url_for(places[place], olden=place_mapper[old_place]))

    if (old_place=='System/task_adder.html'):
        return redirect(url_for(places[inverse_place_mapper[place]]))

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
            bt['style']="display:inline-block; position: relative; left: 50%;"

        strval=listAdd(name, login, strval)

    return strval.prettify()


def listAdd(name, login, document):
    list_problems=engine.execute(f"select name, difficulty, description, link, id from vision where login='{login}' and domain='{name}'")
    most_outer_div=document.find(id="problems")

    difficulty_to_color={
            'Easy': '#006600',
            'Medium': '#444400',
            'Hard': '#220000',
            'Other': '#666666',
    }

    fun=transformation.html_to_place

    for x in list_problems:
        outer_div=document.new_tag("div")
        inner_div_above=document.new_tag("div")
        inner_div_below=document.new_tag("div")

        diff=x[1] if x[1] in difficulty_to_color else 'Other'
        inner_div_above['style']=f"background-color: {difficulty_to_color[diff]};"
        outer_div['style']=f"border: solid; border-width: 0.5px; border-color: #888888;"

        link=document.new_tag("a", href=x[3])
        link['style']="color: #FFFFFF;"
        link.string=x[0]
        inner_div_below.string=x[2]

        butt=document.new_tag("button", value=x[4], form="page", formmethod="post")
        butt['style']="color:#FFFFFF; background-color:#440000; border: 0; position: absolute; right:0"
        butt['name']="remove"
        butt['type']="submit"
        butt.string="x"

        inner_div_above.append(link)
        inner_div_above.append(butt)
        outer_div.append(inner_div_above)
        outer_div.append(inner_div_below)

        most_outer_div.append(outer_div)
    return document

            
def input_fill(html, olden):
    document=BeautifulSoup(html, 'html.parser')
    vl=document.find(id="domain")
    value="".join([' ' if x=='_' else x for x in olden])
    for x in transformation.funeral_procession:
        tag=document.new_tag("option", value=x)
        if (value==x):
            tag=document.new_tag("option", value=x, selected=True)
        tag.string=x
        vl.append(tag)

    return document.prettify()

def show_error(name, error):
    req=request
    with open(f'./templates/System/{name}') as x_file:
        strval=BeautifulSoup(x_file.read(), 'html.parser')
        error_div=strval.find(id="error")
        error_div.string=error
        if name=='index.html':
            alls=['themes']
        elif name=='login.html':
            alls=['login', 'pass']
        elif name=='reset_pass_mail.html':
            alls=['email']
        else:
            alls=['login', 'pass', 'email']
        for x in alls:
            strval.find(id=x)['value']=req.form[x]

    return strval.prettify()


def getBSFileByName(name):
    req=request
    with open(f'./templates/{name}') as x_file:
        strval=BeautifulSoup(x_file.read(), 'html.parser')
    return strval



def Router(htmlName, olden=None):
    req=request

    if (req.method=='POST'):
        if ('remove' in req.form):
            engine.execute(f'delete from vision where id={req.form["remove"]}')
            return comeBackin(transformation.html_to_place[htmlName], htmlName)
        s=req.form['next']
        return comeBackin(s, htmlName)
    else:
        if 'UserID' in  req.cookies:
            if (req.cookies['UserID']!=''):
                html_full=modify(htmlName, req.cookies['UserID'])
                if (htmlName=='System/task_adder.html'):
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
    return Router('NumberTheory/Gcd.html')

@app.route('/erasto', methods=['GET', 'POST'])
def ErastotenesSieve():
    return Router('NumberTheory/Primes.html')

@app.route('/crt', methods=['GET', 'POST'])
def ChineseTheorem():
    return Router('NumberTheory/Crt.html')

@app.route('/totient', methods=['GET', 'POST'])
def Totient():
    return Router('NumberTheory/Totient.html')

@app.route('/binex', methods=['GET', 'POST'])
def BinExpo():
    return Router('NumberTheory/BinaryExpo.html')

@app.route('/treewalk', methods=['GET', 'POST'])
def TreeBasic():
    return Router('Trees/TreeBasics.html')

@app.route('/logger/<login>')
def logChecker(login):
    return Router('System/index.html')

@app.route('/', methods=['GET', 'POST'])
def Wisdom():
    req=request

    if (req.method=='POST' and 'search' in req.form):
        inp=req.form['themes']
        if inp in transformation.inverse_place_mapper:
            resp=make_response(redirect(url_for(transformation.places[transformation.inverse_place_mapper[inp]])))
        else:
            resp=make_response(render_template_string(show_error('index.html', "There is no such article on this site!")))

        resp.set_cookie('UserID', req.cookies['UserID'])
        return resp
        
    if (req.method=='POST' and req.form['next']=='unlog'):
        resp=make_response(render_template('System/index.html'))
        resp.set_cookie('UserID', '')
        return resp
    return Router('System/index.html')

@app.route('/signup', methods=['GET', 'POST'])
def Signer():
    req=request
    if (req.method=='POST' and 'pass' in req.form):
        login=req.form['login']
        authValue=get_random_string()
        mail=req.form['email']
        try:
            engine.execute(f"insert into logging(mail, login, password, activated, authValue) values('{mail}', '{login}', '{req.form['pass']}', 0, '{authValue}')")
        except:
            l1=engine.execute(f"select mail from logging where mail='{mail}'")
            error_string="This mail is already in use!" if l1.rowcount>0 else "This login was already taken"

            html_file=show_error('signup.html', error_string)
            resp=make_response(render_template_string(html_file))
            resp.set_cookie('UserID', '')
            return resp


        #Vulnerable to change
        cursite=app.config['SNAME']

        wisdom=MIMEText(f"<p>Hi, {login}, here is the activation link for Your account from Nothingness Project:  <a href='{cursite}/validat/{authValue}'> {cursite}/validat/{authValue}</a></p>", 'html')
        wisdom['Subject'] = 'Nothingness Project activation link'
        wisdom['From'] = "nothingnessproject@gmail.com"
        wisdom['To'] = mail
        sender_of_wisdom(wisdom.as_string(), mail)
        
    return Router('System/signup.html')

@app.route('/validat/<auth>', methods=['GET', 'POST'])
def Palingnesia(auth):
    engine.execute(f"update logging set activated=1, authValue='{get_random_string()}' where authValue='{auth}'")
    return Router('Finalized.html')


@app.route('/login', methods=['GET', 'POST'])
def Login():
    req=request
    if 'cookies' in dir(req) and 'UserID' in req.cookies:
        redirect(url_for('Wisdom'))
        
    if (req.method=='POST' and 'pass' in req.form):
        results=engine.execute(f"select * from logging where activated=1 and login='{req.form['login']}' and password='{req.form['pass']}'") 

        if results.rowcount>0:
            #html_file=modify('index.html', req.form['login'])
            resp=make_response(redirect('/'))
            resp.set_cookie('UserID', req.form['login'])
            return resp


        results=engine.execute(f"select * from logging where activated=1 and login='{req.form['login']}'")
        error_string="Apparently, the password is incorrect" if results.rowcount>0 else "Apparently, either account does not exist or is not activated (this is possible, if You signed up, but did not open link in e-mail from this site)"
        html_file=show_error('login.html', error_string)

        resp=make_response(render_template_string(html_file))
        resp.set_cookie('UserID', '')
        return resp

    return Router('System/login.html')


@app.route('/task_adder/<olden>', methods=['GET', 'POST'])
def TaskAdder(olden="Primez.html"):
    req=request
    if (req.method=='POST' and 'link' in req.form): 
        funeral=transformation.funeral_procession
        rf=req.form
        engine.execute(f"insert into vision(login, domain, description, link, name, difficulty) values('{req.cookies['UserID']}', '{funeral[rf['next']]}', '{rf['description']}', '{rf['link']}', '{rf['name']}', '{rf['difficulty']}')")

        return Router('System/task_adder.html', olden=olden)
    return Router('System/task_adder.html', olden=olden)

@app.route('/recover_password', methods=['GET', 'POST'])
def PassRecoverer():
    req=request
    if (req.method=='POST' and 'email' in req.form):
        mail=req.form['email']
        x=engine.execute(f"select authValue, login from logging where mail='{mail}'")
        if x.rowcount==0:
            html_file=show_error('reset_pass_mail.html', "This mail does not have an account associated with it!")
            resp=make_response(render_template_string(html_file))
            resp.set_cookie('UserID', '')
            return resp
            
        for a in x:
            authValue=a[0]
            login=a[1]
        
        cursite=app.config['SNAME']
        wisdom=MIMEText(f"<a href='{cursite}/auth_reset/{authValue}'>{cursite}/auth_reset/{authValue}</a>", 'html')
        wisdom=MIMEText(f"<p>Hi, {login}, here is the link to regain password for Thine account from Nothingness Project:  <a href='{cursite}/auth_reset/{authValue}'>{cursite}/auth_reset/{authValue}</a></p>", 'html')
        wisdom['Subject'] = 'Nothingness Project password reset'
        wisdom['From'] = "nothingnessproject@gmail.com"
        wisdom['To'] = mail
        sender_of_wisdom(wisdom.as_string(), mail)

    return Router('System/reset_pass_mail.html')

    
@app.route('/auth_reset/<auth_value>', methods=['GET', 'POST'])
def AuthReseter(auth_value):
    req=request
    if req.method=='POST' and 'email' not in req.form:
        return Router('System/index.html')

    if req.method=='POST' and 'email' in req.form:
        try:
            engine.execute(f"update logging set login='{req.form['login']}', password='{req.form['pass']}' where mail='{req.form['email']}'")
        except:
            html_file=show_error('reset_pass_main.html', "This login is already in use!")
            resp=make_response(render_template_string(html_file))
            resp.set_cookie('UserID', '')
            return resp

        resp=make_response(redirect('/'))
        resp.set_cookie('UserID', req.form['login'])
        return resp

    html_file=getBSFileByName('System/reset_pass_main.html')
    em_cont=engine.execute(f"select mail from logging where authValue='{auth_value}';")
    engine.execute(f"update logging set authValue='{get_random_string()}' where authValue='{auth_value}';")

    for x in em_cont:
        email=x[0]
    html_file.find(id="email")['value']=email

    resp=make_response(render_template_string(html_file.prettify()))
    resp.set_cookie('UserID', '')
    return resp

@app.context_processor
def jinjautils():
    def jipow(a, b):
        return pow(a, b)
    topics=[x for x in transformation.inverse_place_mapper if ord(x[0])<92]
    return dict(jipow=jipow, topics=topics)

def sender_of_wisdom(text, receiver="sebastian.michon10@protonmail.com"):
    port = 465
    passwd=os.environ.get("EMAIL_PASSWORD")
    # Create a secure SSL context
    context = ssl.create_default_context()
    sender=os.environ.get("EMAIL_LOGIN")

    with smtplib.SMTP_SSL("smtp.gmail.com", port, context=context) as server:
        server.login(sender, passwd)
        server.sendmail(sender, receiver, text)

@app.before_first_request
def dbCreator():
    global engine
    engine=create_engine(os.environ.get("DATABASE_URL"))
    app.config['SNAME']=os.environ.get("SNAME")
    #engine=create_engine(os.environ.get("DATABASE_URL"))



if __name__=='__main__':
    #engine.execute("delete from vision")
    #engine.execute("delete from logging")

    #engine.execute("drop table vision")
    #engine.execute("drop table logging")

    #engine.execute("create table logging(id int primary key generated always as identity, mail text unique not null, login text unique not null, password text, authValue text, activated int)")
    #engine.execute("create table vision(id int primary key generated always as identity, login text references logging(login) on update cascade, domain text, description text, link text, name text, difficulty text)")

    #engine.execute("insert into logging values('Stefan', 'Stannis', 'kappa')")
    app.run()
