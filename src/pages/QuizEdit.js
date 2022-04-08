import { Navigate } from 'react-router-dom';
import { useState } from 'react';

// material
import { styled } from '@mui/material/styles';
import { Stack, Container, Typography } from '@mui/material';
// components
import Page from '../components/Page';
import NewQuizForm from '../sections/@app/quiz/NewQuizForm';
// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex'
  }
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: '0 auto',
  display: 'flex',
  minHeight: '45vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(0, 0)
}));

// ----------------------------------------------------------------------

export default function QuizEdit() {
  const [firstStep, setFirstStep] = useState(true);
  const [quiz, setQuiz] = useState();
  if (localStorage.getItem('token') === null) {
    return <Navigate to="/app/home" />;
  }
  return (
    <RootStyle title="New Quiz | Mr. Motor">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h4" gutterBottom>
            New Quiz
          </Typography>
        </Stack>
        <ContentStyle>
          <NewQuizForm />
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}
