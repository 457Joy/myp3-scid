document.getElementById('analyze-btn').addEventListener('click', analyzeEssay);

function analyzeEssay() {
    const essayText = document.getElementById('essay-text').value.trim();
    
    if (!essayText) {
        alert('Please paste your essay before analyzing.');
        return;
    }
    
    // Estimate scores for each criterion
    const resultI = estimateCriterionI(essayText);
    const resultII = estimateCriterionII(essayText);
    const resultIII = estimateCriterionIII(essayText);
    const resultIV = estimateCriterionIV(essayText);
    
    // Update the UI with estimated scores and feedback
    updateCriterionUI('i', resultI);
    updateCriterionUI('ii', resultII);
    updateCriterionUI('iii', resultIII);
    updateCriterionUI('iv', resultIV);
    
    // Calculate total score
    const totalScore = resultI.score + resultII.score + resultIII.score + resultIV.score;
    document.getElementById('total-score').textContent = totalScore;
    
    // Generate overall feedback
    generateOverallFeedback([resultI, resultII, resultIII, resultIV], totalScore, essayText);
    
    // Show results section
    document.getElementById('results-section').style.display = 'block';
}

function updateCriterionUI(criterion, result) {
    document.getElementById(`score-${criterion}`).textContent = result.score;
    
    // Create detailed feedback with color coding
    let feedbackHTML = '<div class="feedback-details">';
    
    // Strengths in green
    if (result.strengths.length > 0) {
        feedbackHTML += '<div class="strengths-section">';
        feedbackHTML += '<strong>✅ Strengths:</strong><ul>';
        result.strengths.forEach(strength => {
            feedbackHTML += `<li class="strength-item">${strength}</li>`;
        });
        feedbackHTML += '</ul></div>';
    }
    
    // Improvements in orange
    if (result.improvements.length > 0) {
        feedbackHTML += '<div class="improvements-section">';
        feedbackHTML += '<strong>🔄 Areas for Improvement:</strong><ul>';
        result.improvements.forEach(improvement => {
            feedbackHTML += `<li class="improvement-item">${improvement}</li>`;
        });
        feedbackHTML += '</ul></div>';
    }
    
    // Critical issues in red
    if (result.criticalIssues.length > 0) {
        feedbackHTML += '<div class="critical-section">';
        feedbackHTML += '<strong>❌ Critical Issues:</strong><ul>';
        result.criticalIssues.forEach(issue => {
            feedbackHTML += `<li class="critical-item">${issue}</li>`;
        });
        feedbackHTML += '</ul></div>';
    }
    
    feedbackHTML += '</div>';
    document.getElementById(`feedback-${criterion}`).innerHTML = feedbackHTML;
    
    // Remove previous highlights
    for (let i = 1; i <= 4; i++) {
        const element = document.getElementById(`level-${criterion}-${i}`);
        if (element) element.classList.remove('highlight');
    }
    
    // Determine which level to highlight based on score range
    let level;
    if (result.score >= 7) level = 4;
    else if (result.score >= 5) level = 3;
    else if (result.score >= 3) level = 2;
    else if (result.score >= 1) level = 1;
    else return; // No highlight for score 0
    
    // Apply highlight
    const element = document.getElementById(`level-${criterion}-${level}`);
    if (element) element.classList.add('highlight');
}

