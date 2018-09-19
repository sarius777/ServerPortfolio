// Klasse, die mit dem Client kommuniziert und die Kettenreaktion in Bewegung setzt.
import cors from 'cors';
import express from 'express';
import pr from './src/procedure';


//Die App wird initiiert und nutzt Express.js.
var app = express();

//Die App soll cors benutzen.
app.use(cors());

/**
 * Bekommt eine Anfrage vom Client mit Kürzeln.
 * Diese werden in einem Array gespeichert.
 * Dann wird die Prozedur gestartet mit dem Kürzel-Array.
 * Ist diese fertig, werden die Ergebnisse wieder an den Client gesendet.
 * Sollte ein Fehler entstehen wird dieser stattdessen an den Client gesendet.
 */
app.put('/:symbol1/:symbol2?/:symbol3?', async (req, res) => {
    let symbols = [];
    //wenn nur ein Kürzel übergeben wurde.
    if(req.params.symbol2 === undefined){
        symbols = [req.params.symbol1]
    }
    //wenn zwei Kürzel übergeben wurden.
    else if(req.params.symbol3 === undefined){
        symbols = [req.params.symbol1, req.params.symbol2]
    }
    //wenn drei Kürzel übergeben wurden.
    else if(req.params.symbol3 !== undefined){
        symbols = [req.params.symbol1, req.params.symbol2, req.params.symbol3]
    }
    console.log(symbols);

    //Setzte die Kettenreaktion in Bewegung.
    try {
        const result = await pr.procedure(symbols);
        console.log("Ergebnis: " , result);
        res.send(result);
    } catch(e) {
        console.log(e);
        res.status(500);
        res.send({"error": e.toString()});
    }
});


module.exports = app;

//Auf welchem Port der Server kommunizieren soll.


let port = process.env.PORT;
if (port == null || port == "") {
    port = 3001;
}
app.listen(port);

