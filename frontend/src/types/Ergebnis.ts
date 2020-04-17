enum Ergebnis{
    Positiv = 'P',
    Ausstehend = 'A',
    Negativ = 'N'
}
export const ErgebnisToBeschreibung = new Map<string, string> ([
    [Ergebnis.Positiv, 'positiv'],
    [Ergebnis.Ausstehend, 'ausstehend'],
    [Ergebnis.Negativ, 'negativ'],
])

export const BeschreibungToErgebnis = new Map([...ErgebnisToBeschreibung].reverse());

export default Ergebnis;