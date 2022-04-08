import { Navigate } from 'react-router-dom';
import { useState } from 'react';
import { Box, Grid, Container, Typography, Button } from '@mui/material';
// components
import Page from '../components/Page';

// ----------------------------------------------------------------------

export default function Post() {
  const [post, setPost] = useState({
    id: 0,
    title: '',
    thumbnail: '',
    content: '',
    source: ''
  });
  if (!window.location.search.startsWith('?id=') || window.location.search.length === 4) {
    return <Navigate to="/app/home" />;
  }
  const requestOptions = {
    method: 'GET'
  };
  fetch(
    `https://mrmotor.herokuapp.com/posts/get?id=${parseInt(
      window.location.search.substring(4),
      10
    )}`,
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
      localStorage.setItem('post', JSON.stringify(data));
      setPost(data);
    })
    .catch((error) => {
      console.error('There was an error!', error);
      alert('Wrong data inputed!');
      window.location.reload(false);
    });
  return (
    <Page title={`${post.title} | Mr.Motor`}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} md={12}>
          <Typography variant="h3">{post.title}</Typography>
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <img
            src={post.thumbnail}
            alt={post.title}
            style={{ margin: '0 auto', objectFit: 'cover' }}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <Button variant="contained" href={post.source} fullWidth>
            Source
          </Button>
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <Typography variant="body1">{post.content}</Typography>
        </Grid>
      </Grid>
    </Page>
  );
}
