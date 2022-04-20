import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Icon } from '@iconify/react';
import { Box, Stack, Container, Typography, Avatar, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

// components
import Page from '../components/Page';

// ----------------------------------------------------------------------
function QuizAnswer({ answer, index, tap, setTap, score, setScore }) {
  const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
  const [color, setColor] = useState('#636E72');
  if (tap !== -1 && tap !== index && answer.isCorrect && color !== '#00CEC9') setColor('#00CEC9');

  return (
    <Box
      sx={{
        backgroundColor: color,
        padding: '10px',
        borderRadius: '10px',
        position: 'relative'
      }}
      key={answer.id}
      onClick={() => {
        if (tap === -1 && !answer.isCorrect) {
          setColor('#FF7675');
          setTap(index);
        }
        if (tap === -1 && answer.isCorrect) {
          setColor('#00CEC9');
          setScore(score + 1);
          setTap(index);
        }
      }}
    >
      <Typography variant="body1" sx={{ marginLeft: '40px' }}>
        {answer.answer}
      </Typography>
      <Box
        component={Avatar}
        children={letters[index]}
        width="30px"
        height="30px"
        sx={{ position: 'absolute', top: '17%', left: '1.5%', backgroundColor: '#FDCB6E' }}
      />
    </Box>
  );
}
export default function QuizRun() {
  //----------------------------------------
  const navigate = useNavigate();
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
  const [count, setCount] = useState(0);
  const [score, setScore] = useState(0);
  const [tap, setTap] = useState(-1);
  const [result, setResult] = useState(true);
  const CoverImgStyle = styled('img')({
    top: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    position: 'absolute',
    borderRadius: '15px',
    border: '2px solid #FDCB6E'
  });
  const state = useLocation();
  const { mquiz } = state.state;
  const postResult = () => {
    const requestOptions = {
      method: 'POST',
      headers: {
        Authorization: localStorage.getItem('token')
      }
    };
    fetch(
      `https://mrmotor.herokuapp.com/quiz/result?achieved=${score}&id=${quiz.id}`,
      requestOptions
    )
      .then(async (response) => {
        const data = await response;
        // check for error response
        if (!response.ok) {
          // get error message from body or default to response statusText
          const error = (data && data.message) || response.statusText;
          return Promise.reject(error);
        }
      })
      .catch((error) => {
        console.error('There was an error!', error);
        alert('Wrong data inputed!');
        window.location.reload(false);
      });
  };
  if (quiz.id === 0) {
    setQuiz(mquiz);
  }
  if (quiz.quizItems.length !== 0 && count === quiz.quizItems.length && result) {
    setResult(false);
    postResult();
  }
  //---------------------------------------
  if (!window.location.search.startsWith('?id=') || window.location.search.length === 4) {
    return <Navigate to="/app/quizzes" />;
  }
  if (localStorage.getItem('token') === null) return <Navigate to="/login" />;
  const id = parseInt(window.location.search.substring(4), 10);

  //-----------------------------------------------
  let quizItem;
  let answers;
  if (count === quiz.quizItems.length) {
    quizItem = 'quiz.quizItems[0]';
    answers = '';
  } else {
    quizItem = quiz.quizItems[count];
    answers = quizItem.quizAnswers;
  }
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
  return (
    <Page title={`${quiz.title} | Mr. Motor`}>
      <Container
        maxWidth="sm"
        sx={{ padding: '15px', borderRadius: '25px' }}
        onClick={() => {
          if (tap !== -1) {
            setCount(count + 1);
            setTap(-1);
          }
        }}
      >
        <Stack spacing={1.5}>
          {count < quiz.quizItems.length && (
            <Box
              sx={{
                backgroundColor: '#74B9FF',
                minHeight: '35vh',
                borderRadius: '25px',
                position: 'relative'
              }}
            >
              {quizItem.image === '' && (
                <Box
                  component="img"
                  src="/static/logo.svg"
                  width="60%"
                  height="auto"
                  color="#FDCB6E"
                  sx={{ position: 'absolute', bottom: '35%', right: '20%' }}
                />
              )}
              {quizItem.image !== '' && <CoverImgStyle alt="Question Image" src={quizItem.image} />}
            </Box>
          )}
          {count === quiz.quizItems.length && (
            <Box
              sx={{
                backgroundColor: '#74B9FF',
                minHeight: '35vh',
                borderRadius: '25px',
                position: 'relative'
              }}
            >
              <Typography variant="h3" sx={{ position: 'absolute', width: '45%', margin: '30px' }}>
                {quiz.title}
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
          {count < quiz.quizItems.length && (
            <Typography variant="h4" textAlign="center">
              {quizItem.question}
            </Typography>
          )}
          {count === quiz.quizItems.length && (
            <Typography variant="h3" textAlign="center">
              Congratulations!
            </Typography>
          )}
        </Stack>
        {count === quiz.quizItems.length && (
          <Typography variant="body1" textAlign="center" sx={{ marginTop: '30px' }}>
            Your result is
          </Typography>
        )}
        {count === quiz.quizItems.length && (
          <Typography variant="h3" textAlign="center" sx={{ marginTop: '10px' }}>
            {score} Out Of {count}
          </Typography>
        )}
        {count === quiz.quizItems.length && (
          <Box
            sx={{
              backgroundColor: '#FF7675',
              borderRadius: '15px',
              height: '25px',
              position: 'relative',
              marginTop: '70px'
            }}
          >
            <Box
              sx={{
                fontSize: 0,
                position: 'absolute',
                top: 0,
                borderRadius: '15px',
                height: '25px',
                width: `${(score / count) * 100}%`,
                backgroundColor: '#00CEC9'
              }}
            >
              s
            </Box>
            <Typography
              variant="subtitle2"
              textAlign="center"
              sx={{ position: 'absolute', right: '10px', color: '#000', top: '1.5px' }}
            >
              {Math.round((score * 1000) / count) / 10}%
            </Typography>
          </Box>
        )}
        {count === quiz.quizItems.length && (
          <Button
            fullWidth
            variant="outlined"
            sx={{ marginTop: '20px' }}
            onClick={() => navigate(`/app/quiz?id=${id}`, { replace: true })}
          >
            TRY AGAIN
          </Button>
        )}
        {count < quiz.quizItems.length && (
          <Stack spacing={1.5} mt={3}>
            {answers.map((answer, index) => (
              <QuizAnswer
                key={answer.id}
                answer={answer}
                index={index}
                tap={tap}
                setTap={setTap}
                score={score}
                setScore={setScore}
              />
            ))}
          </Stack>
        )}
      </Container>
    </Page>
  );
}
