// material
import { Icon } from '@iconify/react';
import { Grid, Container, Stack, Typography, Box, Button } from '@mui/material';
import { useState } from 'react';
import { Navigate, Link as RouterLink, useNavigate } from 'react-router-dom';

// components
import Page from '../components/Page';
//

// ----------------------------------------------------------------------

export default function Results() {
  const [Data, setData] = useState({
    quizResults: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  if (localStorage.getItem('token') === null) return <Navigate to="/app/home" />;
  console.log(Data);
  const getData = () => {
    const requestOptions = {
      method: 'GET',
      headers: {
        Authorization: localStorage.getItem('token')
      }
    };
    fetch(`https://mrmotor.herokuapp.com/quiz/results`, requestOptions)
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
    <Page title="My quiz results | Mr.Motor">
      <Container sx={{ position: 'relative' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            My Quiz Results
          </Typography>
        </Stack>

        {Data.quizResults.length === 0 && (
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
              icon="foundation:results"
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
              No quiz results
            </Typography>
            <Button
              fullWidth
              variant="outlined"
              component={RouterLink}
              to="/app/quizzes"
              style={{ marginTop: '15px' }}
            >
              Go to quizzes
            </Button>
          </Box>
        )}
        {Data.quizResults.length !== 0 && (
          <Grid container spacing={3}>
            {Data.quizResults.map((result, index) => (
              <Grid key={index} item xs={12} sm={4} md={4}>
                <Box
                  style={{
                    border: '2px solid #FDCB6E',
                    borderRadius: '15px',
                    padding: '10px',
                    position: 'relative'
                  }}
                  sx={{ minHeight: '150px' }}
                  onClick={() => navigate(`/app/quiz?id=${result.quiz.id}`, { replace: true })}
                >
                  <Typography
                    variant="body1"
                    style={{ width: '65%', fontWeight: 'bold', marginBottom: '20px' }}
                  >
                    {result.quiz.title}
                  </Typography>
                  <Box
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      padding: '0 5px',
                      backgroundColor: '#C4C4C4',
                      borderRadius: '15px'
                    }}
                  >
                    <Typography
                      variant="h6"
                      color="#2d3436"
                    >{`${result.achieved} / ${result.amount}`}</Typography>
                  </Box>
                  <Box
                    sx={{
                      backgroundColor: '#FF7675',
                      borderRadius: '15px',
                      height: '25px',
                      position: 'absolute',
                      width: '95%',
                      bottom: '10px',
                      left: '2.5%'
                    }}
                  >
                    <Box
                      sx={{
                        fontSize: 0,
                        position: 'absolute',
                        top: 0,
                        borderRadius: '15px',
                        height: '25px',
                        width: `${(result.achieved / result.amount) * 100}%`,
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
                      {Math.round((result.achieved * 1000) / result.amount) / 10}%
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Page>
  );
}
