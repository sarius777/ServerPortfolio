//Klasse bzw. Funktion, die Die Berechnungen für das Portfolio durchführt.
import kf from './keyFigures';
import md from './marketData';
import ef from './efficientFrontier';
import mv from './marketValues';
import re from './ret';
import R from 'ramda';


//Um von Außerhalb auf die Funktion zugreifen zu können.
export default {

    /**
     * Die Prozedur des Servers.
     * Bekommt die Kürzel der Wertpapiere übergeben.
     * Fordert zuerst die Marktdaten der Wertpapiere an.
     * Prüft ob diese Fehlerhaft sind und bricht im Zwifelsfall ab.
     * Berechnet sonst die Kennzahlen.
     * Berechnet dann den effizienten Rand.
     * Gibt die Kennzahlen und den effizinten Rand als Promise in Array-Form an app zurück.
     */
    async procedure(symbols) {
        //Fordere die historischen Daten an.
        let helpMD = await md.filterMarketData(symbols);
        let close = helpMD[0];
        let dividends = helpMD[1];
        let dates = helpMD[2];

        //Überprüfen, ob ein falsches Kürzel dabei war.
        let test = [];
        for(let i = 0; i < symbols.length; i++){
            if(close[i] === "wrong"){
                test[0] = "Falsche ETF-Kürzel";
                test.push(i);
            } else if(close[i] === "over"){
                test = ["zu viele Anfragen"];
            }
        }
        if(test.length > 0){
            return [test];
        }


        //Arrays zum speichern der Kennzahlen.
        let sd = [];
        let ret = [];
        let corr = [[],[],[]];
        let mvp = [];
        let efo = [[],[],[],[],[]];

        //Berechne die Kennzahlen für alle Wertpapiere.
        let helpKF = calcKeyFigures(symbols, close, dividends, dates);
        sd = helpKF[0];
        ret = helpKF[1];
        corr = helpKF[2];


        //Effizienten Rand berechnen.
        if (symbols.length === 2){
            mvp = ef.calculateMVP2(sd, corr, ret);
            efo = ef.calculateFrontier2(mvp, sd, corr, ret)
        } else if (symbols.length === 3){
            mvp = ef.calculateMVP3(sd, corr, ret);
            efo = ef.calculateFrontier3(mvp, sd, corr, ret);
        }

        //Ergebnis zurück an app senden.
        return [sd, ret, corr, efo]
    }
};


/**
 * Hilfsfunktion um die Kennzahlen zu berechnen.
 * Bekommt die historischen Marktdaten übergeben.
 * Berechnet die Standardabweichung und erwartete Rendite für den Arero und dann die anderen Wertpapiere.
 * Berechnet dann die Korrelation zwischen jeweils zwei Wertpapieren.
 * Gibt die berechneten Kennzahlen zurück.
 */
function calcKeyFigures(symbols, close, dividends, dates){
    let sd = [];
    let ret = [];
    let corr = [[],[],[]];

    //Berechne die ARERO-Kennzahlen.
    let arRen = re.calculateSingleRet(mv.getArCl(), mv.getArDi());
    sd.push(kf.calculateSD(arRen));
    ret.push(kf.calculateYield(arRen));

    //Berechne die Kennzahlen für die anderen Wertpapiere.
    for(let i = 0; i < symbols.length; i++){
        //Als erstes berechnen wir die historische Renditen.
        let retH = re.calculateSingleRet(close[i], dividends[i]);
        //Prüfen, ob NaN-Werte dabei sind.
        for(let i = 0; i < retH.length; i++){
            if(isNaN(retH[i])){
                retH = R.remove(i, 1, retH);
                i--;
            }
        }
        //Dann berechnen wir die Standardabweichungen und die erwarteten Renditen des Wertpapiere.
        sd.push(kf.calculateSD(retH));
        ret.push(kf.calculateYield(retH));
    }
    //Die Korrelationsmatrix füllen.
    for (let q = 0; q < symbols.length; q++){
        for (let r = 0; r < symbols.length; r++){
            if(r === q){
                corr[r][q] = 1;
            }else if(corr[r][q] !== 0 && r < q){
                let retH = re.calculateDualRet(dates[q], dates[r], close[q], close[r], dividends[q], dividends[r]);
                let c = kf.calculateCorr(retH);
                corr[q][r] = c;
                corr[r][q] = c;
            }
        }
    }

    return [sd, ret, corr]
}