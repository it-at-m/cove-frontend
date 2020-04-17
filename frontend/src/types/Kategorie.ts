enum Kategorie{
    Index = 'I',
    Kontaktperson = 'KP',
    NegativeKontaktperson = 'KPN'
}

export const KategorieToText = new Map<string, string> ([
    [Kategorie.Index, 'Index (I)'],
    [Kategorie.Kontaktperson, 'Kontaktperson (KP)'],
    [Kategorie.NegativeKontaktperson, 'Negativ getestete Kontaktperson (KPN)'],
])

export default Kategorie;