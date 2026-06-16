import express from 'express';
import { isNonNegativeNumber, isPositiveNumber } from './utils.ts';
import { calculateBmi } from './bmiCalculator.ts';
import { calculateExercises } from './exerciseCalculator.ts';

const app = express();

app.use(express.json());

app.get('/hello', (_req, res) => res.send('Hello Full Stack!'));

app.get('/bmi', (req, res) => {
  const height = Number(req.query.height);
  const weight = Number(req.query.weight);

  if (!isPositiveNumber(height) || !isPositiveNumber(weight)) {
    return res.status(400).json({ error: 'malformatted parameters' });
  }

  const bmi = calculateBmi(height, weight);
  return res.json({ height, weight, bmi });
});

app.post('/exercises', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises, target } = req.body;

  if (daily_exercises === undefined || target === undefined) {
    return res.status(400).json({ error: 'parameters missing' });
  }

  if (
    !isPositiveNumber(Number(target)) ||
    !Array.isArray(daily_exercises) ||
    daily_exercises.length === 0 ||
    daily_exercises.some((hour) => !isNonNegativeNumber(Number(hour)))
  ) {
    return res.status(400).json({ error: 'malformatted parameters' });
  }

  const exerciseSummary = calculateExercises(
    daily_exercises.map(Number),
    Number(target),
  );
  return res.json(exerciseSummary);
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
