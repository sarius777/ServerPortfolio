
import re from '../src/ret'
import t1 from './TestData1'
import t2 from './TestData2'
import hl from './TestHelp'


describe('Test zur Berechnung der historischen Renditen', () => {
    it('Sollte die historischen Renditen von Test1 deckungsgleich liefern', () => {
        let help = re.calculateSingleRet(t1.getAdClose(), t1.getDividends());
        let ret = t1.getRet();
        for(let i = 0; i < ret.length; i++) {
            expect(hl.rounding(8, help[i])).toEqual(hl.rounding(8, ret[i]))
        }
    });

    it('Sollte die historischen Renditen von Test2 deckungsgleich liefern', () => {
        let help = re.calculateSingleRet(t2.getAdClose(), t2.getDividends());
        let ret = t2.getRet();
        for(let i = 0; i < ret.length; i++){
            expect(hl.rounding(8, help[i])).toEqual(hl.rounding(8, ret[i]))
        }
    });

    it('Sollte die historischen Renditen von Test1 und Test2 angepasst, synchron und deckungsgleich liefern', () => {
        let help = re.calculateDualRet(t1.getDates(), t2.getDates(), t1.getAdClose(), t2.getAdClose(), t1.getDividends(), t2.getDividends());
        let ret1 = t1.getAdRet();
        let ret2 = t2.getAdRet();
        for(let i = 0; i < ret2.length; i++){
            expect(hl.rounding(8, help[0][i])).toEqual(hl.rounding(8, ret1[i]));
            expect(hl.rounding(8, help[1][i])).toEqual(hl.rounding(8, ret2[i]))
        }
    });
});




