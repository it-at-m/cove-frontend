# COVe Frontend

## Inhaltsverzeichnis

* [Über das Projekt](#über-das-projekt)
  * [Architektur](#architektur)
  * [Verwendete Technologien](#verwendete-technologien)
* [Erste Schritte](#erste-schritte)
  * [Installation](#installation)
  * [Konfiguration](#konfiguration)
    * [Routen](#routen)
    * [OAuth](#oauth)
    * [Frontend](#frontend)
* [Verwendung](#verwendung)
* [Lizenz](#lizenz)


## Über das Projekt

In Zeiten von COVID-19 müssen Gesundheitsämter die gemeldeten COVID-19-Verdachtsfälle und deren 
Kontaktpersonen erfassen, Laborergebnisse und Quarantäne-Zeiträume dokumentieren und 
zeitgleich viele Telefonanrufe mit den Betroffenen führen.

COVe (COVID-19-Verdachtsfall-Verwaltung) vereint dies innerhalb einer modernen Web-App. Durch sie lassen sich Verdachtsfälle einfach erfassen, die Anrufe leichter organisieren und die Ergebnisse schneller dokumentieren.
Durch den innovativen Ansatz der Telefonlisten haben alle Mitarbeiterinnen und Mitarbeiter eines Telefonservices gleichzeitig Zugriff auf aktuelle Daten.
Das spart erheblich Zeit in der Krisensituation.

![Funktionsweise][functionality-screenshot]


### Architektur

![Architektur][architecture-screenshot]

COVe-Backend: https://github.com/it-at-m/cove-backend

COVe-Frontend: https://github.com/it-at-m/cove-frontend


### Verwendete Technologien

* [Java](https://www.java.com/de/)
* [Maven](https://maven.apache.org/)
* [Spring Boot](https://spring.io/projects/spring-boot)
* [Node.js](https://nodejs.org/)
* [VUE.js](https://vuejs.org/)


## Erste Schritte

Für das erfolgreiche Bauen und Ausführen der Anwendung sollte **Java**, **Maven**, **Node** und **Vue** bereits installiert und eingerichtet sein.
Desweiteren wird für den Security Modus eine **Single-Sign-On Umgebung** benötigt. In unserem Fall wurde Keycloak verwendet. 
Es kann aber auch jeder andere OAuth2-Provider (OpenID-Connect) wie zum Beispiel AWS Cognito genutzt werden.


### Installation

1. Das Repository clonen
```shell script
git clone https://github.com/it-at-m/cove-frontend.git
``` 


### Konfiguration

Vor der Verwendung der Anwendung müssen noch einige Konfigurationen vorgenommen werden.


#### Routen 

In der application.yml der jeweiligen Umgebung muss die Route für das Backend noch konfiguriert werden.
```yaml
 routes:
        - id: backend
          uri: <host-backend>
          predicates:
            - Path=/api/cove-backend-service/**
          filters:
            - RewritePath=/api/cove-backend-service/(?<urlsegments>.*), /$\{urlsegments}
            - RemoveResponseHeader=WWW-Authenticate
```


#### OAuth

In der application.yml der jeweiligen Umgebung muss der Realm, die Keycloak-issuer-uri, die 
Client-id und das Client-secret noch gesetzt werden.

```yaml
# security config
security:
  oauth2:
    client:
      provider:
        keycloak:
          issuer-uri: <host>/auth/realms/${spring.realm}
      registration:
        keycloak:
          client-id: client_name
          client-secret: client_secret
```


#### Frontend

Unter dem Ordner `frontend` können folgende Parameter für die entwicklungs und produktiv Umgebung in der Datei `.env.development` bzw. `.env.production` gesetzt werden.

```text
NODE_ENV= ENVIRONMENT
VUE_APP_API_URL= URL_API
VUE_APP_FAQ= URL_FAQ
VUE_APP_BENUTZERHANDBUCH= URL_Benutzerhandbuch
```


## Verwendung

Die Anwendung besitzt folgende Spring Profiles:

- security (defaultmäßig aktiviert)
- no-security
- local
- dev
- test
- kon
- prod

Um die Anwendung local zu starten, können folgende zwei Skripte ausgeführt werden:
```shell script
# Mit Security
./runLocal.sh

# Ohne Security
./runLocalNosecurity.sh
```

Eine weitere Möglichkeit ist es, dass Maven Plugin zu verwenden:
```shell script
# Ausführbare Jar Datei erzeugen
mvn clean install

# Anwendung mit jeweiligen Profil starten (Bsp.: local,no-security)
mvn clean spring-boot:run -Dspring-boot.run.jvmArguments="-Dspring.profiles.active=local,no-security"
```

## Lizenzierung und Copyright ##
© Copyright 2020 – it@M

*COVe* ist lizenziert unter der *European Union Public Licence (EUPL)*.
Für mehr Informationen siehe `LICENSE`.




[functionality-screenshot]: img/COVe_Grafik.jpg
[architecture-screenshot]: img/COVe_Bausteinsicht.png
