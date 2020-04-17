export interface InQuarantaene{
    I: string;
    KP: string;
}

export interface Konversionen {
    I: string;
}

export interface Kategorien{
    KP: string;
    KPN: string;
    I: string;
    nicht_gesetzt: string;
    gesamt: string;
}

export interface Probenergebnis{
    A: string;
    P: string;
    N: string;
    gesamt: string;
}
export interface Einrichtungen{
    KH: string;
    AH: string;
    PR: string;
    SCHU: string;
    KITA: string;
    nicht_gesetzt: string;
    gesamt: string;
}
export default interface Bericht{
    anzahl: {
        kategorie: Kategorien;
        probenergebnis: Probenergebnis;
        inQuarantaene: InQuarantaene;
        einrichtungen: Einrichtungen;
        konversionen: Konversionen;
    }
}