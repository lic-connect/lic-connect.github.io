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
'880': { 
    name: "LIC's Jan Suraksha", 
    type: 'Micro Insurance', 
    summary: "A Non-Par, Non-linked, Life Micro Insurance plan providing protection and savings for low-income groups with fixed Guaranteed Additions.", 
    benefits: { 
        onDeath: "Sum Assured on Death + Accrued Guaranteed Additions. 'Sum Assured on Death' is higher of 7 times of Annualised Premium or Basic Sum Assured (subject to minimum 105% of total premiums paid).", 
        onSurvival: "Basic Sum Assured + Accrued Guaranteed Additions. (Note: Guaranteed Additions accrue at a fixed rate of 4% of total annualized premiums each year)." 
    }, 
    rules: { death: 'sa_plus_ga', maturity: 'sa_plus_ga' } 
},

'881': { 
    name: "LIC's Bima Lakshmi", 
    type: 'Money Back / Savings', 
    summary: "A Non-Par, Female-only Savings Plan offering Life Cover and flexible Survival Benefits via 3 options (A, B, or C) with fixed Guaranteed Additions.", 
    benefits: { 
        onDeath: "Sum Assured on Death + Accrued Guaranteed Additions. 'Sum Assured on Death' is higher of Basic Sum Assured or 10 times of Tabular Annual Premium adjusted by modal factor.", 
        onSurvival: "Maturity: Basic Sum Assured + Accrued Guaranteed Additions. Survival Benefits: Paid based on chosen option (Option A: 50% SA at end of PPT; Option B: 7.5% SA every 2 years; Option C: 15% SA every 4 years)." 
    }, 
    rules: { death: 'sa_plus_ga', maturity: 'sa_plus_ga' } 
},
        
        // Whole Life Plans
        '745': { name: "LIC's Jeevan Umang", type: 'Whole Life', summary: "A non-linked, with-profits whole life plan with survival benefits.", benefits: { onDeath: "Sum Assured on Death + Bonuses. Death benefit not less than 105% of premiums paid.", onSurvival: "8% of Basic SA annually after PPT. At maturity (age 100) or death, Basic SA + Bonuses + FAB is paid." }, rules: { death: 'standard_death_bonus', maturity: 'sa_plus_bonus' } },
        '771': { name: "LIC's Jeevan Utsav", type: 'Whole Life', summary: "A whole life plan with guaranteed additions and lifetime guaranteed income.", benefits: { onDeath: "Sum Assured on Death + Guaranteed Additions.", onSurvival: "10% of Basic SA as annual income for life. On maturity (age 100), SA + GAs." }, rules: { death: 'ga_death_40', maturity: 'ga_maturity_40_income' } },
 '883': { 
            name: "LIC's Jeevan Utsav Single Premium", 
            type: 'Whole Life', 
            summary: "Single Premium plan with Guaranteed Additions of ₹40 per 1000 SA.", 
            benefits: { 
                onDeath: "Higher of BSA or 1.25x SP + Accrued GAs.", 
                onSurvival: "Maturity (Age 100): Higher of SA or 1.25x SP + Accrued GAs." 
            }, 
            rules: { death: 'utsav_sp', maturity: 'utsav_sp' } 
        },
        // Money Back Plans
        '748': { name: "LIC’s Bima Shree", type: 'Money Back', summary: "A limited premium money back plan for HNI with Guaranteed Additions.", benefits: { onDeath: "Sum Assured on Death + Accrued GA.", onSurvival: "Periodic survival benefits. At maturity, remaining SA + GA + Loyalty Addition." }, rules: { death: 'ga_death', maturity: 'money_back_ga' } },
        '720': { name: "LIC's New Money Back Plan-20 Yrs", type: 'Money Back', summary: "A 20-year money back plan with periodic payouts.", benefits: { onDeath: "Sum Assured on Death (125% of SA or 7x AP) + Bonuses. Not less than 105% of premiums.", onSurvival: "20% of SA at years 5, 10, 15. At maturity (year 20), 40% of SA + Bonuses." }, rules: { death: 'mb_death', maturity: 'money_back_bonus_20' } },
        '721': { name: "LIC's New Money Back Plan-25 Yrs", type: 'Money Back', summary: "A 25-year money back plan with periodic payouts.", benefits: { onDeath: "Sum Assured on Death (125% of SA or 7x AP) + Bonuses. Not less than 105% of premiums.", onSurvival: "15% of SA at years 5, 10, 15, 20. At maturity (year 25), 40% of SA + Bonuses." }, rules: { death: 'mb_death', maturity: 'money_back_bonus_25' } },
        '732': { name: "LIC's New Children's Money Back Plan", type: 'Money Back', summary: "A money back plan for children, with payouts at specific ages.", benefits: { onDeath: "Sum Assured on Death + Bonuses.", onSurvival: "20% of SA at ages 18, 20, 22. At maturity (age 25), 40% of SA + Bonuses." }, rules: { death: 'standard_death_bonus', maturity: 'money_back_bonus_child' } },

