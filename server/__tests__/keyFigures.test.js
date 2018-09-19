import kf from '../src/keyFigures'
import t1 from './TestData1'
import t2 from './TestData2'
import hl from './TestHelp'


describe('Test der Kennzahlen', function () {
    it('Sollte die erwartete Rendite bis 15 Nachkommastellen genau liefern', function () {
        let help = kf.calculateYield(t1.getRet());
        expect(hl.rounding(15, help)).toEqual(hl.rounding(15, t1.getERet()))
    });

    it('Sollte die Standardabweichung bis 15 Nachkommastellen genau liefern', function () {
        let help = kf.calculateSD(t1.getRet());
        expect(hl.rounding(15, help)).toEqual(hl.rounding(15, t1.getSD()))
    });
    it('Sollte die Korrelation von Test1 und Test2 bis 9 Nachkommastellen genau liefern', function () {
        let ret = [t1.getAdRet(), t2.getAdRet()];
        let help = kf.calculateCorr(ret);
        expect(hl.rounding(9, help)).toEqual(hl.rounding(9, hl.getCorr()[0][1]));
    });
});
