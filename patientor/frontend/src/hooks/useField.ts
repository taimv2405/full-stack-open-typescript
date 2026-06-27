import { useState } from 'react';

const useField = (type: string) => {
  const [value, setValue] = useState('');

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const reset = () => setValue('');

  return { inputProps: { type, value, onChange }, reset };
};

export default useField;
