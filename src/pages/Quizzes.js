// material
import { Grid, Container, Stack, Typography, Button, Box } from '@mui/material';
import { Navigate, Link as RouterLink } from 'react-router-dom';
import { useState } from 'react';
import { Icon } from '@iconify/react';
// components
import Page from '../components/Page';
import Iconify from '../components/Iconify';
import { QuizCard } from '../sections/@app/quiz';

// ----------------------------------------------------------------------

export default function Quizzes({ isMy }) {
  const [Data, setData] = useState({
    quizzes: []
  });
  const [isLoading, setIsLoading] = useState(true);
  if (!isMy) {
    const getData = () => {
      const requestOptions = {
        method: 'GET'
      };
      fetch('https://mrmotor.herokuapp.com/quiz', requestOptions)
        .then(async (response) => {
          const data = await response.json();
          // check for error response
          if (!response.ok) {
            // get error message from body or default to response statusText
            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
          }
          setData(data);
        })
        .catch((error) => {
          console.error('There was an error!', error);
          alert('Wrong data inputed!');
          window.location.reload(false);
        });
    };
    if (isLoading) {
      getData();
      setIsLoading(false);
    }
    return (
      <Page title="Quizzes | Mr.Motor">
        <Container sx={{ position: 'relative' }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4" gutterBottom>
              Quizzes
            </Typography>
            {localStorage.getItem('token') !== null && (
              <Button
                variant="contained"
                component={RouterLink}
                to="/app/quiz/new"
                startIcon={<Iconify icon="eva:plus-fill" />}
              >
                Add your own quiz
              </Button>
            )}
          </Stack>

          {Data.quizzes.length === 0 && (
            <Box
              sx={{ margin: '0 auto', position: 'absolute', top: '500%', left: 'calc(50% - 75px)' }}
            >
              <img src="/static/spinner.gif" alt="spinner" style={{ width: '150px' }} />
            </Box>
          )}
          {Data.quizzes.length !== 0 && (
            <Grid container spacing={3}>
              {Data.quizzes.map((post, index) => (
                <QuizCard key={post.id} post={post} index={index} />
              ))}
            </Grid>
          )}
        </Container>
      </Page>
    );
  }
  if (localStorage.getItem('token') === null) return <Navigate to="/login" />;
  const getData = () => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token')
      }
    };
    fetch('https://mrmotor.herokuapp.com/quiz/my', requestOptions)
      .then(async (response) => {
        const data = await response.json();
        // check for error response
        if (!response.ok) {
          // get error message from body or default to response statusText
          const error = (data && data.message) || response.statusText;
          return Promise.reject(error);
        }
        localStorage.setItem('myquizzes', JSON.stringify(data));
        setData(data);
      })
      .catch((error) => {
        console.error('There was an error!', error);
        alert('Wrong data inputed!');
        window.location.reload(false);
      });
  };
  if (isLoading) {
    getData();
    setIsLoading(false);
  }
  return (
    <Page title="My Quizzes | Mr.Motor">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            My Quizzes
          </Typography>
          <Button
            variant="contained"
            component={RouterLink}
            to="/app/quiz/new"
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            New Quiz
          </Button>
        </Stack>

        {Data.quizzes.length === 0 && (
          <Box
            sx={{
              margin: '50px auto',
              border: '2px solid #FDCB6E',
              borderRadius: '15px',
              padding: '20px',
              width: {
                xl: '30%',
                sm: '60%',
                md: '30%',
                xs: '100%'
              }
            }}
          >
            <Icon
              icon="fa-solid:trophy"
              width="50%"
              color="#fdcb6e"
              style={{
                border: '2px solid #e17055',
                borderRadius: '20px',
                width: '100%',
                padding: '20%'
              }}
            />
            <Typography variant="h3" textAlign="center" style={{ marginTop: '15px' }}>
              No Quizzes made by You
            </Typography>
            <Button
              fullWidth
              variant="outlined"
              component={RouterLink}
              to="/app/quiz/new"
              style={{ marginTop: '15px' }}
            >
              Add new quiz
            </Button>
          </Box>
        )}
        {Data.quizzes.length !== 0 && (
          <Grid container spacing={3}>
            {Data.quizzes.map((post, index) => (
              <QuizCard key={post.id} post={post} index={index} />
            ))}
          </Grid>
        )}
      </Container>
    </Page>
  );
}
