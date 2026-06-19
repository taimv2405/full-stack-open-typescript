import express from 'express';
import type { Request, Response } from 'express';
import type { NewPatient, Patient, NonSensitivePatient } from '../types.ts';
import patientService from '../services/patientService.ts';
import { newPatientParser, errorMiddleware } from '../middleware.ts';

const router = express.Router();

router.get('/', (_req, res: Response<NonSensitivePatient[]>) => {
  res.json(patientService.getAllNonSensitive());
});

router.get('/:id', (req, res: Response<Patient | { error: string }>) => {
  const returnedPatient = patientService.getById(req.params.id);
  if (!returnedPatient) {
    return res.status(404).json({ error: 'Patient not found' });
  }
  return res.json(returnedPatient);
});

router.post(
  '/',
  newPatientParser,
  (req: Request<unknown, unknown, NewPatient>, res: Response<Patient>) => {
    const createdPatient = patientService.createPatient(req.body);
    return res.json(createdPatient);
  },
);

router.use(errorMiddleware);

export default router;
