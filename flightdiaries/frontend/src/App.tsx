import { useEffect, useState } from 'react';
import axios from 'axios';
import type { Diary, NewDiary } from './types';
import diaryService from './services/diaryService';
import Diaries from './components/Diaries';
import DiaryForm from './components/DiaryForm';

const App = () => {
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    diaryService.getAll().then(setDiaries);
  }, []);

  const handleCreateDiary = async (newDiary: NewDiary) => {
    try {
      const returnedDiary = await diaryService.create(newDiary);
      setDiaries([...diaries, returnedDiary]);
      setError('');
      return true;
    } catch (e) {
      if (axios.isAxiosError(e)) {
        const issue = e.response?.data?.error?.[0];
        setError(
          issue
            ? `${issue.path[0] ?? 'field'}: ${issue.message}`
            : 'Request failed',
        );
      } else {
        setError('Unknown error occurred');
      }
      return false;
    }
  };

  return (
    <>
      <h1>Ilari's flight diaries</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <DiaryForm onCreate={handleCreateDiary} />
      <Diaries diaries={diaries} />
    </>
  );
};

export default App;
