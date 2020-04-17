import Kategorie from '@/types/Kategorie';

export default class PersonSearchParams {
    name: string;
    kategorie: Kategorie;

    constructor(name:string, kategorie:Kategorie) {
        this.name = name;
        this.kategorie = kategorie;
    }
}