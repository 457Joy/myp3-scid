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
    generateOverallFeedback([resultI, resultII, resultIII, resultIV], totalScore);
    
    // Show results section
    document.getElementById('results-section').style.display = 'block';
}

function updateCriterionUI(criterion, result) {
    document.getElementById(`score-${criterion}`).textContent = result.score;
    document.getElementById(`feedback-${criterion}`).innerHTML = result.feedback;
    
    // Remove previous highlights
    for (let i = 1; i <= 4; i++) {
        const element = document.getElementById(`level-${criterion}-${i}`);
        if (element) element.classList.remove('highlight');
    }
    
    // Determine which level to highlight based on score
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
    let feedback = [];
    
    // Check for required structure headings
    const hasProblemSection = /problem.*section|section.*problem|^problem|heading.*problem/i.test(essay);
    const hasSolutionSection = /solution.*section|section.*solution|^solution|heading.*solution/i.test(essay);
    const hasRequiredStructure = hasProblemSection && hasSolutionSection;
    
    // Check for problem statement
    const problemKeywords = ['problem', 'issue', 'challenge', 'difficulty', 'concern'];
    const hasProblemStatement = problemKeywords.some(keyword => lowerEssay.includes(keyword));
    
    // Check for science application description
    const scienceKeywords = ['science', 'scientific', 'research', 'technology', 'method', 'experiment', 'study', 'data', 'evidence'];
    const hasScienceApplication = scienceKeywords.some(keyword => lowerEssay.includes(keyword));
    
    // Check for detail level and word count
    const wordCount = essay.split(/\s+/).length;
    const meetsWordRequirement = wordCount >= 550 && wordCount <= 650;
    
    // Check for specific problem description
    const hasSpecificProblem = /specific.*problem|particular.*issue|specific.*challenge/i.test(lowerEssay);
    
    // Check for clear scientific process description
    const hasScientificProcess = /method.*used|scientific.*process|research.*conducted|experiment.*performed/i.test(lowerEssay);
    
    // STRICTER Scoring logic
    if (hasRequiredStructure && hasProblemStatement && hasScienceApplication && hasSpecificProblem && hasScientificProcess && meetsWordRequirement) {
        score = 8;
        feedback.push("✓ Excellent structure with required headings");
        feedback.push("✓ Clear, specific problem statement with detailed scientific application");
        feedback.push("✓ Appropriate word count and comprehensive coverage");
    } else if (hasRequiredStructure && hasProblemStatement && hasScienceApplication && hasSpecificProblem) {
        score = 6;
        feedback.push("✓ Good structure and problem identification");
        if (!hasScientificProcess) feedback.push("↻ Need more detail about the scientific methods used");
        if (!meetsWordRequirement) feedback.push(`↻ Word count (${wordCount}) should be around 600 words`);
    } else if (hasProblemStatement && hasScienceApplication) {
        score = 4;
        feedback.push("✓ Basic problem and science application identified");
        if (!hasRequiredStructure) feedback.push("✗ Missing required section headings (Problem, Solution)");
        if (!hasSpecificProblem) feedback.push("↻ Problem statement needs to be more specific");
        feedback.push(`↻ Word count: ${wordCount} (target: 600 words)`);
    } else if (hasProblemStatement || hasScienceApplication) {
        score = 2;
        feedback.push("⚠ Only partially addresses the criterion");
        if (!hasProblemStatement) feedback.push("✗ Missing clear problem statement");
        if (!hasScienceApplication) feedback.push("✗ Missing description of scientific application");
        if (!hasRequiredStructure) feedback.push("✗ Missing required structure headings");
    } else {
        score = 1;
        feedback.push("✗ No clear problem statement or scientific application identified");
        feedback.push("• Use headings: Problem, Solution, Implications, Conclusion");
        feedback.push("• Clearly state the specific problem being addressed");
        feedback.push("• Describe how science is applied to solve this problem");
    }
    
    return {
        score: score,
        feedback: formatFeedback(feedback)
    };
}

