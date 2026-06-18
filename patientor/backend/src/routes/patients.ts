import express, { type Response, type Request } from 'express';
import type { NonSensitivePatient, Patient, NewPatient } from '../types.ts';
import patientService from '../services/patientService.ts';

const router = express.Router();

router.get('/', (_req, res: Response<NonSensitivePatient[]>) => {
  res.json(patientService.getAllNonSensitive());
});

router.post(
  '/',
  (
    req: Request<unknown, unknown, NewPatient>,
    res: Response<Patient | string>,
  ) => {
    const { name, dateOfBirth, ssn, gender, occupation } = req.body;

    if (!name || !dateOfBirth || !ssn || !gender || !occupation) {
      return res.status(400).send('Missing required fields');
    }

    const createdPatient = patientService.createPatient({
      name,
      dateOfBirth,
      ssn,
      gender,
      occupation,
    });
    return res.status(201).json(createdPatient);
  },
);

export default router;
