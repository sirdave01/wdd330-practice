function doFV() {
    // INPUT
    let p = parseFloat(document.getElementById("principle").value);
    let r = parseFloat(document.getElementById("annualrate").value);
    let n = parseInt(document.getElementById("periods").value);
    let y = parseInt(document.getElementById("years").value);
    // PROCESSING
    let output = computeFutureValue(p, r, n, y);
    // OUTPUT with formatting
    document.getElementById("output").innerHTML = `$${output.toFixed(2)}`;
}

// computer future value function
// p = principal, r = annual rate, y = number of years, n = periods of year.

function computeFutureValue(p, r, n, y) {
    let er = r / n; // effective rate per period
    let totalperiods = n * y;
    return p * Math.pow(1 + er, totalperiods);
}

// get and display the current year
document.getElementById("theyear").textContent = new Date().getFullYear();