function estimateCriterionII(essay) {
    const lowerEssay = essay.toLowerCase();
    let score = 0;
    let feedback = [];
    
    // Check for required structure headings
    const hasImplicationsSection = /implications.*section|section.*implications|^implications|heading.*implications/i.test(essay);
    const hasConclusionSection = /conclusion.*section|section.*conclusion|^conclusion|heading.*conclusion/i.test(essay);
    const hasRequiredStructure = hasImplicationsSection && hasConclusionSection;
    
    // Check for implications discussion
    const implicationKeywords = ['implication', 'consequence', 'effect', 'impact', 'result', 'outcome', 'ramification'];
    const hasImplications = implicationKeywords.some(keyword => lowerEssay.includes(keyword));
    
    // Check for specific factors
    const factors = [
        'moral', 'ethical', 'environment', 'social', 'society', 
        'economic', 'economy', 'political', 'politics', 'cultural'
    ];
    const foundFactors = factors.filter(factor => lowerEssay.includes(factor));
    const hasFactors = foundFactors.length > 0;
    const hasMultipleFactors = foundFactors.length >= 2;
    
    // Check for analysis (pros and cons)
    const advantageKeywords = ['advantage', 'benefit', 'strength', 'positive', 'pro', 'opportunity'];
    const disadvantageKeywords = ['disadvantage', 'drawback', 'limitation', 'negative', 'con', 'challenge', 'weakness'];
    
    const hasAdvantages = advantageKeywords.some(keyword => lowerEssay.includes(keyword));
    const hasDisadvantages = disadvantageKeywords.some(keyword => lowerEssay.includes(keyword));
    const hasBothAdvantagesDisadvantages = hasAdvantages && hasDisadvantages;
    
    // Check for analysis depth - stricter requirements
    const analysisKeywords = ['because', 'therefore', 'however', 'although', 'while', 'whereas', 'consequently', 'as a result'];
    const hasAnalysisDepth = analysisKeywords.some(keyword => {
        const sentences = lowerEssay.split(/[.!?]+/);
        return sentences.some(sentence => 
            sentence.includes(keyword) && sentence.length > 40
        );
    });
    
    // Check for critical thinking
    const hasCriticalAnalysis = /limitation.*discuss|future.*research|improve.*method|better.*way/i.test(lowerEssay);
    
    // STRICTER Scoring logic
    if (hasRequiredStructure && hasImplications && hasMultipleFactors && hasBothAdvantagesDisadvantages && hasAnalysisDepth && hasCriticalAnalysis) {
        score = 8;
        feedback.push("✓ Excellent analysis with multiple factors and critical thinking");
        feedback.push(`✓ Discussed factors: ${foundFactors.join(', ')}`);
        feedback.push("✓ Balanced discussion of advantages and disadvantages");
        feedback.push("✓ Shows deep understanding of implications");
    } else if (hasRequiredStructure && hasImplications && hasFactors && hasBothAdvantagesDisadvantages && hasAnalysisDepth) {
        score = 6;
        feedback.push("✓ Good analysis of implications");
        feedback.push(`✓ Mentioned factors: ${foundFactors.join(', ')}`);
        if (!hasMultipleFactors) feedback.push("↻ Discuss more than one factor (social, economic, environmental, etc.)");
        if (!hasCriticalAnalysis) feedback.push("↻ Add critical analysis of limitations or future improvements");
    } else if (hasImplications && hasFactors && (hasAdvantages || hasDisadvantages)) {
        score = 4;
        feedback.push("✓ Basic implications and factors identified");
        feedback.push(`✓ Factors mentioned: ${foundFactors.join(', ')}`);
        if (!hasRequiredStructure) feedback.push("✗ Missing required section headings (Implications, Conclusion)");
        if (!hasBothAdvantagesDisadvantages) feedback.push("↻ Need to discuss both advantages AND disadvantages");
        feedback.push("↻ Expand analytical depth with connecting words (therefore, however, because)");
    } else if (hasImplications) {
        score = 2;
        feedback.push("⚠ Mentions implications but missing key elements");
        if (!hasFactors) feedback.push("✗ No discussion of moral, ethical, social, economic, or political factors");
        if (!hasRequiredStructure) feedback.push("✗ Missing required structure headings");
        feedback.push("• Consider how your solution affects: society, environment, economy, etc.");
    } else {
        score = 1;
        feedback.push("✗ No meaningful discussion of implications found");
        feedback.push("• Add Implications and Conclusion sections");
        feedback.push("• Discuss the consequences of using science to solve this problem");
        feedback.push("• Consider moral, ethical, social, economic, or political impacts");
    }
    
    return {
        score: score,
        feedback: formatFeedback(feedback)
    };
}

