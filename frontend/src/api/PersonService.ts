import {ApiError, Levels} from '@/api/error';
import Person, {PersonCallUpdate, mapPersonToPersonCallUpdate, Quarantäne} from "@/types/Person";
import PersonSearchParams from './types/PersonSearchparams';
import { resolve } from 'dns';
import Kategorie from '@/types/Kategorie';
import FetchUtils from './FetchUtils';
import { Kontakt } from '@/types/Kontakt';
import SearchResult from "@/types/SearchResult";
import { throws } from 'assert';

export default class PersonService {

    private static base:  string | undefined = process.env.VUE_APP_API_URL  + "/api/cove-backend-service";

    static savePerson(person:Person): Promise<Person> {
        return fetch(`${this.base}/persons`, FetchUtils.getPOSTConfig(person))
            .catch(FetchUtils.defaultPersonenServiceCatchHandler)
            .then(response => {
                FetchUtils.defaultResponseHandler(response, "Beim Erstellen der Person ist ein Fehler aufgetreten. Bitte Daten kontrollieren.");
                return response.json();
            })
    }

    static updatePerson(person:Person): Promise<Person> {
        return fetch(`${this.base}/persons/${person.id}`, FetchUtils.getPATCHConfig(person))
            .catch(FetchUtils.defaultPersonenServiceCatchHandler)
            .then(response => {
                if(response.status === 412) {
                    throw new ApiError({
                        level: Levels.WARNING,
                        message: "Die Person wurde in der Zwischenzeit von einer anderen Person verändert. Bitte laden Sie die Daten neu und probieren Sie es erneut."
                    });
                }
                FetchUtils.defaultResponseHandler(response, "Beim aktualisieren der Person ist ein Fehler aufgetreten. Bitte Daten kontrollieren.");
                return response.json();
            })
    }

    static updateCalledPerson(person : Person): Promise<Person> {

        const callPersonUpdate = mapPersonToPersonCallUpdate(person);

        return fetch(`${this.base}/persons/${callPersonUpdate.id}`, FetchUtils.getPATCHConfig(callPersonUpdate))
            .catch(FetchUtils.defaultPersonenServiceCatchHandler)
            .then(response => {
                if(response.status === 412) {
                    throw new ApiError({
                        level: Levels.WARNING,
                        message: "Die Person wurde in der Zwischenzeit von einer anderen Person verändert. Bitte laden Sie die Daten neu und probieren Sie es erneut."
                    });
                }
                FetchUtils.defaultResponseHandler(response, "Beim Aktualisieren der Person ist ein Fehler aufgetreten. Bitte Daten kontrollieren.");
                return response.json();
            })
    }

    static deletePerson(personID:string): Promise<any> {
        return fetch(`${this.base}/persons/${personID}`, 
                    {
                        method: 'DELETE',
                        headers: FetchUtils.getHeaders(),
                        mode: 'cors',
                        credentials: 'include',
                        redirect: "manual"
                    })
            .catch(FetchUtils.defaultPersonenServiceCatchHandler)
            .then(response => {
                // First check for 409 Conflict
                if(response.status === 409) {
                    throw new ApiError({
                        level: Levels.WARNING,
                        message: "Die Person ist für eine andere Person als Kontaktperson eingetragen und kann nicht gelöscht werden."
                    });
                }

                FetchUtils.defaultResponseHandler(response, "Beim Löschen der Person ist ein Fehler aufgetreten.");

                return response.text();
            })

    }
    
    static readPerson(personID:string, readKontakte:boolean = false): Promise<Person> {
        return fetch(`${this.base}/persons/${personID}`, FetchUtils.getGETConfig())
            .catch(FetchUtils.defaultPersonenServiceCatchHandler)
            .then(response => {
                FetchUtils.defaultResponseHandler(response, `Beim Lesen der Person mit ID ${personID} ist ein Fehler aufgetreten.`);
                return response.json()
                    .then((person => {
                        person = this.hateoasAndVersionPersonenEnhancer(person, response);

                        let promises : Promise<any>[] = [];
                        let kontaktMap : Map<string,Person> = new Map();
                        
                        person.kontakte.forEach((kontakt : Kontakt) => {
                            if(kontakt._links) {
                                const urlParts: string[] = kontakt._links.kontakt.href.split("/");
                                if(readKontakte) {
                                    promises.push(
                                        PersonService.readPerson(urlParts[urlParts.length-1])  
                                            .then(result => kontaktMap.set(kontakt._links.kontakt.href, result))
                                    )
                                }
                            }
                        })
                        
                        return Promise.all(promises).then(() => {
                            person.kontakte.forEach((kontakt : Kontakt) => {
                                if(kontakt._links) {
                                    kontakt._person = kontaktMap.get(kontakt._links.kontakt.href) as Person;
                                } else {
                                    kontakt._person = {} as Person;
                                }
                            })
                            return new Promise((resolve) => resolve(person));
                        })
                    }))
            })

    }

