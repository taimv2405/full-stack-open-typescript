import { useState } from 'react';
import { useField } from '../hooks/useField';
import { Visibility, Weather, type NewDiary } from '../types';

interface Props {
  onCreate: (newDiary: NewDiary) => Promise<boolean>;
}

const DiaryForm = ({ onCreate }: Props) => {
  const date = useField('date');
  const [weather, setWeather] = useState<Weather>(Weather.Sunny);
  const [visibility, setVisibility] = useState<Visibility>(Visibility.Great);
  const comment = useField('text');

  const handleCreateDiary = async (
    event: React.SyntheticEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    const success = await onCreate({
      date: date.inputProps.value,
      weather,
      visibility,
      comment: comment.inputProps.value,
    });
    if (success) {
      date.reset();
      setWeather(Weather.Sunny);
      setVisibility(Visibility.Great);
      comment.reset();
    }
  };

  const handleChangeWeather = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWeather(event.target.value as Weather);
  };

  const handleChangeVisibility = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setVisibility(event.target.value as Visibility);
  };

  return (
    <>
      <h2>Create diary</h2>
      <form
        onSubmit={handleCreateDiary}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          alignItems: 'start',
        }}
      >
        <div>
          <label>
            date:
            <input {...date.inputProps} />
          </label>
        </div>
        <div>
          weather:
          {Object.values(Weather).map((weatherType) => (
            <label key={weatherType}>
              {weatherType}
              <input
                type="radio"
                name="weather"
                value={weatherType}
                checked={weather === weatherType}
                onChange={handleChangeWeather}
              />
            </label>
          ))}
        </div>
        <div>
          visibility:
          {Object.values(Visibility).map((visibilityType) => (
            <label key={visibilityType}>
              {visibilityType}
              <input
                type="radio"
                name="visibility"
                value={visibilityType}
                checked={visibility === visibilityType}
                onChange={handleChangeVisibility}
              />
            </label>
          ))}
        </div>
        <div>
          <label>
            comment:
            <input {...comment.inputProps} />
          </label>
        </div>
        <button type="submit">Create</button>
      </form>
    </>
  );
};

export default DiaryForm;
