
import testData1 from './alphaVantageTestRequest1'
import testData2 from './alphaVantageTestRequest2'
import t1 from './TestData1'
import t2 from './TestData2'
import { filterNormal } from '../src/marketData'


describe("Test des Filterns der Alpha Vantage Daten", () => {
    it('Sollte die close- dates- und dividends-Werte von Test1 korrekt zurück geben', () => {
        const result = filterNormal(testData1);
        expect(result).toEqual(t1.getMarketData())
    });

    it('Sollte die close- dates- und dividends-Werte von Test2 korrekt zurück geben', () => {
        const result = filterNormal(testData2);
        expect(result).toEqual(t2.getMarketData())
    })
});






