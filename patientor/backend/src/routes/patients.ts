import express, { type Response } from 'express';
import type { NonSensitivePatient } from '../types.ts';
import patientService from '../services/patientService.ts';
import { parseNewPatient } from '../utils.ts';

const router = express.Router();

router.get('/', (_req, res: Response<NonSensitivePatient[]>) => {
  res.json(patientService.getAllNonSensitive());
});

router.post('/', (req, res) => {
  try {
    const newPatient = parseNewPatient(req.body);
    const createdPatient = patientService.createPatient(newPatient);
    return res.status(201).json(createdPatient);
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    return res.status(400).send(errorMessage);
  }
});

export default router;
