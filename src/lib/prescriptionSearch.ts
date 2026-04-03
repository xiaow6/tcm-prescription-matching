import { Prescription, SearchResult } from './types';
import { getPrescriptions, getPrescriptionChunks } from './knowledgeBase';

/**
 * Search prescriptions using keyword matching + scoring algorithm
 *
 * Score = 处方名匹配(0-50) + 证型/辨证匹配(0-40) + 关键词匹配(0-30) + 适应症匹配(0-20) + 类别匹配(0-10)
 */
export function searchPrescriptions(
  searchQuery: string,
  preliminaryPattern?: string,
  category?: string,
  topK: number = 5
): SearchResult[] {
  const prescriptions = getPrescriptions();
  const chunks = getPrescriptionChunks();

  const searchTerms = searchQuery
    .split(/[\s,，、;；]+/)
    .map(t => t.trim())
    .filter(t => t.length > 0);

  if (searchTerms.length === 0) return [];

  const results: SearchResult[] = [];

  for (let i = 0; i < prescriptions.length; i++) {
    const prescription = prescriptions[i];
    const chunk = chunks[i];

    // 0. Prescription name direct match (bonus 0-50)
    //    If a search term appears in the prescription name, it's a strong signal
    let nameBonus = 0;
    for (const term of searchTerms) {
      if (term.length >= 2 && prescription.name.includes(term)) {
        nameBonus = 50;
        break;
      }
    }

    // 1. Pattern / 辨证要点 matching (0-40 points)
    let patternScore = 0;
    if (preliminaryPattern) {
      const patterns = preliminaryPattern.split(/[\s,，、;；]+/).filter(Boolean);
      for (const pattern of patterns) {
        if (prescription.patternPoints.includes(pattern)) {
          patternScore = 40;
          break;
        }
      }
      // Partial match
      if (patternScore === 0) {
        for (const pattern of patterns) {
          if (pattern.length >= 2) {
            for (let j = 0; j < pattern.length - 1; j++) {
              const pair = pattern.substring(j, j + 2);
              if (prescription.patternPoints.includes(pair)) {
                patternScore = Math.max(patternScore, 20);
              }
            }
          }
        }
      }
    }
    // Also check if search terms appear in patternPoints directly
    // (handles cases where patternPoints contains disease names, not just TCM patterns)
    if (patternScore < 40) {
      for (const term of searchTerms) {
        if (term.length >= 2 && prescription.patternPoints.includes(term)) {
          patternScore = Math.max(patternScore, 30);
          break;
        }
      }
    }

    // 2. Keyword matching (0-30 points)
    let keywordMatches = 0;
    for (const term of searchTerms) {
      for (const keyword of chunk.keywords) {
        if (keyword.includes(term) || term.includes(keyword)) {
          keywordMatches++;
          break;
        }
      }
    }
    const keywordScore = searchTerms.length > 0
      ? (keywordMatches / searchTerms.length) * 30
      : 0;

    // 3. Symptom + indication matching (0-20 points)
    let symptomHits = 0;
    for (const term of searchTerms) {
      if (prescription.symptoms.includes(term)) symptomHits++;
      if (prescription.indication.includes(term)) symptomHits++;
    }
    const maxSymptomHits = searchTerms.length * 2;
    const symptomScore = maxSymptomHits > 0
      ? Math.min((symptomHits / maxSymptomHits) * 20, 20)
      : 0;

    // 4. Category matching (0-10 points)
    let categoryScore = 0;
    if (category && prescription.category.includes(category)) {
      categoryScore = 10;
    }

    const totalScore = nameBonus + patternScore + keywordScore + symptomScore + categoryScore;

    if (totalScore > 0) {
      results.push({
        prescription,
        score: totalScore,
        details: {
          patternScore: patternScore + nameBonus,
          keywordScore,
          symptomScore,
          categoryScore,
        },
      });
    }
  }

  results.sort((a, b) => b.score - a.score);

  return results.slice(0, topK);
}
