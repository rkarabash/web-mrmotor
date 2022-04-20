// material
import { Icon } from '@iconify/react';
import { Grid, Container, Stack, Typography, Box, Button } from '@mui/material';
import { useState } from 'react';
import { Navigate, Link as RouterLink } from 'react-router-dom';

// components
import Page from '../components/Page';
import { BlogPostCard } from '../sections/@app/blog';
//

// ----------------------------------------------------------------------

export default function Favorites() {
  const [Data, setData] = useState({
    posts: []
  });
  const [isLoading, setIsLoading] = useState(true);
  if (localStorage.getItem('token') === null) return <Navigate to="/app/home" />;

  const getData = () => {
    const requestOptions = {
      method: 'GET',
      headers: {
        Authorization: localStorage.getItem('token')
      }
    };
    fetch(`https://mrmotor.herokuapp.com/posts/liked`, requestOptions)
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
    <Page title="Favorite news and posts | Mr.Motor">
      <Container sx={{ position: 'relative' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Favorite news and posts
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
              icon="bxs:star"
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
              No favorite posts
            </Typography>
            <Button
              fullWidth
              variant="outlined"
              component={RouterLink}
              to="/app/news"
              style={{ marginTop: '15px' }}
            >
              Go to posts
            </Button>
          </Box>
        )}
        {Data.posts.length !== 0 && (
          <Grid container spacing={3}>
            {Data.posts.map((post, index) => (
              <BlogPostCard key={post.id} post={post} index={index} />
            ))}
          </Grid>
        )}
      </Container>
    </Page>
  );
}
