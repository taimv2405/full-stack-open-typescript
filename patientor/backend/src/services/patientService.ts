import patients from '../../data/patients.ts';
import type { NonSensitivePatient, NewPatient, Patient } from '../types.ts';
import { v1 as uuid } from 'uuid';

const getAllNonSensitive = (): NonSensitivePatient[] =>
  patients.map(({ ssn: _ssn, ...patient }) => ({ ...patient }));

const createPatient = (inputPatient: NewPatient): Patient => {
  const newPatient = { ...inputPatient, id: uuid() };
  patients.push(newPatient);
  return newPatient;
};

export default { getAllNonSensitive, createPatient };
