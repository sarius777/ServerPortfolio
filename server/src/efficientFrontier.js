//Klasse, die das MVP und den effizienten Rand des Portfolios berechnet.
import math from 'mathjs';


//Um von Auserhalb auf die Funktion zugreifen zu können.
module.exports = {
    /**
     * Berechnet das MVP für 2 Assets.
     * Benötigt für die Berechnungen die Standardabweichung, die Korrelationen und die erwarteten Renditen.
     * Berechnet erst die Anteile an beiden Wertpapieren.
     * Berechnet dann die erwartete Rendite und die Standardabweichung des Portfolios.
     * gibt diese und die Anteile zurück an procedure.
     */
    calculateMVP2: function (sd, corr, ret) {
        let mvp = [];
        let w = [];
        //Die jeweiligen Anteile berechnen.
        w[0] = (sd[2]*sd[2]-sd[1]*sd[2]*corr[0][1])/(sd[2]*sd[2]+sd[1]*sd[1]-2*sd[1]*sd[2]*corr[0][1]);
        w[1] = 1 - w[0];
        mvp[0] = w[0];
        mvp[1] = w[1];

        //Die erwartete Rendite und die Standardabweichung berechnen.
        mvp[2] = pSD(w, sd, corr);
        mvp[3] = pRet(w, ret);

        return mvp;
    },

    /**
     * Berechnet den effizienten Rand für 2 Assets.
     * Benötigt für die Berechnungen das MVP, die Standardabweichung, die Korrelationen und die erwarteten Renditen.
     * Berechnet zuerst die Hilfskennzahl h.
     * Berechnet dann für 25, 50, 75 und 100% RiskPreference die Standardabweichung, erwartete Rendite und die Anteile des Portfolios.
     * Diese Werte werden in einem Array gespeichert und dieses an procedure zurückgegeben.
     */
    calculateFrontier2: function (mvp, sd, corr, ret) {
        //Erst die Kennzahl h berechnen.
        let h = Math.pow(ret[1] - ret[2], 2)/ (sd[2]*sd[2]+sd[1]*sd[1]-2*sd[1]*sd[2]*corr[0][1]);

        //Hilfsvariablen einführen.
        let efo = [[],[],[],[],[]];
        let sdH;
        let retH;
        let w = [];
        //Für alle Risiko-Ertrags-Präferenz-Parameter die Punkte am effizienten Rand berechnen.
        //Bei 0% liegt der MVP.
        efo[0] = mvp;
        for(let i = 0.25; i <= 1; i += 0.25){
            //erst die Standardabweichung berechnen.
            sdH = (0.5 - mvp[2]) * i + mvp[2];
            //Dann die Rendite.
            retH = mvp[3] + Math.sqrt(h*((sdH * sdH) - (mvp[2] * mvp[2])));
            //Dann die Anteile.
            w[0] = (ret[2] - retH) / (ret[2] - ret[1]);
            w[1] = 1 - w[0];
            //Dann die Werte in das Array einspeichern.
            efo[i*4] = [w[0], w[1], sdH, retH];
        }

        return efo;
    },

    /**
     * Berechnet das MVP für 3 Assets.
     * Benötigt für die Berechnungen die Standardabweichung, die Korrelationen und die erwarteten Renditen.
     * Berechnet als erstes die invertierte Varianz-Kovarianz-Matrix.
     * Zieht sich aus dieser die Anteile der Wertpapiere.
     * Berechnet dann die erwartete Rendite und die Standardabweichung des Portfolios.
     * gibt diese und die Anteile zurück an procedure.
     */
    calculateMVP3: function (sd, corr, ret) {
        //Erst ermitteln wir die invertierte Varianz-Kovarianz-Matrix.
        let covInv = vaco(sd, corr);
        let w = [];

        for(let i = 1; i < covInv.length; i++){
            w[i-1] = covInv[covInv.length - 1][i-1];
        }

        return [w[0], w[1], w[2], pSD(w, sd, corr), pRet(w, ret)];

    },

    /**
     * Berechnet den effizienten Rand für 3 Assets.
     * Benötigt für die Berechnungen das MVP, die Standardabweichung, die Korrelationen und die erwarteten Renditen.
     * Berechnet zuerst das d-Array.
     * Nun werden für 25, 50, 75 und 100% RiskPreference die Anteile, die Standardabweichung und erwartete Rendite berechnet.
     * Diese werden dann in ein Array gespeichert, welches dann zurück an procedure gesendet wird.
     */
    calculateFrontier3: function (mvp, sd, corr, ret) {

        let w = [];
        let efo = [[],[],[],[],[]];
        //Kennzahl d, die unsere Berechnung ermöglicht.
        let d = calcD(vaco(sd, corr), ret);

        //Für alle Risiko-Ertrags-Präferenz-Parameter die Punkte am effizienten Rand berechnen.
        //Bei 0% liegt der MVP.
        efo[0] = mvp;
        for(let i = 0.25; i <= 1; i += 0.25){
            //Erst die Anteile berechnen.
            for(let r = 0; r < d.length; r++){
                w[r] = mvp[r] + i * d[r];
            }
            //Dann die Standardabweichung.
            let sdH = pSD(w, sd, corr);
            //Dann die Rendite.
            let retH = pRet(w, ret);
            //Dann die Werte in das Array einspeichern.
            efo[i*4] = [w[0], w[1], w[2], sdH, retH];
        }

        return efo;
    }
};

