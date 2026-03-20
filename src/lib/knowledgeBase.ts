import prescriptionsData from '@/data/prescriptions.json';
import { Prescription } from './types';

let cachedPrescriptions: Prescription[] | null = null;

export function getPrescriptions(): Prescription[] {
  if (!cachedPrescriptions) {
    cachedPrescriptions = prescriptionsData as Prescription[];
  }
  return cachedPrescriptions;
}

export function getPrescriptionById(id: number): Prescription | undefined {
  return getPrescriptions().find(p => p.id === id);
}

// Build keyword chunks for efficient search
// Each chunk contains prescription ID + all searchable text
export interface PrescriptionChunk {
  prescriptionId: number;
  prescriptionName: string;
  category: string;
  searchableText: string; // combined keywords + symptoms + patternPoints + indication
  keywords: string[];
}

let cachedChunks: PrescriptionChunk[] | null = null;

export function getPrescriptionChunks(): PrescriptionChunk[] {
  if (!cachedChunks) {
    cachedChunks = getPrescriptions().map(p => ({
      prescriptionId: p.id,
      prescriptionName: p.name,
      category: p.category,
      searchableText: [
        p.keywords.join(' '),
        p.symptoms,
        p.patternPoints,
        p.indication,
        p.efficacy,
      ].join(' '),
      keywords: p.keywords,
    }));
  }
  return cachedChunks;
}
