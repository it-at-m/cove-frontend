import KontaktTyp from './KontaktTyp';
import Person from './Person';
export interface Kontakt {
    // Die ID die man wegen HATEOAS zum schreiben verwenden muss 🤷‍♂️
    kontakt: string;
    kommentar: string;
    kontakttyp: KontaktTyp;
    kontaktdatum: Date;
    // Kommt nicht von Backend, wird manuell aufgelöst
    _person: Person;
    _links: {
        kontakt: {
            href: string;
        }
    }
}