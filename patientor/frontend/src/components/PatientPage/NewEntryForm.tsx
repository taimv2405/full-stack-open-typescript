import { useState } from 'react';
import { Alert, Box, Button, TextField, Typography } from '@mui/material';
import axios from 'axios';
import useField from '../../hooks/useField';
import { HealthCheckRating, NewEntry } from '../../types';

export const NewEntryForm = ({
  onSubmit,
}: {
  onSubmit: (entry: NewEntry) => Promise<void>;
}) => {
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState('');
  const date = useField('text');
  const description = useField('text');
  const specialist = useField('text');
  const healthCheckRating = useField('number');
  const diagnosisCodes = useField('text');

  const toggleVisibility = () => setVisible(!visible);

  const resetFields = () => {
    date.reset();
    description.reset();
    specialist.reset();
    healthCheckRating.reset();
    diagnosisCodes.reset();
  };

  const handleAdd = async () => {
    try {
      await onSubmit({
        type: 'HealthCheck',
        date: date.inputProps.value,
        description: description.inputProps.value,
        specialist: specialist.inputProps.value,
        healthCheckRating: Number(
          healthCheckRating.inputProps.value,
        ) as HealthCheckRating,
        diagnosisCodes: diagnosisCodes.inputProps.value
          ? diagnosisCodes.inputProps.value.split(',').map((c) => c.trim())
          : undefined,
      });
      setError('');
      resetFields();
      toggleVisibility();
    } catch (e) {
      if (axios.isAxiosError(e)) {
        const issues = e.response?.data?.error;
        if (Array.isArray(issues)) {
          setError(
            issues
              .map(
                (i: { path: string[]; message: string }) =>
                  `${i.path.join('.')}: ${i.message}`,
              )
              .join(', '),
          );
        } else {
          setError(e.message);
        }
      }
    }
  };

  if (!visible) {
    return (
      <Button variant="contained" sx={{ mb: 2 }} onClick={toggleVisibility}>
        ADD ENTRY
      </Button>
    );
  }

  return (
    <Box sx={{ border: '2px dashed #aaa', borderRadius: 1, p: 2, mb: 2 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        New HealthCheck Entry
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 1 }}>
          {error}
        </Alert>
      )}
      <TextField
        fullWidth
        label="Date"
        required
        margin="dense"
        {...date.inputProps}
      />
      <TextField
        fullWidth
        label="Description"
        required
        margin="dense"
        {...description.inputProps}
      />
      <TextField
        fullWidth
        label="Specialist"
        required
        margin="dense"
        {...specialist.inputProps}
      />
      <TextField
        fullWidth
        label="Health Check Rating (0-3)"
        required
        margin="dense"
        {...healthCheckRating.inputProps}
      />
      <TextField
        fullWidth
        label="Diagnosis Codes (comma-separated)"
        margin="dense"
        {...diagnosisCodes.inputProps}
      />
      <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
        <Button variant="contained" onClick={handleAdd}>
          ADD
        </Button>
        <Button variant="outlined" onClick={toggleVisibility}>
          CANCEL
        </Button>
      </Box>
    </Box>
  );
};
