export const isPositiveNumber = (value: number) => !isNaN(value) && value > 0;
export const isNonNegativeNumber = (value: number) =>
  !isNaN(value) && value >= 0;
