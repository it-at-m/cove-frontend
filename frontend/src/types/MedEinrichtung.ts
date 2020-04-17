enum MedEinrichtung{
    Krankenhaus = 'KH',
    Altenheim = 'AH',
    Praxis = 'PR',
    Schule = 'SCHU',
    Kindertagesstätte = 'KITA'
}

export const MedEinrichtungToText = new Map<string, string> ([
    [MedEinrichtung.Krankenhaus, 'Krankenhaus (KH)'],
    [MedEinrichtung.Altenheim, 'Altenheim (AH)'],
    [MedEinrichtung.Praxis, 'Praxis (PR)'],
    [MedEinrichtung.Schule, 'Schule (SCHU)'],
    [MedEinrichtung.Kindertagesstätte, 'Kindertagesstätte (KITA)'],
])

export default MedEinrichtung;