function estimateCriterionIII(essay) {
    let score = 0;
    let feedback = [];
    
    // Scientific terms list - more comprehensive
    const scientificTerms = [
        'hypothesis', 'theory', 'experiment', 'data', 'analysis', 'conclusion',
        'methodology', 'variable', 'control', 'observation', 'evidence', 
        'research', 'study', 'finding', 'result', 'procedure', 'sample',
        'measurement', 'validity', 'reliability', 'conclusion', 'empirical',
        'quantitative', 'qualitative', 'statistical', 'significant', 'correlation'
    ];
    
    // Count scientific terms
    const lowerEssay = essay.toLowerCase();
    const foundTerms = scientificTerms.filter(term => lowerEssay.includes(term));
    const termCount = foundTerms.length;
    const hasSubstantialTerminology = termCount >= 8;
    const hasExcellentTerminology = termCount >= 12;
    
    // Check for definitions of terms
    const definitionPatterns = /defined as|meaning|refers to|which is|is when|in other words/i;
    const hasDefinitions = definitionPatterns.test(lowerEssay);
    
    // Check for conciseness (no repeated ideas) - stricter
    const sentences = essay.split(/[.!?]+/).filter(s => s.trim().length > 10);
    const uniqueSentences = [...new Set(sentences.map(s => s.trim().toLowerCase().replace(/\s+/g, ' ')))];
    const repetitionRatio = uniqueSentences.length / sentences.length;
    const isConcise = repetitionRatio > 0.85;
    
    // Check for technical accuracy and precision
    const hasTechnicalPrecision = /precisely|accurately|specifically|exactly|measured|calculated/i.test(lowerEssay);
    
    // Check for proper term usage in context
    const hasContextUsage = /data shows|research indicates|studies demonstrate|evidence suggests/i.test(lowerEssay);
    
    // Check for font and formatting compliance (basic check)
    const hasFormattingIssues = /font.*size|size.*font|times new roman|arial|calibri/i.test(lowerEssay);
    
    // STRICTER Scoring logic
    if (hasExcellentTerminology && hasDefinitions && isConcise && hasTechnicalPrecision && hasContextUsage && !hasFormattingIssues) {
        score = 8;
        feedback.push("✓ Excellent use of scientific language throughout");
        feedback.push(`✓ Used ${termCount} scientific terms correctly in context`);
        feedback.push("✓ Key terms are defined and explained appropriately");
        feedback.push("✓ Writing is concise, precise, and professionally formatted");
    } else if (hasSubstantialTerminology && hasDefinitions && isConcise && hasContextUsage) {
        score = 6;
        feedback.push("✓ Good use of scientific language");
        feedback.push(`✓ Used ${termCount} scientific terms: ${foundTerms.slice(0, 6).join(', ')}${foundTerms.length > 6 ? '...' : ''}`);
        if (!hasTechnicalPrecision) feedback.push("↻ Use more precise technical language");
        if (repetitionRatio <= 0.8) feedback.push("↻ Some repetition detected - improve conciseness");
    } else if (termCount >= 4) {
        score = 4;
        feedback.push("✓ Basic scientific terminology used");
        feedback.push(`✓ Found terms: ${foundTerms.join(', ')}`);
        feedback.push("↻ Use more scientific language like: hypothesis, data analysis, empirical evidence");
        if (!hasDefinitions) feedback.push("↻ Define unfamiliar scientific terms for clarity");
        if (!hasContextUsage) feedback.push("↻ Use terms in proper scientific context");
    } else if (termCount > 0) {
        score = 2;
        feedback.push("⚠ Very limited scientific language used");
        feedback.push(`✓ Only found: ${foundTerms.join(', ')}`);
        feedback.push("✗ Need to incorporate significantly more scientific vocabulary");
        feedback.push("• Required terms: research, data, evidence, analysis, conclusion, methodology");
    } else {
        score = 1;
        feedback.push("✗ No scientific language detected");
        feedback.push("• Essential terms: hypothesis, experiment, data, analysis, evidence, research");
        feedback.push("• Use precise scientific language throughout your essay");
    }
    
    return {
        score: score,
        feedback: formatFeedback(feedback)
    };
}