function estimateCriterionI(essay) {
    const lowerEssay = essay.toLowerCase();
    let score = 0;
    let strengths = [];
    let improvements = [];
    let criticalIssues = [];
    
    // === HONG KONG CONTEXT ANALYSIS ===
    const hasHongKongContext = /hong kong|hk|hongkong|special administrative region|sar/i.test(essay);
    const hasEnergyProblem = /energy.*problem|energy.*issue|energy.*challenge|energy.*need|energy.*demand/i.test(lowerEssay);
    const hasRenewableFocus = /renewable|solar|wind|hydro|tidal|geothermal|bioenergy|clean energy/i.test(lowerEssay);
    const hasNonRenewableMention = /non.renewable|fossil|coal|natural gas|petroleum|unsustainable/i.test(lowerEssay);
    
    // === PROBLEM IDENTIFICATION ===
    const problemKeywords = ['problem', 'issue', 'challenge', 'difficulty', 'concern', 'current situation', 'existing'];
    const problemMentions = countOccurrences(lowerEssay, problemKeywords);
    const hasProblemFocus = problemMentions >= 2;
    
    // === SOLUTION DESCRIPTION ===
    const solutionKeywords = ['solution', 'proposal', 'recommendation', 'suggest', 'propose', 'implement'];
    const solutionMentions = countOccurrences(lowerEssay, solutionKeywords);
    const hasSolutionFocus = solutionMentions >= 2;
    
    // === SCIENTIFIC PRINCIPLES ===
    const energyScienceKeywords = [
        'energy transfer', 'energy conversion', 'electricity generation', 'power production',
        'efficiency', 'photovoltaic', 'turbine', 'generator', 'conversion', 'storage',
        'battery', 'kinetic', 'potential', 'thermal', 'electrical', 'mechanical'
    ];
    const scienceMentions = countOccurrences(lowerEssay, energyScienceKeywords);
    const hasScienceFocus = scienceMentions >= 3;
    
    // === QUALITY INDICATORS ===
    const wordCount = essay.split(/\s+/).length;
    const meetsWordRequirement = wordCount >= 525 && wordCount <= 675; // 600 ± 75 words
    const hasSpecificTechnology = /solar panel|wind turbine|hydroelectric|tidal generator|battery storage/i.test(lowerEssay);
    const hasApplicationDetails = /applied.*hong kong|implement.*hk|hong kong.*context|local.*application/i.test(lowerEssay);
    
    // Calculate weighted score
    let weightedScore = 0;
    
    // Base context points
    if (hasHongKongContext) weightedScore += 2;
    if (hasEnergyProblem) weightedScore += 1;
    if (hasRenewableFocus) weightedScore += 1;
    
    // Content quality points
    if (hasProblemFocus) weightedScore += 1;
    if (hasSolutionFocus) weightedScore += 1;
    if (hasScienceFocus) weightedScore += 1;
    if (hasSpecificTechnology) weightedScore += 1;
    if (hasApplicationDetails) weightedScore += 1;
    if (meetsWordRequirement) weightedScore += 0.5;
    if (hasNonRenewableMention) weightedScore += 0.5;
    
    // Convert to final score with sub-levels
    if (weightedScore >= 6) {
        score = weightedScore >= 7 ? 8 : 7;
    } else if (weightedScore >= 4) {
        score = weightedScore >= 5 ? 6 : 5;
    } else if (weightedScore >= 2) {
        score = weightedScore >= 3 ? 4 : 3;
    } else if (weightedScore >= 0.5) {
        score = weightedScore >= 1.5 ? 2 : 1;
    } else {
        score = 0;
    }
    
    // Generate detailed feedback
    if (hasHongKongContext) {
        strengths.push("Clear focus on Hong Kong's specific energy context");
    } else {
        criticalIssues.push("Missing specific reference to Hong Kong - this is essential for the task");
    }
    
    if (hasEnergyProblem) {
        strengths.push("Good identification of energy-related problems");
    } else {
        criticalIssues.push("Energy problem not clearly identified - focus on Hong Kong's energy needs");
    }
    
    if (hasRenewableFocus) {
        strengths.push("Appropriate focus on renewable energy solutions");
    } else {
        criticalIssues.push("Missing focus on renewable energy - this is the core requirement");
    }
    
    if (hasProblemFocus) {
        strengths.push("Clear problem statement and identification");
    } else {
        improvements.push("Strengthen the problem description with more specific details");
    }
    
    if (hasSolutionFocus) {
        strengths.push("Good explanation of proposed solution");
    } else {
        improvements.push("Make the solution proposal more explicit and detailed");
    }
    
    if (hasScienceFocus) {
        strengths.push("Good integration of energy science principles");
    } else {
        improvements.push("Include more scientific principles of energy transfer and conversion");
    }
    
    if (hasSpecificTechnology) {
        strengths.push("Specific renewable technology identified and described");
    } else {
        improvements.push("Name specific renewable energy technologies (solar, wind, hydro, etc.)");
    }
    
    if (!meetsWordRequirement) {
        criticalIssues.push(`Word count: ${wordCount} (Target: 600±75 words. You are ${wordCount < 525 ? 'under' : 'over'} by ${Math.abs(600 - wordCount)} words)`);
    }
    
    if (!hasApplicationDetails) {
        improvements.push("Explain how the solution specifically applies to Hong Kong's unique context");
    }
    
    return {
        score: score,
        strengths: strengths,
        improvements: improvements,
        criticalIssues: criticalIssues
    };
}

