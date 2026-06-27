import express from 'express';
import type { Request, Response } from 'express';
import type {
  NewPatient,
  NewEntry,
  Patient,
  NonSensitivePatient,
} from '../types.ts';
import patientService from '../services/patientService.ts';
import {
  newPatientParser,
  errorMiddleware,
  newEntryParser,
} from '../middleware.ts';

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
  '/:id/entries',
  newEntryParser,
  (
    req: Request<{ id: string }, unknown, NewEntry>,
    res: Response<Patient | { error: string }>,
  ) => {
    try {
      const updatedPatient = patientService.createEntry(
        req.params.id,
        req.body,
      );
      return res.status(201).json(updatedPatient);
    } catch (error: unknown) {
      if (error instanceof ReferenceError) {
        return res.status(404).json({ error: 'Patient not found' });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  },
);

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
