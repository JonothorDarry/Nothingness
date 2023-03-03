from flask import Flask, render_template, url_for, redirect, request, make_response, render_template_string
from bs4 import BeautifulSoup
from math import log

app=Flask(__name__)

class Article:
    def __init__(self, base, path, refined_full_name, url):
        self.base = base
        self.path = path
        self.refined_full_name = refined_full_name
        self.refined_with_underscore = refined_full_name.replace(' ', '_')
        self.full_name = self.refined_with_underscore
        self.url = url

systems=[
        ['sieve', 'NumberTheory/Primes.html', 'Erastotenes Sieve', 'erasto'],
        ['gcd', 'NumberTheory/Gcd.html', 'Greatest Common Divisor', 'gcd'],
        ['crt', 'NumberTheory/Crt.html', 'Chineese Remainder Theorem', 'crt'],
        ['divisors', 'NumberTheory/Divisors.html', 'Divisors', 'divisors'],
        ['binex', 'NumberTheory/BinaryExpo.html', 'Binary Exponentation', 'binex'],
        ['totient', 'NumberTheory/Totient.html', 'Totient', 'totient'],
        ['proot', 'NumberTheory/Proot.html', 'Primitive Root', 'proot'],
        ['dlog', 'NumberTheory/Discrete.html', 'Discrete Logarithm', 'dlog'],
        ['advpr', 'NumberTheory/Aprimes.html', 'Advanced Primes', 'advpr'],
        ['primescnt', 'NumberTheory/Prcount.html', 'Counting Primes', 'prcount'],
        ['ntt', 'NumberTheory/Ntt.html', 'Number Theoretical Transform', 'ntt'],

        ['choice', 'Combinatorics/Choice.html', 'Choice', 'choice'],
        ['iep', 'Combinatorics/Iep.html', 'Inclusion Exclusion Principle', 'iep'],
        ['romance', 'Combinatorics/Unholy_romance.html', 'Number theory in combinatorics', 'unholy_romance'],
        ['isomorphism', 'Trees/Tree_isomorphism.html', 'Tree Isomorphism', 'isomorphism'],

        ['treewalk', 'Trees/TreeBasics.html', 'Tree Walk', 'treewalk'],
        ['lca', 'Trees/Lca.html', 'Lowest Common Ancestor', 'lca'],
        ['shows', 'Temp/Shows.html', 'Shows', 'shows']
]
systems=[Article(*x) for x in systems]

class transformation:
    places={
            **{x.base:x.full_name for x in systems}, 
            'all_vizes':'Allez',
            'index':'Wisdom',
            'signup':'Signer',
            'unlog':'Wisdom',
            'login':'Login',
            'taskAdder':'TaskAdder',
            'forgotten':'PassRecoverer',
    }

    place_mapper={
            **{x.path:x.refined_with_underscore for x in systems}, 
    }

    inverse_place_mapper={
            **{x.refined_full_name:x.base for x in systems}, 
            'index':'index',
    }

    funeral_procession={
            **{x.refined_full_name:x.path for x in systems},
    }
    
    html_to_place={
            **{x.path:x.base for x in systems},
    }

    base_to_url = {
            **{x.base:x.url for x in systems},
    }

def comeBackin(place, old_place):
    places=transformation.places
    place_mapper=transformation.place_mapper
    inverse_place_mapper=transformation.inverse_place_mapper

    if (place in places and places[place]=='TaskAdder'):
        return redirect(url_for(places[place], olden=place_mapper[old_place]))

    if (old_place=='System/task_adder.html'):
        return redirect(url_for(places[inverse_place_mapper[place]]))

    return redirect(url_for(places[place]))

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


def Router(htmlName, olden=None):
    req=request
    if (req.method=='POST'):
        s=req.form['next']
        return comeBackin(s, htmlName)
    else:
        resp=make_response(render_template(htmlName))
        return resp

for x in systems:
    exec(f"""
@app.route('/{x.url}', methods=['GET', 'POST'])
def {x.full_name}():
    return Router('{x.path}')
    """)

@app.route('/all_vizes', methods=['GET', 'POST'])
def Allez():
    return Router('System/all_vizes.html')


@app.route('/', methods=['GET', 'POST'])
def Wisdom():
    req=request

    if (req.method=='POST' and 'search' in req.form):
        inp=req.form['themes']
        if inp in transformation.inverse_place_mapper:
            resp=make_response(redirect(url_for(transformation.places[transformation.inverse_place_mapper[inp]])))
        else:
            resp=make_response(render_template_string(show_error('index.html', "There is no such article on this site!")))

        return resp
        
    return Router('System/index.html')


@app.context_processor
def jinjautils():
    def jipow(a, b):
        return pow(a, b)
    def jilog(a):
        return log(a)
    def ji_formatter(a, numb=4):
        return f'{a:.{numb}f}'
    def ji_expo(a):
        if len(str(a))<5:
            return str(a), -1
        sa=str(a)
        return f'{sa[0]}.{sa[1]}*10', len(sa)-1
    def ji_ge(a, b):
        return a>=b

    topics=[x for x in transformation.inverse_place_mapper if ord(x[0])<92]
    return dict(jipow=jipow, jilog=jilog, ji_expo=ji_expo, ji_formatter=ji_formatter, ji_ge=ji_ge, topics=topics, ji_urls=transformation.base_to_url)


if __name__=='__main__':
    app.run()