//ULIP PLANS
'735': { 
    name: "LIC's New Endowment Plus", 
    type: 'Unit Linked (ULIP)', 
    summary: "A regular premium, unit-linked plan combining insurance and market-linked wealth creation.", 
    benefits: { 
      onDeath: "Before Risk Commencement: Unit Fund Value. After Risk Commencement: Highest of (Basic Sum Assured less partial withdrawals, Unit Fund Value, or 105% of total premiums received).", 
      onSurvival: "Unit Fund Value as on the Date of Maturity." 
    }, 
    rules: { death: 'ulip_risk_logic', maturity: 'fund_value_only' } 
  },

  '749': { 
    name: "LIC's Nivesh Plus", 
    type: 'Single Premium ULIP', 
    summary: "A single premium unit-linked plan offering two types of death cover options and guaranteed additions.", 
    benefits: { 
      onDeath: "Before Risk Commencement: Unit Fund Value. After Risk Commencement: Higher of (Basic Sum Assured less partial withdrawals or Unit Fund Value).", 
      onSurvival: "Unit Fund Value + Guaranteed Additions." 
    }, 
    rules: { death: 'single_premium_ulip_logic', maturity: 'fund_value_plus_ga' } 
  },

  '752': { 
    name: "LIC's SIIP", 
    type: 'Unit Linked (ULIP)', 
    summary: "A systematic investment plan providing life cover and a unique refund of mortality charges feature.", 
    benefits: { 
      onDeath: "Before Risk Commencement: Unit Fund Value. After Risk Commencement: Highest of (Basic Sum Assured less partial withdrawals, Unit Fund Value, or 105% of total premiums received).", 
      onSurvival: "Unit Fund Value + Refund of Mortality Charges + Guaranteed Additions." 
    }, 
    rules: { death: 'ulip_risk_logic', maturity: 'fund_value_plus_refund_plus_ga' } 
  },

  '867': { 
    name: "LIC's New Pension Plus", 
    type: 'Unit Linked Pension', 
    summary: "A unit-linked individual pension plan designed to build a retirement corpus through market growth.", 
    benefits: { 
      onDeath: "Higher of (Unit Fund Value or 105% of total premiums received). Proceeds must be used for annuity as per IRDAI rules.", 
      onSurvival: "Vesting Benefit: Unit Fund Value (utilized to purchase annuity, with up to 60% commutation allowed)." 
    }, 
    rules: { death: 'pension_ulip_logic', maturity: 'vesting_annuitisation' } 
  },

  '873': { 
    name: "LIC's Index Plus", 
    type: 'Unit Linked (ULIP)', 
    summary: "A unit-linked plan specifically investing in NSE Nifty 50 or Nifty 100 indices.", 
    benefits: { 
      onDeath: "Before Risk Commencement: Unit Fund Value. After Risk Commencement: Highest of (Basic Sum Assured less partial withdrawals, Unit Fund Value, or 105% of total premiums received).", 
      onSurvival: "Unit Fund Value + Refund of Mortality Charges + Guaranteed Additions." 
    }, 
    rules: { death: 'ulip_risk_logic', maturity: 'fund_value_plus_refund_plus_ga' } 
  },

  '886': { 
    name: "LIC's Protection Plus", 
    type: 'Unit Linked (ULIP)', 
    summary: "A high-cover unit-linked savings plan with flexible premium terms and mortality charge refund.", 
    benefits: { 
      onDeath: "Highest of (Basic Sum Assured, Unit Fund Value, or 105% of total premiums received).", 
      onSurvival: "Base Premium Fund Value + Top-up Fund Value + Refund of Mortality Charges." 
    }, 
    rules: { death: 'high_cover_ulip_logic', maturity: 'fund_value_plus_refund' } 
  },
        
        // Term Assurance Plans
'887': { 
    name: "LIC's Bima Kavach", 
    type: 'Term', 
    summary: "A high-value pure risk, non-linked, non-participating plan with options for Increasing Sum Assured and cover up to age 100.", 
    benefits: { 
        onDeath: "Sum Assured on Death is paid (Level or Increasing SA depending on the option chosen).", 
        onSurvival: "No maturity benefit is payable." 
    }, 
    rules: { 
        death: '887_logic', 
        maturity: 'term_plan' 
    } 
  },
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
        
        // For participating plans: Reversionary Bonus Rate. 
        // For Non-Par plans: Use this field as Guaranteed Addition Rate per 1000 SA.
        const bonusRate = parseFloat(bonusRateInput.value) || 0; 
        const fabRate = parseFloat(fabRateInput.value) || 0;
        
        if (sa === 0 || term === 0 || ppt === 0 || annualPremium === 0) {
            alert('Please fill in Sum Assured, Term, PPT, and Annual Premium.');
            return;
        }

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
        resultsContainer.style.display = 'none'; // Hide old results
    });
    
    deathBenefitToggle.addEventListener('change', () => {
        deathDateGroup.style.display = deathBenefitToggle.checked ? 'block' : 'none';
    });

    calculateBtn.addEventListener('click', calculateBenefits);

    // --- Initial Setup ---
    populatePlanSelector();
});