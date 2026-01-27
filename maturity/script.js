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
            summary: "Child plan. Calculator assumes Option 4 (15% SB).",
            benefits: { onDeath: "125% SA + Bonus", onSurvival: "Survival Benefits + Maturity" },
            // NEW RULE:
            rules: { death: 'death_125_plus_bonus', maturity: 'money_back_bonus_child' },
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
            summary: "Single Premium ULIP.",
            benefits: { onDeath: "Higher of SA or Fund Value", onSurvival: "Fund Value" },
            // NEW RULE:
            rules: { death: 'ulip_death_higher', maturity: 'fund_value_only' }, 
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
   '752': { 
            name: "SIIP", type: 'ULIP', 
            summary: "ULIP with Mortality Refund.",
            benefits: { onDeath: "Higher of SA or Fund Value", onSurvival: "Fund Value + Refund" },
            // NEW RULE:
            rules: { death: 'ulip_death_higher', maturity: 'fund_value_plus_refund_plus_ga' },
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
            summary: "Whole Life with 10% Income.",
            benefits: { onDeath: "Sum Assured + Accrued GA", onSurvival: "Income + Maturity" },
            // NEW RULE:
            rules: { death: 'sa_plus_ga_accrued', maturity: 'ga_maturity_40_income' },
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
            summary: "Women-only plan.",
            benefits: { onDeath: "Sum Assured + Accrued GA", onSurvival: "SA + GA" },
            // NEW RULE:
            rules: { death: 'sa_plus_ga_accrued', maturity: 'sa_plus_ga' },
            minTerm: 10, maxTerm: 25, allowedTerms: [25], pptMin: 7, pptMax: 15
        },
        // 34. Jeevan Utsav SP
     '883': { 
            name: "Jeevan Utsav SP", type: 'Whole Life', 
            summary: "Single Premium Whole Life.",
            benefits: { onDeath: "Higher of (SA, 1.25x Premium) + GA", onSurvival: "Income + Maturity" },
            // NEW RULE:
            rules: { death: 'utsav_sp_death', maturity: 'utsav_sp' },
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
            summary: "Term Plan. Assumes Increasing SA Option for Death Benefit.",
            benefits: { onDeath: "Sum Assured (Increasing Logic)", onSurvival: "Nil" },
            // NEW RULE:
            rules: { death: 'term_increasing_logic', maturity: 'term_no_maturity' },
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
            summary: "Online Term Plan. Pure Risk.",
            benefits: { onDeath: "Basic Sum Assured", onSurvival: "Nil" },
            // NEW RULE:
            rules: { death: 'term_sa_only', maturity: 'term_no_maturity' }, 
            minTerm: 10, maxTerm: 40, calcPPT: (t) => t 
        },
        // 40. Jeevan Amar