function estimateCriterionIV(essay) {
    let score = 0;
    let feedback = [];
    
    // Check for in-text citations - stricter
    const hasInTextCitations = /\([^)]+\s\d{4}\)|\[\d+\]|author.*\d{4}|et al\.|\d{4}.*page|\d{4}.*p\./.test(essay);
    const hasMultipleInTextCitations = (essay.match(/\([^)]+\s\d{4}\)|\[\d+\]/g) || []).length >= 3;
    
    // Check for works cited/references section
    const hasReferences = /references|works cited|bibliography/i.test(essay);
    
    // Check for MLA format indicators - stricter
    const hasMLA = /mla|modern language association/i.test(essay);
    const hasMLAFormatting = /author.*title.*publisher|vol\.|pp\.|pages?\s\d|edited by|journal.*vol/i.test(essay);
    
    // Check for alphabetical order in references
    const lines = essay.split('\n');
    let referenceSection = false;
    let referenceCount = 0;
    let hasAlphabeticalOrder = false;
    let previousFirstLetter = '';
    
    for (let line of lines) {
        const lowerLine = line.toLowerCase();
        if (lowerLine.includes('references') || lowerLine.includes('works cited') || lowerLine.includes('bibliography')) {
            referenceSection = true;
            continue;
        }
        
        if (referenceSection && line.trim() && /[a-zA-Z]/.test(line)) {
            referenceCount++;
            const firstLetter = line.trim().charAt(0).toLowerCase();
            if (previousFirstLetter && firstLetter < previousFirstLetter) {
                hasAlphabeticalOrder = false;
            }
            previousFirstLetter = firstLetter;
        }
    }
    
    hasAlphabeticalOrder = referenceCount > 1; // Simplified check
    
    // Check for picture/diagram citations
    const hasFigureCitations = /figure\s*\d|table\s*\d|diagram\s*\d|image\s*\d/i.test(essay);
    const hasProperFigureCitations = /figure\s*\d.*\(.*\d{4}\)|source.*\d{4}|adapted from.*\d{4}/i.test(essay);
    
    // Check for complete documentation
    const hasCompleteDocumentation = hasMultipleInTextCitations && referenceCount >= 4 && hasMLAFormatting && hasAlphabeticalOrder;
    
    // STRICTER Scoring logic
    if (hasCompleteDocumentation && hasProperFigureCitations) {
        score = 8;
        feedback.push("✓ Excellent documentation with proper MLA formatting throughout");
        feedback.push(`✓ Found ${referenceCount} references with multiple in-text citations`);
        feedback.push("✓ References in alphabetical order");
        feedback.push("✓ All figures and tables properly cited");
    } else if (hasMultipleInTextCitations && hasReferences && referenceCount >= 3 && hasMLAFormatting) {
        score = 6;
        feedback.push("✓ Good source documentation");
        feedback.push(`✓ Found ${referenceCount} references with multiple in-text citations`);
        if (!hasAlphabeticalOrder) feedback.push("↻ Arrange references in alphabetical order");
        if (!hasProperFigureCitations) feedback.push("↻ Improve citation of images/diagrams");
    } else if (hasInTextCitations && hasReferences && referenceCount >= 2) {
        score = 4;
        feedback.push("✓ Basic references and citations included");
        feedback.push(`✓ Found ${referenceCount} reference(s) with some in-text citations`);
        feedback.push("↻ Add more references (minimum 3-4 required)");
        feedback.push("↻ Use consistent MLA format for all citations");
        if (!hasMultipleInTextCitations) feedback.push("↻ Include in-text citations for all referenced works");
    } else if (hasReferences) {
        score = 2;
        feedback.push("⚠ References section present but inadequate");
        feedback.push(`↻ Only ${referenceCount} reference(s) - need minimum 3`);
        if (!hasInTextCitations) feedback.push("✗ No in-text citations found");
        feedback.push("• Use MLA format: Author. Title. Publisher, Year.");
    } else {
        score = 1;
        feedback.push("✗ No proper references or citations detected");
        feedback.push("• Add a 'References' or 'Works Cited' section with 3+ sources");
        feedback.push("• Include in-text citations for all borrowed information");
        feedback.push("• Use MLA format consistently");
    }
    
    return {
        score: score,
        feedback: formatFeedback(feedback)
    };
}

