import { isPositiveNumber, isNonNegativeNumber } from './utils.ts';

interface WorkoutData {
  dailyHours: number[];
  target: number;
}

type Rating = 1 | 2 | 3;

interface RatingResult {
  rating: Rating;
  ratingDescription: string;
}

const ratePerformance = (ratio: number): RatingResult => {
  if (ratio >= 1)
    return { rating: 3, ratingDescription: 'great, you reached your target!' };
  if (ratio >= 0.5)
    return { rating: 2, ratingDescription: 'not too bad but could be better' };
  return { rating: 1, ratingDescription: 'bad' };
};

interface ExerciseSummary {
  periodLength: number;
  trainingDays: number;
  target: number;
  average: number;
  success: boolean;
  rating: Rating;
  ratingDescription: string;
}

const parseExerciseArguments = (args: string[]): WorkoutData => {
  if (args.length < 4) throw new Error('Not enough arguments');

  const [target, ...dailyHours] = args.slice(2).map((arg) => Number(arg));

  if (isPositiveNumber(target) && dailyHours.every(isNonNegativeNumber)) {
    return { dailyHours, target };
  } else {
    throw new Error('Provided values were not valid numbers!');
  }
};

export const calculateExercises = (
  dailyHours: number[],
  target: number,
): ExerciseSummary => {
  const periodLength = dailyHours.length;
  const trainingDays = dailyHours.filter((hour) => hour > 0).length;
  const average =
    dailyHours.reduce((sum, hour) => sum + hour, 0) / periodLength;
  const success = average >= target;
  const ratio = average / target;
  const { rating, ratingDescription } = ratePerformance(ratio);

  return {
    periodLength,
    trainingDays,
    target,
    average,
    success,
    rating,
    ratingDescription,
  };
};

if (process.argv[1] === import.meta.filename) {
  try {
    const { dailyHours, target } = parseExerciseArguments(process.argv);
    console.log(calculateExercises(dailyHours, target));
  } catch (error: unknown) {
    let errorMessage = 'Something bad happened.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    console.log(errorMessage);
  }
}
