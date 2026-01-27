document.addEventListener('DOMContentLoaded', function () {
    
    // --- DATA STORE: All plan details parsed from your .txt files ---
    // Note: This is a simplified, structured representation for calculation purposes.
  // --- DATA STORE: All 40 Plans with Corrected Ranges & Validation ---
    const planData = {
        // === ENDOWMENT & SAVINGS ===
        '714': { 
            name: "New Endowment", type: 'Endowment', 
            benefits: { onDeath: "Sum Assured + Bonus + FAB", onSurvival: "SA + Bonus + FAB" }, 
            rules: { death: 'standard_death_bonus', maturity: 'sa_plus_bonus' },
            minTerm: 12, maxTerm: 35, calcPPT: (t) => t // PPT equals Term
        },
        '715': { 
            name: "Jeevan Anand", type: 'Endowment', 
            benefits: { onDeath: "125% SA + Bonus", onSurvival: "SA + Bonus" }, 
            rules: { death: 'ja_death', maturity: 'sa_plus_bonus' },
            minTerm: 15, maxTerm: 35, calcPPT: (t) => t 
        },
        '717': { 
            name: "Single Premium Endowment", type: 'Single Premium', 
            benefits: { onDeath: "SA + Bonus", onSurvival: "SA + Bonus" }, 
            rules: { death: 'standard_death_bonus', maturity: 'sa_plus_bonus' },
            minTerm: 10, maxTerm: 25, calcPPT: (t) => 1 // Single Pay
        },
        '733': { 
            name: "Jeevan Lakshya", type: 'Endowment', 
            benefits: { onDeath: "Income + 110% SA + Bonus", onSurvival: "SA + Bonus" }, 
            rules: { death: 'jeevan_lakshya', maturity: 'sa_plus_bonus' },
            minTerm: 13, maxTerm: 25, calcPPT: (t) => t - 3 // PPT is Term - 3
        },
        '734': { 
            name: "Jeevan Tarun", type: 'Money Back', 
            benefits: { onDeath: "125% SA + Bonus", onSurvival: "Survival % Options" }, 
            rules: { death: 'standard_death_bonus', maturity: 'money_back_bonus_child' },
            minTerm: 13, maxTerm: 25, calcPPT: (t) => t - 5 // Approx logic for child plan
        },
        '736': { 
            name: "Jeevan Labh", type: 'Endowment', 
            benefits: { onDeath: "SA + Bonus", onSurvival: "SA + Bonus" }, 
            rules: { death: 'standard_death_bonus', maturity: 'sa_plus_bonus' },
            allowedTerms: [16, 21, 25], 
            pptMap: { 16: 10, 21: 15, 25: 16 } 
        },
        '751': { 
            name: "Micro Bachat", type: 'Micro Insurance', 
            benefits: { onDeath: "SA + Loyalty", onSurvival: "SA + Loyalty" }, 
            rules: { death: 'standard_death_bonus', maturity: 'sa_plus_bonus' },
            minTerm: 10, maxTerm: 15, calcPPT: (t) => t 
        },
        '760': { 
            name: "Bima Jyoti", type: 'Endowment', 
            benefits: { onDeath: "SA + GA", onSurvival: "SA + GA" }, 
            rules: { death: 'ga_death_50', maturity: 'ga_maturity_50' },
            minTerm: 15, maxTerm: 20, calcPPT: (t) => t - 5 
        },
        '764': { 
            name: "Bima Ratna", type: 'Money Back', 
            benefits: { onDeath: "125% SA + GA", onSurvival: "Money Back + GA" }, 
            rules: { death: 'ga_death_50', maturity: 'money_back_ga' },
            allowedTerms: [15, 20, 25],
            pptMap: { 15: 11, 20: 16, 25: 21 }
        },
        '768': { 
            name: "Jeevan Azad", type: 'Endowment', 
            benefits: { onDeath: "SA", onSurvival: "SA" }, 
            rules: { death: 'sa_only', maturity: 'sa_only' },
            minTerm: 15, maxTerm: 20, calcPPT: (t) => t - 8 
        },
        '774': {
            name: "Amritbaal", type: 'Endowment',
            benefits: { onDeath: "SA + GA", onSurvival: "SA + GA" },
            rules: { death: 'ga_death', maturity: 'ga_maturity' },
            minTerm: 5, maxTerm: 25, pptMin: 1, pptMax: 7 // 1 is Single Premium
        },
        '880': { 
            name: "Jan Suraksha", type: 'Micro Insurance', 
            benefits: { onDeath: "Higher of 7x AP or BSA + GA", onSurvival: "BSA + GA" }, 
            rules: { death: 'sa_plus_ga', maturity: 'sa_plus_ga' },
            minSA: 100000, maxSA: 200000,
            allowedTerms: [12, 13, 14, 15, 16, 17, 18, 19, 20], 
            calcPPT: (t) => t - 5
        },
        '881': { 
            name: "Bima Lakshmi", type: 'Money Back', 
            benefits: { onDeath: "SA + GA", onSurvival: "Option A/B/C" }, 
            rules: { death: 'sa_plus_ga', maturity: 'sa_plus_ga' },
            minSA: 200000,
            allowedTerms: [25], 
            pptMin: 7, pptMax: 15
        },
        '911': {
            name: "Nav Jeevan Shree SP", type: 'Single Premium',
            benefits: { onDeath: "SA + Loyalty", onSurvival: "SA + Loyalty" },
            rules: { death: 'standard_death_bonus', maturity: 'sa_plus_bonus' },
            minTerm: 10, maxTerm: 25, calcPPT: (t) => 1
        },
        '912': {
            name: "Nav Jeevan Shree", type: 'Endowment',
            benefits: { onDeath: "SA + Loyalty", onSurvival: "SA + Loyalty" },
            rules: { death: 'standard_death_bonus', maturity: 'sa_plus_bonus' },
            minTerm: 10, maxTerm: 25, calcPPT: (t) => t
        },

        // --- MONEY BACK ---
        '720': { 
            name: "Money Back 20 Yrs", type: 'Money Back', 
            rules: { death: 'mb_death', maturity: 'money_back_bonus_20' },
            allowedTerms: [20], calcPPT: (t) => 15 
        },
        '721': { 
            name: "Money Back 25 Yrs", type: 'Money Back', 
            rules: { death: 'mb_death', maturity: 'money_back_bonus_25' },
            allowedTerms: [25], calcPPT: (t) => 20 
        },
        '732': { 
            name: "Children's Money Back", type: 'Money Back', 
            rules: { death: 'standard_death_bonus', maturity: 'money_back_bonus_child' },
            allowedTerms: [25], calcPPT: (t) => t // PPT is usually term or waived
        },
        '748': { 
            name: "Bima Shree", type: 'Money Back', 
            benefits: { onDeath: "125% SA + GA", onSurvival: "Money Back" }, 
            rules: { death: 'ga_death', maturity: 'money_back_ga' },
            minSA: 1000000,
            allowedTerms: [14, 16, 18, 20, 24, 28],
            calcPPT: (t) => t - 4 
        },

        // --- WHOLE LIFE ---
        '745': { 
            name: "Jeevan Umang", type: 'Whole Life', 
            rules: { death: 'standard_death_bonus', maturity: 'sa_plus_bonus' },
            minTerm: 15, maxTerm: 55, pptMin: 15, pptMax: 30 
        },
        '771': { 
            name: "Jeevan Utsav", type: 'Whole Life', 
            rules: { death: 'ga_death_40', maturity: 'ga_maturity_40_income' },
            minTerm: 100, maxTerm: 100, pptMin: 5, pptMax: 16 
        },
        '883': { 
            name: "Jeevan Utsav SP", type: 'Whole Life', 
            rules: { death: 'utsav_sp', maturity: 'utsav_sp' },
            minTerm: 100, maxTerm: 100, calcPPT: (t) => 1 
        },

        // --- TERM ASSURANCE ---
        '887': { name: "Bima Kavach", type: 'Term', rules: { death: '887_logic', maturity: 'term_plan' }, minTerm: 10, maxTerm: 40, calcPPT: (t) => t },
        '955': { name: "Jeevan Amar", type: 'Term', rules: { death: 'term_plan', maturity: 'term_plan' }, minTerm: 10, maxTerm: 40, calcPPT: (t) => t },
        '859': { name: "Saral Jeevan Bima", type: 'Term', rules: { death: 'term_plan', maturity: 'term_plan' }, minTerm: 5, maxTerm: 40, calcPPT: (t) => t },
        '875': { name: "Yuva Term", type: 'Term', rules: { death: 'term_plan', maturity: 'term_plan' }, minTerm: 15, maxTerm: 40, calcPPT: (t) => t },
        '876': { name: "Digi Term", type: 'Term', rules: { death: 'term_plan', maturity: 'term_plan' }, minTerm: 10, maxTerm: 40, calcPPT: (t) => t },
        '954': { name: "New Tech Term", type: 'Term', rules: { death: 'term_plan', maturity: 'term_plan' }, minTerm: 10, maxTerm: 40, calcPPT: (t) => t },
        // Credit Life (Decreasing Term)
        '877': { name: "Yuva Credit Life", type: 'Term', rules: { death: 'term_plan', maturity: 'term_plan' }, minTerm: 5, maxTerm: 30, calcPPT: (t) => t },
        '878': { name: "Digi Credit Life", type: 'Term', rules: { death: 'term_plan', maturity: 'term_plan' }, minTerm: 5, maxTerm: 30, calcPPT: (t) => t },

        // --- ULIP ---
        '735': { name: "Endowment Plus", type: 'ULIP', rules: { death: 'ulip_risk_logic', maturity: 'fund_value_only' }, minTerm: 10, maxTerm: 20, calcPPT: (t) => t },
        '749': { name: "Nivesh Plus", type: 'ULIP', rules: { death: 'single_premium_ulip_logic', maturity: 'fund_value_plus_ga' }, minTerm: 10, maxTerm: 25, calcPPT: (t) => 1 },
        '752': { name: "SIIP", type: 'ULIP', rules: { death: 'ulip_risk_logic', maturity: 'fund_value_plus_refund_plus_ga' }, minTerm: 10, maxTerm: 25, calcPPT: (t) => t },
        '867': { name: "New Pension Plus", type: 'Pension', rules: { death: 'pension_ulip_logic', maturity: 'vesting_annuitisation' }, minTerm: 10, maxTerm: 42, calcPPT: (t) => t },
        '873': { name: "Index Plus", type: 'ULIP', rules: { death: 'ulip_risk_logic', maturity: 'fund_value_only' }, minTerm: 10, maxTerm: 25, calcPPT: (t) => t },
        '886': { name: "Protection Plus", type: 'ULIP', rules: { death: 'high_cover_ulip_logic', maturity: 'fund_value_plus_refund' }, minTerm: 10, maxTerm: 40, calcPPT: (t) => t },

        // --- PENSION / ANNUITY ---
        '758': { name: "Jeevan Shanti", type: 'Pension', rules: { death: 'pension', maturity: 'pension' }, minTerm: 1, maxTerm: 12, calcPPT: (t) => 1 }, // Deferment Period
        '857': { name: "Jeevan Akshay VII", type: 'Pension', rules: { death: 'pension', maturity: 'pension' }, minTerm: 0, maxTerm: 0, calcPPT: (t) => 1 }, // Immediate
        '862': { name: "Saral Pension", type: 'Pension', rules: { death: 'pension', maturity: 'pension' }, minTerm: 0, maxTerm: 0, calcPPT: (t) => 1 }, // Immediate
        '879': { name: "Smart Pension", type: 'Pension', rules: { death: 'pension', maturity: 'pension' }, minTerm: 0, maxTerm: 0, calcPPT: (t) => 1 }, // Immediate
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