function formatFeedback(feedbackArray) {
    if (!feedbackArray || feedbackArray.length === 0) return '';
    
    let html = '<ul>';
    feedbackArray.forEach(item => {
        if (item.startsWith('✓')) {
            html += `<li class="feedback-positive">${item}</li>`;
        } else if (item.startsWith('✗') || item.startsWith('⚠')) {
            html += `<li class="feedback-missing">${item}</li>`;
        } else if (item.startsWith('↻')) {
            html += `<li class="feedback-improvement">${item}</li>`;
        } else {
            html += `<li>${item}</li>`;
        }
    });
    html += '</ul>';
    return html;
}

function generateOverallFeedback(results, totalScore) {
    const overallFeedback = document.getElementById('overall-feedback');
    let html = '<h3>Overall Assessment</h3>';
    
    // Calculate grade based on strict boundaries
    const grade = calculateGrade(totalScore);
    
    html += `<p><strong>Total Score: ${totalScore}/32</strong></p>`;
    html += `<p><strong>Estimated Grade: ${grade}/8</strong></p>`;
    
    // Grade interpretation
    let gradeLevel = '';
    if (grade >= 7) gradeLevel = 'Excellent - Meeting high expectations';
    else if (grade >= 6) gradeLevel = 'Good - Solid understanding demonstrated';
    else if (grade >= 5) gradeLevel = 'Satisfactory - Meets basic requirements';
    else if (grade >= 4) gradeLevel = 'Limited - Needs significant improvement';
    else if (grade >= 3) gradeLevel = 'Weak - Major issues present';
    else if (grade >= 2) gradeLevel = 'Very Weak - Fundamental problems';
    else if (grade >= 1) gradeLevel = 'Poor - Minimal requirements met';
    else gradeLevel = 'Incomplete - Work not submitted or completely inadequate';
    
    html += `<p><strong>Level: ${gradeLevel}</strong></p>`;
    
    // Strengths (only if actually strong)
    const strengths = results.filter(r => r.score >= 6);
    if (strengths.length > 0) {
        html += '<p><strong>Strengths:</strong></p><ul>';
        strengths.forEach(result => {
            const criterionName = getCriterionName(results.indexOf(result));
            html += `<li class="feedback-positive">${criterionName} (${result.score}/8)</li>`;
        });
        html += '</ul>';
    }
    
    // Areas for improvement (most will have these)
    const improvements = results.filter(r => r.score < 6);
    if (improvements.length > 0) {
        html += '<p><strong>Priority Improvements:</strong></p><ul>';
        improvements.forEach(result => {
            const criterionName = getCriterionName(results.indexOf(result));
            html += `<li class="feedback-improvement">${criterionName} (${result.score}/8) - Review specific feedback above</li>`;
        });
        html += '</ul>';
    }
    
    // Critical issues
    const criticalIssues = results.filter(r => r.score <= 2);
    if (criticalIssues.length > 0) {
        html += '<p><strong>Critical Issues Requiring Immediate Attention:</strong></p><ul>';
        criticalIssues.forEach(result => {
            const criterionName = getCriterionName(results.indexOf(result));
            html += `<li class="feedback-missing">${criterionName} - Fundamental requirements not met</li>`;
        });
        html += '</ul>';
    }
    
    // Actionable next steps based on grade
    html += '<p><strong>Action Steps:</strong></p><ul>';
    if (grade <= 3) {
        html += '<li class="feedback-missing">Review the assignment instructions and rubric carefully</li>';
        html += '<li class="feedback-missing">Ensure you have all required sections: Problem, Solution, Implications, Conclusion</li>';
        html += '<li class="feedback-missing">Add proper references and citations</li>';
    } else if (grade <= 5) {
        html += '<li class="feedback-improvement">Focus on improving analytical depth in Implications section</li>';
        html += '<li class="feedback-improvement">Increase use of scientific terminology</li>';
        html += '<li class="feedback-improvement">Ensure word count is around 600 words</li>';
    } else {
        html += '<li class="feedback-positive">Refine analytical depth and critical thinking</li>';
        html += '<li class="feedback-positive">Ensure all formatting requirements are met</li>';
        html += '<li class="feedback-positive">Double-check MLA citation consistency</li>';
    }
    html += '<li>Use the highlighted rubric levels above as specific targets</li>';
    html += '</ul>';
    
    overallFeedback.innerHTML = html;
}

function calculateGrade(totalScore) {
    // Strict grade boundaries as specified
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