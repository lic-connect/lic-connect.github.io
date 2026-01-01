// Wrap everything in an "init" function
function init() {
    console.log("Calculator script initialized");

    const planName = document.getElementById('planName');
    const planNo = document.getElementById('planNo');
    const revivalType = document.getElementById('revivalType');
    const calculateBtn = document.getElementById('calculateBtn');
    const resultOutput = document.getElementById('revivalAmountOutput');
    const formulaDisplay = document.getElementById('formulaDisplay');

    // 1. AUTO-POPULATE PLAN NO
    planName.addEventListener('change', function() {
        const selected = this.options[this.selectedIndex];
        const num = selected.getAttribute('data-plan-no');
        planNo.value = num || '';
        console.log("Selected Plan No:", num);
    });

    // 2. SHOW SECTIONS
    revivalType.addEventListener('change', function() {
        // Hide all sections with class 'revival-section'
        document.querySelectorAll('.revival-section').forEach(div => {
            div.style.display = 'none';
        });
        
        // Show the one that matches the value
        const targetId = this.value + '-inputs';
        const targetDiv = document.getElementById(targetId);
        if (targetDiv) {
            targetDiv.style.display = 'block';
            console.log("Showing section:", targetId);
        }
    });

    // 3. CALCULATION
    calculateBtn.onclick = function() {
        console.log("Button clicked!");
        const type = revivalType.value;
        if(!type) { alert("Select a revival type"); return; }

        let total = 0;
        
        // Simple math logic for Ordinary
        if(type === 'ordinary') {
            const prem = parseFloat(document.getElementById('ord_unpaid_premium').value) || 0;
            const rate = parseFloat(document.getElementById('ord_interest_rate').value) || 9.5;
            const years = parseFloat(document.getElementById('ord_years_lapsed').value) || 0;
            const interest = (prem * rate * years) / 100;
            total = prem + interest;
            formulaDisplay.innerText = "Premium + Interest";
        } else {
            // Placeholder for other types to show the button works
            total = 0;
            formulaDisplay.innerText = "Calculation logic for " + type + " coming soon.";
        }

        resultOutput.innerText = "₹ " + total.toFixed(2);
    };
}

// Ensure the script runs only after HTML is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}