function estimateCriterionII(essay) {
    const lowerEssay = essay.toLowerCase();
    let score = 0;
    let strengths = [];
    let improvements = [];
    let criticalIssues = [];
    
    // === FACTORS ANALYSIS ===
    const factors = [
        'moral', 'ethical', 'environment', 'social', 'economic', 'political', 
        'cultural', 'society', 'economy', 'ecology', 'sustainability', 'health'
    ];
    const foundFactors = factors.filter(factor => lowerEssay.includes(factor));
    const factorCount = foundFactors.length;
    const hasMultipleFactors = factorCount >= 3;
    
    // === ADVANTAGES & DISADVANTAGES ===
    const advantageKeywords = ['advantage', 'benefit', 'strength', 'positive', 'pro', 'opportunity', 'improvement'];
    const disadvantageKeywords = ['disadvantage', 'drawback', 'limitation', 'negative', 'con', 'challenge', 'weakness', 'constraint'];
    
    const advantageMentions = countOccurrences(lowerEssay, advantageKeywords);
    const disadvantageMentions = countOccurrences(lowerEssay, disadvantageKeywords);
    const hasBalancedAnalysis = advantageMentions >= 2 && disadvantageMentions >= 2;
    const hasOneSidedAnalysis = (advantageMentions >= 2 || disadvantageMentions >= 2) && !hasBalancedAnalysis;
    
    // === IMPLICATIONS DEPTH ===
    const implicationKeywords = ['implication', 'consequence', 'effect', 'impact', 'result', 'outcome', 'ramification'];
    const implicationMentions = countOccurrences(lowerEssay, implicationKeywords);
    const hasImplicationsFocus = implicationMentions >= 2;
    
    // === FEASIBILITY ANALYSIS ===
    const feasibilityKeywords = ['feasibility', 'viability', 'practical', 'realistic', 'implement', 'cost', 'infrastructure'];
    const hasFeasibilityDiscussion = countOccurrences(lowerEssay, feasibilityKeywords) >= 2;
    const hasHongKongFeasibility = /hong kong.*feasibility|feasibility.*hong kong|hk.*implement|practical.*hong kong/i.test(lowerEssay);
    
    // === CRITICAL THINKING ===
    const analysisKeywords = ['because', 'therefore', 'however', 'although', 'while', 'whereas', 'consequently', 'as a result'];
    const analysisDepth = countOccurrences(lowerEssay, analysisKeywords);
    const hasAnalyticalLanguage = analysisDepth >= 3;
    
    const hasCriticalEvaluation = /limitation.*discuss|future.*research|improve.*method|better.*way|recommendation|suggestion|alternative/i.test(lowerEssay);
    
    // Calculate weighted score
    let weightedScore = 0;
    
    // Base points
    if (hasImplicationsFocus) weightedScore += 1;
    if (factorCount >= 2) weightedScore += 1;
    
    // Quality points
    if (hasMultipleFactors) weightedScore += 1;
    if (hasBalancedAnalysis) weightedScore += 2;
    else if (hasOneSidedAnalysis) weightedScore += 1;
    if (hasFeasibilityDiscussion) weightedScore += 1;
    if (hasHongKongFeasibility) weightedScore += 1;
    if (hasAnalyticalLanguage) weightedScore += 1;
    if (hasCriticalEvaluation) weightedScore += 1;
    
    // Convert to final score with sub-levels
    if (weightedScore >= 6) {
        score = weightedScore >= 7 ? 8 : 7;
    } else if (weightedScore >= 4) {
        score = weightedScore >= 5 ? 6 : 5;
    } else if (weightedScore >= 2) {
        score = weightedScore >= 3 ? 4 : 3;
    } else if (weightedScore >= 0.5) {
        score = weightedScore >= 1.5 ? 2 : 1;
    } else {
        score = 0;
    }
    
    // Generate detailed feedback
    if (hasImplicationsFocus) {
        strengths.push("Good analysis of implications and consequences");
    } else {
        criticalIssues.push("Insufficient discussion of implications - analyze consequences thoroughly");
    }
    
    if (factorCount > 0) {
        strengths.push(`Discussed ${factorCount} factor(s): ${foundFactors.join(', ')}`);
    } else {
        criticalIssues.push("No factors (social, economic, environmental, etc.) discussed - this is required");
    }
    
    if (hasMultipleFactors) {
        strengths.push("Multiple factors considered, showing comprehensive understanding");
    } else if (factorCount >= 1) {
        improvements.push("Consider additional factors beyond current discussion");
    }
    
    if (hasBalancedAnalysis) {
        strengths.push("Excellent balanced analysis of both advantages and disadvantages");
    } else if (hasOneSidedAnalysis) {
        improvements.push("Analysis is one-sided - discuss both positive and negative aspects equally");
    } else {
        criticalIssues.push("No clear analysis of advantages or disadvantages - use 'pros/cons' or 'advantages/disadvantages'");
    }
    
    if (hasFeasibilityDiscussion) {
        strengths.push("Good discussion of feasibility and practical considerations");
    } else {
        improvements.push("Include more discussion of feasibility (cost, infrastructure, practicality)");
    }
    
    if (hasHongKongFeasibility) {
        strengths.push("Specific feasibility analysis for Hong Kong context");
    } else {
        improvements.push("Discuss how the solution is specifically feasible for Hong Kong");
    }
    
    if (hasAnalyticalLanguage) {
        strengths.push("Good use of analytical language to connect ideas");
    } else {
        improvements.push("Use more analytical language (therefore, however, because, consequently)");
    }
    
    if (!hasCriticalEvaluation) {
        improvements.push("Add critical evaluation of limitations or suggestions for improvement");
    }
    
    return {
        score: score,
        strengths: strengths,
        improvements: improvements,
        criticalIssues: criticalIssues
    };
}

