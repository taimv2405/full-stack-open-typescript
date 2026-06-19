import { useField } from '../hooks/useField';
import type { NewDiary, Visibility, Weather } from '../types';

interface Props {
  onCreate: (newDiary: NewDiary) => Promise<boolean>;
}

const DiaryForm = ({ onCreate }: Props) => {
  const date = useField('date');
  const weather = useField('text');
  const visibility = useField('text');
  const comment = useField('text');

  const handleCreateDiary = async (
    event: React.SyntheticEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    const success = await onCreate({
      date: date.inputProps.value,
      weather: weather.inputProps.value as Weather,
      visibility: visibility.inputProps.value as Visibility,
      comment: comment.inputProps.value,
    });
    if (success) {
      date.reset();
      weather.reset();
      visibility.reset();
      comment.reset();
    }
  };

  return (
    <>
      <h2>Create diary</h2>
      <form onSubmit={handleCreateDiary}>
        <div>
          <label>
            date:
            <input {...date.inputProps} />
          </label>
        </div>
        <div>
          <label>
            weather:
            <input {...weather.inputProps} />
          </label>
        </div>
        <div>
          <label>
            visibility:
            <input {...visibility.inputProps} />
          </label>
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
