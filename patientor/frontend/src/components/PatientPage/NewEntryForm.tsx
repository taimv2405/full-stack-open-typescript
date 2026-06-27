import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import axios from 'axios';
import useField from '../../hooks/useField';
import { Diagnosis, HealthCheckRating, NewEntry } from '../../types';

export const NewEntryForm = ({
  onSubmit,
  diagnoses,
}: {
  onSubmit: (entry: NewEntry) => Promise<void>;
  diagnoses: Diagnosis[];
}) => {
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState('');
  const [entryType, setEntryType] = useState('HealthCheck');

  const date = useField('date');
  const description = useField('text');
  const specialist = useField('text');
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);

  // HealthCheck
  const [healthCheckRating, setHealthCheckRating] = useState<number>(0);

  // Hospital
  const dischargeDate = useField('date');
  const dischargeCriteria = useField('text');

  // Occupational Healthcare
  const employerName = useField('text');
  const sickLeaveStart = useField('date');
  const sickLeaveEnd = useField('date');

  const toggleVisibility = () => setVisible(!visible);

  const resetFields = () => {
    date.reset();
    description.reset();
    specialist.reset();
    setSelectedCodes([]);
    setHealthCheckRating(0);
    dischargeDate.reset();
    dischargeCriteria.reset();
    employerName.reset();
    sickLeaveStart.reset();
    sickLeaveEnd.reset();
    setEntryType('HealthCheck');
  };

  const handleAdd = async () => {
    try {
      const base = {
        date: date.inputProps.value,
        description: description.inputProps.value,
        specialist: specialist.inputProps.value,
        diagnosisCodes: selectedCodes.length > 0 ? selectedCodes : undefined,
      };

      let entry: NewEntry;
      switch (entryType) {
        case 'HealthCheck':
          entry = {
            ...base,
            type: 'HealthCheck',
            healthCheckRating: healthCheckRating as HealthCheckRating,
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
        Add New Entry
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
        slotProps={{ inputLabel: { shrink: true } }}
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

      <FormControl fullWidth margin="dense">
        <InputLabel id="diagnosis-codes-label">Diagnosis Codes</InputLabel>
        <Select
          labelId="diagnosis-codes-label"
          id="diagnosis-codes-select"
          multiple
          value={selectedCodes}
          onChange={(e) => {
            const val = e.target.value as string | string[];
            setSelectedCodes(typeof val === 'string' ? val.split(',') : val);
          }}
          input={
            <OutlinedInput id="diagnosis-codes-input" label="Diagnosis Codes" />
          }
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((code) => (
                <Chip key={code} label={code} />
              ))}
            </Box>
          )}
        >
          {diagnoses.map((d) => (
            <MenuItem key={d.code} value={d.code}>
              {d.code} — {d.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {entryType === 'HealthCheck' && (
        <FormControl fullWidth margin="dense" required>
          <InputLabel id="health-check-rating-label">
            Health Check Rating
          </InputLabel>
          <Select
            labelId="health-check-rating-label"
            id="health-check-rating-select"
            value={String(healthCheckRating)}
            label="Health Check Rating"
            onChange={(event: SelectChangeEvent) =>
              setHealthCheckRating(Number(event.target.value))
            }
          >
            {Object.entries(HealthCheckRating).map(([label, value]) => (
              <MenuItem key={value} value={value}>
                {value} - {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {entryType === 'Hospital' && (
        <>
          <TextField
            fullWidth
            label="Discharge Date"
            required
            margin="dense"
            slotProps={{ inputLabel: { shrink: true } }}
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
            slotProps={{ inputLabel: { shrink: true } }}
            {...sickLeaveStart.inputProps}
          />
          <TextField
            fullWidth
            label="Sick Leave End"
            margin="dense"
            slotProps={{ inputLabel: { shrink: true } }}
            {...sickLeaveEnd.inputProps}
          />
        </>
      )}

      <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
        <Button variant="contained" onClick={handleAdd}>
          Add
        </Button>
        <Button variant="outlined" onClick={toggleVisibility}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
};
