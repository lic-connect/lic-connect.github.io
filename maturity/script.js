document.addEventListener('DOMContentLoaded', function () {
    
    // --- DATA STORE: All plan details parsed from your .txt files ---
    // Note: This is a simplified, structured representation for calculation purposes.
  // --- DATA STORE: All 40 Plans with Corrected Ranges & Validation ---
  // --- DATA STORE: All 40 Plans (Detailed & Validated) ---
    const planData = {
        // 1. New Endowment
        '714': { 
            name: "New Endowment", type: 'Endowment', 
            summary: "A regular premium, non-linked, with-profits Endowment Plan offering a combination of protection and savings.",
            benefits: { 
                onDeath: "Sum Assured + Vested Simple Reversionary Bonuses + Final Additional Bonus (FAB).", 
                onSurvival: "Basic Sum Assured + Vested Simple Reversionary Bonuses + Final Additional Bonus (FAB)." 
            }, 
            rules: { death: 'standard_death_bonus', maturity: 'sa_plus_bonus' },
            minTerm: 12, maxTerm: 35, calcPPT: (t) => t 
        },
        // 2. Jeevan Anand
        '715': { 
            name: "Jeevan Anand", type: 'Endowment', 
            summary: "A non-linked, participating plan offering financial protection against death throughout the lifetime and a lump sum at end of policy term.",
            benefits: { 
                onDeath: "125% of Basic SA or 7x Annual Premium (higher) + Vested Bonuses + FAB. (After maturity: Basic SA is payable on death).", 
                onSurvival: "Basic Sum Assured + Vested Simple Reversionary Bonuses + Final Additional Bonus (FAB)." 
            }, 
            rules: { death: 'ja_death', maturity: 'sa_plus_bonus' },
            minTerm: 15, maxTerm: 35, calcPPT: (t) => t 
        },
        // 3. Single Premium Endowment
        '717': { 
            name: "Single Premium Endowment", type: 'Single Premium', 
            summary: "A single premium, non-linked, with-profits Endowment Plan.",
            benefits: { 
                onDeath: "Sum Assured + Vested Bonuses + FAB (after commencement of risk). Return of Single Premium (before risk).", 
                onSurvival: "Sum Assured + Vested Bonuses + FAB." 
            }, 
            rules: { death: 'standard_death_bonus', maturity: 'sa_plus_bonus' },
            minTerm: 10, maxTerm: 25, calcPPT: (t) => 1 
        },
        // 4. Money Back 20 Years
        '720': { 
            name: "Money Back 20 Yrs", type: 'Money Back', 
            summary: "A limited premium money back plan with periodic payouts.",
            benefits: { 
                onDeath: "125% of Basic SA + Vested Bonuses + FAB.", 
                onSurvival: "20% of Basic SA at end of 5th, 10th, and 15th year. At Maturity (20th yr): 40% of SA + Vested Bonuses + FAB." 
            }, 
            rules: { death: 'mb_death', maturity: 'money_back_bonus_20' },
            allowedTerms: [20], calcPPT: (t) => 15 
        },
        // 5. Money Back 25 Years
        '721': { 
            name: "Money Back 25 Yrs", type: 'Money Back', 
            summary: "A limited premium money back plan with periodic payouts.",
            benefits: { 
                onDeath: "125% of Basic SA + Vested Bonuses + FAB.", 
                onSurvival: "15% of Basic SA at end of 5th, 10th, 15th, and 20th year. At Maturity (25th yr): 40% of SA + Vested Bonuses + FAB." 
            }, 
            rules: { death: 'mb_death', maturity: 'money_back_bonus_25' },
            allowedTerms: [25], calcPPT: (t) => 20 
        },
        // 6. Child Money Back
        '732': { 
            name: "Children's Money Back", type: 'Money Back', 
            summary: "A participating money back plan designed for children's needs.",
            benefits: { 
                onDeath: "Sum Assured on Death + Vested Bonuses + FAB (After risk commencement).", 
                onSurvival: "20% of SA at age 18, 20, 22. At Maturity (Age 25): 40% of SA + Bonuses + FAB." 
            }, 
            rules: { death: 'standard_death_bonus', maturity: 'money_back_bonus_child' },
            allowedTerms: [25], calcPPT: (t) => t // PPT usually waived or specific
        },
        // 7. Jeevan Lakshya
        '733': { 
            name: "Jeevan Lakshya", type: 'Endowment', 
            summary: "A limited premium paying, with-profits Endowment plan with income benefit on death.",
            benefits: { 
                onDeath: "10% of SA Annual Income till maturity + 110% of SA payable at maturity + Vested Bonuses + FAB.", 
                onSurvival: "Basic Sum Assured + Vested Bonuses + FAB." 
            }, 
            rules: { death: 'jeevan_lakshya', maturity: 'sa_plus_bonus' },
            minTerm: 13, maxTerm: 25, calcPPT: (t) => t - 3 
        },
        // 8. Jeevan Tarun
      '734': { 
            name: "Jeevan Tarun", type: 'Money Back', 
            summary: "A child plan with 4 Survival Benefit options (0%, 5%, 10%, 15% SB). <strong>Note: This calculator assumes Option 4 (15% SB) for maturity estimation purposes.</strong>",
            benefits: { 
                onDeath: "125% of Sum Assured + Bonus.", 
                onSurvival: "Survival Benefits per Option 4 (15% SA/yr) + Maturity (25% SA + Bonus)." 
            }, 
            rules: { death: 'standard_death_bonus', maturity: 'money_back_bonus_child' },
            minTerm: 13, maxTerm: 25, calcPPT: (t) => t - 5 
        },
        // 9. Endowment Plus (ULIP)
        '735': { 
            name: "Endowment Plus", type: 'ULIP', 
            summary: "A regular premium Unit Linked insurance plan.",
            benefits: { onDeath: "Higher of SA or Fund Value.", onSurvival: "Fund Value." }, 
            rules: { death: 'ulip_risk_logic', maturity: 'fund_value_only' },
            minTerm: 10, maxTerm: 20, calcPPT: (t) => t 
        },
        // 10. Jeevan Labh
        '736': { 
            name: "Jeevan Labh", type: 'Endowment', 
            summary: "A limited premium, non-linked, with-profits Endowment plan.",
            benefits: { 
                onDeath: "Sum Assured on Death + Vested Bonuses + FAB.", 
                onSurvival: "Basic Sum Assured + Vested Bonuses + FAB." 
            }, 
            rules: { death: 'standard_death_bonus', maturity: 'sa_plus_bonus' },
            allowedTerms: [16, 21, 25], 
            pptMap: { 16: 10, 21: 15, 25: 16 } 
        },
        // 11. Jeevan Umang
        '745': { 
            name: "Jeevan Umang", type: 'Whole Life', 
            summary: "A whole life plan with 8% annual survival benefits after PPT.",
            benefits: { 
                onDeath: "Sum Assured on Death + Vested Bonuses + FAB.", 
                onSurvival: "8% of Basic SA payable annually after PPT. Maturity (Age 100): SA + Bonuses + FAB." 
            }, 
            rules: { death: 'standard_death_bonus', maturity: 'sa_plus_bonus' },
            minTerm: 15, maxTerm: 55, pptMin: 15, pptMax: 30 
        },
        // 12. Bima Shree
        '748': { 
            name: "Bima Shree", type: 'Money Back', 
            summary: "Limited premium Money Back plan for HNI with Guaranteed Additions.",
            benefits: { 
                onDeath: "125% of Basic SA + Accrued Guaranteed Additions (GA).", 
                onSurvival: "Money Back: \n14yr: 30% (10,12th yr). \n16yr: 35% (12,14th yr). \n18yr: 40% (14,16th yr). \n20yr: 45% (16,18th yr). \n24yr: 45% (20,22nd yr). \n28yr: 45% (24,26th yr).\nMaturity: Balance SA + GA + Loyalty." 
            }, 
            rules: { death: 'ga_death', maturity: 'money_back_ga' },
            allowedTerms: [14, 16, 18, 20, 24, 28], 
            calcPPT: (t) => t - 4 
        },
        // 13. Nivesh Plus
      '749': { 
            name: "Nivesh Plus", type: 'ULIP', 
            summary: "Single Premium ULIP. <strong>Note: For calculation, please enter the Basic Sum Assured corresponding to your chosen Option (Option 1: 1.25x Premium or Option 2: 10x Premium).</strong>",
            benefits: { onDeath: "Higher of Entered SA or Fund Value.", onSurvival: "Fund Value." }, 
            rules: { death: 'single_premium_ulip_logic', maturity: 'fund_value_plus_ga' },
            minTerm: 10, maxTerm: 25, calcPPT: (t) => 1 
        },
        // 14. Micro Bachat
        '751': { 
            name: "Micro Bachat", type: 'Micro Insurance', 
            summary: "A regular premium, micro-insurance plan with Loyalty Additions.",
            benefits: { onDeath: "Sum Assured on Death + Loyalty Addition.", onSurvival: "Basic SA + Loyalty Addition." }, 
            rules: { death: 'standard_death_bonus', maturity: 'sa_plus_bonus' },
            minTerm: 10, maxTerm: 15, calcPPT: (t) => t 
        },
        // 15. SIIP
      '752': { 
            name: "SIIP", type: 'ULIP', 
            summary: "Unit Linked Plan. <strong>Note: Please enter the Basic Sum Assured based on your chosen cover option (Option 1: 7x Premium or Option 2: 10x Premium).</strong>",
            benefits: { onDeath: "Higher of Entered SA or Fund Value.", onSurvival: "Fund Value + Mortality Refund." }, 
            rules: { death: 'ulip_risk_logic', maturity: 'fund_value_plus_refund_plus_ga' },
            minTerm: 10, maxTerm: 25, calcPPT: (t) => t 
        },
        // 16. Jeevan Shanti
        '758': { 
            name: "Jeevan Shanti", type: 'Pension', 
            summary: "Single Premium Deferred Annuity Plan.",
            benefits: { onDeath: "Higher of Purchase Price + Accrued Benefits or 105% of SP.", onSurvival: "Annuity payments." }, 
            rules: { death: 'pension', maturity: 'pension' },
            minTerm: 1, maxTerm: 12, calcPPT: (t) => 1 
        },
        // 17. Bima Jyoti
        '760': { 
            name: "Bima Jyoti", type: 'Endowment', 
            summary: "Non-participating plan with Guaranteed Additions of Rs. 50 per 1000 SA.",
            benefits: { 
                onDeath: "125% of Basic SA + Accrued GA.", 
                onSurvival: "Basic SA + Accrued GA." 
            }, 
            rules: { death: 'ga_death_50', maturity: 'ga_maturity_50' },
            minTerm: 15, maxTerm: 20, calcPPT: (t) => t - 5 
        },
        // 18. Bima Ratna
        '764': { 
            name: "Bima Ratna", type: 'Money Back', 
            summary: "Non-participating Money Back plan with Guaranteed Additions.",
            benefits: { 
                onDeath: "125% of Basic SA + Accrued GA.", 
                onSurvival: "Periodic Money Back + Maturity Benefit (50% SA + GA)." 
            }, 
            rules: { death: 'ga_death_50', maturity: 'money_back_ga' },
            allowedTerms: [15, 20, 25],
            pptMap: { 15: 11, 20: 16, 25: 21 }
        },
        // 19. Jeevan Azad
        '768': { 
            name: "Jeevan Azad", type: 'Endowment', 
            summary: "Non-participating, limited premium endowment plan.",
            benefits: { onDeath: "Sum Assured on Death.", onSurvival: "Basic Sum Assured." }, 
            rules: { death: 'sa_only', maturity: 'sa_only' },
            minTerm: 15, maxTerm: 20, calcPPT: (t) => t - 8 
        },
        // 20. Jeevan Utsav
      '771': { 
            name: "Jeevan Utsav", type: 'Whole Life', 
            summary: "Whole Life Plan. <strong>Note: This calculator shows the Total Accrued Benefit. It assumes 'Flexi Income Benefit' where income is accumulated and not withdrawn annually.</strong>",
            benefits: { onDeath: "Sum Assured + Accrued GA.", onSurvival: "Accumulated Income + Maturity (SA + GA)." }, 
            rules: { death: 'ga_death_40', maturity: 'ga_maturity_40_income' },
            minTerm: 100, maxTerm: 100, pptMin: 5, pptMax: 16 
        },

        // 21. Amritbaal
        '774': {
            name: "Amritbaal", type: 'Endowment',
            summary: "Child plan with Guaranteed Additions (Rs. 80/1000).",
            benefits: { onDeath: "Sum Assured on Death + Accrued GA.", onSurvival: "Sum Assured + Accrued GA." },
            rules: { death: 'ga_death', maturity: 'ga_maturity' },
            minTerm: 5, maxTerm: 25, pptMin: 1, pptMax: 7 
        },
        // 22. Jeevan Akshay VII
        '857': { 
            name: "Jeevan Akshay VII", type: 'Pension', 
            summary: "Immediate Annuity Plan.",
            benefits: { onDeath: "Varies by Option (e.g. Return of Purchase Price).", onSurvival: "Immediate Annuity." }, 
            rules: { death: 'pension', maturity: 'pension' },
            minTerm: 0, maxTerm: 0, calcPPT: (t) => 1 
        },
        // 23. Saral Jeevan Bima
        '859': { 
            name: "Saral Jeevan Bima", type: 'Term', 
            summary: "Standard Pure Term Assurance.",
            benefits: { onDeath: "Sum Assured is paid.", onSurvival: "Nil." }, 
            rules: { death: 'term_plan', maturity: 'term_plan' },
            minTerm: 5, maxTerm: 40, calcPPT: (t) => t 
        },
        // 24. Saral Pension
        '862': { 
            name: "Saral Pension", type: 'Pension', 
            summary: "Standard Immediate Annuity Plan.",
            benefits: { onDeath: "100% Purchase Price returned.", onSurvival: "Annuity for life." }, 
            rules: { death: 'pension', maturity: 'pension' },
            minTerm: 0, maxTerm: 0, calcPPT: (t) => 1 
        },
        // 25. New Pension Plus
        '867': { 
            name: "New Pension Plus", type: 'Pension ULIP', 
            summary: "Unit Linked Pension Plan.",
            benefits: { onDeath: "Higher of Fund Value or 105% Premiums.", onSurvival: "Vesting Fund Value." }, 
            rules: { death: 'pension_ulip_logic', maturity: 'vesting_annuitisation' },
            minTerm: 10, maxTerm: 42, calcPPT: (t) => t 
        },
        // 26. Index Plus
        '873': { 
            name: "Index Plus", type: 'ULIP', 
            summary: "Unit Linked Plan investing in Nifty Indices.",
            benefits: { onDeath: "Higher of SA or Fund Value.", onSurvival: "Fund Value + Refund of Mortality." }, 
            rules: { death: 'ulip_risk_logic', maturity: 'fund_value_plus_refund_plus_ga' },
            minTerm: 10, maxTerm: 25, calcPPT: (t) => t 
        },
        // 27. Yuva Term
        '875': { 
            name: "Yuva Term", type: 'Term', 
            summary: "Term plan for young individuals.",
            benefits: { onDeath: "Sum Assured paid.", onSurvival: "Nil." }, 
            rules: { death: 'term_plan', maturity: 'term_plan' },
            minTerm: 15, maxTerm: 40, calcPPT: (t) => t 
        },
        // 28. Digi Term
        '876': { 
            name: "Digi Term", type: 'Term', 
            summary: "Online pure Term Assurance plan.",
            benefits: { onDeath: "Sum Assured paid.", onSurvival: "Nil." }, 
            rules: { death: 'term_plan', maturity: 'term_plan' },
            minTerm: 10, maxTerm: 40, calcPPT: (t) => t 
        },
        // 29. Yuva Credit Life
        '877': { 
            name: "Yuva Credit Life", type: 'Term', 
            summary: "Decreasing Term Assurance for loan protection.",
            benefits: { onDeath: "Decreasing Sum Assured based on schedule.", onSurvival: "Nil." }, 
            rules: { death: 'term_plan', maturity: 'term_plan' },
            minTerm: 5, maxTerm: 30, pptMin: 1, pptMax: 30 
        },
        // 30. Digi Credit Life
        '878': { 
            name: "Digi Credit Life", type: 'Term', 
            summary: "Online Decreasing Term Assurance.",
            benefits: { onDeath: "Decreasing Sum Assured.", onSurvival: "Nil." }, 
            rules: { death: 'term_plan', maturity: 'term_plan' },
            minTerm: 5, maxTerm: 30, pptMin: 1, pptMax: 30 
        },
        // 31. Smart Pension
        '879': { 
            name: "Smart Pension", type: 'Pension', 
            summary: "Individual Immediate Annuity Plan.",
            benefits: { onDeath: "Return of Purchase Price (Option dependent).", onSurvival: "Annuity." }, 
            rules: { death: 'pension', maturity: 'pension' },
            minTerm: 0, maxTerm: 0, calcPPT: (t) => 1 
        },
        // 32. Jan Suraksha
        '880': { 
            name: "Jan Suraksha", type: 'Micro Insurance', 
            summary: "Micro Insurance Term Endowment with GA.",
            benefits: { 
                onDeath: "Higher of 7x Annual Premium or Basic SA + Accrued GA.", 
                onSurvival: "Basic SA + Accrued GA." 
            }, 
            rules: { death: 'sa_plus_ga', maturity: 'sa_plus_ga' },
            minSA: 100000, maxSA: 200000,
            allowedTerms: [12, 13, 14, 15, 16, 17, 18, 19, 20], 
            calcPPT: (t) => t - 5
        },
        // 33. Bima Lakshmi
        '881': { 
            name: "Bima Lakshmi", type: 'Money Back', 
            summary: "Women-only plan. <strong>Note: The Maturity Result below displays 'Basic SA + Guaranteed Additions'. Periodic Survival Benefits (under Options A, B, or C) are paid separately during the term and are NOT added to the final maturity figure here.</strong>",
            benefits: { 
                onDeath: "Sum Assured on Death + Accrued GA.", 
                onSurvival: "Maturity: Basic SA + GA. (Survival Payouts depend on Option A/B/C chosen)." 
            }, 
            rules: { death: 'sa_plus_ga', maturity: 'sa_plus_ga' },
            minSA: 200000,
            allowedTerms: [25], 
            pptMin: 7, pptMax: 15
        },
        // 34. Jeevan Utsav SP
      '883': { 
            name: "Jeevan Utsav SP", type: 'Whole Life', 
            summary: "Single Premium Whole Life. <strong>Note: This calculator assumes 'Flexi Income Option' where the 10% Income is accumulated in the policy and paid as a lump sum at end, rather than withdrawn yearly.</strong>",
            benefits: { 
                onDeath: "Higher of BSA or 1.25x Single Premium + Accrued GA.", 
                onSurvival: "Accumulated Income + Maturity (SA + GA)." 
            }, 
            rules: { death: 'utsav_sp', maturity: 'utsav_sp' },
            minTerm: 100, maxTerm: 100, calcPPT: (t) => 1 
        },
        // 35. Protection Plus
        '886': { 
            name: "Protection Plus", type: 'ULIP', 
            summary: "Unit Linked Plan offering higher risk cover options.",
            benefits: { onDeath: "Highest of SA, Fund Value, or 105% Premiums.", onSurvival: "Fund Value." }, 
            rules: { death: 'high_cover_ulip_logic', maturity: 'fund_value_plus_refund' },
            minTerm: 10, maxTerm: 40, calcPPT: (t) => t 
        },
        // 36. Bima Kavach
     '887': { 
            name: "Bima Kavach", type: 'Term', 
            summary: "Pure Risk Plan. <strong>Note: If Death Benefit is selected, this calculator assumes 'Option II: Increasing Sum Assured' (SA increases by 10% from Yr 6-15). If 'Level Sum Assured' is desired, the actual benefit will be lower (constant Basic SA).</strong>",
            benefits: { onDeath: "Increasing Sum Assured Logic Applied.", onSurvival: "Nil (Pure Term Plan)." }, 
            rules: { death: '887_logic', maturity: 'term_plan' },
            minTerm: 10, maxTerm: 40, calcPPT: (t) => t 
        },

        // 37. Nav Jeevan Shree SP
        '911': {
            name: "Nav Jeevan Shree SP", type: 'Single Premium',
            summary: "Single Premium Endowment with Loyalty Additions.",
            benefits: { onDeath: "Sum Assured + Loyalty Addition.", onSurvival: "Sum Assured + Loyalty Addition." },
            rules: { death: 'standard_death_bonus', maturity: 'sa_plus_bonus' },
            minTerm: 10, maxTerm: 25, calcPPT: (t) => 1
        },
        // 38. Nav Jeevan Shree
        '912': {
            name: "Nav Jeevan Shree", type: 'Endowment',
            summary: "Limited Premium Endowment with Loyalty Additions.",
            benefits: { onDeath: "Sum Assured + Loyalty Addition.", onSurvival: "Sum Assured + Loyalty Addition." },
            rules: { death: 'standard_death_bonus', maturity: 'sa_plus_bonus' },
            minTerm: 10, maxTerm: 25, calcPPT: (t) => t
        },
        // 39. New Tech Term
       '954': { 
            name: "New Tech Term", type: 'Term', 
            summary: "Online Term Plan. <strong>Note: Calculation assumes 'Option I: Level Sum Assured'. If 'Increasing Sum Assured' is chosen, the Death Benefit will differ in later years.</strong>",
            benefits: { onDeath: "Basic Sum Assured.", onSurvival: "Nil." }, 
            rules: { death: 'term_plan', maturity: 'term_plan' },
            minTerm: 10, maxTerm: 40, calcPPT: (t) => t 
        },
        // 40. Jeevan Amar
   '955': { 
            name: "Jeevan Amar", type: 'Term', 
            summary: "Offline Term Plan. <strong>Note: Calculation assumes 'Option I: Level Sum Assured'.</strong>",
            benefits: { onDeath: "Basic Sum Assured.", onSurvival: "Nil." }, 
            rules: { death: 'term_plan', maturity: 'term_plan' },
            minTerm: 10, maxTerm: 40, calcPPT: (t) => t 
        }
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
        const planSelector = document.getElementById('planSelector');
        // Reset dropdown
        planSelector.innerHTML = '<option value="">-- Choose a Plan to Begin --</option>';

        // Define preferred display order
        const displayOrder = [
            'Endowment', 'Single Premium', 'Money Back', 'Whole Life', 
            'Term', 'ULIP', 'Pension', 'Pension ULIP', 'Micro Insurance'
        ];

        // Group all plans by their 'type' property
        const groupedPlans = {};
        for (const [id, plan] of Object.entries(planData)) {
            if (!groupedPlans[plan.type]) {
                groupedPlans[plan.type] = [];
            }
            groupedPlans[plan.type].push({ id: id, name: plan.name });
        }

        // Loop through order and create Option Groups
        displayOrder.forEach(type => {
            if (groupedPlans[type]) {
                const optgroup = document.createElement('optgroup');
                optgroup.label = `--- ${type} Plans ---`;
                
                groupedPlans[type].forEach(plan => {
                    const option = document.createElement('option');
                    option.value = plan.id;
                    option.textContent = `${plan.id} - ${plan.name}`;
                    optgroup.appendChild(option);
                });
                
                planSelector.appendChild(optgroup);
            }
        });
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







// --- Helper: Populate Term Dropdown ---
    function updatePolicyInputUI() {
        const planId = planSelector.value;
        const plan = planData[planId];
        
        // Reset Dropdown
        policyTermInput.innerHTML = '';
        
        // Reset PPT
        pptInput.value = '';
        pptInput.readOnly = false;
        pptInput.style.backgroundColor = '#fff';
        pptInput.placeholder = "Auto-filled or Enter PPT";

        if (!plan) return;

        // 1. Generate Options based on Plan Data
        if (plan.allowedTerms) {
            // Specific terms (e.g., 736: 16,21,25 or 748: 14,16,18...)
            plan.allowedTerms.forEach(t => {
                let opt = document.createElement('option');
                opt.value = t;
                opt.textContent = t + " Years";
                policyTermInput.add(opt);
            });
        } else if (plan.minTerm && plan.maxTerm) {
            // Range of terms (e.g., 714: 12-35, 715: 15-35)
            for (let i = plan.minTerm; i <= plan.maxTerm; i++) {
                let opt = document.createElement('option');
                opt.value = i;
                opt.textContent = i + " Years";
                policyTermInput.add(opt);
            }
        } else {
            // Fallback
            let opt = document.createElement('option');
            opt.text = "Select Plan First";
            policyTermInput.add(opt);
        }

        // Trigger PPT update immediately for the first option
        autoFillPPT();
    }
    // --- Helper 2: Auto-calculate PPT when Term changes ---
// --- Helper: Auto-Fill PPT based on Term ---
    function autoFillPPT() {
        const planId = planSelector.value;
        const plan = planData[planId];
        const term = parseInt(policyTermInput.value);

        if (!plan || isNaN(term)) return;

        // Logic 1: Specific Mapping (e.g., 736: 16->10, 21->15)
        if (plan.pptMap) {
            pptInput.value = plan.pptMap[term] || '';
            pptInput.readOnly = true;
            pptInput.style.backgroundColor = '#e9ecef';
        }
        // Logic 2: Calculated Formula (e.g., 748: t-4, 880: t-5, 714: t)
        else if (plan.calcPPT) {
            pptInput.value = plan.calcPPT(term);
            pptInput.readOnly = true;
            pptInput.style.backgroundColor = '#e9ecef';
        }
        // Logic 3: Range (e.g., 881: 7 to 15, Amritbaal)
        else if (plan.pptMin && plan.pptMax) {
            pptInput.value = '';
            pptInput.readOnly = false;
            pptInput.style.backgroundColor = '#fff';
            pptInput.placeholder = `Enter ${plan.pptMin} - ${plan.pptMax}`;
            pptInput.setAttribute('min', plan.pptMin);
            pptInput.setAttribute('max', plan.pptMax);
        } 
        else {
            pptInput.value = term; // Default regular premium
        }
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
        
        // For participating plans: Reversionary Bonus Rate. 
        // For Non-Par plans: Use this field as Guaranteed Addition Rate per 1000 SA.
        const bonusRate = parseFloat(bonusRateInput.value) || 0; 
        const fabRate = parseFloat(fabRateInput.value) || 0;
        
 // ... inside calculateBenefits() ...





// ... inside calculateBenefits ...

        // --- VALIDATION START ---
        // 1. Basic Empty Check
        if (sa === 0 || isNaN(term) || isNaN(ppt) || annualPremium === 0) {
            alert('Error: Please fill in Sum Assured, Policy Term, PPT, and Premium.');
            return;
        }

        // 2. Sum Assured Range Check
        if (plan.minSA && sa < plan.minSA) {
            alert(`Error: Minimum Sum Assured for this plan is ₹${plan.minSA.toLocaleString('en-IN')}`);
            return;
        }
        if (plan.maxSA && sa > plan.maxSA) {
            alert(`Error: Maximum Sum Assured for this plan is ₹${plan.maxSA.toLocaleString('en-IN')}`);
            return;
        }

        // 3. PPT Range Check (For flexible plans like 881)
        if (plan.pptMin && (ppt < plan.pptMin || ppt > plan.pptMax)) {
            alert(`Error: Premium Paying Term must be between ${plan.pptMin} and ${plan.pptMax} years.`);
            return;
        }
        // --- VALIDATION END ---






        let completedYears = term;
        // Logic for Death Benefit Calculation Duration
        if(isDeathCalc && docInput.value && dateOfDeathInput.value) {
            const doc = new Date(docInput.value);
            const dod = new Date(dateOfDeathInput.value);
            if (dod > doc) {
                completedYears = Math.floor((dod - doc) / (1000 * 60 * 60 * 24 * 365.25));
                // Cap completed years at Policy Term for calculation limits
                if (completedYears > term) completedYears = term; 
            } else {
                alert('Date of Death must be after Date of Commencement.');
                return;
            }
        } else if (isDeathCalc) {
            alert('Please provide valid Date of Commencement and Date of Death for death benefit calculation.');
            return;
        }

        const totalPremiumsPaid = annualPremium * (isDeathCalc ? Math.min(completedYears, ppt) : ppt);
        
        // Initialize variables
        let totalBonus = 0; // Accumulated Bonus or GA
        let finalBonus = 0; // FAB or Loyalty Addition
        let totalBenefit = 0;
        let notes = '';

        const rule = isDeathCalc ? plan.rules.death : plan.rules.maturity;

        // --- CORE CALCULATION LOGIC ---
        switch (rule) {
            // ============================================================
            // 1. UNIT LINKED (ULIP) & PENSION LOGIC
            // ============================================================
            case 'ulip_risk_logic':
            case 'fund_value_plus_refund_plus_ga':
            case 'high_cover_ulip_logic':
                // Estimation: bonusRate input is treated as Expected Market Return %
                let netGrowth = (bonusRate - 1.35) / 100; 
                let fundVal = 0;
                let refundAmt = 0;
                for (let i = 1; i <= completedYears; i++) {
                    if (i <= ppt) fundVal += (annualPremium * 0.96); 
                    fundVal *= (1 + netGrowth);
                }
                // GA for ULIPs (simplified estimation)
                let gaVal = (sa * (fabRate / 100));
                // Mortality refund estimation
                if (rule !== 'ulip_risk_logic') refundAmt = (sa / 1000) * 1.5 * completedYears; 
                
                totalBonus = gaVal + refundAmt;
                totalBenefit = fundVal + totalBonus;
                if(isDeathCalc) {
                    // Death Benefit is usually Higher of SA or Fund Value
                    totalBenefit = Math.max(sa, totalBenefit);
                }
                notes = `Estimated Fund Value @ ${bonusRate}% growth. Includes Refund & GAs if applicable.`;
                break;

            case 'single_premium_ulip_logic':
            case 'fund_value_plus_ga':
                let spGrowth = (bonusRate - 1.35) / 100;
                let spFund = (annualPremium * 0.967) * Math.pow((1 + spGrowth), completedYears);
                totalBonus = (annualPremium * (fabRate / 100)); 
                totalBenefit = spFund + totalBonus;
                if(isDeathCalc) totalBenefit = Math.max(sa, totalBenefit);
                break;

            case 'vesting_annuitisation':
            case 'pension_ulip_logic':
                let pGrowth = (bonusRate - 1.35) / 100;
                let pFund = 0;
                for (let i = 1; i <= completedYears; i++) {
                    let inv = (i <= ppt) ? (annualPremium * 0.95) : 0;
                    pFund = (pFund + inv) * (1 + pGrowth);
                }
                totalBonus = (annualPremium * (fabRate / 100)); // Simplified GA
                totalBenefit = pFund + totalBonus;
                notes = isDeathCalc ? "Benefit used for Annuity purchase." : "Vesting Benefit (Corpus for Annuity).";
                break;

            case 'fund_value_only':
                let sGrowth = (bonusRate - 1.35) / 100;
                let sFund = 0;
                for (let i = 1; i <= completedYears; i++) {
                    let inv = (i <= ppt) ? (annualPremium * 0.93) : 0;
                    sFund = (sFund + inv) * (1 + sGrowth);
                }
                totalBenefit = sFund;
                if(isDeathCalc) totalBenefit = Math.max(sa, sFund);
                break;

            // ============================================================
            // 2. GUARANTEED ADDITIONS PLANS (880, 881, 774, 760, 748, 883)
            // ============================================================
            
            // Covers 880 (Jan Suraksha) and 881 (Bima Lakshmi)
            case 'sa_plus_ga':
                if (planId === '880') {
                    // 880: GA is 4% of Annualized Premium (Fixed)
                    // Note: Summary says "4% of total annualized premiums". 
                    // Calculation: (Premium * 0.04) * Years
                    let gaPerYear = annualPremium * 0.04;
                    totalBonus = gaPerYear * completedYears;
                    notes = "GA calculated as 4% of Annual Premium per year.";
                } else {
                    // 881: GA is Fixed (User should enter rate in Bonus Input, e.g., 50)
                    // Calculation: (SA * Rate/1000) * Years
                    totalBonus = (sa / 1000) * bonusRate * completedYears;
                    notes = `GA calculated @ Rs.${bonusRate} per 1000 SA.`;
                }
                
                if (isDeathCalc) {
                    // 7x AP or Basic SA or 105% premiums
                    let riskCover = Math.max(sa, 7 * annualPremium);
                    // For 881, death sum assured is specific (Higher of SA or 10x AP adjusted)
                    if(planId === '881') riskCover = Math.max(sa, 10 * annualPremium); 
                    
                    totalBenefit = riskCover + totalBonus;
                } else {
                    totalBenefit = sa + totalBonus;
                }
                break;

            // Covers 883 (Jeevan Utsav SP)
            case 'utsav_sp':
                // GA Rate fixed at 40 per 1000 SA
                // Accrues during the policy TERM (even though PPT is 1)
                totalBonus = (sa / 1000) * 40 * completedYears;
                
                if (isDeathCalc) {
                    let deathSA = Math.max(sa, 1.25 * annualPremium); // annualPremium here is Single Premium
                    totalBenefit = deathSA + totalBonus;
                } else {
                    // Maturity
                    totalBenefit = sa + totalBonus;
                }
                notes = "GA fixed at Rs. 40 per 1000 SA.";
                break;

            // Covers 774 (Amritbaal), 748 (Bima Shree)
            case 'ga_death': 
            case 'ga_maturity':
            case 'money_back_ga':
                // User must input GA rate in "Bonus Rate" field (e.g. 80 for Amritbaal)
                totalBonus = (sa / 1000) * bonusRate * completedYears;
                
                if (planId === '748' && !isDeathCalc) {
                    // Bima Shree Maturity: Remaining SA + GA + Loyalty
                    // Assuming 40% survived or simplified to Full Calculation minus survival benefits
                    // Here we calculate Total Accrued Value for simplicity
                    finalBonus = (sa / 1000) * fabRate; // Treating FAB input as Loyalty Addition
                    totalBenefit = sa + totalBonus + finalBonus; 
                    notes = "Total Benefit includes Accrued GA and Loyalty Additions.";
                } else if (isDeathCalc) {
                     // Standard GA Death
                    let riskCover = Math.max(sa, 7 * annualPremium);
                    if(planId === '748') riskCover = Math.max(1.25 * sa, 7 * annualPremium);
                    totalBenefit = riskCover + totalBonus;
                } else {
                    // Amritbaal Maturity
                    totalBenefit = sa + totalBonus;
                }
                break;

            // Covers 760 (Bima Jyoti - Fixed 50)
            case 'ga_maturity_50':
                totalBonus = (sa / 1000 * 50 * term);
                totalBenefit = sa + totalBonus;
                break;
            case 'ga_death_50':
                totalBonus = (sa / 1000 * 50 * completedYears);
                totalBenefit = Math.max(1.25 * sa, 7 * annualPremium) + totalBonus;
                break;

            // Covers 771 (Utsav - Fixed 40)
            case 'ga_maturity_40_income':
                totalBonus = (sa / 1000 * 40 * ppt); // Accrues only during PPT
                totalBenefit = sa + totalBonus;
                notes = "Plus Lifetime Income of 10% SA.";
                break;
            case 'ga_death_40':
                totalBonus = (sa / 1000 * 40 * Math.min(completedYears, ppt)); // Caps at PPT
                totalBenefit = Math.max(sa, 7 * annualPremium) + totalBonus;
                break;

            // ============================================================
            // 3. TRADITIONAL ENDOWMENT / WHOLE LIFE / MONEY BACK (BONUS BASED)
            // ============================================================
            case 'sa_plus_bonus':
                totalBonus = (sa / 1000) * bonusRate * completedYears;
                finalBonus = (sa / 1000) * fabRate;
                totalBenefit = sa + totalBonus + finalBonus;
                break;
            case 'standard_death_bonus':
                totalBonus = (sa / 1000) * bonusRate * completedYears;
                finalBonus = (sa / 1000) * fabRate;
                totalBenefit = Math.max(sa, 7 * annualPremium) + totalBonus + finalBonus;
                break;
            case 'ja_death': // Jeevan Anand
                totalBonus = (sa / 1000) * bonusRate * completedYears;
                finalBonus = (sa / 1000) * fabRate;
                totalBenefit = Math.max(1.25 * sa, 7 * annualPremium) + totalBonus + finalBonus;
                break;
            case 'mb_death': // Money Back Death
                totalBonus = (sa / 1000) * bonusRate * completedYears;
                finalBonus = (sa / 1000) * fabRate;
                totalBenefit = Math.max(1.25 * sa, 7 * annualPremium) + totalBonus + finalBonus;
                break;
            case 'money_back_bonus_20':
            case 'money_back_bonus_25':
            case 'money_back_bonus_child':
                totalBonus = (sa / 1000) * bonusRate * completedYears;
                finalBonus = (sa / 1000) * fabRate;
                // Maturity is 40% of SA for standard MB plans
                totalBenefit = (sa * 0.40) + totalBonus + finalBonus;
                notes = 'Maturity: 40% of SA + Accrued Bonuses + FAB.';
                break;
            case 'jeevan_lakshya':
                totalBonus = (sa / 1000) * bonusRate * completedYears;
                finalBonus = (sa / 1000) * fabRate;
                if(isDeathCalc) {
                     // 110% SA + Bonuses paid on Maturity Date, plus Income Benefit
                     totalBenefit = (sa * 1.10) + totalBonus + finalBonus;
                     notes = "Paid at end of term. Plus 10% SA annual income till maturity.";
                } else {
                     totalBenefit = sa + totalBonus + finalBonus;
                }
                break;

            // ============================================================
            // 4. TERM & OTHERS
            // ============================================================
            case 'term_plan':
                totalBenefit = isDeathCalc ? Math.max(sa, 7 * annualPremium) : 0;
                notes = isDeathCalc ? 'Sum Assured on Death is paid.' : 'No benefit on maturity for Term Plans.';
                break;
            case 'sa_only':
                totalBenefit = sa;
                if(isDeathCalc) totalBenefit = Math.max(sa, 7 * annualPremium);
                notes = 'Non-participating plan. Basic Sum Assured only.';
                break;
            case '887_logic': // Bima Kavach
                if (isDeathCalc) {
                    // Logic: Level SA (Year 1-5), increasing 10% (Year 6-15), max 2x SA
                    let pYear = completedYears + 1; 
                    let multiplier = 1;
                    if (pYear > 5 && pYear <= 15) {
                        multiplier = 1 + (0.10 * (pYear - 5));
                    } else if (pYear > 15) {
                        multiplier = 2;
                    }
                    totalBenefit = sa * multiplier;
                    notes = `Increasing SA logic applied (Level first 5 yrs, then +10%).`;
                } else {
                    totalBenefit = 0;
                    notes = "No benefit on survival.";
                }
                break;

            default:
                // Fallback
                totalBonus = (sa / 1000) * bonusRate * completedYears;
                totalBenefit = sa + totalBonus;
                notes = 'Standard calculation applied.';
        }

        // --- Display Results ---
        resultTitle.innerHTML = `<i class="fas ${isDeathCalc ? 'fa-skull-crossbones' : 'fa-hand-holding-usd'}"></i> ${isDeathCalc ? 'Death' : 'Maturity'} Benefit Results`;
        totalBenefitResult.textContent = `₹ ${totalBenefit.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
        premiumsPaidResult.textContent = `₹ ${totalPremiumsPaid.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
        sumAssuredResult.textContent = `₹ ${sa.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

        // Dynamic Label for Bonus/GA
        const bonusLabel = document.querySelector('#bonusResult').previousElementSibling; // selecting the label <p>
        if (['735', '749', '752', '867', '873', '886'].includes(planId)) {
            if (bonusLabel) bonusLabel.textContent = "Growth / Additions:";
        } else if (['880', '881', '774', '760', '748', '883', '771'].includes(planId)) {
             if (bonusLabel) bonusLabel.textContent = "Guaranteed Additions:";
        } else {
             if (bonusLabel) bonusLabel.textContent = "Vested Bonus + FAB:";
        }
        
        bonusResult.textContent = `₹ ${(totalBonus + finalBonus).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

        resultNotes.innerHTML = notes ? `<i class="fas fa-info-circle"></i> ${notes}` : '';
        resultsContainer.style.display = 'block';
        setTimeout(() => { resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 100);
    }
// --- Event Listeners ---
    planSelector.addEventListener('change', () => {
        displayPlanDetails(planSelector.value);
        updatePolicyInputUI(); // <--- NEW: Populates the Policy Term dropdown based on plan
        resultsContainer.style.display = 'none'; 
    });

    // NEW LISTENER: Triggers auto-fill of PPT when Policy Term is selected
    policyTermInput.addEventListener('change', () => {
        autoFillPPT(); 
    });
    
    deathBenefitToggle.addEventListener('change', () => {
        deathDateGroup.style.display = deathBenefitToggle.checked ? 'block' : 'none';
    });

    calculateBtn.addEventListener('click', calculateBenefits);

    // --- Initial Setup ---
    populatePlanSelector();
});