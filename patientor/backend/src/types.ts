import { z } from 'zod';

export const Gender = {
  Male: 'male',
  Female: 'female',
  Other: 'other',
} as const;

export type Gender = (typeof Gender)[keyof typeof Gender];

export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

export const NewPatientSchema = z.object({
  name: z.string().trim().min(1, 'name cannot be empty or contain only spaces'),
  dateOfBirth: z.iso.date(),
  ssn: z.string().trim().min(1, 'ssn cannot be empty or contain only spaces'),
  gender: z.enum(Gender),
  occupation: z
    .string()
    .trim()
    .min(1, 'occupation cannot be empty or contain only spaces'),
});

export type NewPatient = z.infer<typeof NewPatientSchema>;

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface Entry {}

export interface Patient extends NewPatient {
  id: string;
  entries: Entry[];
}

export type NonSensitivePatient = Omit<Patient, 'ssn' | 'entries'>;
