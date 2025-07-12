document.addEventListener('DOMContentLoaded', function () {
    
    // --- DATA STORE: All plan details parsed from your .txt files ---
    // Note: This is a simplified, structured representation for calculation purposes.
    const planData = {
        // Endowment Plans
        '714': { name: "LIC's New Endowment Plan", type: 'Endowment', summary: "A regular premium, non-linked, with-profits Endowment Plan.", benefits: { onDeath: "Sum Assured + Vested Bonus + FAB. Or 7 times of Annualized Premium, or 105% of all Premiums paid, whichever is higher.", onSurvival: "Basic Sum Assured + Vested Bonus + FAB." }, rules: { death: 'standard_death_bonus', maturity: 'sa_plus_bonus' } },
        '715': { name: "LIC's New Jeevan Anand", type: 'Endowment', summary: "A non-linked, with-profits Endowment plan offering the dual benefit of protection and savings.", benefits: { onDeath: "125% of Basic SA or 7 times of Annualized Premium (whichever is higher) + bonuses. Death benefit will not be less than 105% of all premiums paid.", onSurvival: "Basic Sum Assured + Vested Bonus + FAB. Risk cover continues even after maturity." }, rules: { death: 'ja_death', maturity: 'sa_plus_bonus' } },
        '733': { name: "LIC's Jeevan Lakshya", type: 'Endowment', summary: "A limited premium paying, with-profits Endowment Assurance plan.", benefits: { onDeath: "Annual Income Benefit (10% of SA) until maturity, then 110% of SA + Bonuses + FAB on the original maturity date.", onSurvival: "Basic Sum Assured + Vested Bonus + FAB." }, rules: { death: 'jeevan_lakshya', maturity: 'sa_plus_bonus' } },
        '736': { name: "LIC's Jeevan Labh", type: 'Endowment', summary: "A limited premium, non-linked, with-profits Endowment plan.", benefits: { onDeath: "Sum Assured on Death (higher of Basic SA or 7x Annual Premium) + Bonuses + FAB. Not less than 105% of premiums paid.", onSurvival: "Basic Sum Assured + Vested Bonus + FAB." }, rules: { death: 'standard_death_bonus', maturity: 'sa_plus_bonus' } },
        '774': { name: "LIC's Amritbaal", type: 'Endowment', summary: "A non-participating savings plan for children with Guaranteed Additions.", benefits: { onDeath: "Sum Assured on Death + Guaranteed Additions. Not less than 105% of premiums paid.", onSurvival: "Basic Sum Assured + Guaranteed Additions." }, rules: { death: 'ga_death', maturity: 'ga_maturity' } },
        '760': { name: "LIC's Bima Jyoti", type: 'Endowment', summary: "A Non-participating, limited premium plan with Guaranteed Additions of Rs. 50 per 1000 SA.", benefits: { onDeath: "Sum Assured on Death + Accrued Guaranteed Additions.", onSurvival: "Basic Sum Assured + Guaranteed Additions." }, rules: { death: 'ga_death_50', maturity: 'ga_maturity_50' } },
        '768': { name: "LIC's Jeevan Azad", type: 'Endowment', summary: "A limited premium, non-participating Endowment plan.", benefits: { onDeath: "Sum Assured on Death (higher of Basic SA or 7x Annual Premium). Not less than 105% of premiums paid.", onSurvival: "Basic Sum Assured." }, rules: { death: 'standard_death_no_bonus', maturity: 'sa_only' } },
        
        // Whole Life Plans
        '745': { name: "LIC's Jeevan Umang", type: 'Whole Life', summary: "A non-linked, with-profits whole life plan with survival benefits.", benefits: { onDeath: "Sum Assured on Death + Bonuses. Death benefit not less than 105% of premiums paid.", onSurvival: "8% of Basic SA annually after PPT. At maturity (age 100) or death, Basic SA + Bonuses + FAB is paid." }, rules: { death: 'standard_death_bonus', maturity: 'sa_plus_bonus' } },
        '771': { name: "LIC's Jeevan Utsav", type: 'Whole Life', summary: "A whole life plan with guaranteed additions and lifetime guaranteed income.", benefits: { onDeath: "Sum Assured on Death + Guaranteed Additions.", onSurvival: "10% of Basic SA as annual income for life. On maturity (age 100), SA + GAs." }, rules: { death: 'ga_death_40', maturity: 'ga_maturity_40_income' } },
        
        // Money Back Plans
        '748': { name: "LIC’s Bima Shree", type: 'Money Back', summary: "A limited premium money back plan for HNI with Guaranteed Additions.", benefits: { onDeath: "Sum Assured on Death + Accrued GA.", onSurvival: "Periodic survival benefits. At maturity, remaining SA + GA + Loyalty Addition." }, rules: { death: 'ga_death', maturity: 'money_back_ga' } },
        '720': { name: "LIC's New Money Back Plan-20 Yrs", type: 'Money Back', summary: "A 20-year money back plan with periodic payouts.", benefits: { onDeath: "Sum Assured on Death (125% of SA or 7x AP) + Bonuses. Not less than 105% of premiums.", onSurvival: "20% of SA at years 5, 10, 15. At maturity (year 20), 40% of SA + Bonuses." }, rules: { death: 'mb_death', maturity: 'money_back_bonus_20' } },
        '721': { name: "LIC's New Money Back Plan-25 Yrs", type: 'Money Back', summary: "A 25-year money back plan with periodic payouts.", benefits: { onDeath: "Sum Assured on Death (125% of SA or 7x AP) + Bonuses. Not less than 105% of premiums.", onSurvival: "15% of SA at years 5, 10, 15, 20. At maturity (year 25), 40% of SA + Bonuses." }, rules: { death: 'mb_death', maturity: 'money_back_bonus_25' } },
        '732': { name: "LIC's New Children's Money Back Plan", type: 'Money Back', summary: "A money back plan for children, with payouts at specific ages.", benefits: { onDeath: "Sum Assured on Death + Bonuses.", onSurvival: "20% of SA at ages 18, 20, 22. At maturity (age 25), 40% of SA + Bonuses." }, rules: { death: 'standard_death_bonus', maturity: 'money_back_bonus_child' } },
        
        // Term Assurance Plans
        '955': { name: "LIC's New Jeevan Amar", type: 'Term', summary: "A pure risk, non-linked, non-profit term assurance plan.", benefits: { onDeath: "Sum Assured on Death is paid.", onSurvival: "No maturity benefit is payable." }, rules: { death: 'term_plan', maturity: 'term_plan' } },
        '859': { name: "LIC's Saral Jeevan Bima", type: 'Term', summary: "A standardized pure risk term assurance plan.", benefits: { onDeath: "Sum Assured on Death is paid.", onSurvival: "No maturity benefit is payable." }, rules: { death: 'term_plan', maturity: 'term_plan' } },
        '875': { name: "LIC's Yuva Term", type: 'Term', summary: "A pure risk, non-linked, non-profit term assurance plan.", benefits: { onDeath: "Sum Assured on Death is paid.", onSurvival: "No maturity benefit is payable." }, rules: { death: 'term_plan', maturity: 'term_plan' } },
        '954': { name: "LIC's New Tech-Term", type: 'Term', summary: "An online pure risk, non-linked, non-profit term assurance plan.", benefits: { onDeath: "Sum Assured on Death is paid.", onSurvival: "No maturity benefit is payable." }, rules: { death: 'term_plan', maturity: 'term_plan' } },

        // Other plan types can be added here following the same structure.
        // For ULIP & Pension plans, calculation is complex and depends on fund value/annuity rates, so we'll show details but simplify calculations.
        '749': { name: "LIC's Nivesh Plus", type: 'ULIP', summary: "A Unit Linked, non-participating, single premium plan.", benefits: { onDeath: "Higher of Basic SA or Unit Fund Value.", onSurvival: "Unit Fund Value." }, rules: { death: 'ulip', maturity: 'ulip' } },
        '857': { name: "LIC's Jeevan Akshay-VII", type: 'Pension', summary: "An immediate annuity plan with multiple payout options.", benefits: { onDeath: "Varies by option chosen.", onSurvival: "Annuity payments for life." }, rules: { death: 'pension', maturity: 'pension' } },
    };

    const planSelector = document.getElementById('planSelector');
    const planDetailsContainer = document.getElementById('planDetailsContainer');
    const calculateBtn = document.getElementById('calculateBtn');
    const resultsContainer = document.getElementById('resultsContainer');
    
    // Input Fields
    const sumAssuredInput = document.getElementById('sumAssured');
    const policyTermInput = document.getElementById('policyTerm');
    const pptInput = document.getElementById('ppt');
    const annualPremiumInput = document.getElementById('annualPremium');
    const bonusRateInput = document.getElementById('bonusRate');
    const fabRateInput = document.getElementById('fabRate');
    const deathBenefitToggle = document.getElementById('deathBenefitToggle');
    const deathDateGroup = document.getElementById('deathDateGroup');
    const dateOfDeathInput = document.getElementById('dateOfDeath');
    const docInput = document.getElementById('doc');
    
    // Result Fields
    const resultTitle = document.getElementById('resultTitle');
    const totalBenefitResult = document.getElementById('totalBenefitResult');
    const premiumsPaidResult = document.getElementById('premiumsPaidResult');
    const sumAssuredResult = document.getElementById('sumAssuredResult');
    const bonusResult = document.getElementById('bonusResult');
    const resultNotes = document.getElementById('result-notes');

    function populatePlanSelector() {
        const categories = {
            'Endowment': [], 'Whole Life': [], 'Money Back': [], 
            'Term': [], 'ULIP': [], 'Pension': []
        };

        for (const planId in planData) {
            const plan = planData[planId];
            if (categories[plan.type]) {
                categories[plan.type].push({ id: planId, name: plan.name });
            }
        }
        
        for (const categoryName in categories) {
            const optgroup = document.createElement('optgroup');
            optgroup.label = `--- ${categoryName} Plans ---`;
            categories[categoryName].forEach(plan => {
                const option = document.createElement('option');
                option.value = plan.id;
                option.textContent = `${plan.id} - ${plan.name}`;
                optgroup.appendChild(option);
            });
            planSelector.appendChild(optgroup);
        }
    }

    function displayPlanDetails(planId) {
        const plan = planData[planId];
        if (!plan) {
            planDetailsContainer.style.display = 'none';
            return;
        }

        let detailsHtml = `
            <h3><i class="fas fa-info-circle"></i> Plan Details: ${plan.name} (${planId})</h3>
            <p><strong>Summary:</strong> ${plan.summary}</p>
            <ul>
                <li><strong>On Survival / Maturity:</strong> ${plan.benefits.onSurvival}</li>
                <li><strong>On Death:</strong> ${plan.benefits.onDeath}</li>
            </ul>
        `;
        planDetailsContainer.innerHTML = detailsHtml;
        planDetailsContainer.style.display = 'block';
    }

    function calculateBenefits() {
        const planId = planSelector.value;
        if (!planId) {
            alert('Please select a plan first.');
            return;
        }

        const plan = planData[planId];
        const isDeathCalc = deathBenefitToggle.checked;

        // --- Gather Inputs ---
        const sa = parseFloat(sumAssuredInput.value) || 0;
        const term = parseFloat(policyTermInput.value) || 0;
        const ppt = parseFloat(pptInput.value) || 0;
        const annualPremium = parseFloat(annualPremiumInput.value) || 0;
        const bonusRate = parseFloat(bonusRateInput.value) || 0;
        const fabRate = parseFloat(fabRateInput.value) || 0;
        
        if (sa === 0 || term === 0 || ppt === 0 || annualPremium === 0) {
            alert('Please fill in Sum Assured, Term, PPT, and Annual Premium.');
            return;
        }

        let completedYears = term;
        if(isDeathCalc && docInput.value && dateOfDeathInput.value) {
            const doc = new Date(docInput.value);
            const dod = new Date(dateOfDeathInput.value);
            if (dod > doc) {
                completedYears = Math.floor((dod - doc) / (1000 * 60 * 60 * 24 * 365.25));
            } else {
                alert('Date of Death must be after Date of Commencement.');
                return;
            }
        } else if (isDeathCalc) {
            alert('Please provide valid Date of Commencement and Date of Death for death benefit calculation.');
            return;
        }

        const totalPremiumsPaid = annualPremium * (isDeathCalc ? Math.min(completedYears, ppt) : ppt);
        const totalBonus = (sa / 1000) * bonusRate * completedYears;
        const finalBonus = isDeathCalc ? 0 : (sa / 1000) * fabRate; // FAB generally not paid on early death

        let totalBenefit = 0;
        let notes = '';

        const rule = isDeathCalc ? plan.rules.death : plan.rules.maturity;

        // --- Core Calculation Logic ---
        switch (rule) {
            case 'sa_plus_bonus':
                totalBenefit = sa + totalBonus + finalBonus;
                break;
            case 'standard_death_bonus':
                let saOnDeath = Math.max(sa, 7 * annualPremium);
                totalBenefit = saOnDeath + totalBonus;
                notes = `Sum Assured on Death (Higher of Basic SA or 7x Annual Premium) + Accrued Bonus.`;
                break;
            case 'ja_death':
                let saOnDeathJA = Math.max(1.25 * sa, 7 * annualPremium);
                totalBenefit = saOnDeathJA + totalBonus;
                notes = `Sum Assured on Death (Higher of 125% Basic SA or 7x Annual Premium) + Accrued Bonus.`;
                break;
            case 'mb_death':
                let saOnDeathMB = Math.max(1.25 * sa, 7 * annualPremium);
                totalBenefit = saOnDeathMB + totalBonus;
                notes = `Sum Assured on Death is paid in full, regardless of survival benefits already paid.`;
                break;
            case 'money_back_bonus_20':
                totalBenefit = (sa * 0.40) + totalBonus + finalBonus;
                notes = 'Maturity: 40% of SA + Bonuses. (Assumes 3x 20% Survival Benefits were paid).';
                break;
            case 'money_back_bonus_25':
                totalBenefit = (sa * 0.40) + totalBonus + finalBonus;
                notes = 'Maturity: 40% of SA + Bonuses. (Assumes 4x 15% Survival Benefits were paid).';
                break;
            case 'money_back_bonus_child':
                totalBenefit = (sa * 0.40) + totalBonus + finalBonus;
                notes = 'Maturity at age 25: 40% of SA + Bonuses. (Assumes 3x 20% Survival Benefits at ages 18, 20, 22 were paid).';
                break;
            case 'jeevan_lakshya':
                totalBenefit = (sa * 1.10) + totalBonus + finalBonus;
                notes = 'On Death, nominee gets 10% of SA annually till maturity date, then on maturity date, receives 110% of SA + Bonuses. The calculated value represents the final lump sum payment.';
                break;
            case 'term_plan':
                totalBenefit = isDeathCalc ? Math.max(sa, 7 * annualPremium) : 0;
                notes = isDeathCalc ? 'Sum Assured on Death is paid.' : 'No benefit is payable on maturity for a Term Plan.';
                break;
            case 'sa_only':
                totalBenefit = sa;
                notes = 'Benefit is equal to the Basic Sum Assured only.';
                break;
            case 'standard_death_no_bonus':
                totalBenefit = Math.max(sa, 7 * annualPremium);
                notes = 'Sum Assured on Death is paid. This is a non-participating plan.';
                break;
            case 'ga_maturity_50':
                totalBenefit = sa + (sa / 1000 * 50 * term);
                notes = `Maturity = Basic SA + Guaranteed Additions (₹50 per 1000 SA per year).`;
                break;
            case 'ga_death_50':
                totalBenefit = Math.max(1.25 * sa, 7 * annualPremium) + (sa / 1000 * 50 * completedYears);
                notes = `Death = SA on Death + Accrued Guaranteed Additions (₹50 per 1000 SA per year).`;
                break;
            case 'ga_maturity_40_income':
                 totalBenefit = sa + (sa / 1000 * 40 * ppt);
                 notes = `Maturity at 100 = SA + GAs. Note: 10% of SA is also paid as income annually for life after PPT.`;
                 break;
            case 'ga_death_40':
                totalBenefit = Math.max(sa, 7*annualPremium) + (sa / 1000 * 40 * completedYears);
                notes = `Death = SA on Death + Accrued GAs.`;
                break;
            case 'ulip':
            case 'pension':
                totalBenefit = 0;
                notes = `Benefit for ${plan.type} plans depends on market performance (Fund Value) or annuity rates, which cannot be estimated with these inputs. Please check your policy document.`;
                break;
            default:
                totalBenefit = sa + totalBonus + finalBonus;
                notes = 'Standard calculation applied. Please verify with official documents for specifics.';
        }

        // --- Display Results ---
        resultTitle.innerHTML = `<i class="fas ${isDeathCalc ? 'fa-cross' : 'fa-trophy'}"></i> ${isDeathCalc ? 'Death' : 'Maturity'} Benefit Results`;
        totalBenefitResult.textContent = `₹ ${totalBenefit.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        premiumsPaidResult.textContent = `₹ ${totalPremiumsPaid.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        sumAssuredResult.textContent = `₹ ${sa.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        bonusResult.textContent = `₹ ${(totalBonus + finalBonus).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        resultNotes.innerHTML = notes ? `<i class="fas fa-info-circle"></i> ${notes}` : '';
        resultsContainer.style.display = 'block';
        resultsContainer.scrollIntoView({ behavior: 'smooth' });
    }

    // --- Event Listeners ---
    planSelector.addEventListener('change', () => {
        displayPlanDetails(planSelector.value);
        resultsContainer.style.display = 'none'; // Hide old results
    });
    
    deathBenefitToggle.addEventListener('change', () => {
        deathDateGroup.style.display = deathBenefitToggle.checked ? 'block' : 'none';
    });

    calculateBtn.addEventListener('click', calculateBenefits);

    // --- Initial Setup ---
    populatePlanSelector();
});