import { useEffect, useState } from 'react';
import type { Diary, NewDiary } from './types';
import diaryService from './services/diaryService';
import Diaries from './components/Diaries';
import DiaryForm from './components/DiaryForm';

const App = () => {
  const [diaries, setDiaries] = useState<Diary[]>([]);

  useEffect(() => {
    diaryService.getAll().then(setDiaries);
  }, []);

  const handleCreateDiary = async (newDiary: NewDiary) => {
    const returnedDiary: Diary = await diaryService.create(newDiary);
    setDiaries([...diaries, returnedDiary]);
  };

  return (
    <>
      <h1>Ilari's flight diaries</h1>
      <Diaries diaries={diaries} />
      <DiaryForm onCreate={handleCreateDiary} />
    </>
  );
};

export default App;
