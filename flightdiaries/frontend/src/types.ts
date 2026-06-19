export type Weather = 'sunny' | 'rainy' | 'cloudy' | 'stormy' | 'windy';
export type Visibility = 'great' | 'good' | 'ok' | 'poor';

export interface Diary {
  id: number;
  date: string;
  weather: Weather;
  visibility: Visibility;
}