function estimateCriterionIII(essay) {
    const lowerEssay = essay.toLowerCase();
    let score = 0;
    let strengths = [];
    let improvements = [];
    let criticalIssues = [];
    
    // === ENERGY SCIENCE TERMINOLOGY ===
    const energyScienceTerms = [
        'energy transfer', 'energy conversion', 'electricity generation', 'power production',
        'efficiency', 'photovoltaic', 'turbine', 'generator', 'conversion', 'storage',
        'battery', 'kinetic', 'potential', 'thermal', 'electrical', 'mechanical',
        'renewable', 'sustainable', 'solar', 'wind', 'hydro', 'tidal', 'geothermal',
        'carbon footprint', 'emissions', 'climate change', 'sustainability',
        'voltage', 'current', 'power grid', 'infrastructure', 'capacity'
    ];
    
    const foundTerms = energyScienceTerms.filter(term => lowerEssay.includes(term));
    const termCount = foundTerms.length;
    const uniqueTermCount = new Set(foundTerms).size;
    const hasSubstantialTerminology = uniqueTermCount >= 8;
    const hasBasicTerminology = uniqueTermCount >= 4;
    
    // === LANGUAGE QUALITY ===
    const hasDefinitions = /defined as|meaning|refers to|which is|is when|in other words|that is/i.test(lowerEssay);
    const hasTechnicalPrecision = /efficiency.*rate|conversion.*rate|capacity.*factor|energy.*density|specific.*cost/i.test(lowerEssay);
    const hasContextUsage = /energy.*transfer|power.*generation|electricity.*production|renewable.*source/i.test(lowerEssay);
    
    // === COMMUNICATION EFFECTIVENESS ===
    const sentences = essay.split(/[.!?]+/).filter(s => s.trim().length > 10);
    const uniqueSentences = [...new Set(sentences.map(s => s.trim().toLowerCase().replace(/\s+/g, ' ')))];
    const repetitionRatio = uniqueSentences.length / Math.max(sentences.length, 1);
    const isConcise = repetitionRatio > 0.8;
    
    const hasStructuredSections = /problem.*solution|solution.*implication|implication.*conclusion/i.test(lowerEssay);
    const hasLogicalFlow = sentences.length > 20 && (sentences.filter(s => s.split(/\s+/).length > 15).length >= 5);
    
    // Calculate weighted score
    let weightedScore = 0;
    
    // Terminology points
    if (hasBasicTerminology) weightedScore += 1;
    if (hasSubstantialTerminology) weightedScore += 2;
    else if (uniqueTermCount >= 6) weightedScore += 1;
    
    // Quality points
    if (hasDefinitions) weightedScore += 1;
    if (hasTechnicalPrecision) weightedScore += 1;
    if (hasContextUsage) weightedScore += 1;
    if (isConcise) weightedScore += 1;
    if (hasStructuredSections) weightedScore += 1;
    if (hasLogicalFlow) weightedScore += 0.5;
    
    // Convert to final score with sub-levels
    if (weightedScore >= 6) {
        score = weightedScore >= 7 ? 8 : 7;
    } else if (weightedScore >= 4) {
        score = weightedScore >= 5 ? 6 : 5;
    } else if (weightedScore >= 2) {
        score = weightedScore >= 3 ? 4 : 3;
    } else if (weightedScore >= 0.5) {
        score = weightedScore >= 1.5 ? 2 : 1;
    } else {
        score = 0;
    }
    
    // Generate detailed feedback
    if (hasSubstantialTerminology) {
        strengths.push(`Excellent energy science vocabulary (${uniqueTermCount} different terms used)`);
    } else if (hasBasicTerminology) {
        strengths.push(`Good start with energy science terminology (${uniqueTermCount} terms)`);
    } else {
        criticalIssues.push(`Insufficient energy science terminology (only ${uniqueTermCount} terms used)`);
    }
    
    if (hasDefinitions) {
        strengths.push("Key energy terms are properly defined and explained");
    } else {
        improvements.push("Define important energy science terms for clarity");
    }
    
    if (hasTechnicalPrecision) {
        strengths.push("Uses precise technical energy terminology appropriately");
    } else {
        improvements.push("Use more precise energy terminology (efficiency rates, conversion rates, capacity)");
    }
    
    if (hasContextUsage) {
        strengths.push("Energy terms used in proper scientific context");
    } else {
        improvements.push("Use energy terms in proper context (energy transfer, power generation, etc.)");
    }
    
    if (isConcise) {
        strengths.push("Writing is concise with minimal repetition");
    } else {
        improvements.push("Reduce repetition and improve conciseness");
    }
    
    if (!hasStructuredSections) {
        improvements.push("Ensure clear logical flow between Problem → Solution → Implications → Conclusion");
    }
    
    if (uniqueTermCount < 6) {
        const missingTerms = energyScienceTerms.filter(term => !foundTerms.includes(term)).slice(0, 5);
        improvements.push(`Consider using terms like: ${missingTerms.join(', ')}`);
    }
    
    return {
        score: score,
        strengths: strengths,
        improvements: improvements,
        criticalIssues: criticalIssues
    };
}