    static searchPerson(params:PersonSearchParams, page:number,size: number, sort: string = "", reverseSort: boolean = false): Promise<SearchResult> {
        var searchString:string = `q=${params.name}`;
        if(params.kategorie) {
            searchString += `&kategorie=${params.kategorie}`;
        }
        return fetch(`${this.base}/persons/search?${searchString}&page=${page - 1}&size=${size}&sort=${sort}&reverse=${reverseSort}`,
            FetchUtils.getGETConfig())
            .catch(FetchUtils.defaultPersonenServiceCatchHandler)
            .then(response => {
                FetchUtils.defaultResponseHandler(response, "Beim Suchen von Personen ist ein Fehler aufgetreten.");
                return response.json()
                    .then(data =>  new Promise<SearchResult>((resolve) =>
                        resolve(new SearchResult(data.content, data.pageable.pageNumber, data.pageable.pageSize, data.totalElements))));
            })

    }

    static findIndexPersonToKontakt(personId: string): Promise<Person[]> {
        return fetch(`${this.base}/persons/search/findByKontakte_kontakt_id?id=${personId}`, FetchUtils.getGETConfig())
            .catch(FetchUtils.defaultPersonenServiceCatchHandler)
            .then(response => {
                FetchUtils.defaultResponseHandler(response, "Beim Suchen der Indexperson ist ein Fehler aufgetreten.");
                return response.json()
                    .then(data =>  new Promise<Person[]>((resolve) => resolve(data._embedded.persons)));
            })

    }

    static getIndexPersonenOhneBearbeiterNichtKontaktiert(page:number = 1, size: number = 10) : Promise<Person[]> {
        return fetch(`${this.base}/persons/search/indexpersonenOhneBearbeiterNichtKontaktiert?page=${page - 1}&size=${size}`, FetchUtils.getGETConfig())
            .catch(FetchUtils.defaultPersonenServiceCatchHandler)
            .then(response => {
                FetchUtils.defaultResponseHandler(response, "Beim Laden der anzurufenden Index-Personen ist ein Fehler aufgetreten.");
                return response.json()
                    .then(data =>  new Promise<Person[]>((resolve) => resolve(this.personEnhancer(data._embedded.persons))));
            })
    }

    static getMeineZuBearbeitendenPersonen() : Promise<Person[]>{
        return fetch(`${this.base}/persons/meineZuBearbeitendenPersonen`, FetchUtils.getGETConfig())
            .catch(FetchUtils.defaultPersonenServiceCatchHandler)
            .then(response => {
                FetchUtils.defaultResponseHandler(response, "Beim Laden der noch zu bearbeitenden Personen ist ein Fehler aufgetreten.");
                return response.json()
                    .then((data:Person[]) =>  {
                        return new Promise((resolve) => resolve(data.map(person => this.hateoasAndVersionPersonenEnhancer(person, response))))
                    });
            })
    }

    static getNextDailyCall() : Promise<Person> {
        return fetch(`${this.base}/persons/generateNextDailyCall`, FetchUtils.getGETConfig())
            .catch(FetchUtils.defaultPersonenServiceCatchHandler)
            .then(response => {
                if(response.status === 412) {
                    throw new ApiError({
                        level: Levels.WARNING,
                        message: "Es ist ein Fehler aufgetreten. Bitte versuchen Sie es noch einmal."
                    });
                }

                if(response.status === 204) {
                    throw new ApiError({
                        level: Levels.INFO,
                        message: "Für heute sind keine weiteren Index-Personen anzurufen."
                    });
                }
                FetchUtils.defaultResponseHandler(response, "Beim Laden der nächsten anzurufenden Index-Person ist ein Fehler aufgetreten.");

                return response.json()
                .then((person => new Promise((resolve) => resolve(this.hateoasAndVersionPersonenEnhancer(person, response)))))
            })
    }

