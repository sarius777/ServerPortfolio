export default {
    //Hilfsfunktion, um die Kennzahlen so zu Runden, dass sie mit den Excel-Werten verglichen werden können.
    rounding: function (digits, number) {
        let help = 1;
        for (let i = 0; i < digits; i++) {
            help += "0"
        }
        // console.log(number);
        let lsg = number * help;
        // console.log(lsg);
        return Math.round(lsg);
    },
    getCorr: function () {
        return corr;
    }
}


let corr = [[1, 0.44625231088173200, -0.00733394490656097],
    [0.44625231088173200, 1, 0.0428024519687687],
    [-0.00733394490656097, 0.0428024519687687, 1]];
