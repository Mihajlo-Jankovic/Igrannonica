<h1>Cortex - Igrannonica</h1>

<h2>Server</h2>

Uputstvo i konfiguracije za server

**Spisak zauzetih portova:**

```
10105 - WebServer za Angular
10106 - .NET server
10107 - Main Flask Server
10108 - Storage Flask Server
10109 - MongoDB
```

<h2>Local</h2>

Uputstvo i konfiguracije za local

**Da bi se aplikacija uspesno pokretala potrebno je imati sledece:**

```
Angular CLI: 13.2.5
Node: 16.14.0
Package Manager: npm 8.3.1
.NET: 6.0
MySql: 8.0
Python: 3.10.2
Anakonda: NE

Python biblioteke: tensorflow, pandas, csv, keras, sklearn, category_encoders, urllib, flask, json, requests, websockets, asyncio
```

**Frontend**

Potrebno je otvoriti terminal i u njemu otvoriti folder "front" u kojem se nalazi Angular, iz tog foldera izvrsiti sledece komande:
```
npm install
ng serve
```

**Backend**

U folderu "back" pronaci fajl "Igrannonica.sln" i pokrenuti ga. Kada se pokrene otvora se konzola i tab u swagger-u koji moraju biti otvoreni dok se koristi aplikacija, u suprotnom .NET server ce se ugasiti.

**ML**

Potrebno je otvoriti terminal i u njemu otvoriti folder "ml" u kojem se nalaze python skripte. Iz tog foldera u terminalu izvrsiti sledece komande:

```
set FLASK_APP="FlaskServer.py"
python3 -m flask run
```