    static getNextEndgespraechCall(kategorieToCall: Kategorie, quarantaeneEndeAb: Date | null) : Promise<Person> {
        return fetch(`${this.base}/persons/generateNextEndgespraechCall?kategorie=${kategorieToCall}&quarantaeneEndeAb=${quarantaeneEndeAb ? quarantaeneEndeAb : ''}`, FetchUtils.getGETConfig())
            .catch(FetchUtils.defaultPersonenServiceCatchHandler)
            .then(response => {
                if(response.status === 412) {
                    throw new ApiError({
                        level: Levels.WARNING,
                        message: "Es ist ein Fehler aufgetreten. Bitte versuchen Sie es noch einmal."
                    });
                }

                if(response.status === 204) {
                    throw new ApiError({
                        level: Levels.INFO,
                        message: "Für heute sind keine weiteren Endgespräche zu führen."
                    });
                }
                FetchUtils.defaultResponseHandler(response, "Beim Laden des nächsten Endgesprächs ist ein Fehler aufgetreten.");

                return response.json()
                    .then((person => new Promise((resolve) => resolve(this.hateoasAndVersionPersonenEnhancer(person, response)))))
            })
    }

    static getPersonenFuerEndgespraech(kategorieToCall: Kategorie, quarantaeneEndeAb: Date | null, page:number = 1, size: number = 10) : Promise<Person[]> {
        return fetch(`${this.base}/persons/search/personenFuerEndgespraech?page=${page - 1}&size=${size}&kategorie=${kategorieToCall}&quarantaeneEndeAb=${quarantaeneEndeAb ? quarantaeneEndeAb : ''}`, FetchUtils.getGETConfig())
            .catch(FetchUtils.defaultPersonenServiceCatchHandler)
            .then(response => {
                FetchUtils.defaultResponseHandler(response, "Beim Laden der Personen für Endgespräche ist ein Fehler aufgetreten.");
                return response.json()
                    .then(data =>  new Promise<Person[]>((resolve) => resolve(data._embedded.persons)));
            })
    }

    static countEndgespraecheFuerDatum(datum:Date) : Promise<number> {
        let dateString = datum.toISOString().replace(/T.*/,"")
        return fetch(`${this.base}/persons/search/countEndgespraecheFuerDatum?datum=${dateString}`, FetchUtils.getGETConfig())
            .catch(FetchUtils.defaultPersonenServiceCatchHandler)
            .then(response => {
                FetchUtils.defaultResponseHandler(response, "Beim Laden der Personenanzahl für Endgespräche ist ein Fehler aufgetreten.");
                return response.json();
            })
    }

    static generateEndgespraechAnruferListeFuerDatum(datum:Date, anzahl: Number | null) : Promise<Person[]> {
        let dateString = datum.toISOString().replace(/T.*/,"")
        return fetch(`${this.base}/persons/generateEndgespraechAnruferListeFuerDatum?anzahl=${anzahl}&datum=${dateString}`, FetchUtils.getGETConfig())
            .catch(FetchUtils.defaultPersonenServiceCatchHandler)
            .then(response => {
                FetchUtils.defaultResponseHandler(response, "Beim Laden der Personen für Endgespräche ist ein Fehler aufgetreten.");
                if(response.status === 204) {
                    throw new ApiError({
                        level: Levels.WARNING,
                        message: "Für die gewählte Eingabe stehen keine Personen zur Verfügung."
                    });
                }
                return response.json()
                    .then(data =>  new Promise<Person[]>((resolve) => resolve(data)));
            })
    }

    static personEnhancer(persons: Person[]): Person[] {
        for (let person of persons) {
            if(!person.quarantaene) {
                person.quarantaene = {} as Quarantäne;
            }
        }
        return persons;
    }

    static hateoasAndVersionPersonenEnhancer(person:Person, response:Response) : Person {
        // Wenn keine Version mitgeschickt wird, setzte die Version aus dem etag-Header
        if(!person.version) {
            person.version = parseInt((response.headers.get("etag") as string).replace(/"/, ''))
        }

        person.kontakte.forEach((kontakt : Kontakt) => {
            if(kontakt._links) {
                kontakt.kontakt = kontakt._links.kontakt.href;
            }
        })

        return person;
    }
}