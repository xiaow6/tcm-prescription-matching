import { getPrescriptions } from './knowledgeBase';

let cachedIndex: string | null = null;

/**
 * Build a condensed index of all 86 prescriptions for LLM context.
 * Format: ID|名称|类别|关键词|辨证要点
 * ~3000 tokens total — fits easily in context window.
 */
export function getPrescriptionIndex(): string {
  if (!cachedIndex) {
    const prescriptions = getPrescriptions();
    const lines = prescriptions.map(p =>
      `${p.id}|${p.name}|${p.category}|${p.keywords.join('、')}|${p.patternPoints}`
    );
    cachedIndex = lines.join('\n');
  }
  return cachedIndex;
}
