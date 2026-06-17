import patients from '../../data/patients.ts';
import type { NonSensitivePatient } from '../types.ts';

const getAllNonSensitive = (): NonSensitivePatient[] =>
  patients.map(({ ssn: _ssn, ...patient }) => ({ ...patient }));

export default { getAllNonSensitive };
