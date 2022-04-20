// material
import { Grid, Container, Stack, Typography, Box } from '@mui/material';
import { useState, useEffect, useRef } from 'react';

// components
import Page from '../components/Page';
import { BlogPostCard } from '../sections/@app/blog';
//

// ----------------------------------------------------------------------

export default function Racers() {
  const [Data, setData] = useState({
    posts: []
  });
  const [scroll, setScroll] = useState(window.scrollY);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
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
    fetch(
      `https://mrmotor.herokuapp.com/posts/get_by_type_limit?type=${type}&offset=${Data.posts.length}&limit=6`,
      requestOptions
    )
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
    getData('RACER');
    setIsLoading(false);
  }

  if (blockRef.current) {
    const { clientHeight } = blockRef.current;
    if (!isAdding && scroll > clientHeight * 0.3) {
      setIsAdding(true);
      getData('RACER');
    }
  }

  return (
    <Page title="Racers | Mr.Motor">
      <Container sx={{ position: 'relative' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Racers
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
