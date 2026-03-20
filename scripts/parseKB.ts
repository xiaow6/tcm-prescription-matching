import * as fs from 'fs';
import * as path from 'path';

interface Prescription {
  id: number;
  name: string;
  category: string;
  efficacy: string;
  indication: string;
  symptoms: string;
  patternPoints: string;
  dosage: string;
  precautions: string;
  keywords: string[];
}

function parseKnowledgeBase(mdContent: string): Prescription[] {
  const sections = mdContent.split(/\r?\n---\r?\n/).filter(s => s.trim());
  const prescriptions: Prescription[] = [];

  for (const section of sections) {
    const lines = section.trim();

    const idMatch = lines.match(/\*\*【编号】\*\*\s*(\d+)/);
    const nameMatch = lines.match(/\*\*【处方名称】\*\*\s*(.+)/);
    const categoryMatch = lines.match(/\*\*【类别】\*\*\s*(.+)/);
    const efficacyMatch = lines.match(/\*\*【功效】\*\*\s*(.+)/);
    const indicationMatch = lines.match(/\*\*【主治】\*\*\s*(.+)/);
    const symptomsMatch = lines.match(/\*\*【适应症】\*\*\s*(.+)/);
    const patternMatch = lines.match(/\*\*【辨证要点】\*\*\s*(.+)/);
    const dosageMatch = lines.match(/\*\*【用法用量】\*\*\s*(.+)/);
    const precautionsMatch = lines.match(/\*\*【注意事项】\*\*\s*(.+)/);
    const keywordsMatch = lines.match(/\*\*【关键词】\*\*\s*(.+)/);

    if (!idMatch || !nameMatch) continue;

    const keywords = keywordsMatch
      ? keywordsMatch[1].split(/[、，,]/).map(k => k.trim()).filter(Boolean)
      : [];

    prescriptions.push({
      id: parseInt(idMatch[1]),
      name: nameMatch[1].trim(),
      category: categoryMatch?.[1]?.trim() || '',
      efficacy: efficacyMatch?.[1]?.trim() || '',
      indication: indicationMatch?.[1]?.trim() || '',
      symptoms: symptomsMatch?.[1]?.trim() || '',
      patternPoints: patternMatch?.[1]?.trim() || '',
      dosage: dosageMatch?.[1]?.trim() || '',
      precautions: precautionsMatch?.[1]?.trim() || '',
      keywords,
    });
  }

  return prescriptions;
}

const mdPath = path.join(__dirname, '..', 'src', 'data', '协定处方知识库.md');
const outPath = path.join(__dirname, '..', 'src', 'data', 'prescriptions.json');

const md = fs.readFileSync(mdPath, 'utf-8');
const result = parseKnowledgeBase(md);

fs.writeFileSync(outPath, JSON.stringify(result, null, 2), 'utf-8');
console.log(`Parsed ${result.length} prescriptions → ${outPath}`);

if (result.length !== 86) {
  console.warn(`⚠️  Expected 86 prescriptions, got ${result.length}`);
}
