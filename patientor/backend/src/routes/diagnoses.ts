import express, { type Response } from 'express';
import type { Diagnosis } from '../types.ts';
import diagnosisService from '../services/diagnosisService.ts';

const router = express.Router();

router.get('/', (_req, res: Response<Diagnosis[]>) => {
  res.json(diagnosisService.getAll());
});

export default router;
