import express from 'express';
import type { Request, Response } from 'express';
import type { NewPatient, Patient, NonSensitivePatient } from '../types.ts';
import patientService from '../services/patientService.ts';
import { newPatientParser, errorMiddleware } from '../middleware.ts';

const router = express.Router();

router.get('/', (_req, res: Response<NonSensitivePatient[]>) => {
  res.json(patientService.getAllNonSensitive());
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
