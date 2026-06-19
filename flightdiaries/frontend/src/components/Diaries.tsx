import type { Diary } from '../types';

interface Props {
  diaries: Diary[];
}

const Diaries = ({ diaries }: Props) => (
  <>
    <h2>Diary entries</h2>
    {diaries.map((diary) => (
      <div key={diary.id} style={{ marginTop: 10 }}>
        <strong>{diary.date}</strong>
        <div>Weather: {diary.weather}</div>
        <div>Visibility: {diary.visibility}</div>
      </div>
    ))}
  </>
);

export default Diaries;
