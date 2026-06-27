import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Typography, Box, List, ListItem, ListItemText } from '@mui/material';
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import TransgenderIcon from '@mui/icons-material/Transgender';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import WorkIcon from '@mui/icons-material/Work';
import FavoriteIcon from '@mui/icons-material/Favorite';

import {
  Diagnosis,
  Patient,
  Entry,
  HealthCheckEntry,
  HospitalEntry,
  OccupationalHealthcareEntry,
} from '../../types';
import patientService from '../../services/patients';
import diagnosisService from '../../services/diagnoses';

const GenderIcon = ({ gender }: { gender: string }) => {
  if (gender === 'male') return <MaleIcon />;
  if (gender === 'female') return <FemaleIcon />;
  return <TransgenderIcon />;
};

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`,
  );
};

const healthRatingColors = ['green', 'yellow', 'orange', 'red'] as const;

const DiagnosisList = ({
  codes,
  diagnoses,
}: {
  codes?: string[];
  diagnoses: Diagnosis[];
}) => {
  if (!codes || codes.length === 0) return null;
  return (
    <List dense disablePadding sx={{ listStyleType: 'disc', pl: 4 }}>
      {codes.map((code) => (
        <ListItem key={code} sx={{ display: 'list-item', p: 0 }}>
          <ListItemText>
            {code}{' '}
            {diagnoses.find((diagnosis) => diagnosis.code === code)?.name}
          </ListItemText>
        </ListItem>
      ))}
    </List>
  );
};

const entryBoxSx = { border: '1px solid #000', padding: 1, marginBottom: 1 };

const HealthCheck = ({
  entry,
  diagnoses,
}: {
  entry: HealthCheckEntry;
  diagnoses: Diagnosis[];
}) => (
  <Box sx={entryBoxSx}>
    <Typography>
      {entry.date} <MonitorHeartIcon />
    </Typography>
    <Typography>
      <i>{entry.description}</i>
    </Typography>
    <FavoriteIcon sx={{ color: healthRatingColors[entry.healthCheckRating] }} />
    <DiagnosisList codes={entry.diagnosisCodes} diagnoses={diagnoses} />
    <Typography>diagnose by {entry.specialist}</Typography>
  </Box>
);

const Hospital = ({
  entry,
  diagnoses,
}: {
  entry: HospitalEntry;
  diagnoses: Diagnosis[];
}) => (
  <Box sx={entryBoxSx}>
    <Typography>
      {entry.date} <LocalHospitalIcon />
    </Typography>
    <Typography>
      <i>{entry.description}</i>
    </Typography>
    <DiagnosisList codes={entry.diagnosisCodes} diagnoses={diagnoses} />
    <Typography>
      discharge: {entry.discharge.date} — {entry.discharge.criteria}
    </Typography>
    <Typography>diagnose by {entry.specialist}</Typography>
  </Box>
);

const OccupationalHealthcare = ({
  entry,
  diagnoses,
}: {
  entry: OccupationalHealthcareEntry;
  diagnoses: Diagnosis[];
}) => (
  <Box sx={entryBoxSx}>
    <Typography>
      {entry.date} <WorkIcon /> {entry.employerName}
    </Typography>
    <Typography>
      <i>{entry.description}</i>
    </Typography>
    <DiagnosisList codes={entry.diagnosisCodes} diagnoses={diagnoses} />
    {entry.sickLeave && (
      <Typography>
        sick leave: {entry.sickLeave.startDate} – {entry.sickLeave.endDate}
      </Typography>
    )}
    <Typography>diagnose by {entry.specialist}</Typography>
  </Box>
);

const EntryDetail = ({
  entry,
  diagnoses,
}: {
  entry: Entry;
  diagnoses: Diagnosis[];
}) => {
  switch (entry.type) {
    case 'HealthCheck':
      return <HealthCheck entry={entry} diagnoses={diagnoses} />;
    case 'Hospital':
      return <Hospital entry={entry} diagnoses={diagnoses} />;
    case 'OccupationalHealthcare':
      return <OccupationalHealthcare entry={entry} diagnoses={diagnoses} />;
    default:
      return assertNever(entry);
  }
};

const PatientPage = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatient = async () => {
      if (!id) return;
      try {
        const [patient, diagnoses] = await Promise.all([
          patientService.getById(id),
          diagnosisService.getAll(),
        ]);
        setPatient(patient);
        setDiagnoses(diagnoses);
        setLoading(false);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          let errorMessage;
          if (error.response?.status === 404) {
            errorMessage = 'Patient not found';
          } else if (error.request) {
            errorMessage = 'Network error';
          } else {
            errorMessage = error.message;
          }
          setError(errorMessage);
        }
      }
    };
    void fetchPatient();
  }, [id]);

  if (error) return <Typography>{error}</Typography>;
  if (loading || !patient) return <Typography>Loading patient...</Typography>;

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography
          component="h1"
          variant="h5"
          sx={{ display: 'inline-block', marginRight: 1 }}
        >
          {patient.name}
        </Typography>
        <GenderIcon gender={patient.gender} />
      </Box>
      <Typography>ssn: {patient.ssn}</Typography>
      <Typography>occupation: {patient.occupation}</Typography>
      <Typography>dateOfBirth: {patient.dateOfBirth}</Typography>
      <Typography component="h2" variant="h6" sx={{ mt: 1 }}>
        entries
      </Typography>
      {patient.entries.map((entry) => (
        <EntryDetail key={entry.id} entry={entry} diagnoses={diagnoses} />
      ))}
    </>
  );
};

export default PatientPage;
