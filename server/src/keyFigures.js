// Klasse, die die Kennzahlen der Wertpapiere berechnet.
let ss = require('simple-statistics');
let R = require("ramda");
// import R from 'ramda';



//Um von Auserhalb auf die Funktion zugreifen zu können.
module.exports= {

    /**
     * Berechnet die Standardabweichung.
     * Bekommt die historischen Renditen übergeben.
     * Nutzt simple-statistics um die Tages-Standardabweichung zu berechnen.
     * Diese wird dann auf die Jahres-Standardabweichung erweitert.
     * Die fertig berechnete Standardabweichung wird zurückgegeben.
     */
    calculateSD: function (ret) {
        return (ss.sampleStandardDeviation(ret) * Math.sqrt(250));
    },

    /**
     * Berechnet die erwartete Rendite.
     * Bekommt die historischen Renditen übergeben.
     * Nutzt simple-statistics um die erwartete Tages-Rendite zu berechnen.
     * Diese wird dann auf die erwartete Jahres-Rendite erweitert.
     * Die fertig berechnete erwartete Rendite wird zurückgegeben.
     */
    calculateYield: function (ret) {
        let tyield = (ss.mean(ret) * 250);
        return tyield;
    },

    /**
     * Berechnet die Korreltation zwischen zwei Wertpapieren.
     * Bekommt die angepassten historischen Renditen von zwei Wertpapieren übergeben.
     * Prüft, ob eine der Renditen leere Werte enthält, da dies die Berechnung nicht möglich machen würde.
     * Löscht diese im Zweifelsfall aus beiden Arrays (Um eine Berechnung weiterhin zu ermöglichen).
     * Nutzt dann simple-statistics um die Korrelation zu berechnen.
     * Diese wird zurückgegeben.
     */
    calculateCorr: function (adaptedRet) {
        let max = adaptedRet[0].length;
        for(let i = 0; i < max; i++){
            if(isNaN(adaptedRet[0][i]) || isNaN(adaptedRet[1][i])){
                adaptedRet[0] = R.remove(i, 1, adaptedRet[0]);
                adaptedRet[1] = R.remove(i, 1, adaptedRet[1]);
                max--;
                i--;
            }
        }
        return ss.sampleCorrelation(adaptedRet[0], adaptedRet[1]);
    },

};