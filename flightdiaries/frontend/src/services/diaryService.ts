import axios from 'axios';
import type { Diary } from '../types';

const BASE_URL = '/api/diaries';

const getAll = async (): Promise<Diary[]> => {
  const response = await axios.get<Diary[]>(BASE_URL);
  return response.data;
};

export default { getAll };
