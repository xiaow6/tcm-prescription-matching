import { NextRequest, NextResponse } from 'next/server';
import { analyzeSymptoms, matchPrescriptions } from '@/lib/llm';
import { searchPrescriptions } from '@/lib/prescriptionSearch';
import { ChatRequest, UserProfile } from '@/lib/types';

export const maxDuration = 60;

function formatProfileContext(profile?: UserProfile): string {
  if (!profile) return '';
  const parts: string[] = [];
  if (profile.name) parts.push(`姓名：${profile.name}`);
  if (profile.gender) parts.push(`性别：${profile.gender}`);
  if (profile.age) parts.push(`年龄：${profile.age}岁`);
  if (profile.medicalHistory) parts.push(`既往病史：${profile.medicalHistory}`);
  if (profile.allergies) parts.push(`过敏史：${profile.allergies}`);
  if (profile.isPregnant !== undefined) parts.push(`是否怀孕：${profile.isPregnant ? '是' : '否'}`);
  return parts.length > 0 ? `\n\n## 患者基本信息\n${parts.join('\n')}` : '';
}

export async function POST(req: NextRequest) {
  try {
    const body: ChatRequest = await req.json();
    const { messages, stage, roundCount, userProfile, locale = 'zh' } = body;

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: 'No messages provided' }, { status: 400 });
    }

    if (stage === 'collecting') {
      const profileContext = formatProfileContext(userProfile);
      const llm1Result = await analyzeSymptoms(messages, roundCount, profileContext, locale);

      if (!llm1Result.ready) {
        return NextResponse.json({
          type: 'follow_up',
          message: llm1Result.follow_up_question || (locale === 'en' ? 'Please describe more symptoms.' : '请描述更多症状信息。'),
          collectedSoFar: llm1Result.collected_so_far,
          roundCount: roundCount + 1,
        });
      }

      const searchResults = searchPrescriptions(
        llm1Result.search_query || '',
        llm1Result.preliminary_pattern,
        llm1Result.possible_category,
        5
      );

      if (searchResults.length === 0) {
        return NextResponse.json({
          type: 'no_match',
          message: locale === 'en'
            ? 'Based on your symptoms, no highly matching prescription was found in the knowledge base. We recommend consulting a TCM doctor in person for a more accurate diagnosis.'
            : '根据您描述的症状，在现有的协定处方知识库中未找到高度匹配的处方。建议您直接咨询中医师，进行面诊以获得更准确的诊治方案。',
          symptomAnalysis: llm1Result,
        });
      }

      const candidateText = searchResults.map((r, i) => {
        const p = r.prescription;
        return `### 候选${i + 1}：${p.name}（匹配评分：${r.score.toFixed(1)}）
- 编号：${p.id}
- 类别：${p.category}
- 功效：${p.efficacy}
- 主治：${p.indication}
- 适应症：${p.symptoms}
- 辨证要点：${p.patternPoints}
- 用法用量：${p.dosage}
- 注意事项：${p.precautions}
- 关键词：${p.keywords.join('、')}`;
      }).join('\n\n');

      const stream = await matchPrescriptions(llm1Result, candidateText, profileContext, locale);

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    }

    return NextResponse.json({ error: 'Invalid stage' }, { status: 400 });
  } catch (error) {
    console.error('Chat API error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: '服务暂时不可用，请稍后再试。', details: message },
      { status: 500 }
    );
  }
}
