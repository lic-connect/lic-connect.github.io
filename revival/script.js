document.addEventListener('DOMContentLoaded', function () {
    const planNameSelect = document.getElementById('planName');
    const planNoInput = document.getElementById('planNo');
    const revivalTypeSelect = document.getElementById('revivalType');
    const dynamicInputsContainer = document.getElementById('dynamic-inputs');
    const calculateBtn = document.getElementById('calculateBtn');
    const resultContainer = document.getElementById('result-container');
    const revivalAmountOutput = document.getElementById('revivalAmountOutput');
    const formulaDisplay = document.getElementById('formulaDisplay');

    // --- Event Listener for Plan Name Change ---
    planNameSelect.addEventListener('change', function () {
        const selectedOption = this.options[this.selectedIndex];
        const planNo = selectedOption.dataset.planNo || '';
        planNoInput.value = planNo;
    });

    // --- Event Listener for Revival Type Change ---
    revivalTypeSelect.addEventListener('change', function () {
        // Hide all revival sections first
        document.querySelectorAll('.revival-section').forEach(section => {
            section.style.display = 'none';
        });

        // Show the selected section
        const selectedType = this.value;
        if (selectedType) {
            const sectionToShow = document.getElementById(`${selectedType}-inputs`);
            if (sectionToShow) {
                sectionToShow.style.display = 'block';
            }
        }
        // Hide result container when type changes
        resultContainer.style.display = 'none';
    });

    // --- Event Listener for Calculate Button Click ---
    calculateBtn.addEventListener('click', function () {
        const type = revivalTypeSelect.value;
        let revivalAmount = 0;
        let formula = '-';

        if (!type) {
            alert('Please select a revival type first.');
            return;
        }

        switch (type) {
            case 'ordinary':
                const ordUnpaid = parseFloat(document.getElementById('ord_unpaid_premium').value) || 0;
                const ordInterest = parseFloat(document.getElementById('ord_interest_rate').value) / 100 || 0;
                const ordYears = parseFloat(document.getElementById('ord_years_lapsed').value) || 0;
                
                revivalAmount = ordUnpaid + (ordUnpaid * ordInterest * ordYears);
                formula = `Unpaid Premiums + (Premiums × Interest Rate × Years Lapsed)`;
                break;

            case 'special':
                const splUnpaid = parseFloat(document.getElementById('spl_unpaid_premium').value) || 0;
                const splInterest = parseFloat(document.getElementById('spl_interest_rate').value) / 100 || 0;
                const splYears = parseFloat(document.getElementById('spl_years_lapsed').value) || 0;
                const splPenalty = parseFloat(document.getElementById('spl_penalty').value) || 0;

                revivalAmount = splUnpaid + (splUnpaid * splInterest * splYears) + splPenalty;
                formula = `Unpaid Premiums + (Premiums × Interest Rate × Years) + Penalty`;
                break;

            case 'sb_cum':
                const sbAmount = parseFloat(document.getElementById('sb_outstanding_amount').value) || 0;
                const sbInterest = parseFloat(document.getElementById('sb_interest_rate').value) / 100 || 0;
                const sbYears = parseFloat(document.getElementById('sb_years_lapsed').value) || 0;
                const sbPenalty = parseFloat(document.getElementById('sb_penalty').value) || 0;

                revivalAmount = sbAmount + (sbAmount * sbInterest * sbYears) + sbPenalty;
                formula = `Outstanding SB + (SB × Interest Rate × Years) + Penalty`;
                break;

            case 'loan_cum':
                const loanAmount = parseFloat(document.getElementById('loan_outstanding_amount').value) || 0;
                const loanInterest = parseFloat(document.getElementById('loan_interest_rate').value) / 100 || 0;
                const loanDuration = parseFloat(document.getElementById('loan_duration').value) || 0;
                const loanPenalty = parseFloat(document.getElementById('loan_penalty').value) || 0;
                const premiumsNo = parseFloat(document.getElementById('loan_unpaid_premiums_no').value) || 0;
                const premiumAmount = parseFloat(document.getElementById('loan_premium_amount').value) || 0;

                const totalPremiumsDue = premiumsNo * premiumAmount;
                revivalAmount = loanAmount + (loanAmount * loanInterest * loanDuration) + loanPenalty + totalPremiumsDue;
                formula = `Loan Amount + Loan Interest + Penalty + Premiums Due`;
                break;
                
            case 'instalment_cum':
                const instNo = parseFloat(document.getElementById('inst_unpaid_no').value) || 0;
                const instAmount = parseFloat(document.getElementById('inst_amount').value) || 0;
                const instPenalty = parseFloat(document.getElementById('inst_penalty').value) || 0;
                // These are just inputs for now, but could be calculated in a more complex version
                const instPenaltyInterest = parseFloat(document.getElementById('inst_penalty_interest').value) || 0;
                const instPremiumInterest = parseFloat(document.getElementById('inst_premium_interest').value) || 0;
                
                const totalInstalments = instNo * instAmount;
                // NOTE: The formula given is ambiguous. This is a reasonable interpretation.
                // It assumes the interest inputs are percentages to be applied to the base amounts.
                const totalPenalty = instPenalty + (instPenalty * (instPenaltyInterest / 100));
                const totalPremiumInterest = totalInstalments * (instPremiumInterest / 100);
                
                revivalAmount = totalInstalments + totalPenalty + totalPremiumInterest;
                formula = `(Unpaid Instalments × Amount) + Penalties + Interests`;
                break;
        }

        if (revivalAmount > 0) {
            revivalAmountOutput.textContent = `₹ ${revivalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            formulaDisplay.textContent = formula;
            resultContainer.style.display = 'block';
        } else {
             alert('Please fill in the required fields with valid numbers to perform a calculation.');
             resultContainer.style.display = 'none';
        }
    });
});
<div class="home-button-container">
  <a href="/main.html" title="Go to Home">
    <img src="images/home-icon.png" alt="Home">
  </a>
</div>
<!-- PWA: Register the Workbox Service Worker -->
<script>
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('sw-workbox.js')
                .then(registration => {
                    console.log('Workbox service worker registered successfully:', registration);
                })
                .catch(error => {
                    console.error('Workbox service worker registration FAILED:', error);
                });
        });
    }
</script>  