/**
 * Berechnet die erwartete Rendite des Portfolios.
 * Braucht dafür nur die Anteile und die erwarteten Renditen der Wertpapiere.
 * Macht für jedes Wertpapier eine Iteration und multipliziert dabei den Anteil mit der erwarteten Rendite des Wertpapiers.
 * Ergebnis dieser Iterationen ist die erwartete Rendite des Portfolios.
 * Diese wird zurückgegeben.
 */
function pRet (w, ret){
    let help = 0;
    for(let i = 0; i <w.length; i++){
        help += w[i] * ret[i+1];
    }
    return help;
}

/**
 * Berechnet die Standardabweichung des Portfolios.
 * Braucht dafür die Anteile, die Standardabweichung und die Korrelationen der Wertpapiere.
 * Macht für jede Kombination von zwei Wertpapieren zwei Iterationen.
 * Macht für jede Kombination von dem gleichen Wertpapiert eine Iteration.
 * Ergebnis dieser Iterationen ist die Standardabweichung des Portfolios.
 * Diese wird zurückgegeben.
 */
function pSD (w, sd, corr){
    let help = 0;
    for (let r = 0; r < w.length; r++) {
        for (let q = 0; q < w.length; q++) {
            help += w[r] * w[q] * sd[r+1] * sd[q+1] * corr[r][q];
        }
    }
    return Math.sqrt(help);
}

/**
 * Berechnet die invertierte Varianz-Kovarianz-Matrix.
 * Benötigt dafür die Standardabweichung und die Korrelation.
 * Zuerst wird die Varianz-Kovarianz-Matrix eingeführt.
 * Es werden die Randbeträge 1 und 0 eingesetzt und die Kovarianzen berechnet und so die Matrix gefüllt.
 * Diese wird mit Math.js invertiert und dann zurückgegeben.
 */
function vaco(sd, corr) {
    //Normale Varianz-Kovarianz-Matrix einführen.
    let varKovMa = [[],[],[],[]];

    for (let r = 0; r < sd.length; r++) {
        for (let q = 0; q < sd.length; q++) {
            //Die Randbeträge einsetzen in die Matrix einsetzen.
            if (r === sd.length - 1 && q !== sd.length - 1) {
                varKovMa[r][q] = 1;
            } else if (r !== sd.length - 1 && q === sd.length - 1) {
                varKovMa[r][q] = 1;
            } else if (r === sd.length - 1&& q === sd.length - 1) {
                varKovMa[r][q] = 0;
                //Die restlichen Beträge einsetzen.
            } else if (r !== q) {
                varKovMa[r][q] = 2 * corr[r][q] * sd[r+1] * sd[q+1];
            } else if (r === q) {
                varKovMa[r][q] = 2 * sd[r+1] * sd[q+1];
            }
        }
    }

    //Matrix invertieren und zurückgeben.
    let covInv;
    covInv = math.inv(varKovMa);
    return covInv;
}


/**
 * Berechnet den Faktor d für den effizienten Rand.
 * Erhält die invertierte Varianz-Kovarianz-Matrix und die erwarteten Renditen der Wertpapiere.
 * Führt zuerst das Array d ein und füllt es schonmal auf.
 * Addiert dann in der Schleife nach und nach die Werte in das d-Array.
 * Das fertige d-Array wird zurückgegegen.
 */
function calcD (covInv, ret) {
    let d = [];
    for(let i = 0; i < ret.length - 1; i++){
        d[i] = 0;
    }
    for (let r = 0; r < ret.length - 1; r++){
        for (let q = 0; q < ret.length - 1; q++){
            d[r] += covInv[r][q] * ret[q+1];
        }
    }

    return d;
}