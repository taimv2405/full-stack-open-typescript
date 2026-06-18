import { Gender } from './types.ts';
import type { NewPatient } from './types.ts';

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const parseString = (label: string, text: unknown): string => {
  if (!isString(text)) {
    throw new Error(`Incorrect or missing ${label}`);
  }

  const trimmedString = text.trim();
  if (trimmedString.length === 0) {
    throw new Error(`Field ${label} cannot be empty or contain only spaces`);
  }

  return trimmedString;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const parseDate = (date: unknown): string => {
  if (!isString(date)) {
    throw new Error(`Incorrect or missing date`);
  }
  const trimmedDate = date.trim();

  if (!isDate(trimmedDate)) {
    throw new Error(`Incorrect date format: ${date}`);
  }
  return trimmedDate;
};

const isGender = (param: string): param is Gender => {
  return (Object.values(Gender) as string[]).includes(param);
};

const parseGender = (gender: unknown): Gender => {
  if (!isString(gender)) {
    throw new Error(`Incorrect or missing gender`);
  }
  const trimmedGender = gender.trim();

  if (!isGender(trimmedGender)) {
    throw new Error(`Incorrect gender: ${gender}`);
  }
  return trimmedGender;
};

export const parseNewPatient = (newPatientRequest: unknown): NewPatient => {
  if (!newPatientRequest || typeof newPatientRequest !== 'object') {
    throw new Error('Incorrect or missing data');
  }

  if (
    'name' in newPatientRequest &&
    'dateOfBirth' in newPatientRequest &&
    'ssn' in newPatientRequest &&
    'gender' in newPatientRequest &&
    'occupation' in newPatientRequest
  ) {
    const newPatient: NewPatient = {
      name: parseString('name', newPatientRequest.name),
      dateOfBirth: parseDate(newPatientRequest.dateOfBirth),
      ssn: parseString('ssn', newPatientRequest.ssn),
      gender: parseGender(newPatientRequest.gender),
      occupation: parseString('occupation', newPatientRequest.occupation),
    };

    return newPatient;
  }
  throw new Error('Incorrect data: some fields are missing');
};