function estimateCriterionIV(essay) {
    let score = 0;
    let strengths = [];
    let improvements = [];
    let criticalIssues = [];
    
    // Remove bibliography section for in-text citation analysis
    const essayWithoutBibliography = essay.split(/references|works cited|bibliography/i)[0] || essay;
    
    // === IN-TEXT CITATION ANALYSIS ===
    const inTextCitations = (essayWithoutBibliography.match(/\([^)]+\s\d{4}\)|\[\d+\]|author.*\d{4}|\d{4}.*page/g) || []);
    const citationCount = inTextCitations.length;
    const hasAdequateCitations = citationCount >= 3;
    const hasMinimalCitations = citationCount >= 1;
    
    // === REFERENCE SECTION ===
    const hasReferences = /references|works cited|bibliography/i.test(essay);
    const lines = essay.split('\n');
    let referenceSection = false;
    let referenceCount = 0;
    let hasMLAFormatting = false;
    
    for (let line of lines) {
        const lowerLine = line.toLowerCase();
        if (lowerLine.includes('references') || lowerLine.includes('works cited') || lowerLine.includes('bibliography')) {
            referenceSection = true;
            continue;
        }
        
        if (referenceSection && line.trim() && /[a-zA-Z]/.test(line)) {
            referenceCount++;
            // Check MLA formatting
            if (line.includes(',') && line.includes('.') && /\d{4}/.test(line)) {
                hasMLAFormatting = true;
            }
        }
    }
    
    // === VISUAL ELEMENTS CITATION ===
    const hasFigures = /figure|diagram|image|picture|table|chart/g.test(essay.toLowerCase());
    const hasFigureCitations = /figure.*\d.*\(|diagram.*\d.*\(|image.*\d.*\(|source.*\d{4}|adapted from/i.test(essay);
    
    // === COMPLETENESS CHECK ===
    const hasCompleteDocumentation = hasAdequateCitations && referenceCount >= 4 && hasMLAFormatting;
    const hasBasicDocumentation = hasMinimalCitations && hasReferences && referenceCount >= 2;
    
    // Calculate weighted score
    let weightedScore = 0;
    
    // Base points
    if (hasReferences) weightedScore += 1;
    if (hasMinimalCitations) weightedScore += 1;
    
    // Quality points
    if (hasAdequateCitations) weightedScore += 1;
    if (referenceCount >= 3) weightedScore += 1;
    if (referenceCount >= 4) weightedScore += 1;
    if (hasMLAFormatting) weightedScore += 1;
    if (hasFigureCitations) weightedScore += 1;
    else if (hasFigures) weightedScore += 0.5;
    
    // Convert to final score with sub-levels
    if (weightedScore >= 6) {
        score = weightedScore >= 7 ? 8 : 7;
    } else if (weightedScore >= 4) {
        score = weightedScore >= 5 ? 6 : 5;
    } else if (weightedScore >= 2) {
        score = weightedScore >= 3 ? 4 : 3;
    } else if (weightedScore >= 0.5) {
        score = weightedScore >= 1.5 ? 2 : 1;
    } else {
        score = 0;
    }
    
    // Generate detailed feedback
    if (hasReferences) {
        strengths.push("References section is present");
    } else {
        criticalIssues.push("Missing references/works cited section");
    }
    
    if (hasAdequateCitations) {
        strengths.push(`Good use of in-text citations (${citationCount} citations)`);
    } else if (hasMinimalCitations) {
        improvements.push(`Limited in-text citations (${citationCount} - aim for 3+)`);
    } else {
        criticalIssues.push("No in-text citations found");
    }
    
    if (referenceCount >= 3) {
        strengths.push(`Adequate number of references (${referenceCount})`);
    } else if (referenceCount > 0) {
        improvements.push(`Insufficient references (${referenceCount} - need 3+)`);
    } else {
        criticalIssues.push("No references listed in references section");
    }
    
    if (hasMLAFormatting) {
        strengths.push("MLA formatting used correctly");
    } else {
        improvements.push("Improve MLA formatting (Author. Title. Publisher, Year.)");
    }
    
    if (hasFigures && !hasFigureCitations) {
        criticalIssues.push("Figures/diagrams are not properly cited");
    } else if (hasFigureCitations) {
        strengths.push("Visual elements are properly cited");
    }
    
    if (citationCount < referenceCount) {
        improvements.push("Some references are missing corresponding in-text citations");
    }
    
    return {
        score: score,
        strengths: strengths,
        improvements: improvements,
        criticalIssues: criticalIssues
    };
}

// Helper function to count occurrences of keywords
function countOccurrences(text, keywords) {
    return keywords.reduce((count, keyword) => {
        const regex = new RegExp(`\\b${keyword}\\w*`, 'gi');
        const matches = text.match(regex);
        return count + (matches ? matches.length : 0);
    }, 0);
}

function generateOverallFeedback(results, totalScore, essayText) {
    const overallFeedback = document.getElementById('overall-feedback');
    let html = '<h3>📊 Overall Assessment - Hong Kong Renewable Energy Research</h3>';
    
    // Calculate grade based on strict boundaries
    const grade = calculateGrade(totalScore);
    const wordCount = essayText.split(/\s+/).length;
    
    html += `<p><strong>Total Score: ${totalScore}/32</strong></p>`;
    html += `<p><strong>Estimated Grade: ${grade}/8</strong></p>`;
    html += `<p><strong>Word Count: ${wordCount} words ${wordCount >= 525 && wordCount <= 675 ? '✅' : '❌'}</strong></p>`;
    
    // Grade interpretation
    const gradeInfo = getGradeInfo(grade);
    html += `<div class="grade-summary ${gradeInfo.class}">`;
    html += `<p><strong>${gradeInfo.level}</strong> - ${gradeInfo.description}</p>`;
    html += '</div>';
    
    // Task-specific feedback
    const hasHongKong = /hong kong|hk/i.test(essayText);
    const hasRenewable = /renewable|solar|wind|hydro|tidal/i.test(essayText.toLowerCase());
    const hasProsCons = /pros|cons|advantage|disadvantage/i.test(essayText.toLowerCase());
    
    html += '<div class="task-specific">';
    html += '<h4>🎯 Task Requirements Check:</h4><ul>';
    html += `<li class="${hasHongKong ? 'strength-item' : 'critical-item'}">${hasHongKong ? '✅ Hong Kong context addressed' : '❌ Missing Hong Kong focus'}</li>`;
    html += `<li class="${hasRenewable ? 'strength-item' : 'critical-item'}">${hasRenewable ? '✅ Renewable energy solution proposed' : '❌ No renewable energy solution'}</li>`;
    html += `<li class="${hasProsCons ? 'strength-item' : 'improvement-item'}">${hasProsCons ? '✅ Pros/cons analysis included' : '🔄 Need pros/cons analysis'}</li>`;
    html += `<li class="${wordCount >= 525 && wordCount <= 675 ? 'strength-item' : 'critical-item'}">${wordCount >= 525 && wordCount <= 675 ? '✅ Word count appropriate' : '❌ Word count outside range (525-675)'}</li>`;
    html += '</ul></div>';
    
    // Critical overall issues
    const allCriticalIssues = results.flatMap(r => r.criticalIssues);
    if (allCriticalIssues.length > 0) {
        html += '<div class="critical-overall">';
        html += '<h4>🚨 Priority Fixes Required:</h4><ul>';
        allCriticalIssues.slice(0, 3).forEach(issue => {
            html += `<li class="critical-item">${issue}</li>`;
        });
        html += '</ul></div>';
    }
    
    // Key strengths
    const allStrengths = results.flatMap(r => r.strengths);
    if (allStrengths.length > 0) {
        html += '<div class="strengths-overall">';
        html += '<h4>✅ What You Did Well:</h4><ul>';
        allStrengths.slice(0, 3).forEach(strength => {
            html += `<li class="strength-item">${strength}</li>`;
        });
        html += '</ul></div>';
    }
    
    // Action plan
    html += '<div class="action-plan">';
    html += '<h4>🎯 Your Improvement Plan:</h4><ol>';
    
    if (grade <= 4) {
        html += '<li class="critical-item"><strong>Hong Kong Focus:</strong> Ensure all analysis is specifically about Hong Kong</li>';
        html += '<li class="critical-item"><strong>Renewable Solution:</strong> Propose a clear renewable energy technology</li>';
        html += '<li class="improvement-item"><strong>Basic Structure:</strong> Follow Problem → Solution → Implications → Conclusion</li>';
    } else if (grade <= 6) {
        html += '<li class="improvement-item"><strong>Multiple Factors:</strong> Discuss 3+ factors (economic, social, environmental)</li>';
        html += '<li class="improvement-item"><strong>Balanced Analysis:</strong> Equal discussion of advantages AND disadvantages</li>';
        html += '<li class="improvement-item"><strong>Energy Science:</strong> Use more specific energy transfer terminology</li>';
    } else {
        html += '<li class="strength-item"><strong>Refine Excellence:</strong> Enhance critical evaluation of limitations</li>';
        html += '<li class="improvement-item"><strong>Hong Kong Specificity:</strong> Make feasibility analysis more Hong Kong-specific</li>';
        html += '<li class="improvement-item"><strong>Technical Precision:</strong> Add specific efficiency rates and capacity data</li>';
    }
    
    html += '</ol></div>';
    
    overallFeedback.innerHTML = html;
}

function getGradeInfo(grade) {
    const grades = {
        8: { level: 'Excellent', description: 'Outstanding research paper exceeding all requirements', class: 'grade-excellent' },
        7: { level: 'Very Good', description: 'High quality work with comprehensive Hong Kong analysis', class: 'grade-very-good' },
        6: { level: 'Good', description: 'Solid research with minor areas for refinement', class: 'grade-good' },
        5: { level: 'Satisfactory', description: 'Meets basic requirements adequately', class: 'grade-satisfactory' },
        4: { level: 'Adequate', description: 'Limited demonstration of understanding', class: 'grade-adequate' },
        3: { level: 'Basic', description: 'Fundamental requirements partially met', class: 'grade-basic' },
        2: { level: 'Limited', description: 'Significant improvements needed', class: 'grade-limited' },
        1: { level: 'Very Limited', description: 'Minimal requirements addressed', class: 'grade-very-limited' },
        0: { level: 'Incomplete', description: 'Work not submitted or completely inadequate', class: 'grade-incomplete' }
    };
    return grades[grade] || grades[0];
}

function calculateGrade(totalScore) {
    if (totalScore >= 32) return 8;
    if (totalScore >= 28) return 7;
    if (totalScore >= 24) return 6;
    if (totalScore >= 20) return 5;
    if (totalScore >= 16) return 4;
    if (totalScore >= 12) return 3;
    if (totalScore >= 8) return 2;
    if (totalScore >= 4) return 1;
    return 0;
}

function getCriterionName(index) {
    const names = [
        'Application of Science',
        'Implications Analysis', 
        'Scientific Language',
        'Source Documentation'
    ];
    return names[index] || `Criterion ${index + 1}`;
}