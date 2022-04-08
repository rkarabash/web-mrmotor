import { Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Icon } from '@iconify/react';
import {
  Box,
  Stack,
  Container,
  Typography,
  Button,
  Alert,
  AlertTitle,
  Skeleton
} from '@mui/material';
// components
import Page from '../components/Page';

// ----------------------------------------------------------------------

export default function Quiz() {
  //----------------------------------------
  const navigate = useNavigate();
  const [flag, setFlag] = useState(true);
  const [quiz, setQuiz] = useState({
    id: 0,
    title: '',
    description: '',
    timer: 10,
    author: {
      id: 0,
      name: '',
      email: '',
      avatar: ''
    },
    quizItems: []
  });
  //---------------------------------------
  if (!window.location.search.startsWith('?id=') || window.location.search.length === 4) {
    return <Navigate to="/app/quizzes" />;
  }
  if (localStorage.getItem('token') === null) return <Navigate to="/login" />;
  const id = parseInt(window.location.search.substring(4), 10);
  const user = JSON.parse(localStorage.getItem('user'));
  let icon;
  if (id % 4 === 0) {
    icon = 'mdi:steering';
  } else if (id % 3 === 0) {
    icon = 'fa-solid:trophy';
  } else if (id % 2 === 0) {
    icon = 'mdi:steering';
  } else {
    icon = 'bxs:car';
  }
  //-----------------------------------------------
  const getQuiz = () => {
    const requestOptions = {
      method: 'GET',
      headers: {
        Authorization: localStorage.getItem('token')
      }
    };
    fetch(`https://mrmotor.herokuapp.com/quiz/${id}`, requestOptions)
      .then(async (response) => {
        const data = await response.json();
        // check for error response
        if (!response.ok) {
          // get error message from body or default to response statusText
          const error = (data && data.message) || response.statusText;
          return Promise.reject(error);
        }
        localStorage.setItem('quiz', JSON.stringify(data));
        setQuiz(data);
      })
      .catch((error) => {
        console.error('There was an error!', error);
        alert('Wrong data inputed!');
        window.location.reload(false);
      });
  };
  if (flag) {
    setFlag(false);
    getQuiz();
  }

  return (
    <Page title={`${quiz.title} | Mr. Motor`}>
      <Container maxWidth="sm" sx={{ padding: '15px', borderRadius: '25px' }}>
        <Stack spacing={1.5}>
          {quiz.id === 0 ? (
            <Skeleton
              sx={{ minHeight: '60vh', marginBottom: -10, marginTop: -13 }}
              animation="wave"
            />
          ) : (
            <Box
              sx={{
                backgroundColor: '#74B9FF',
                minHeight: '35vh',
                borderRadius: '25px',
                position: 'relative'
              }}
            >
              <Typography variant="h3" sx={{ position: 'absolute', width: '45%', margin: '30px' }}>
                {quiz.title === '' ? <Skeleton /> : quiz.title}
              </Typography>
              <Box
                component={Icon}
                icon={icon}
                width="30%"
                height="auto"
                color="#FDCB6E"
                sx={{ position: 'absolute', bottom: '15px', right: '20px' }}
              />
            </Box>
          )}

          <Typography variant="h4">Description:</Typography>
          <Typography variant="body1" color="#DFE6E9" sx={{ marginBottom: '20px' }}>
            {quiz.description === '' ? (
              <Skeleton height="30vh" sx={{ marginTop: -7, marginBottom: -8 }} animation="wave" />
            ) : (
              quiz.description
            )}
          </Typography>
        </Stack>
        <Button
          fullWidth
          disabled={quiz.id === 0}
          variant="outlined"
          sx={{ marginTop: '50px' }}
          onClick={() => navigate(`/app/quizrun?id=${id}`, { replace: true })}
        >
          START QUIZ
        </Button>

        {user.id === quiz.author.id && (
          <Button fullWidth variant="outlined" sx={{ marginTop: '15px' }}>
            EDIT QUIZ
          </Button>
        )}
        {user.id === quiz.author.id && (
          <Button fullWidth variant="outlined" sx={{ marginTop: '15px' }}>
            DELETE QUIZ
          </Button>
        )}
        {/* <Alert variant="filled" severity="success">
          This is a success alert — check it out!
        </Alert> */}
      </Container>
    </Page>
  );
}
