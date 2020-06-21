# Nothingness
Some js nonsense

If You want to see, how the nonsense looks like, and You have python with flask, then:

0) Create local .env file specifying DB access, login and password to email suitable for sending signup/reset password
File looks like this:

DATABASE_URL=postgres://onvvlkvayxvbpz:BLALALALLALLALALAL@ec2-35-174-127-63.compute-1.amazonaws.com:5432/WhoKnows

EMAIL_LOGIN=nothingnessproject@gmail.com

EMAIL_PASSWORD=nothing_to_see_here

1) pip install python-dotenv
2) python base.py
3) go in the browser to localhost:5000/

Or You can use Heroku platform: https://algos.herokuapp.com/


Założenia aplikacji i jej obecny stan:
1) Aplikacja posiada kilka (6) artykułów razem z wizualizacjami, do których można podać stosowny input opisany powyżej, tak aby rozpocząć animację.
2) Każda wizualizacja ma 4 przyciski: aby ją rozpocząć, należy kliknąć begin dla poprawnie sformułowanego test case'u (format jest na górze razem z dodatkowymi informacjami). Nie podałem informacji o maksymalnych wartościach, bo nie mają one sensu - zasadniczo aplikacja może przestać odpowiadać po podaniu test case'u, który nakazuje wyrenderowanie zbyt dużej ilości danych.
3) Wizualizacja drzewa nie będzie renderowana poprawnie, jeśli została już stworzona, a następnie zmieniono rozmiar okna przeglądarki - to wynika z definiowania edge'ów jako divów o określonej długości pod określonym kątem, wyliczonymi m.in na podstawie rozmiaru okna przeglądarki. To nie jest pierwszorzędny problem, bo prawie nikt nie zmienia rozmiaru przeglądarki w trakcie korzystania z tego typu aplikacji - a nawet jeśli, to pewnie kliknie znowu "begin" i zapomni o problemie, natomiast zapewne zostanie to niebawem zmienione.
4) Niewykluczone, że w aplikacji nadal są błędy teoretyczne albo niejednoznaczności - jednym z najważniejszych problemów aplikacji w przyszłości będzie ich eliminacja.

5) Aplikacja pozwala zalogować się, zarejestrować się używając własnego maila, a także zresetować swój login i hasło opcją forgot password - także za pomocą maila.
6) Aplikacja pozwala zalogowanemu użytkownikowi przechowywać listy zadań do danego problemu (są to arbitralne linki - równie dobrze mogą to być inne tutoriale), wybierając dla nich 1 z 3 poziomów trudności, a także opis.
7) Zadania własne są przechowywane na końcu strony dotyczącej danego problemu w kolorze zależnym od poziomu trudności (można nie podać poprawnego poziomu trudności, wtedy wyświetli się na szaro - być może skala trudności zostanie zmieniona w przyszłości na liczbową, ale to trzeciorzędny drobiazg). Można je usunąć z listy klikając na nich przycisk x. W założeniu użytkownicy na ogół nie przechowują więcej niż 5 problemów z danego działu, więc nie dodawałem (na razie) innych użyteczności dotyczących listy.
8) Aplikacja ma na stronie głównej SearchBar pozwalający przejść do 1 z obecnie 6 artykułów. Podanie błędnych danych implikuje pojawienie się komunikatu o nieistnieniu danego artykułu.




Cele przyszłościowe:

A) Cele merytoryczne

	1) Dokończenie Teorii Liczb - pozostaje Divisors (1), Primitive Root (2), Discrete Root/Logarithm (3), Number Theoretic Transform (w tym samym artykule będzie Fast Fourier Transform) (4) - pewnie w sierpniu skończy się ten dział.

	2) Drzewa - pozostaje wszystko, ale przynajmniej jest rysowanie drzew: obecne cele to LCA, Rzut drzewa na drzewo przedziałowe, small-to-large na 2 sposoby, heavy-light decomposition, centroid decomposition i rzutowanie drzewa na Persistent segment tree - co najmniej 5 artykułów. Do września powinno się zakończyć.

	3) Algorytmy tekstowe - KMP, Suffix table, Trie z Aho-Corasickiem; dalej Suffix automata/tree i (być może) algorytmy palindromowe (Palindrom tree albo Manacher). Być może dojdzie coś jeszcze. Do października może się skończy.

	4) Testowanie na żywych użytkownikach - co jest zrozumiałe, a co nie? Zmiana sformułowań na krótsze i bardziej precyzyjne, jeśli się da.

	5) Przygotowanie dowodów w formacie Teza/Obserwacje/Dowód.

	6) Być może dodanie kodów - nie wiem jeszcze, czy w Ruście, czy C++ i w jakim stylu - to jest cel drugorzędny.


B) Cele infrastrukturalne:

	1) Stworzenie profilu użytkownika - na początek tylko z pogrupowanymi problemami. Dostępny ze strony głównej, po kliknięciu na "Welcome, {login}" (jak bodaj w dawnym HackerRanku).

	2) Stworzenie koncepcji użycia kompilatorów, wykonania kodu i użycia online-judge'a

	3) Implementacja online-judge'a dla kilku problemów - w ostateczności pewnie wszystkich, ale na początek test case'y z poprawnymi outputami dla 1-2 problemów starczą.

	4) Danie użytkownikom możliwości submitowania kodów i sprawdzania ich na test case'ach, a także usuwania kodów i dostępu z poziomu profilu użytkownika.
