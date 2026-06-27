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

export const HealthCheckRating = {
  Healthy: 0,
  LowRisk: 1,
  HighRisk: 2,
  CriticalRisk: 3,
} as const;

type HealthCheckRating =
  (typeof HealthCheckRating)[keyof typeof HealthCheckRating];

const BaseEntrySchema = z.object({
  description: z.string().trim().min(1),
  date: z.iso.date(),
  specialist: z.string().trim().min(1),
  diagnosisCodes: z.array(z.string()).optional(),
});

const HealthCheckEntrySchema = BaseEntrySchema.extend({
  type: z.literal('HealthCheck'),
  healthCheckRating: z.union([
    z.literal(HealthCheckRating.Healthy),
    z.literal(HealthCheckRating.LowRisk),
    z.literal(HealthCheckRating.HighRisk),
    z.literal(HealthCheckRating.CriticalRisk),
  ]),
});

const HospitalEntrySchema = BaseEntrySchema.extend({
  type: z.literal('Hospital'),
  discharge: z.object({
    date: z.iso.date(),
    criteria: z.string().trim().min(1),
  }),
});

const OccupationalHealthcareEntrySchema = BaseEntrySchema.extend({
  type: z.literal('OccupationalHealthcare'),
  employerName: z.string().trim().min(1),
  sickLeave: z
    .object({
      startDate: z.iso.date(),
      endDate: z.iso.date(),
    })
    .optional(),
});

export const NewEntrySchema = z.discriminatedUnion('type', [
  HealthCheckEntrySchema,
  HospitalEntrySchema,
  OccupationalHealthcareEntrySchema,
]);

export type NewEntry = z.infer<typeof NewEntrySchema>;
export type Entry = NewEntry & { id: string };

export interface Patient extends NewPatient {
  id: string;
  entries: Entry[];
}

export type NonSensitivePatient = Omit<Patient, 'ssn' | 'entries'>;
