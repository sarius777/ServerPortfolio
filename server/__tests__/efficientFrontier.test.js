import ef from '../src/efficientFrontier'
import t1 from './TestData1'
import t2 from './TestData2'
import hl from './TestHelp'



describe('Test der effizienten Ränder bei zwei Assets und der Standardabweichung-/ erwartete Rendite- (im Portfolio) Funktionen', function () {
    //Die Kennzahlen aufsetzen.
    let sd = [0, t1.getSD(), t2.getSD(), 0.109191064];
    let ret = [0, t1.getERet(), t2.getERet(), 0.056422493];
    //Die Anteile sind nur bis 7 bzw. 8 Stellen deckungsgleicht, was aber ein Rundungs-Fehler bei Excel ist. Ist sowieso egal, da der User diese Stellen nicht mal sieht.
    it('Sollte die Anteile des MVP bis 8 Nachkommastellen genau liefern', function () {
        let help = ef.calculateMVP2(sd, hl.getCorr(), ret);
        expect(hl.rounding(8, help[0])).toEqual(hl.rounding(8, 0.332208986726436));
        expect(hl.rounding(8, help[1])).toEqual(hl.rounding(8, 0.667791013273564));
    });

    it('Sollte die Standardabweichung und erwartete Rendite bis 9 Nachkommastellen genau liefern', function () {
        let help = ef.calculateMVP2(sd, hl.getCorr(), ret);
        expect(hl.rounding(9, help[2])).toEqual(hl.rounding(9, 0.138754579626500));
        expect(hl.rounding(9, help[3])).toEqual(hl.rounding(9, 0.200303991764346));
    });
    it('Sollte die Anteile bei 25, 50, 75 und 100 Prozent Risikobereitschaft liefern', function () {
        let mvp = ef.calculateMVP2(sd, hl.getCorr(), ret);
        let help = ef.calculateFrontier2(mvp, sd, hl.getCorr(), ret);
        expect(hl.rounding(7, help[1][0])).toEqual(hl.rounding(7, 1.359729624511750));
        expect(hl.rounding(7, help[2][0])).toEqual(hl.rounding(7, 1.953954965084340));
        expect(hl.rounding(7, help[3][0])).toEqual(hl.rounding(7, 2.505405726954040));
        expect(hl.rounding(7, help[4][0])).toEqual(hl.rounding(7, 3.040339489734430));
    });
});

describe('Test der effizienten Ränder bei drei Assets und der Standardabweichung-/ erwartete Rendite- (im Portfolio) Funktionen', function () {
    //Die Kennzahlen aufsetzen.
    let sd = [0, t1.getSD(), t2.getSD(), 0.109191064];
    let ret = [0, t1.getERet(), t2.getERet(), 0.056422493];
    it('Sollte die Anteile des MVP bis 8 Nachkommastellen genau liefern', function () {
        let help = ef.calculateMVP3(sd, hl.getCorr(), ret);
        expect(hl.rounding(8, help[0])).toEqual(hl.rounding(8, 0.1426039115639730));
        expect(hl.rounding(8, help[1])).toEqual(hl.rounding(8, 0.2360915769703890));
        expect(hl.rounding(8, help[2])).toEqual(hl.rounding(8, 0.6213045114656390));
    });

    it('Sollte die Standardabweichung und erwartete Rendite bis 8 Nachkommastellen genau liefern', function () {
        let help = ef.calculateMVP3(sd, hl.getCorr(), ret);
        expect(hl.rounding(8, help[3])).toEqual(hl.rounding(8, 0.086908708138556));
        expect(hl.rounding(8, help[4])).toEqual(hl.rounding(8, 0.111354083203248));
    });
    it('Sollte die Anteile bei 25, 50, 75 und 100 Prozent Risikobereitschaft liefern', function () {
        let mvp = ef.calculateMVP3(sd, hl.getCorr(), ret);
        let help = ef.calculateFrontier3(mvp, sd, hl.getCorr(), ret);
        //Anteile Test1
        expect(hl.rounding(7, help[1][0])).toEqual(hl.rounding(7, 0.427881151300980));
        expect(hl.rounding(7, help[2][0])).toEqual(hl.rounding(7, 0.713158391037987));
        expect(hl.rounding(7, help[3][0])).toEqual(hl.rounding(7, 0.998435630774994));
        expect(hl.rounding(7, help[4][0])).toEqual(hl.rounding(7, 1.283712870512000));
        //Anteile Test2
        expect(hl.rounding(7, help[1][1])).toEqual(hl.rounding(7, 0.541266796608673));
        expect(hl.rounding(7, help[2][1])).toEqual(hl.rounding(7, 0.846442016246957));
        expect(hl.rounding(7, help[3][1])).toEqual(hl.rounding(7, 1.151617235885240));
        expect(hl.rounding(7, help[4][1])).toEqual(hl.rounding(7, 1.456792455523520));
    });
});