'955': { 
            name: "Jeevan Amar", type: 'Term', 
            summary: "Offline Term Plan. Pure Risk.",
            benefits: { onDeath: "Basic Sum Assured", onSurvival: "Nil" },
            // NEW RULE:
            rules: { death: 'term_sa_only', maturity: 'term_no_maturity' }, 
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
            // 1. TERM ASSURANCE PLANS (Pure Risk)
            // ============================================================
            case 'term_sa_only': // 954, 955, 875, 876, 859
                totalBenefit = sa;
                notes = "Death Benefit is equal to the Basic Sum Assured.";
                break;

            case 'term_increasing_logic': // 887 Bima Kavach
                // Logic: Level SA for first 5 years. From 6th to 15th year, SA increases by 10% p.a.
                if (completedYears <= 5) {
                    totalBenefit = sa;
                } else if (completedYears <= 15) {
                    // e.g. Year 6 = SA + 10%
                    let increase = (completedYears - 5) * 0.10 * sa;
                    totalBenefit = sa + increase;
                } else {
                    // From 16th year onwards, SA doubles
                    totalBenefit = 2 * sa;
                }
                notes = "Death Benefit includes Increasing Sum Assured (10% increase from Year 6 to 15).";
                break;

            case 'term_no_maturity':
                totalBenefit = 0;
                notes = "This is a Pure Risk Term Plan. No Maturity Benefit is payable.";
                break;

            // ============================================================
            // 2. ULIP & PENSION PLANS (Market Linked)
            // ============================================================
            case 'ulip_death_higher': // 749, 752, 867 etc.
                // Simplified Fund Value Calculation
                // Rate input is treated as % Growth (e.g. 8%)
                let growth = (bonusRate - 1.5) / 100; // Approx deduction for charges
                let fundVal = 0;
                
                if (ppt === 1) {
                    // Single Premium Compounding
                    fundVal = annualPremium * Math.pow(1 + growth, completedYears);
                } else {
                    // Regular Premium Future Value Formula
                    // FV = P * [(1+r)^n - 1] / r
                    if (growth !== 0) {
                        let investedYears = Math.min(completedYears, ppt); // Premiums stopped after PPT
                        let corpusAtStop = annualPremium * ((Math.pow(1 + growth, investedYears) - 1) / growth);
                        // If policy continues after PPT, corpus grows
                        let remainingYears = completedYears - investedYears;
                        if (remainingYears > 0) {
                            fundVal = corpusAtStop * Math.pow(1 + growth, remainingYears);
                        } else {
                            fundVal = corpusAtStop;
                        }
                    } else {
                        fundVal = totalPremiumsPaid;
                    }
                }
                
                // Death Benefit is usually Higher of SA or Fund Value
                totalBenefit = Math.max(sa, fundVal);
                notes = "Death Benefit is Higher of Basic Sum Assured or Estimated Fund Value.";
                break;

            case 'fund_value_only': // 735, 873
            case 'fund_value_plus_ga': // 749 Maturity
            case 'fund_value_plus_refund': // 886
            case 'fund_value_plus_refund_plus_ga': // 752
                // Reuse Fund Value Logic
                let mGrowth = (bonusRate - 1.5) / 100;
                let matFundVal = 0;
                if (ppt === 1) {
                    matFundVal = annualPremium * Math.pow(1 + mGrowth, completedYears);
                } else {
                    let invYears = Math.min(completedYears, ppt);
                    let corp = annualPremium * ((Math.pow(1 + mGrowth, invYears) - 1) / mGrowth);
                    matFundVal = corp * Math.pow(1 + mGrowth, (completedYears - invYears));
                }
                
                // Add GA for specific plans (Simplified estimation using FAB input)
                let gaAmt = 0;
                if (rule.includes('plus_ga')) gaAmt = (sa * (fabRate/1000));
                
                totalBenefit = matFundVal + gaAmt;
                notes = "Maturity Benefit based on Estimated Fund Value.";
                break;

            case 'vesting_annuitisation': // 867
                // Same Fund Value Logic
                let pGrowth = (bonusRate - 1.5) / 100;
                let pFund = annualPremium * ((Math.pow(1 + pGrowth, completedYears) - 1) / pGrowth);
                totalBenefit = pFund;
                notes = "Vesting Benefit (Corpus) used to purchase Annuity.";
                break;
            
            case 'pension_ulip_logic': // 867 Death
                // Higher of Fund Value or 105% Premiums
                let dGrowth = (bonusRate - 1.5) / 100;
                let dFund = annualPremium * ((Math.pow(1 + dGrowth, completedYears) - 1) / dGrowth);
                totalBenefit = Math.max(dFund, 1.05 * totalPremiumsPaid);
                notes = "Higher of Fund Value or 105% of Total Premiums Paid.";
                break;

            // ============================================================
            // 3. SPECIAL PLANS (Jeevan Tarun, Utsav, etc.)
            // ============================================================
            case 'death_125_plus_bonus': // 734 Jeevan Tarun
                totalBonus = (sa / 1000) * bonusRate * completedYears;
                finalBonus = (sa / 1000) * fabRate;
                totalBenefit = (1.25 * sa) + totalBonus + finalBonus;
                notes = "125% of Sum Assured + Vested Bonus + FAB.";
                break;

            case 'money_back_bonus_child': // 734 Maturity
                // 734 Option 4 Maturity is 25% SA + Bonus
                // Standard Child MB 732 is 40% + Bonus
                let matPct = (planId === '734') ? 0.25 : 0.40;
                totalBonus = (sa / 1000) * bonusRate * completedYears;
                finalBonus = (sa / 1000) * fabRate;
                totalBenefit = (sa * matPct) + totalBonus + finalBonus;
                notes = `Maturity: ${matPct*100}% of SA + Vested Bonus + FAB.`;
                break;

            case 'sa_plus_ga_accrued': // 771, 881, 748, 774, 880 (Death)
                // Simply SA + GA. No 7x Premium check to avoid confusion.
                totalBonus = (sa / 1000) * bonusRate * completedYears;
                totalBenefit = sa + totalBonus;
                notes = "Sum Assured + Accrued Guaranteed Additions.";
                break;
            
            case 'ga_maturity': // 774
            case 'sa_plus_ga': // 880, 881 (Maturity)
                totalBonus = (sa / 1000) * bonusRate * completedYears;
                totalBenefit = sa + totalBonus;
                break;

            case 'ga_maturity_40_income': // 771 Maturity
                // GA (40/1000) accrues during PPT only
                totalBonus = (sa / 1000) * 40 * ppt; 
                totalBenefit = sa + totalBonus;
                notes = "Basic SA + GA (accrued during PPT). Plus 10% Lifetime Income starts.";
                break;

            case 'ga_maturity_50': // 760, 764
                totalBonus = (sa / 1000) * 50 * completedYears;
                totalBenefit = sa + totalBonus;
                break;

            case 'ga_death_50': // 760, 764
                totalBonus = (sa / 1000) * 50 * completedYears;
                // Death is 125% SA for these plans
                totalBenefit = (1.25 * sa) + totalBonus;
                break;

            case 'utsav_sp_death': // 883 SP Death
                totalBonus = (sa / 1000) * 40 * completedYears;
                // Higher of SA or 1.25x Single Premium
                let riskBase = Math.max(sa, 1.25 * annualPremium);
                totalBenefit = riskBase + totalBonus;
                notes = "Higher of (Basic SA or 1.25x Single Premium) + GA.";
                break;

             case 'utsav_sp': // 883 SP Maturity
                totalBonus = (sa / 1000) * 40 * completedYears;
                totalBenefit = sa + totalBonus;
                break;

            // ============================================================
            // 4. STANDARD ENDOWMENT & MONEY BACK (Bonus Based)
            // ============================================================
            case 'standard_death_bonus': // 714, 736, 745, 911, 912
                totalBonus = (sa / 1000) * bonusRate * completedYears;
                finalBonus = (sa / 1000) * fabRate;
                // Strictly Higher of SA or 7x Premium as per IRDAI, but user prefers SA visualization
                // We will use Max(SA, 7xAP) for accuracy, but note it.
                // 717 is Single Premium, so 7x doesn't apply (it is usually SA or 1.25x)
                let baseDeath = sa;
                if (planId !== '717') baseDeath = Math.max(sa, 7 * annualPremium);
                
                totalBenefit = baseDeath + totalBonus + finalBonus;
                notes = "Higher of (Basic SA or 7x Annual Premium) + Vested Bonus + FAB.";
                break;

            case 'sa_plus_bonus': // Standard Maturity
                totalBonus = (sa / 1000) * bonusRate * completedYears;
                finalBonus = (sa / 1000) * fabRate;
                totalBenefit = sa + totalBonus + finalBonus;
                break;

            case 'ja_death': // 715 Jeevan Anand
                totalBonus = (sa / 1000) * bonusRate * completedYears;
                finalBonus = (sa / 1000) * fabRate;
                totalBenefit = (1.25 * sa) + totalBonus + finalBonus;
                notes = "125% of Basic SA + Vested Bonus + FAB.";
                break;

            case 'jeevan_lakshya': // 733 Death
                 // 110% SA is paid at maturity, not on death. 
                 // On death, Income starts. We show the lump sum equivalent here? 
                 // The prompt implies straightforward calculation.
                 // Death Benefit usually implies what is payable *eventually* or immediate?
                 // Lakshya: Immediate = Nil (Income starts). Maturity = 110% SA + Bonus.
                 // We will calculate the Total Value payable at Maturity.
                totalBonus = (sa / 1000) * bonusRate * term; // Bonus continues till maturity
                finalBonus = (sa / 1000) * fabRate;
                totalBenefit = (1.10 * sa) + totalBonus + finalBonus;
                notes = "On Death: 10% Income p.a. till maturity. At Maturity: 110% SA + Bonus + FAB.";
                break;

            case 'mb_death': // 720, 721
                totalBonus = (sa / 1000) * bonusRate * completedYears;
                finalBonus = (sa / 1000) * fabRate;
                totalBenefit = (1.25 * sa) + totalBonus + finalBonus;
                notes = "125% of Basic SA + Vested Bonus + FAB.";
                break;

            case 'money_back_bonus_20': // 720 Maturity
                // 40% SA + Bonus
                totalBonus = (sa / 1000) * bonusRate * completedYears;
                finalBonus = (sa / 1000) * fabRate;
                totalBenefit = (0.40 * sa) + totalBonus + finalBonus;
                break;
            
            case 'money_back_bonus_25': // 721 Maturity
                // 40% SA + Bonus
                totalBonus = (sa / 1000) * bonusRate * completedYears;
                finalBonus = (sa / 1000) * fabRate;
                totalBenefit = (0.40 * sa) + totalBonus + finalBonus;
                break;

            case 'money_back_ga': // 748 Maturity
                // Balance SA + GA + Loyalty
                // For 748, Balance SA depends on term.
                // Simplified: Total Accrued GA + Loyalty. 
                // Actual money back payouts happened earlier.
                // We will show "Maturity Lumpsum"
                let bimaShreeMap = {14:0.4, 16:0.3, 18:0.2, 20:0.1, 24:0.1, 28:0.1}; // % SA remaining
                let balancePct = bimaShreeMap[term] || 0.1; 
                
                totalBonus = (sa / 1000) * bonusRate * completedYears; // GA
                finalBonus = (sa / 1000) * fabRate; // Loyalty
                totalBenefit = (sa * balancePct) + totalBonus + finalBonus;
                notes = `Maturity: ${balancePct*100}% of SA + Accrued GA + Loyalty.`;
                break;

            // ============================================================
            // 5. OTHERS / DEFAULTS
            // ============================================================
            case 'sa_only': // 768
                totalBenefit = sa;
                notes = "Non-Participating Plan. Basic Sum Assured Only.";
                break;
            
            case 'pension': // 758, 857, etc
                totalBenefit = 0;
                notes = "Annuity Plan: Benefit depends on Option chosen (e.g. Return of Purchase Price).";
                if(ppt === 1 && rule === 'death') totalBenefit = annualPremium; // Return of SP
                break;

            default:
                totalBenefit = sa;
                notes = "Standard calculation applied.";
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