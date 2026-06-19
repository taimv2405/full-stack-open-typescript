import { useEffect, useState } from 'react';
import type { Diary } from './types';
import diaryService from './services/diaryService';
import Diaries from './components/Diaries';

const App = () => {
  const [diaries, setDiaries] = useState<Diary[]>([]);

  useEffect(() => {
    diaryService.getAll().then(setDiaries);
  }, []);

  return (
    <>
      <h1>Ilari's flight diaries</h1>
      <Diaries diaries={diaries} />
    </>
  );
};

export default App;
