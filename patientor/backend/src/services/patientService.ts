import patients from '../../data/patients.ts';
import type { NonSensitivePatient, NewPatient, Patient } from '../types.ts';
import { v1 as uuid } from 'uuid';

const getAllNonSensitive = (): NonSensitivePatient[] =>
  patients.map(({ ssn: _ssn, entries: _entries, ...patient }) => ({ ...patient }));

const getById = (id: string): Patient | undefined =>
  patients.find((patient) => patient.id === id);

const createPatient = (inputPatient: NewPatient): Patient => {
  const newPatient = { ...inputPatient, id: uuid(), entries: [] };
  patients.push(newPatient);
  return newPatient;
};

export default { getAllNonSensitive, getById, createPatient };
