const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3000;

// Sample premium logic
function calculatePremium({ plan, age, term, sa, dab, mode }) {
  // Basic base premium per ₹1000 SA for plan 915 (dummy logic; replace with real table)
  let baseRate = 50; // base premium per ₹1000 SA
  let dabRate = dab === 'Y' ? 1 : 0;

  let basePremium = (sa / 1000) * baseRate;
  let dabPremium = (sa / 1000) * dabRate;
  let totalPremiumBeforeMode = basePremium + dabPremium;

  // Mode rebate (adjust premiums based on mode)
  let modeFactor = {
    YLY: 1,
    HLY: 0.51,
    QLY: 0.26,
    MLY: 0.088
  }[mode] || 1;

  let premiumAfterMode = totalPremiumBeforeMode * modeFactor;

  // Tax Calculation
  let firstYearTax = premiumAfterMode * 0.045;
  let subsequentYearTax = premiumAfterMode * 0.0225;

  let firstYearPremium = premiumAfterMode + firstYearTax;
  let subsequentYearPremium = premiumAfterMode + subsequentYearTax;

  return {
    basePremium: premiumAfterMode.toFixed(2),
    firstYearPremium: firstYearPremium.toFixed(2),
    subsequentYearPremium: subsequentYearPremium.toFixed(2)
  };
}

// POST API
app.post("/api/plan", (req, res) => {
  const { plan, age, term, sa, dab, mode } = req.body;

  if (!plan || !age || !term || !sa || !mode) {
    return res.status(400).send("Missing required fields");
  }

  const result = calculatePremium({ plan, age, term, sa, dab, mode });

  res.send(`
    Plan No: ${plan}
    Age: ${age}
    Term: ${term}
    SA: ₹${sa}
    Mode: ${mode}
    Accident Benefit: ${dab}

    ➤ Base Premium: ₹${result.basePremium}
    ➤ 1st Year Premium (incl. 4.5% Tax): ₹${result.firstYearPremium}
    ➤ Subsequent Year Premium (incl. 2.25% Tax): ₹${result.subsequentYearPremium}
  `);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
