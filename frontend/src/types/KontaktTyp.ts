enum KontaktTyp{
    A = 'A',
    B = 'B',
    C = 'C'
}

export const KontakttypToBeschreibung = new Map<string, string> ([
    [KontaktTyp.A, '15 mins F2F'],
    [KontaktTyp.B, 'B'],
    [KontaktTyp.C, 'C'],
])

export const BeschreibungToKontakttyp = new Map([...KontakttypToBeschreibung].reverse());
export default KontaktTyp;