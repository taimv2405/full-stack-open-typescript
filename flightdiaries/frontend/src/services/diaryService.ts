import axios from 'axios';
import type { Diary, NewDiary } from '../types';

const BASE_URL = '/api/diaries';

const getAll = async (): Promise<Diary[]> => {
  const response = await axios.get<Diary[]>(BASE_URL);
  return response.data;
};

const create = async (newDiary: NewDiary): Promise<Diary> => {
  const response = await axios.post<Diary>(BASE_URL, newDiary);
  return response.data;
};

export default { getAll, create };
