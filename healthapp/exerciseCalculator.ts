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

const calculateExercises = (
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

console.log(calculateExercises([3, 0, 2, 4.5, 0, 3, 1], 2));
