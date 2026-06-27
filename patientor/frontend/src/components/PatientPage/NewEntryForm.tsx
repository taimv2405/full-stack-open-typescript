import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
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
  const [entryType, setEntryType] = useState('');

  const date = useField('text');
  const description = useField('text');
  const specialist = useField('text');
  const diagnosisCodes = useField('text');

  // HealthCheck
  const healthCheckRating = useField('number');

  // Hospital
  const dischargeDate = useField('text');
  const dischargeCriteria = useField('text');

  // Occupational Healthcare
  const employerName = useField('text');
  const sickLeaveStart = useField('text');
  const sickLeaveEnd = useField('text');

  const toggleVisibility = () => setVisible(!visible);

  const resetFields = () => {
    date.reset();
    description.reset();
    specialist.reset();
    diagnosisCodes.reset();
    healthCheckRating.reset();
    dischargeDate.reset();
    dischargeCriteria.reset();
    employerName.reset();
    sickLeaveStart.reset();
    sickLeaveEnd.reset();
    setEntryType('');
  };

  const handleAdd = async () => {
    try {
      const base = {
        date: date.inputProps.value,
        description: description.inputProps.value,
        specialist: specialist.inputProps.value,
        diagnosisCodes: diagnosisCodes.inputProps.value
          ? diagnosisCodes.inputProps.value.split(',').map((c) => c.trim())
          : undefined,
      };

      let entry: NewEntry;
      switch (entryType) {
        case 'HealthCheck':
          entry = {
            ...base,
            type: 'HealthCheck',
            healthCheckRating: Number(
              healthCheckRating.inputProps.value,
            ) as HealthCheckRating,
          };
          break;
        case 'Hospital':
          entry = {
            ...base,
            type: 'Hospital',
            discharge: {
              date: dischargeDate.inputProps.value,
              criteria: dischargeCriteria.inputProps.value,
            },
          };
          break;
        case 'OccupationalHealthcare':
          entry = {
            ...base,
            type: 'OccupationalHealthcare',
            employerName: employerName.inputProps.value,
            sickLeave:
              sickLeaveStart.inputProps.value && sickLeaveEnd.inputProps.value
                ? {
                    startDate: sickLeaveStart.inputProps.value,
                    endDate: sickLeaveEnd.inputProps.value,
                  }
                : undefined,
          };
          break;
        default:
          throw new Error(`Unknown entry type: ${entryType}`);
      }

      await onSubmit(entry);
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
      } else if (e instanceof Error) {
        setError(e.message);
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
        New Entry
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 1 }}>
          {error}
        </Alert>
      )}

      <FormControl fullWidth margin="dense">
        <InputLabel>Entry Type</InputLabel>
        <Select
          label="Entry Type"
          value={entryType}
          onChange={(e: SelectChangeEvent) => setEntryType(e.target.value)}
        >
          <MenuItem value="HealthCheck">Health Check</MenuItem>
          <MenuItem value="Hospital">Hospital</MenuItem>
          <MenuItem value="OccupationalHealthcare">
            Occupational Healthcare
          </MenuItem>
        </Select>
      </FormControl>

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
        label="Diagnosis Codes (comma-separated)"
        margin="dense"
        {...diagnosisCodes.inputProps}
      />

      {entryType === 'HealthCheck' && (
        <TextField
          fullWidth
          label="Health Check Rating (0-3)"
          required
          margin="dense"
          {...healthCheckRating.inputProps}
        />
      )}

      {entryType === 'Hospital' && (
        <>
          <TextField
            fullWidth
            label="Discharge Date"
            required
            margin="dense"
            {...dischargeDate.inputProps}
          />
          <TextField
            fullWidth
            label="Discharge Criteria"
            required
            margin="dense"
            {...dischargeCriteria.inputProps}
          />
        </>
      )}

      {entryType === 'OccupationalHealthcare' && (
        <>
          <TextField
            fullWidth
            label="Employer Name"
            required
            margin="dense"
            {...employerName.inputProps}
          />
          <TextField
            fullWidth
            label="Sick Leave Start"
            margin="dense"
            {...sickLeaveStart.inputProps}
          />
          <TextField
            fullWidth
            label="Sick Leave End"
            margin="dense"
            {...sickLeaveEnd.inputProps}
          />
        </>
      )}

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
