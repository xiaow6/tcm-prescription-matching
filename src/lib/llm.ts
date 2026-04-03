import Anthropic from '@anthropic-ai/sdk';
import { LLM1Output } from './types';
import { SYMPTOM_COLLECTOR_SYSTEM_PROMPT } from './prompts/symptomCollector';
import { PRESCRIPTION_MATCHER_SYSTEM_PROMPT } from './prompts/prescriptionMatcher';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const MODEL = 'claude-sonnet-4-20250514';

const EN_INSTRUCTION = `

## Language Instruction
The user is using the English interface. You MUST:
1. Output all follow_up_question text in English
2. Keep the JSON keys unchanged (they are code identifiers)
3. The search_query should still use Chinese medical terms for accurate knowledge base matching
4. The symptoms array should contain both Chinese standard terms AND English translations in parentheses, e.g. ["五心烦热 (heat in palms and soles)", "口干 (dry mouth)"]`;

const EN_MATCHER_INSTRUCTION = `

## Language Instruction
The user is using the English interface. You MUST:
1. Output ALL text in English, including headers, analysis, and recommendations
2. Translate Chinese medical terms with explanations, e.g. "阴虚火旺 (Yin Deficiency with Fire)"
3. Keep prescription names in Chinese with English translation: e.g. "早泄1方 (Premature Ejaculation Formula 1)"
4. Translate all table content to English
5. The prescription data from the knowledge base is in Chinese - translate it for the user`;

/**
 * LLM1: Symptom collection and analysis
 */
export async function analyzeSymptoms(
  messages: { role: 'user' | 'assistant'; content: string }[],
  roundCount: number,
  profileContext: string = '',
  locale: string = 'zh'
): Promise<LLM1Output> {
  let systemPrompt = SYMPTOM_COLLECTOR_SYSTEM_PROMPT;

  if (profileContext) {
    systemPrompt += profileContext;
  }

  if (locale === 'en') {
    systemPrompt += EN_INSTRUCTION;
  }

  if (roundCount >= 2) {
    systemPrompt += '\n\n## 特别指示\n这已经是第' + (roundCount + 1) + '轮对话了，请务必设置 ready: true，用已有信息进行最佳判断。';
  }

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    system: systemPrompt,
    messages: messages.map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';

  const jsonMatch = text.match(/```json\s*([\s\S]*?)```/) || text.match(/({[\s\S]*})/);
  if (!jsonMatch) {
    throw new Error('LLM1 did not return valid JSON');
  }

  try {
    return JSON.parse(jsonMatch[1]) as LLM1Output;
  } catch {
    throw new Error('Failed to parse LLM1 JSON output');
  }
}

/**
 * LLM Semantic Search: Send condensed index of ALL prescriptions to LLM,
 * let it pick the best candidates using its understanding of TCM.
 * Returns array of prescription IDs.
 */
export async function llmSelectCandidates(
  symptomAnalysis: LLM1Output,
  prescriptionIndex: string,
  profileContext: string = ''
): Promise<number[]> {
  const systemPrompt = `你是中医辨证选方专家。根据患者症状分析，从处方索引中选出最匹配的处方。

## 处方索引格式
每行一个处方：编号|名称|类别|关键词|辨证要点

## 选方原则
1. 辨证论治优先：证型匹配是第一位
2. 症状匹配：患者症状与处方适应症的重合度
3. 人群匹配：年龄、性别、合并症等
4. 注意鉴别相似处方（如胃肠合剂1-5方的区分）

## 输出格式
只输出 JSON 数组，包含最匹配的 3-5 个处方编号，按匹配度从高到低排列。
不要输出任何其他内容。

示例：[8, 9, 10]`;

  const userMessage = `## 患者症状
症状：${symptomAnalysis.symptoms?.join('、') || '未知'}
症状特征：${symptomAnalysis.symptom_features || '未提供'}
既往病史：${symptomAnalysis.medical_history || '未提供'}
舌脉：${symptomAnalysis.tongue_pulse || '未提供'}
初步辨证：${symptomAnalysis.preliminary_pattern || '待定'}
${profileContext}

## 全部处方索引（共86个）
${prescriptionIndex}

请选出最匹配的3-5个处方编号：`;

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 256,
    system: systemPrompt,
    messages: [{ role: 'user', content: userMessage }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';

  const arrMatch = text.match(/\[[\d,\s]+\]/);
  if (!arrMatch) return [];

  try {
    const ids = JSON.parse(arrMatch[0]) as number[];
    return ids.filter(id => id >= 1 && id <= 86);
  } catch {
    return [];
  }
}

/**
 * LLM2: Prescription matching and recommendation (streaming)
 */
export async function matchPrescriptions(
  symptomAnalysis: LLM1Output,
  candidatePrescriptions: string,
  profileContext: string = '',
  locale: string = 'zh'
): Promise<ReadableStream> {
  const systemPrompt = locale === 'en'
    ? PRESCRIPTION_MATCHER_SYSTEM_PROMPT + EN_MATCHER_INSTRUCTION
    : PRESCRIPTION_MATCHER_SYSTEM_PROMPT;

  const userMessage = `## 患者症状分析

症状：${symptomAnalysis.symptoms?.join('、') || '未知'}
症状特征：${symptomAnalysis.symptom_features || '未提供'}
既往病史：${symptomAnalysis.medical_history || '未提供'}
舌脉：${symptomAnalysis.tongue_pulse || '未提供'}
初步辨证：${symptomAnalysis.preliminary_pattern || '待定'}
${profileContext}

## 候选协定处方（来自知识库检索 + AI 语义匹配）

${candidatePrescriptions}

请根据以上信息，从候选处方中选出最匹配的1-3个进行推荐。如果没有合适的，请诚实告知。`;

  const stream = await client.messages.stream({
    model: MODEL,
    max_tokens: 2048,
    system: systemPrompt,
    messages: [{ role: 'user', content: userMessage }],
  });

  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`));
          }
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });
}
