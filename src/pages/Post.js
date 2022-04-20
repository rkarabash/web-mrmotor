import { Navigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { alpha, styled } from '@mui/material/styles';
import { Icon } from '@iconify/react';
import { Box, Container, Typography, Button } from '@mui/material';
// components
import Page from '../components/Page';

// ----------------------------------------------------------------------

export default function Post() {
  const [post, setPost] = useState({
    id: 0,
    title: '',
    thumbnail: '',
    content: '',
    source: '',
    like: false
  });
  const [like, setLike] = useState(post.like);
  const [likeFlag, setLikeFlag] = useState(true);

  const state = useLocation();
  if (
    state.state === null ||
    !window.location.search.startsWith('?id=') ||
    window.location.search.length === 4
  ) {
    return <Navigate to="/app/home" />;
  }
  if (post.id === 0) {
    setPost(state.state.post);
    setLike(state.state.post.like);
  }
  const CoverImgStyle = styled('img')({
    top: 0,
    width: '100%',
    height: '100%',
    objectFit: post.type === 'RACER' ? 'contain' : 'cover',
    position: 'absolute',
    borderRadius: '15px'
  });
  const likePost = () => {
    if (likeFlag) {
      setLikeFlag(false);
      const requestOptions = {
        method: 'POST',
        headers: {
          Authorization: localStorage.getItem('token')
        }
      };
      fetch(`https://mrmotor.herokuapp.com/posts/like?id=${post.id}`, requestOptions)
        .then(async (response) => {
          const data = await response;
          // check for error response
          if (!response.ok) {
            // get error message from body or default to response statusText
            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
          }
          setLikeFlag(true);
          setLike(!like);
        })
        .catch((error) => {
          console.error('There was an error!', error);
          alert('Wrong data inputed!');
          window.location.reload(false);
        });
    }
  };
  return (
    <Page title={`${post.title} | Mr.Motor`}>
      <Container maxWidth="xl">
        <Box
          style={{
            position: 'relative',
            borderRadius: '15px',
            backgroundColor: '#636e72',
            paddingTop: 'calc(100% * 1 / 2)',
            marginBottom: '20px'
          }}
          sx={{
            '&:after': {
              top: 0,
              content: "''",
              width: '100%',
              height: '100%',
              position: 'absolute',
              borderRadius: '15px',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72)
            }
          }}
        >
          <CoverImgStyle alt={post.title} src={post.thumbnail} />
          <Typography
            variant="h3"
            style={{
              position: 'absolute',
              bottom: '7%',
              left: '3%',
              zIndex: '100'
            }}
          >
            {post.title}
          </Typography>
          <Box
            style={{
              backgroundColor: '#636E72',
              padding: '5px 5px 0px',
              borderRadius: '10px',
              position: 'absolute',
              top: '10px',
              right: '10px',
              zIndex: '100'
            }}
            onClick={() => likePost()}
          >
            <Icon icon="bxs:star" color={like ? '#FDCB6E' : '#DFE6E9'} width="24px" />
          </Box>
          <Box
            style={{
              backgroundColor: '#636E72',
              padding: '5px 5px 0px',
              borderRadius: '10px',
              position: 'absolute',
              top: '10px',
              right: '55px',
              zIndex: '100'
            }}
            onClick={() => window.open(post.source, '_blank')}
          >
            <Icon icon="akar-icons:link-chain" color="#FDCB6E" width="24px" />
          </Box>
        </Box>
        <Typography variant="body2" textAlign="center">
          {post.content}
        </Typography>
      </Container>
    </Page>
  );
}
