import patients from '../../data/patients.ts';
import type {
  NonSensitivePatient,
  NewPatient,
  Patient,
  NewEntry,
} from '../types.ts';
import { v1 as uuid } from 'uuid';

const getAllNonSensitive = (): NonSensitivePatient[] =>
  patients.map(({ ssn: _ssn, entries: _entries, ...patient }) => ({
    ...patient,
  }));

const getById = (id: string): Patient | undefined =>
  patients.find((patient) => patient.id === id);

const createPatient = (inputPatient: NewPatient): Patient => {
  const newPatient = { ...inputPatient, id: uuid(), entries: [] };
  patients.push(newPatient);
  return newPatient;
};
const createEntry = (patientId: string, newEntry: NewEntry): Patient => {
  const updatePatient = patients.find((patient) => patient.id === patientId);
  if (!updatePatient) throw new ReferenceError('Patient not found');
  updatePatient.entries.push({ ...newEntry, id: uuid() });
  return updatePatient;
};
export default { getAllNonSensitive, getById, createPatient, createEntry };
