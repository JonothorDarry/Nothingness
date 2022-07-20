# Nothingness
Some algorithm visualizations, mostly related to number theory. 

## Shortcomings of applications visualizing algorithms I've seen:
 1) They have an absurd amount of pop-ups I never ever read.
 2) They don't allow to visualize a mechanism on a huge testcase.
 3) They don't give to shown mechanisms any identity distinguishing them from other mechanisms (or ideas).
 4) There is usually nothing interesting about those visualizations once you know, how a mechanism works.
 5) They don't couple visualizations with theory containing proofs and ideas related to a mechanism / an algorithm.
 6) They don't have nice buttons distinguishing articles and/or visualizations.

## Assumptions
 1) Seeing how the method works before analyzing it theoretically may yield better results (i.e. seeing how the mechanism works before thinking about it).
 2) Visualization should show primarily why a mechanism works, rather than how it works. 
 3) It is appropriate to show past actions of an algorithm (even if they're irrelevant) in order to give bird's-eye view to an algorithm along with fun.
 4) It is sometimes desirable to debug own library with the use of visualizations along with partial results.
 5) Visualizations should provide fun, whether by allowing to pass a huge testcase and see its results, or by the virtue of its aesthetics, or by allowing to use ProgressBar and see how the reality changes in subsequent steps of a mechanism.


## How does a visualization work (right now)?
 1) Click "Begin" in order to start a visualization (or don't, I won't tell you what to do with your life). Begin initializes the algorithm with supplied (or default) input and options.
 2) "Next Move" / "Previous Move" allows to move the visualization one step back/forward.
 3) "Finish" allows to move visualization to its last state.
 4) "Visualization Progress" bar allows to move the visualization from one state to another.
 5) Some algorithms have additional options: they usually allow either to disable some feature (for example, disable displaying grids in gcd visualization - which is handy for showing table on large data) or enable some feature (for example, showing rho's in pollard-rho algorithm - either for found divisor, or all divisors in form \(p^k\))

In order to use it, you can use Heroku platform: https://algos.herokuapp.com/

If You want to see, how the application looks like, and you have python with flask, then:

1) pip install -r requirements.txt
2) python base.py
3) go in the browser to localhost:5000/
