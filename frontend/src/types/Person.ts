import Kategorie from './Kategorie'
import MedEinrichtung from './MedEinrichtung'
import Ergebnis from './Ergebnis';
import { Kontakt } from './Kontakt';

export interface Quarantäne{
    start: Date;
    ende: Date;
}

export interface Probe{
    kommentar: string;
    datum : Date;
    ergebnis: Ergebnis;
}

/**
 * Teilperson die per patch die aktuell angerufene Person aktualisiert.
 * Verhindert Probleme beim speichern von Kontakten und anderen Relationen
 */
export interface PersonCallUpdate {
    id: string;
    telefonnotizen?: string;
    doku?: string;
    quarantaene: Quarantäne;

    letzterKontakt : Date | null;
    endTelefonatErfolgtAm : Date | null;
    aktuellerBearbeiter : string | null;

    // Wird aus "ETag"-Header im PersonService gesetzt.
    version: number;
}

export default interface Person{
    id: string;
    createdDate: Date
    name: string;
    vorname: string;
    vornameNachname: string;
    kategorie: Kategorie;
    medEinrichtung: MedEinrichtung;
    standort?: string;
    geburtsdatum?: Date;
    strasse?: string;
    ort?: string;
    plz?: string;
    landkreis?: string;
    land?: string;
    telefon?: string;
    mobile?: string;
    mail?: string;
    kontakte: Kontakt[];
    quarantaene: Quarantäne;
    proben: Probe[];
    kommentare?: string;
    haushalt?: string;
    telefonnotizen?: string;
    doku?: string;
    ehemalsKp? : Date;
    letzterKontakt : Date | null;
    erstKontaktErfolgtAm?: Date;
    endTelefonatErfolgtAm : Date | null;
    aktuellerBearbeiter : string | null;

    // Wird aus "ETag"-Header im PersonService gesetzt, wenn es nicht direkt vom Backend kommt...
    version: number;
}

export function equalsPerson(person1:Person, person2:Person) : Boolean {
    return person1.id === person2.id &&
    person1.createdDate === person2.createdDate &&
    person1.name === person2.name &&
    person1.vorname === person2.vorname &&
    person1.vornameNachname === person2.vornameNachname &&
    person1.kategorie === person2.kategorie &&
    person1.medEinrichtung === person2.medEinrichtung &&
    person1.standort === person2.standort &&
    person1.geburtsdatum === person2.geburtsdatum &&
    person1.strasse === person2.strasse &&
    person1.ort === person2.ort &&
    person1.plz === person2.plz &&
    person1.landkreis === person2.landkreis &&
    person1.land === person2.land &&
    person1.telefon === person2.telefon &&
    person1.mobile === person2.mobile &&
    person1.mail === person2.mail &&
    person1.quarantaene.start === person2.quarantaene.start &&
    person1.quarantaene.ende === person2.quarantaene.ende &&
    person1.kommentare === person2.kommentare &&
    person1.haushalt === person2.haushalt &&
    person1.telefonnotizen === person2.telefonnotizen &&
    person1.doku === person2.doku &&
    person1.ehemalsKp === person2.ehemalsKp &&
    person1.letzterKontakt === person2.letzterKontakt &&
    person1.erstKontaktErfolgtAm === person2.erstKontaktErfolgtAm &&
    person1.endTelefonatErfolgtAm === person2.endTelefonatErfolgtAm &&
    person1.aktuellerBearbeiter === person2.aktuellerBearbeiter &&
    person1.id === person2.id &&
    person1.id === person2.id &&
    equalsKontakte(person1.kontakte,person2.kontakte) &&
    equalsProben(person1.proben,person2.proben);
}

function equalsKontakte(kontakte1: Kontakt[], kontakte2:Kontakt[]) : Boolean {
    if(kontakte1.length !== kontakte2.length) return false;

    for (let i=0; i < kontakte1.length; i++) {
        if(kontakte1[i].kommentar !== kontakte2[i].kommentar &&
            kontakte1[i].kontakt !== kontakte2[i].kontakt &&
            kontakte1[i].kontaktdatum !== kontakte2[i].kontaktdatum &&
            kontakte1[i].kontakttyp !== kontakte2[i].kontakttyp
        ) {
            return false;
        }
    }

    return true;
}

function equalsProben(proben1: Probe[], proben2:Probe[]) : Boolean {
    if(proben1.length !== proben2.length) return false;

    for (let i=0; i < proben1.length; i++) {
        if(proben1[i].ergebnis !== proben2[i].ergebnis &&
            proben1[i].datum !== proben2[i].datum &&
            proben1[i].kommentar !== proben2[i].kommentar
        ) {
            return false;
        }
    }

    return true;
}

export function mapPersonToPersonCallUpdate(person: Person) : PersonCallUpdate {
    var mappedPerson = {} as PersonCallUpdate;

    mappedPerson.id = person.id;
    mappedPerson.version = person.version;
    mappedPerson.doku = person.doku;
    mappedPerson.telefonnotizen = person.telefonnotizen;
    mappedPerson.quarantaene = person.quarantaene;
    mappedPerson.letzterKontakt = person.letzterKontakt;
    mappedPerson.endTelefonatErfolgtAm = person.endTelefonatErfolgtAm;
    mappedPerson.aktuellerBearbeiter = person.aktuellerBearbeiter;

    return mappedPerson;
}