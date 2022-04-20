// material
import { Grid, Container, Stack, Typography, Box, Button } from '@mui/material';
import { useState, useEffect, useRef } from 'react';
import { useLocation, Link as RouterLink, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';

// components
import Page from '../components/Page';
import { BlogPostCard } from '../sections/@app/blog';
//

// ----------------------------------------------------------------------

export default function Search() {
  const [Data, setData] = useState({
    posts: []
  });
  const [scroll, setScroll] = useState(window.scrollY);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const navigate = useNavigate();
  const state = useLocation();
  if (state.state === null) navigate('/app/home', { replace: true });
  const { query } = state.state;
  const blockRef = useRef(null);
  const getData = (type) => {
    let requestOptions = {
      method: 'GET'
    };
    if (localStorage.getItem('token') !== null) {
      requestOptions = {
        method: 'GET',
        headers: {
          Authorization: localStorage.getItem('token')
        }
      };
    }
    fetch(`https://mrmotor.herokuapp.com/posts/search?query=${type}`, requestOptions)
      .then(async (response) => {
        const data = await response.json();
        // check for error response
        if (!response.ok) {
          // get error message from body or default to response statusText
          const error = (data && data.message) || response.statusText;
          return Promise.reject(error);
        }
        setIsAdding(false);
        setData({ posts: [...Data.posts, ...data.posts] });
      })
      .catch((error) => {
        console.error('There was an error!', error);
        alert('Wrong data inputed!');
        window.location.reload(false);
      });
  };

  useEffect(() => {
    window.addEventListener('scroll', (e) => setScroll(window.pageYOffset));
    return () => {
      window.removeEventListener('scroll', (e) => setScroll(window.pageYOffset));
    };
  }, [scroll]);

  if (isLoading) {
    getData(query);
    setIsLoading(false);
  }

  return (
    <Page title={`Search Results for '${query.replace('%20', ' ')}' | Mr.Motor`}>
      <Container sx={{ position: 'relative' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            {`Search Results for "${query.replace('%20', ' ')}"`}
          </Typography>
        </Stack>

        {Data.posts.length === 0 && (
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
              icon="eva:search-fill"
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
              No Search Results
            </Typography>
            <Button
              fullWidth
              variant="outlined"
              component={RouterLink}
              to="/app/home"
              style={{ marginTop: '15px' }}
            >
              Go to Home
            </Button>
          </Box>
        )}
        {Data.posts.length !== 0 && (
          <Grid container spacing={3} ref={blockRef}>
            {Data.posts.map((post, index) => (
              <BlogPostCard key={post.id} post={post} index={index} />
            ))}
          </Grid>
        )}
      </Container>
    </Page>
  );
}
