import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Typography, Box, List, ListItem, ListItemText } from '@mui/material';
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import TransgenderIcon from '@mui/icons-material/Transgender';

import { Patient } from '../../types';

import patientService from '../../services/patients';

const GenderIcon = ({ gender }: { gender: string }) => {
  if (gender === 'male') return <MaleIcon />;
  if (gender === 'female') return <FemaleIcon />;
  return <TransgenderIcon />;
};

const PatientPage = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatient = async () => {
      if (!id) return;
      try {
        const patient = await patientService.getById(id);
        setPatient(patient);
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
        <Box key={entry.id}>
          <Typography>
            {entry.date} <i>{entry.description}</i>
          </Typography>
          {entry.diagnosisCodes && (
            <List dense disablePadding sx={{ listStyleType: 'disc', pl: 4 }}>
              {entry.diagnosisCodes.map((code) => (
                <ListItem key={code} sx={{ display: 'list-item', p: 0 }}>
                  <ListItemText>{code}</ListItemText>
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      ))}
    </>
  );
};

export default PatientPage;
