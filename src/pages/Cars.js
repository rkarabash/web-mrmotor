// material
import { Grid, Container, Stack, Typography, Box } from '@mui/material';
import { useState } from 'react';

// components
import Page from '../components/Page';
import { BlogPostCard } from '../sections/@app/blog';
//

// ----------------------------------------------------------------------

export default function Cars() {
  const [Data, setData] = useState({
    posts: []
  });
  const requestOptions = {
    method: 'GET'
  };
  fetch('https://mrmotor.herokuapp.com/posts/get_by_type?type=CAR', requestOptions)
    .then(async (response) => {
      const data = await response.json();
      // check for error response
      if (!response.ok) {
        // get error message from body or default to response statusText
        const error = (data && data.message) || response.statusText;
        return Promise.reject(error);
      }
      localStorage.setItem('cars', JSON.stringify(data));
      setData(data);
    })
    .catch((error) => {
      console.error('There was an error!', error);
      alert('Wrong data inputed!');
      window.location.reload(false);
    });
  return (
    <Page title="Cars | Mr.Motor">
      <Container sx={{ position: 'relative' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Cars
          </Typography>
        </Stack>

        {Data.posts.length === 0 && (
          <Box
            sx={{ margin: '0 auto', position: 'absolute', top: '500%', left: 'calc(50% - 75px)' }}
          >
            <img src="/static/spinner.gif" alt="spinner" style={{ width: '150px' }} />
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
