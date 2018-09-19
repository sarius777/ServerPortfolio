//Klasse, die die historischen Renditen berechnet.
import R from 'ramda';


module.exports = {
    /**
     * historische Rendite für ein ETF.
     * Delegiert die Aufgabe einwach weiter an calculateRen.
     */
    calculateSingleRet: function (close, dividends) {
        let ret = calculateRet(close, dividends);
        //Wurde ein Aktiensplit durchgeführt, kann die Rendite zu unrecht zu hoch sein
        for (let i = 0; i < ret.length; i++) {
            if (ret[i] > 2 || ret[i] < -2) {
                ret = R.remove(i, 1, ret);
            }
        }
        return ret;
    },

    /**
     * Angepasste historische Rendite für zwei ETFs (für die Korrelation).
     * Bekommt die Daten, die close- und dividenden-Werte für zwei Wertpapiere.
     * Löscht zuerst die Daten beim ersten Wertpapier, dann vom anderen.
     * Dabei werden die Daten verglichen: alle Daten, die Wertpapier2 nicht hat, werden bei Wertpapier1 gelöscht.
     * Dann werden für die angepassten Datensätze die historischen Renditen berechnet.
     * Diese angepassten Renditen werden zurückgegeben.
     */
    calculateDualRet: function (dates1, dates2, close1, close2, dividends1, dividends2) {
        //Erst beide Datensätze filtern.
        let help1 = filterAll2(dates1, dates2, close1, dividends1);
        let help2 = filterAll2(dates2, dates1, close2, dividends2);
        //Dann die historischen Renditen berechnen.
        let r1 = calculateRet(help1[0], help1[1]);
        let r2 = calculateRet(help2[0], help2[1]);
        return [r1, r2];
    }
};

/**
 * Filtert die Daten für die calculateDualRet-Funtkion.
 * Geht die Daten von dem Wertpapier durch, guckt ob diese bei dem anderen sind.
 * Sind sie nicht in dem anderen, werden die entsprechenden Daten gelöscht.
 * Die angepassten close- und dividenden-Werte zurückgeben.
 */
function filterAll2(dates, datesCom, close, dividends) {
    //Alle Daten einmal prüfen.
    for (let i = 0; i < dates.length; i++) {
        let q = datesCom.indexOf(dates[i]);
        //Ist das Datum nicht beim anderen Wertpapier.
        if (q === -1) {
            dates.splice(i, 1);
            close.splice(i, 1);
            dividends.splice(i, 1);
            i--;
        }
    }

    return [close, dividends];
}

/**
 * Einfache Funktion um die historischen Renditen zu berechnen.
 * Benötigt für die Berechnung nur die close- und dividenden-Werte des Wertpapiers.
 * Führt die Berechnung zu jedem close-Wert die Formel aus und speichert die Rendite in einem Array.
 * Gibt das fertige Array zurück.
 */
function calculateRet(close, dividends) {
    let r = [];
    for (let i = 0; i < close.length - 1; i++) {
        r.push((close[i + 1] - close[i] + dividends[i]) / close[i])
    }
    return r;

}