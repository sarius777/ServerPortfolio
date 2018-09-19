//Klasse, die die erhaltenen Marktdaten filtert und weitergibt.
import ap from './alphaVantageCommunication';
import mv from './marketValues'


//Um von Außerhalb auf die Funktion zugreifen zu können.
export default {

    /**
     * Berechnet die Daten, Close- und Dividenden-Werte für jeweils jedes ETF.
     * Bekommt die Kürzel übergeben.
     * Prüft, ob einer der internen ETFs angefordert wurde.
     * Fordert sonst die Daten von Alpha Vantage an.
     * Prüft, ob das Kürzel falsch war oder ob der Traffic zu Alpha Vantage überfordert war.
     * Filtert die Daten und speichert sie in Arrays.
     * Gibt diese Arrays zurück an Procedure.
     */
    async filterMarketData(symbols) {

        //Unangepasste Daten (Arrays im Array können unterschiedlich lang und zeitlich versetzt sein).
        let close = [[], [], []];
        let dates = [[], [], []];
        let dividends = [[], [], []];

        for (let i = 0; i < symbols.length; i++) {
            //help Variable initiieren bzw. leeren.
            let help;
            //Erst gucken, ob einer der vorgespeicherten Wertpapiere dabei ist.
            if (symbols[i] === "ARERO") {
                help = mv.getArero();
            } else if (symbols[i] === "PARIBAS") {
                help = mv.getParibas()
            } else if (symbols[i] === "GLSELECT") {
                help = mv.getGlobalSelect()
            } else {
                //Fordere dann Daten von Alpha Vantage.
                let ETF = await ap.receiveData(symbols[i]);
                //Sollten die Kürzel falsch sein.
                if (ETF === "wrong") {
                    help = ["wrong", "wrong", "wrong"]
                }
                //Sollte man zu viele Anfragen stellen.
                else if (ETF === "over") {
                    help = ["over", "over", "over"]
                } else {
                    //Filtert den Datensatz.
                    help = filterNormal(ETF);
                }
            }
            close[i] = help[0];
            dates[i] = help[1];
            dividends[i] = help[2];
        }
        return [close, dividends, dates]
    }


};

/**
 * Funktion um die Daten so zu filtern, dass wir mit ihnen rechnen können.
 * Bekommt die JSON-Datei übergeben.
 * Begrenzt als erstes die Daten auf 1300 Datensätze, was ungefähr 5,5 Jahren entspricht.
 * Speichert dann mit einer Schleife alle Open-, Close- und Dividenden-Werte aus dem JSON-Objekt in ein Array.
 * Füllt dann eventuelle Lücken bei Close mit entweder dem entsprechenden Open-Wert oder füllt sie auf.
 * Dreht den Datensatz um, um eine Berechnung der Rendite leichter zu machen.
 * Gibt die fertigen Arrays zurück.
 */
export function filterNormal(ETF) {
    //Hilfsvariablen aufsetzen.
    const help = ETF["Time Series (Daily)"];
    let keys = Object.keys(help);
    let open = [];
    let close = [];
    let dividends = [];
    let dates = keys;
    dates = dates.slice(0, 1301);


    //Das JSON-Objekt kürzen, um später nicht unnötig viele Daten zwischenzuspeichern.
    let i = 0;
    for (let key of keys) {
        if (i > 1300) {
            delete ETF["Time Series (Daily)"][key];
        }
        i++;
    }

    keys = Object.keys(help);

    //Die entsprechenden Daten in die Arrays einfügen.
    for (let key of keys) {
        let hOpen = parseFloat(help[key]['1. open']);
        let hClose = parseFloat(help[key]['4. close']);
        let hDividends = parseFloat(help[key]['7. dividend amount']);

        open = [...open, hOpen];
        close = [...close, hClose];
        dividends = [...dividends, hDividends];
    }

    //Fehlerbehandlung: Da close manchmal leer ist, ergänzen wir diese Werte.
    for (let i = 0; i < close.length; i++) {
        if (close[i] === 0) {
            //Wir fügen den passenden Open-Wert ein (von der Folgewoche).
            if (open[i - 1] !== 0) {
                close[i] = open[i - 1];
            }
        }
    }


    //Falls noch Lücken da sind.
    for (let i = 0; i < close.length; i++) {
        if (close[i] === 0) {
            //Wenn nur eine Lücke vorhanden ist, muss die Hilfsvariable 0 sein.
            let help = 0;
            //Wir zählen, wie viele Lücken vorhanden sind.
            for (let r = 1; close[i + r] === 0; r++) {
                help = r;
            }
            //Differenz zwischen den beiden Randwerten berechnen.
            let difference = close[i - 1] - close[i + help + 1];
            //Differenz zwischen den einzelnen Lücken im Verhältnis zu den beiden Außenwerten.
            let addition = difference / help;

            //Wenn nur eine Lücke vorhanden ist.
            if (help === 0) {
                addition = difference / 2
            }

            //Lücken mit entsprechender Differenz schließen.
            for (let l = 0; l < help + 1; l++) {
                close[i + l] = Math.round((close[i - 1] - addition * (l + 1)) * 1000) / 1000;
            }

        }
    }


    //Datensätze umdrehen, da die Formeln so intuitiver sind.
    close.reverse();
    dates.reverse();
    dividends.reverse();

    return [close, dates, dividends];
}
