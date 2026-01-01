// common-share.js
function sharePremiumQuote(details) {
    const res = details.results; // This contains yly, hly, qly, mly

    const message = 
        `*LIC PREMIUM QUOTE*%0A` +
        `--------------------------%0A` +
        `*Plan:* ${details.planName} (${details.planNo})%0A` +
        `*SA:* ₹${parseInt(details.sa).toLocaleString('en-IN')} | *Age:* ${details.age}%0A` +
        `*Term/PPT:* ${details.term} Years%0A` +
        `--------------------------%0A` +
        `*PREMIUMS (Inclusive of GST)*%0A%0A` +
        `*Mode | 1st Year | 2nd Year onwards*%0A` +
        `--------------------------%0A` +
        `*Yearly:* ${res.yly.first} | ${res.yly.second}%0A` +
        `*H-Yearly:* ${res.hly.first} | ${res.hly.second}%0A` +
        `*Q-Yearly:* ${res.qly.first} | ${res.qly.second}%0A` +
        `*Monthly:* ${res.mly.first} | ${res.mly.second}%0A` +
        `--------------------------%0A` +
        `_Generated via LIC Connect Dashboard_`;

    window.open(`https://wa.me/?text=${message}`, '_blank');
}