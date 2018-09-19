// Klasse, die mit Alpha Vantage kommuniziert und die entsprechenden Marktdaten erhält.
// import axios from 'axios';
let axios = require("axios");

//Um von Außerhalb auf die Funktion zugreifen zu können.
module.exports=  {
    /**
     * Fordert die Marktdaten von Alpha-Vantage an.
     * Bekommt die Kürzel übergeben mit denen die URL zusammengesetzt wird.
     * Die Anfrage wird mit Hilfe von axios geschickt und die Antwort wird abgewartet.
     * Ist das Kürzel falsch oder der Traffic verbraucht, so wird die Atwort angepasst.
     * Sonst wird das empfangene JSON-Objekt zurück gesendet.
     */
    async receiveData(symbol) {
        let yourURL = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=' + symbol + '&apikey=R0AY9S2QEDAFB2YB&outputsize=full';
        const {data} = await axios.get(yourURL);
        //Falls das ETF-Kürzel nicht existiert.
        if(data["Error Message"] === "Invalid API call. Please retry or visit the documentation (https://www.alphavantage.co/documentation/) for TIME_SERIES_DAILY_ADJUSTED."){
            return "wrong"
        } //Falls der Traffic verbraucht wurde.
        else if(data["Information"] === "Thank you for using Alpha Vantage! Please visit https://www.alphavantage.co/premium/ if you would like to have a higher API call volume."){
            return "over"
        }
        //Prüfen, ob das ETF nicht veraltet ist.
        let today = new Date();
        let ETFDate = new Date(data["Meta Data"]["3. Last Refreshed"]);
        if((today.getFullYear() - ETFDate.getFullYear()) !== 0){
            return "wrong"
        }
        return data;
    },
}

